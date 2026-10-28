/* Quartex Synergy & Associates — page behaviour.
 * One script serves all six pages: it renders content.js into whichever
 * containers exist on the current page, runs the deadline engine, the
 * calculators, the question filter, the site search and the enquiry form.
 * Nothing here sends data anywhere unless config.formEndpoint is set. */
(() => {
  'use strict';
  const C = window.QUARTEX_CONTENT;
  if (!C) return;
  const cfg = C.config;
  const page = document.body.dataset.page || 'index';

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const kes = n => 'KES ' + Math.round(n).toLocaleString('en-KE');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollTo = (el, block = 'start') => el && el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
  const waLink = text => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent('Hello Quartex, ' + text)}`;
  const num = sel => { const v = parseFloat($(sel).value); return isFinite(v) && v > 0 ? v : 0; };
  const edit = (p, w) => `assets/editorial/${p}-${w}.webp`;
  const pictureFor = (p, alt, ratio, sizes) =>
    `<picture><source type="image/webp" srcset="${edit(p, 900)} 900w, ${edit(p, 1600)} 1600w" sizes="${sizes}"><img src="assets/editorial/${p}.jpeg" alt="${esc(alt)}" loading="lazy" decoding="async" style="aspect-ratio:${ratio}"></picture>`;
  const hashOf = () => decodeURIComponent(location.hash.replace(/^#/, ''));
  const svcById = Object.fromEntries(C.services.map(s => [s.id, s]));
  const finderById = Object.fromEntries(C.finder.map(f => [f.id, f]));
  const personById = Object.fromEntries(C.people.map(p => [p.id, p]));
  const checkById = Object.fromEntries(C.checklists.map(c => [c.id, c]));

  $$('[data-reviewed]').forEach(el => { el.textContent = cfg.reviewedOn; });
  const year = $('#year'); if (year) year.textContent = String(new Date().getFullYear());
  const footSvc = $('#foot-services'); if (footSvc) footSvc.innerHTML = C.services.map(s => `<li><a href="services.html#service-${esc(s.id)}">${esc(s.shortTitle)}</a></li>`).join('');

  /* ---------- dialog ---------- */
  const dlg = $('#dlg');
  const dlgContent = $('#dlg-content');
  let dlgTrigger = null, dlgHash = '';
  function openDialog(html, trigger, hash) {
    dlgTrigger = trigger || document.activeElement;
    dlgHash = hash || '';
    dlgContent.innerHTML = html;
    closeMenu();
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    document.body.classList.add('modal-open');
    if (dlgHash && hashOf() !== dlgHash) history.replaceState(null, '', '#' + dlgHash);
    const h = $('h2', dlgContent); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  function closeDialog() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (dlgHash && hashOf() === dlgHash) history.replaceState(null, '', location.pathname + location.search);
    dlgHash = '';
    if (dlgTrigger && dlgTrigger.isConnected && document.activeElement === document.body) dlgTrigger.focus({ preventScroll: true });
  });
  function outsideClick(d, e) { const r = d.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; }
  dlg.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeDialog(); else if (e.target === dlg && outsideClick(dlg, e)) closeDialog(); });

  /* ---------- header, menu, bottom bar ---------- */
  const head = $('.site-head'), menuBtn = $('#menu-btn'), menuSheet = $('#menu-sheet');
  function setMenu(open) {
    if (!head || !menuBtn || !menuSheet) return;
    head.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuSheet.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    $('span', menuBtn).textContent = open ? 'Close' : 'Menu';
    $('use', menuBtn).setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  function closeMenu() { if (head && head.classList.contains('open')) setMenu(false); }
  if (menuBtn && menuSheet) {
    menuBtn.addEventListener('click', () => setMenu(!head.classList.contains('open')));
    menuSheet.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && head.classList.contains('open')) { closeMenu(); menuBtn.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  }
  const progress = $('#progress');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - window.innerHeight; if (progress) progress.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%'; ticking = false; });
  }, { passive: true });

  /* ---------- site search ---------- */
  const sdlg = $('#search-dlg'), sinput = $('#site-search'), sresults = $('#search-results'), shint = $('#search-hint');
  let index = null;
  function buildIndex() {
    const entries = [];
    C.services.forEach(s => entries.push({ type: 'Service', title: s.title, text: [s.promise, s.description, s.bullets.join(' '), s.audience].join(' '), href: `services.html#service-${s.id}` }));
    C.finder.forEach(f => entries.push({ type: 'Situation', title: f.title, text: [f.label, f.sub, f.steps.join(' '), f.know].join(' '), href: `index.html#need-${f.id}` }));
    (C.calculators || []).forEach(c => entries.push({ type: 'Calculator', title: /estimator|calculator/i.test(c.title) ? c.title : c.title + ' calculator', text: c.keywords, href: `tools.html#tool-${c.id}` }));
    C.deadlines.calendar.filter(r => !r.group).forEach(r => entries.push({ type: 'Deadline', title: r.what.split('. ')[0].replace(/\.$/, '') + ' (' + r.when + ')', text: r.what + ' ' + r.who, href: 'tools.html#deadlines' }));
    C.checklists.forEach(c => entries.push({ type: 'Checklist', title: c.title + ': what to have ready', text: c.intro + ' ' + c.items.join(' '), href: `tools.html#check-${c.id}` }));
    C.faqs.forEach((f, i) => entries.push({ type: 'Answer', title: f.q, text: f.a, href: `answers.html#q-${i}` }));
    C.people.forEach(p => entries.push({ type: 'Person', title: p.name, text: p.credential + ' ' + p.role + ' ' + p.intro, href: `about.html#person-${p.id}` }));
    C.audiences.forEach(a => entries.push({ type: 'Who we serve', title: a.title, text: a.summary + ' ' + a.answersTo + ' ' + a.focus.join(' '), href: 'services.html#who' }));
    entries.push({ type: 'Page', title: 'About the firm: why Quartex, values, technology', text: C.whyUs.map(w => w.title + ' ' + w.text).join(' ') + ' mission vision values', href: 'about.html' });
    entries.push({ type: 'Page', title: 'How an engagement runs: seven steps', text: C.process.map(p => p.title + ' ' + p.text).join(' ') + ' proposal fees engagement letter', href: 'about.html#process' });
    entries.push({ type: 'Page', title: 'Contact: WhatsApp, phone, email, consultation request', text: cfg.location + ' ' + cfg.postal + ' ' + cfg.phones.join(' ') + ' ' + cfg.email + ' call back form', href: 'contact.html' });
    entries.push({ type: 'Document', title: 'Company profile (PDF, 41 pages)', text: 'brochure download profile document', href: cfg.profilePdf, external: true });
    const weight = { Service: 2, Answer: 1.8, Calculator: 1.8, Checklist: 1.6, Situation: 1.6, Person: 1.4, Page: 1.2, 'Who we serve': 1.2, Deadline: 1, Document: .8 };
    entries.forEach(e => { e.tl = e.title.toLowerCase(); e.xl = e.text.toLowerCase(); e.w = weight[e.type] || 1; });
    return entries;
  }
  function search(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (!terms.length) return [];
    index = index || buildIndex();
    return index.map(e => {
      let score = 0;
      for (const t of terms) { const inTitle = e.tl.includes(t), inText = e.xl.includes(t); if (!inTitle && !inText) return null; score += inTitle ? 3 : 1; if (e.tl.startsWith(t)) score += 1; }
      return { e, score: score + e.w };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8).map(x => x.e);
  }
  function renderSearch() {
    const q = sinput.value.trim();
    const hits = search(q);
    shint.hidden = q.length > 1;
    sresults.innerHTML = q.length < 2 ? '' : hits.length
      ? hits.map(e => `<li><a href="${esc(e.href)}"${e.external ? ' target="_blank" rel="noopener"' : ''}><span class="type">${esc(e.type)}</span><span class="title">${esc(e.title)}</span></a></li>`).join('')
      : `<li class="none">Nothing matches “${esc(q)}” yet. <a href="${waLink('I have a question: ' + q)}" target="_blank" rel="noopener">Ask us on WhatsApp</a> and the team will reply.</li>`;
  }
  function openSearch(prefill) {
    if (!sdlg) return;
    closeMenu();
    if (!sdlg.open) sdlg.showModal();
    document.body.classList.add('modal-open');
    if (prefill != null) sinput.value = prefill;
    renderSearch();
    setTimeout(() => sinput.focus(), 30);
  }
  if (sdlg) {
    $('#search-btn').addEventListener('click', e => openSearch());
    sinput.addEventListener('input', renderSearch);
    sinput.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); sdlg.close(); } });
    $('#search-form').addEventListener('submit', e => { e.preventDefault(); const first = $('#search-results a'); if (first) first.click(); });
    $$('#search-hint button').forEach(b => b.addEventListener('click', () => { sinput.value = b.dataset.q; renderSearch(); sinput.focus(); }));
    sdlg.addEventListener('click', e => { if (e.target.closest('[data-close]')) sdlg.close(); else if (e.target === sdlg && outsideClick(sdlg, e)) sdlg.close(); });
    sdlg.addEventListener('close', () => document.body.classList.remove('modal-open'));
    sresults.addEventListener('click', e => { const a = e.target.closest('a'); if (a && a.getAttribute('href').split('#')[0] === location.pathname.split('/').pop()) { sdlg.close(); } });
    document.addEventListener('keydown', e => { if (e.key === '/' && !e.ctrlKey && !e.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !dlg.open) { e.preventDefault(); openSearch(''); } });
  }

  /* ---------- enquiry routing: any [data-need] button leads to the form ---------- */
  function goToForm(needId) {
    const sel = $('#f-need');
    if (!sel) { location.href = 'contact.html#need-' + encodeURIComponent(needId || 'unsure'); return; }
    if (needId && $$('option', sel).some(o => o.value === needId)) sel.value = needId;
    closeDialog();
    scrollTo($('#enquiry'));
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 450);
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-need]'); if (b) { e.preventDefault(); goToForm(b.getAttribute('data-need')); } });

  /* ---------- deadline engine (home strip, tools page) ---------- */
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY = 86400000;
  const sod = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const fmt = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const daysBetween = (a, b) => Math.round((sod(b) - sod(a)) / DAY);
  function easter(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return new Date(y, mo - 1, da); }
  const holidayCache = {};
  function holidays(y) {
    if (holidayCache[y]) return holidayCache[y];
    /* New Year, Labour Day, Madaraka, Mazingira, Mashujaa, Jamhuri, Christmas, Boxing Day, Good Friday, Easter Monday.
       A holiday on a Sunday moves to Monday. Idd days are gazetted late and are not included. */
    const list = [[0, 1], [4, 1], [5, 1], [9, 10], [9, 20], [11, 12], [11, 25], [11, 26]].map(([m, d]) => new Date(y, m, d));
    const e = easter(y); list.push(new Date(y, e.getMonth(), e.getDate() - 2)); list.push(new Date(y, e.getMonth(), e.getDate() + 1));
    const out = {};
    list.forEach(d => { if (d.getDay() === 0) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); out[d.toDateString()] = true; });
    holidayCache[y] = out; return out;
  }
  const isWorking = d => d.getDay() !== 0 && d.getDay() !== 6 && !holidays(d.getFullYear())[d.toDateString()];
  function nthWorkingDay(y, m, n) { let d = new Date(y, m, 1), c = 0; for (;;) { if (isWorking(d)) { c++; if (c === n) return d; } d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); } }
  const dueFor = (rule, y, m) => rule.workingDay ? nthWorkingDay(y, m, rule.workingDay) : new Date(y, m, rule.day);
  const covers = (y, m) => MONTHS[new Date(y, m - 1, 1).getMonth()];
  function nextDue(rule, today) {
    for (let k = 0; k < 3; k++) { const d = dueFor(rule, today.getFullYear(), today.getMonth() + k); if (d >= today) return { d, covers: covers(today.getFullYear(), today.getMonth() + k) }; }
    return null;
  }
  function upcoming() {
    const today = sod(new Date());
    return { today, items: C.deadlines.monthly.map(r => Object.assign({ r }, nextDue(r.rule, today))).filter(x => x.d).sort((a, b) => a.d - b.d) };
  }
  if ($('#strip-list')) {
    try {
      const { today, items } = upcoming();
      $('#strip-list').innerHTML = items.map(x => { const n = daysBetween(today, x.d); return `<li class="${n <= 5 ? 'soon' : ''}"><b>${esc(fmt(x.d))}</b><span>${esc(x.r.label)} for ${esc(x.covers)}</span></li>`; }).join('');
    } catch (e) { /* static copy stays */ }
  }
  if ($('#now')) {
    try {
      const { today, items } = upcoming();
      $('#now').innerHTML = items.map(x => {
        const n = daysBetween(today, x.d);
        const cls = n <= 5 ? 'soon' : 'ok';
        const state = n === 0 ? 'Due today' : n <= 5 ? `Due in ${n} day${n === 1 ? '' : 's'}` : `In ${n} days`;
        const prev = dueFor(x.r.rule, x.d.getFullYear(), x.d.getMonth() - 1);
        return `<div class="${cls}"><div class="days"><b>${n}</b><span>${n === 1 ? 'day' : 'days'}</span></div><span class="state">${esc(state)}</span><strong>${esc(x.r.label)} for ${esc(x.covers)}</strong><span>Due ${esc(fmt(x.d))}. The previous one was due ${esc(fmt(prev))}; late filings attract penalties and interest.</span></div>`;
      }).join('');
      const ahl = C.deadlines.monthly.find(r => r.id === 'ahl');
      const ahlNext = ahl ? nextDue(ahl.rule, today) : null;
      $('#cal-body').innerHTML = C.deadlines.calendar.map(row => {
        if (row.group) return `<tr class="group"><td colspan="4">${esc(row.group)}</td></tr>`;
        let when = row.when;
        if (row.liveId === 'ahl' && ahlNext) when += ` (${fmt(ahlNext.d)} for ${ahlNext.covers})`;
        return `<tr><td class="when">${esc(when)}</td><td>${esc(row.what)}</td><td class="applies">${esc(row.who)}</td><td><a href="${esc(row.source)}" target="_blank" rel="noopener">${esc(row.sourceLabel)}</a></td></tr>`;
      }).join('');
      $('#deadline-note').textContent = C.deadlines.note;
    } catch (e) { /* leave the section empty rather than wrong */ }
  }

  /* ---------- home page ---------- */
  if (page === 'index') {
    /* old single-page links still arrive here: send them to the right page */
    const h = hashOf();
    const go = {
      'service-': id => `services.html#service-${id}`, 'person-': id => `about.html#person-${id}`, 'tool-': id => `tools.html#tool-${id}`,
      'check-': id => `tools.html#check-${id}`, 'q-': id => `answers.html#q-${id}`
    };
    for (const k in go) { if (h.startsWith(k)) { location.replace(go[k](h.slice(k.length))); return; } }
    const simple = { who: 'services.html#who', deadlines: 'tools.html#deadlines', calculators: 'tools.html#calculators', checklists: 'tools.html#checklists', answers: 'answers.html', people: 'about.html#people', process: 'about.html#process', profile: 'about.html#profile' };
    if (simple[h]) { location.replace(simple[h]); return; }

    $('#tiles').innerHTML = C.finder.map((f, i) => `
      <li><button class="tile" type="button" data-id="${esc(f.id)}" aria-pressed="${i === 0 ? 'true' : 'false'}">
        <span class="ic"><svg aria-hidden="true"><use href="#i-${esc(f.icon)}"/></svg></span>
        <span><b>${esc(f.label)}</b><span class="sub-l">${esc(f.sub)}</span></span>
      </button></li>`).join('');
    let currentNeed = C.finder[0].id;
    function selectFinder(id, scroll) {
      const f = finderById[id]; if (!f) return;
      currentNeed = id;
      $$('.tile').forEach(t => t.setAttribute('aria-pressed', t.getAttribute('data-id') === id ? 'true' : 'false'));
      const panel = $('#panel');
      $('#p-title').textContent = f.title;
      $('#p-do').innerHTML = f.steps.map(s => `<li>${esc(s)}</li>`).join('');
      $('#p-first').textContent = f.first;
      $('#p-know').textContent = f.know; $('#p-know').classList.add('know');
      $('#p-wa').href = waLink(f.wa);
      $('#p-form').href = 'contact.html#need-' + f.id;
      $('#p-tools').innerHTML = f.tools.map(t => `<li><a href="${esc(t.href)}">${esc(t.label)}</a></li>`).join('');
      const svc = svcById[f.service];
      $('#p-service').href = svc ? `services.html#service-${svc.id}` : 'services.html';
      $('#p-service').innerHTML = (svc ? 'See ' + esc(svc.shortTitle.toLowerCase()) + ' in full ' : 'See all services ') + icon('arrow');
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      if (scroll) scrollTo(panel, 'nearest');
    }
    $$('.tile').forEach(t => t.addEventListener('click', () => selectFinder(t.getAttribute('data-id'), window.innerWidth < 980)));
    const need = h.match(/^need-(.+)$/);
    selectFinder(need && finderById[need[1]] ? need[1] : currentNeed, !!need);
    if (need) scrollTo($('#start'));
    window.addEventListener('hashchange', () => { const m = hashOf().match(/^need-(.+)$/); if (m && finderById[m[1]]) selectFinder(m[1], true); });

    $('#svc-mini').innerHTML = C.services.map((s, i) => `
      <li><a href="services.html#service-${esc(s.id)}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span><b>${esc(s.title)}</b><span>${esc(s.promise)}</span></span>${icon('arrow')}</a></li>`).join('');
    $('#calc-links').innerHTML = (C.calculators || []).map(c => `<li><a href="tools.html#tool-${esc(c.id)}">${esc(c.title)}</a></li>`).join('');
    $('#check-links').innerHTML = C.checklists.map(c => `<li><a href="tools.html#check-${esc(c.id)}">${esc(c.title)}</a></li>`).join('');
    $('#home-qa-search').addEventListener('submit', e => { e.preventDefault(); const q = $('#home-qa-q').value.trim(); location.href = q ? 'answers.html#find-' + encodeURIComponent(q) : 'answers.html'; });
    $('#team-mini').innerHTML = C.people.map(p => `
      <li class="person" data-person-id="${esc(p.id)}"><a href="about.html#person-${esc(p.id)}">
        <span class="photo-btn">${portrait(p, false)}</span>
        <b>${esc(p.name)}</b><span>${esc(p.displayRole)}</span></a></li>`).join('');
  }

  /* ---------- "on this page" bar (phones): current section, previous/next, and the full list ---------- */
  const n2g = i => String(i + 1).padStart(2, '0');
  function pageBar({ items, trigger, stage, kicker, onPick }) {
    const bar = $('#pagebar');
    if (!bar || !items.length || !trigger) return null;
    const cur = $('#pb-cur'), list = $('#pb-list'), ol = $('#pb-items'), k = $('#pb-k'), t = $('#pb-t');
    ol.innerHTML = items.map((it, i) => `<li><button type="button" data-i="${i}" aria-current="false"><span class="n">${n2g(i)}</span><span>${esc(it.label)}</span>${icon('check')}</button></li>`).join('');
    let idx = 0;
    function paint(i) { if (i < 0 || i >= items.length) return; idx = i; t.textContent = items[i].label; k.textContent = typeof kicker === 'function' ? kicker(i) : kicker; $$('button[data-i]', ol).forEach((b, j) => b.setAttribute('aria-current', j === i ? 'true' : 'false')); }
    function closeList() { list.hidden = true; cur.setAttribute('aria-expanded', 'false'); }
    cur.addEventListener('click', () => { const open = list.hidden; list.hidden = !open; cur.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    ol.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; closeList(); onPick(+b.dataset.i); });
    $('#pb-prev').addEventListener('click', () => onPick((idx + items.length - 1) % items.length));
    $('#pb-next').addEventListener('click', () => onPick((idx + 1) % items.length));
    document.addEventListener('click', e => { if (!list.hidden && !e.target.closest('#pagebar')) closeList(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !list.hidden) { closeList(); cur.focus(); } });
    let above = false, inStage = true;
    const apply = () => { const show = above && inStage && window.innerWidth < 981; if (bar.hidden === show) { bar.hidden = !show; if (!show) closeList(); } };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(en => { en.forEach(x => { above = !x.isIntersecting && x.boundingClientRect.bottom < 140; }); apply(); }, { rootMargin: '-130px 0px 0px 0px', threshold: 0 }).observe(trigger);
      if (stage) new IntersectionObserver(en => { en.forEach(x => { inStage = x.isIntersecting; }); apply(); }, { rootMargin: '-130px 0px 0px 0px', threshold: 0 }).observe(stage);
    }
    window.addEventListener('resize', apply, { passive: true });
    paint(0);
    return { paint, close: closeList };
  }

  /* ---------- services page: a directory, one practice area at a time ---------- */
  if (page === 'services') {
    const n2 = n2g;
    const tags = a => a.replace(/\.$/, '').split(/,\s*|\s+and\s+/).map(t => t.trim()).filter(Boolean).map(t => t.charAt(0).toUpperCase() + t.slice(1));
    const jump = $('#svc-jump'); if (jump) jump.innerHTML = C.services.map(s => `<a href="#service-${esc(s.id)}">${esc(s.shortTitle)}</a>`).join('');
    $('#svc-index').innerHTML = C.services.map((s, i) => `<li><button type="button" data-svc="${esc(s.id)}" aria-current="false"><span class="n">${n2(i)}</span><span class="t">${esc(s.title)}</span><span class="ts">${esc(s.shortTitle)}</span>${icon('arrow')}</button></li>`).join('');
    const FRAME = 'M119 85H518C591 85 644 136 644 209V594H369C326 594 300 580 279 541L76 170C51 123 68 85 119 85Z';
    const figure = (s, i) => `<svg class="sp-figure" viewBox="40 60 620 560" role="img" aria-label="${esc(s.imageAlt)}"><defs><clipPath id="spf-${i}"><path d="${FRAME}"/></clipPath></defs><path d="M292-75H430L680 390V640L292-75Z" fill="#F9DEBD" opacity=".9"/><path d="M0 132H143C215 132 250 181 250 247V523H0Z" fill="#082344"/><path d="${FRAME}" fill="#CE9645" stroke="#CE9645" stroke-width="28"/><g clip-path="url(#spf-${i})"><image href="${edit(s.image, 900)}" x="40" y="60" width="640" height="560" preserveAspectRatio="xMidYMid slice"/></g></svg>`;
    $('#svc-stage').innerHTML = C.services.map((s, i) => {
      const prev = C.services[(i + C.services.length - 1) % C.services.length], next = C.services[(i + 1) % C.services.length];
      const f = C.finder.find(x => x.id === s.need);
      return `
      <article class="svc-panel" id="service-${esc(s.id)}" hidden>
        <header class="sp-head">
          <div class="sp-head-copy">
            <span class="kicker">Practice area ${n2(i)} of 08</span>
            <h2>${esc(s.title)}</h2>
            <p class="promise">${esc(s.promise)}</p>
            <p class="desc">${esc(s.description)}</p>
          </div>
          <div class="sp-head-art">${figure(s, i)}</div>
        </header>
        <section class="sp-list" aria-label="How we can support you">
          <h3>How we can support you</h3>
          <ul class="dlg-list">${s.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>
        <section class="sp-cards" aria-label="Who it is for, the outcome and the next step">
          <div class="sp-card"><h4>Who this is for</h4><div class="tags">${(s.tags || tags(s.audience)).map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
          <div class="sp-card peach"><h4>What you end up with</h4><p>${esc(s.outcome)}</p></div>
          <div class="sp-card navy"><h4>The next step</h4><p>${f ? esc(f.first) : 'Tell us what is going on and we will say what we would do first.'}</p><div class="sp-acts"><button class="btn btn-gold" type="button" data-need="${esc(s.need)}">Discuss this service</button><a class="btn btn-light" href="${waLink('I would like to talk about ' + s.title.toLowerCase() + '.')}" target="_blank" rel="noopener">${icon('chat')}WhatsApp</a></div></div>
        </section>
        <footer class="sp-foot">
          ${s.related && s.related.length ? `<div class="sp-related"><h4>Useful on this site</h4><ul class="related">${s.related.map(r => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join('')}</ul></div>` : '<div></div>'}
          <nav class="sp-nav" aria-label="Other practice areas">
            <a href="#service-${esc(prev.id)}"><span>Previous</span><b>${esc(prev.shortTitle)}</b></a>
            <a href="#service-${esc(next.id)}" class="next"><span>Next</span><b>${esc(next.shortTitle)}</b></a>
          </nav>
        </footer>
      </article>`;
    }).join('');
    let currentSvc = null;
    const phone = () => window.innerWidth < 981;
    const bar = pageBar({ items: C.services.map(s => ({ id: s.id, label: s.title })), trigger: $('#svc-index'), stage: $('#svc-stage'), kicker: i => `Practice area ${n2(i)} of ${n2(C.services.length - 1)}`, onPick: i => selectService(C.services[i].id, { scroll: true }) });
    function selectService(id, { scroll = false, push = true } = {}) {
      if (!svcById[id]) id = C.services[0].id;
      currentSvc = id;
      $$('.svc-panel').forEach(p => { const on = p.id === 'service-' + id; if (on && p.hidden) { p.hidden = false; p.classList.remove('show'); void p.offsetWidth; p.classList.add('show'); } else if (!on) p.hidden = true; });
      $$('#svc-index button').forEach(b => b.setAttribute('aria-current', b.dataset.svc === id ? 'true' : 'false'));
      $$('#svc-jump a').forEach(a => { const on = a.getAttribute('href') === '#service-' + id; a.classList.toggle('active', on); });
      if (bar) bar.paint(C.services.findIndex(s => s.id === id));
      if (push && hashOf() !== 'service-' + id) history.replaceState(null, '', '#service-' + id);
      if (scroll) scrollTo(phone() ? $('#svc-stage') : $('#service-list'));
    }
    $('#svc-index').addEventListener('click', e => { const b = e.target.closest('button[data-svc]'); if (b) selectService(b.dataset.svc, { scroll: phone() }); });
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#service-"]'); if (!a) return;
      e.preventDefault(); selectService(a.getAttribute('href').slice(9), { scroll: true });
    });
    window.addEventListener('hashchange', () => { const m = hashOf().match(/^service-(.+)$/); if (m && m[1] !== currentSvc) selectService(m[1], { scroll: true, push: false }); });
    const m0 = hashOf().match(/^service-(.+)$/);
    selectService(m0 ? m0[1] : C.services[0].id, { scroll: !!m0, push: !!m0 });
  }
  if ($('#audiences')) {
    $('#audiences').innerHTML = C.audiences.map((a, i) => `
      <details class="aud" name="audience"${i === 0 ? ' open' : ''}>
        <summary>${esc(a.title)}${icon('plus-s')}</summary>
        <div class="body">
          <div><p>${esc(a.summary)}</p><p class="answers"><b>You answer to:</b> ${esc(a.answersTo)}</p></div>
          <div><h4>Where we usually start</h4><ul>${a.focus.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        </div>
      </details>`).join('');
    const auds = $$('.aud');
    auds.forEach(d => $('summary', d).addEventListener('click', () => { if (!d.open) auds.forEach(o => { if (o !== d) o.open = false; }); }));
    $('#industries').innerHTML = C.industries.map(i => `<li>${esc(i)}</li>`).join('');
  }

  /* ---------- tools page: calculators ---------- */
  if ($('#calculators')) {
    const R = C.rates;
    function showTab(id, focus) {
      const tab = $(`.tab[data-tab="${id}"]`); if (!tab) return false;
      $$('#calculators .tab').forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
      $$('#calculators .tool').forEach(p => { p.hidden = p.id !== 'tool-' + id; });
      if (focus) tab.focus({ preventScroll: true });
      return true;
    }
    $$('#calculators .tab').forEach(t => t.addEventListener('click', () => showTab(t.getAttribute('data-tab'))));
    const nssfOf = g => R.nssf.rate * Math.min(g, R.nssf.tier1) + R.nssf.rate * Math.max(0, Math.min(g, R.nssf.upper) - R.nssf.tier1);
    function payeOf(taxable) { let tax = 0, prev = 0; for (const [top, rate] of R.paye.bands) { if (taxable > prev) tax += (Math.min(taxable, top) - prev) * rate; prev = top; } return Math.max(0, tax - R.paye.relief); }
    function calcPaye() {
      const g = num('#paye-gross');
      const n = $('#paye-nssf').checked ? nssfOf(g) : 0;
      const s = $('#paye-shif').checked && g > 0 ? Math.max(R.shif.min, R.shif.rate * g) : 0;
      const a = $('#paye-ahl').checked ? R.ahl.rate * g : 0;
      const taxable = Math.max(0, g - n - s - a), p = payeOf(taxable), net = Math.max(0, taxable - p);
      const set = (id, v) => { $(id).textContent = kes(v); };
      set('#paye-net', net); set('#r-gross', g); set('#r-nssf', n); set('#r-shif', s); set('#r-ahl', a); set('#r-taxable', taxable); set('#r-paye', p); set('#r-net', net);
      set('#r-emp-nssf', n); set('#r-emp-ahl', a); set('#r-cost', g + n + a);
    }
    ['#paye-gross', '#paye-nssf', '#paye-shif', '#paye-ahl'].forEach(s => $(s).addEventListener('input', calcPaye));
    function calcVat() {
      const v = num('#vat-amount'), add = $('#vat-mode').value === 'add';
      const net = add ? v : v / (1 + R.vat.rate), gross = add ? v * (1 + R.vat.rate) : v, tax = gross - net;
      $('#vat-lbl').textContent = add ? 'Price including VAT' : 'VAT inside this amount';
      $('#vat-big').textContent = kes(add ? gross : tax);
      $('#vat-net').textContent = kes(net); $('#vat-tax').textContent = kes(tax); $('#vat-gross').textContent = kes(gross);
    }
    $('#vat-amount').addEventListener('input', calcVat); $('#vat-mode').addEventListener('change', calcVat);
    function calcTot() {
      const v = num('#tot-sales'), annual = v * 12;
      $('#tot-big').textContent = kes(v * R.tot.rate); $('#tot-sales-out').textContent = kes(v); $('#tot-annual').textContent = kes(annual);
      $('#tot-elig').textContent = annual <= R.tot.min ? 'Below the band: no TOT at this level' : annual > R.tot.max ? 'Above the band: normal income tax and VAT apply' : 'Within the TOT band';
    }
    $('#tot-sales').addEventListener('input', calcTot);
    function calcMri() {
      const v = num('#mri-rent'), annual = v * 12;
      $('#mri-big').textContent = kes(v * R.mri.rate); $('#mri-rent-out').textContent = kes(v); $('#mri-annual').textContent = kes(annual);
      $('#mri-elig').textContent = annual < R.mri.min ? 'Below the band: declare under income tax' : annual > R.mri.max ? 'Above the band: declare under income tax' : 'Within the MRI band';
    }
    $('#mri-rent').addEventListener('input', calcMri);
    const penSel = $('#pen-type');
    R.penalties.types.forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = t.label; penSel.appendChild(o); });
    function calcPenalty() {
      const t = R.penalties.types.find(x => x.id === penSel.value) || R.penalties.types[0];
      const tax = num('#pen-tax'), months = Math.max(1, Math.min(120, Math.round(parseFloat($('#pen-months').value) || 1))), unpaid = $('#pen-unpaid').checked && tax > 0;
      const filing = t.flatPerMonth ? t.flatPerMonth * months : Math.max(t.pct * tax, t.min);
      const pay = unpaid ? R.penalties.latePaymentPct * tax : 0;
      const interest = unpaid ? R.penalties.interestPerMonth * tax * months : 0;
      $('#pen-filing-lbl').textContent = t.flatPerMonth ? `Late-filing penalty (KES ${t.flatPerMonth.toLocaleString('en-KE')} a month)` : `Late-filing penalty (${(t.pct * 100).toLocaleString('en-KE')}% or KES ${t.min.toLocaleString('en-KE')}, whichever is higher)`;
      $('#pen-int-lbl').textContent = `Interest at 1% a month for ${months} month${months === 1 ? '' : 's'}`;
      $('#pen-big').textContent = kes(filing + pay + interest);
      $('#pen-tax-out').textContent = kes(tax); $('#pen-filing').textContent = kes(filing); $('#pen-pay').textContent = kes(pay); $('#pen-int').textContent = kes(interest); $('#pen-total').textContent = kes(tax + filing + pay + interest);
      $('#pen-note').textContent = unpaid
        ? 'File now even if you cannot pay today: interest keeps running on the unpaid tax, but a filed return can be put on an iTax payment plan. If the period is on or before 31 December 2025, the 2026 amnesty may waive these penalties and interest once the principal is paid by 31 December 2026.'
        : (tax > 0 ? 'The tax itself is treated as paid, so only the filing penalty applies. If the period is on or before 31 December 2025, the 2026 amnesty may waive it once outstanding returns are filed.' : 'A nil return filed late still attracts the minimum penalty. File it now; if the period is on or before 31 December 2025, the 2026 amnesty may waive the penalty once the return is in.');
    }
    ['#pen-type', '#pen-tax', '#pen-months', '#pen-unpaid'].forEach(s => { $(s).addEventListener('input', calcPenalty); $(s).addEventListener('change', calcPenalty); });
    try { calcPaye(); calcVat(); calcTot(); calcMri(); calcPenalty(); } catch (e) { /* leave the static figures */ }

    /* checklists */
    $('#check-tabs').innerHTML = C.checklists.map((c, i) => `<button class="tab" role="tab" data-check="${esc(c.id)}" aria-selected="${i === 0 ? 'true' : 'false'}">${esc(c.title)}</button>`).join('');
    let currentCheck = C.checklists[0].id;
    const ticksKey = id => 'qx-check-' + id;
    const loadTicks = id => { try { return JSON.parse(localStorage.getItem(ticksKey(id)) || '[]'); } catch (e) { return []; } };
    const saveTicks = (id, arr) => { try { localStorage.setItem(ticksKey(id), JSON.stringify(arr)); } catch (e) { /* private mode: ticks last for the visit only */ } };
    let ticks = [];
    function paintProgress() {
      const c = checkById[currentCheck], done = ticks.filter(Boolean).length, total = c.items.length;
      $('#check-progress').innerHTML = `<span><b>${done} of ${total}</b> ready${done === total ? '. Everything is in hand; send it over.' : done ? '. Tap an item to tick it off as you find it.' : '. Tap each item as you find it; your ticks are remembered on this device.'}</span><span class="bar"><i style="width:${total ? Math.round(done / total * 100) : 0}%"></i></span>`;
    }
    function showCheck(id) {
      const c = checkById[id]; if (!c) return false;
      currentCheck = id;
      ticks = loadTicks(id);
      $$('#check-tabs .tab').forEach(t => t.setAttribute('aria-selected', t.getAttribute('data-check') === id ? 'true' : 'false'));
      $('#check-title').textContent = c.title;
      $('#check-intro').textContent = c.intro;
      $('#check-list').innerHTML = c.items.map((it, i) => `<li class="${ticks[i] ? 'done' : ''}" role="checkbox" aria-checked="${ticks[i] ? 'true' : 'false'}" tabindex="0" data-i="${i}"><span class="box">${icon('check')}</span><span class="txt"><span class="n">${i + 1}.</span>${esc(it)}</span></li>`).join('');
      $('#check-status').textContent = '';
      $('#check-wa').href = waLink(`I am gathering documents for: ${c.title.toLowerCase()}. Here is what I have so far:`);
      paintProgress();
      return true;
    }
    function toggleTick(li) {
      const i = Number(li.dataset.i); ticks[i] = !ticks[i];
      li.classList.toggle('done', !!ticks[i]); li.setAttribute('aria-checked', ticks[i] ? 'true' : 'false');
      saveTicks(currentCheck, ticks); paintProgress();
    }
    $('#check-list').addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) toggleTick(li); });
    $('#check-list').addEventListener('keydown', e => { const li = e.target.closest('li[data-i]'); if (li && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); toggleTick(li); } });
    $('#check-reset').addEventListener('click', () => { ticks = []; saveTicks(currentCheck, ticks); showCheck(currentCheck); });
    $$('#check-tabs .tab').forEach(t => t.addEventListener('click', () => showCheck(t.getAttribute('data-check'))));
    const checkText = () => { const c = checkById[currentCheck]; return `${c.title} — what to have ready (${cfg.firm})\n` + c.items.map((it, i) => `${ticks[i] ? '[x]' : '[ ]'} ${i + 1}. ${it}`).join('\n'); };
    $('#check-copy').addEventListener('click', e => copyText(checkText(), e.currentTarget, 'Copied', $('#check-status')));
    showCheck(currentCheck);

    function routeTools(fromLoad) {
      const h = hashOf(); let m;
      if ((m = h.match(/^tool-(.+)$/))) { if (showTab(m[1], !fromLoad)) scrollTo($('#calculators')); }
      else if ((m = h.match(/^check-(.+)$/))) { if (showCheck(m[1])) scrollTo($('#checklists')); }
    }
    window.addEventListener('hashchange', () => routeTools(false));
    routeTools(true);
  }

  /* ---------- answers page ---------- */
  if ($('#qa')) {
    const CATS = [['all', 'All'], ['tax', 'Tax'], ['payroll', 'Payroll'], ['audit', 'Audit'], ['company', 'Company'], ['ngo', 'NGOs and SACCOs'], ['firm', 'Working with us']];
    const catLabel = { tax: 'Tax', payroll: 'Payroll', audit: 'Audit', company: 'Company', ngo: 'NGOs', firm: 'The firm' };
    $('#qa-chips').innerHTML = CATS.map(([id, l], i) => `<button class="chip" type="button" data-cat="${id}" aria-pressed="${i === 0 ? 'true' : 'false'}">${esc(l)}</button>`).join('');
    $('#qa').innerHTML = C.faqs.map((f, i) => `<details id="q-${i}" data-cat="${esc(f.cat)}"><summary><span class="tag">${esc(catLabel[f.cat] || '')}</span>${esc(f.q)}</summary><p>${esc(f.a)}</p><a class="ask" href="${waLink('About "' + f.q + '": ')}" target="_blank" rel="noopener">${icon('chat')}Ask us about your own case</a></details>`).join('') + '<div class="qa-empty" id="qa-empty" hidden>Nothing matches that yet. Ask us directly and we will answer.</div>';
    let qaCat = 'all';
    function filterQa() {
      const q = $('#qa-search').value.trim().toLowerCase();
      let shown = 0;
      $$('#qa details').forEach(d => {
        const ok = (qaCat === 'all' || d.getAttribute('data-cat') === qaCat) && (!q || d.textContent.toLowerCase().includes(q));
        d.hidden = !ok; if (ok) shown++;
      });
      $('#qa-empty').hidden = shown > 0;
      $('#qa-meta').textContent = `${shown} of ${C.faqs.length} answers` + (q ? ` for “${$('#qa-search').value.trim()}”` : '') + (qaCat !== 'all' ? ` in ${CATS.find(c => c[0] === qaCat)[1]}` : '');
    }
    $('#qa-search').addEventListener('input', filterQa);
    $$('#qa-chips .chip').forEach(c => c.addEventListener('click', () => { qaCat = c.getAttribute('data-cat'); $$('#qa-chips .chip').forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false')); filterQa(); }));
    function routeAnswers() {
      const h = hashOf(); let m;
      if ((m = h.match(/^find-(.+)$/))) { $('#qa-search').value = m[1]; filterQa(); const first = $('#qa details:not([hidden])'); if (first) { first.open = true; scrollTo(first, 'center'); } }
      else if ((m = h.match(/^q-(\d+)$/))) { const d = document.getElementById(h); if (d) { $('#qa-search').value = ''; qaCat = 'all'; $$('#qa-chips .chip').forEach(x => x.setAttribute('aria-pressed', x.getAttribute('data-cat') === 'all' ? 'true' : 'false')); filterQa(); d.open = true; scrollTo(d, 'center'); } }
      else filterQa();
    }
    window.addEventListener('hashchange', routeAnswers);
    routeAnswers();
    try {
      const ld = document.createElement('script'); ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
      document.head.appendChild(ld);
    } catch (e) { /* optional */ }
  }

  /* ---------- about page ---------- */
  function portrait(p, expanded) {
    const base = `assets/people/${p.id}`;
    const sizes = expanded ? '(max-width: 980px) 100vw, 360px' : '(max-width: 640px) 46vw, (max-width: 1120px) 24vw, 300px';
    return `<img src="${base}-1122.webp" srcset="${base}-560.webp 560w, ${base}-1122.webp 1122w" sizes="${sizes}" data-fallback="${base}-1122.jpg" alt="${esc(p.name)}" width="1122" height="1402" loading="${expanded ? 'eager' : 'lazy'}" decoding="async">`;
  }
  document.addEventListener('error', e => {
    const img = e.target; if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
    const fb = img.dataset.fallback; delete img.dataset.fallback; img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.src = fb;
  }, true);
  function openPerson(id, trigger) {
    const p = personById[id]; if (!p) return;
    openDialog(`
      <div class="dlg-person">
        <div class="pic">${portrait(p, true)}</div>
        <div class="dlg-body">
          <span class="cred">${esc(p.credential || 'Governance and advisory')}</span>
          <h2 id="dlg-title">${esc(p.name)}</h2>
          <p class="role">${esc(p.role)}</p>
          <p class="bio">${esc(p.bio)}</p>
          <div class="dlg-acts"><button class="btn btn-primary" type="button" data-need="unsure">Start a conversation</button></div>
        </div>
      </div>`, trigger, 'person-' + id);
  }
  if (page === 'about') {
    const whyIcons = ['briefcase', 'pin', 'shield', 'doc', 'calc', 'lock'];
    $('#why').innerHTML = C.whyUs.map((w, i) => `<li><span class="w-icon">${icon(whyIcons[i % whyIcons.length])}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></li>`).join('');
    $('#tech').innerHTML = C.technology.map(t => `<li><b>${esc(t.title)}</b><span>${esc(t.text)}</span></li>`).join('') + `<li class="software">${C.software.map(s => `<span>${esc(s)}</span>`).join('')}</li>`;
    $('#values-btn').addEventListener('click', e => openDialog(`
      <div class="dlg-body dlg-plain">
        <span class="kicker">Purpose</span>
        <h2 id="dlg-title">Mission, vision and values</h2>
        <div class="kv"><div><h3>Our mission</h3><p>${esc(C.mission)}</p></div><div><h3>Our vision</h3><p>${esc(C.vision)}</p></div></div>
        <h3>Core values</h3>
        <ul class="values">${C.values.map(v => `<li><b>${esc(v.title)}</b><span>${esc(v.text)}</span></li>`).join('')}</ul>
      </div>`, e.currentTarget));
    $('#steps').innerHTML = C.process.map(p => `<li><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`).join('');
    $('#team').innerHTML = C.people.map(p => `
      <li class="person" data-person-id="${esc(p.id)}" id="person-${esc(p.id)}">
        <button class="photo-btn" type="button" data-person="${esc(p.id)}" aria-label="Read ${esc(p.name)}’s profile">${portrait(p, false)}</button>
        <p class="cred">${esc(p.credential || 'Governance and advisory')}</p>
        <h3>${esc(p.name)}</h3>
        <p class="role">${esc(p.displayRole)}</p>
        <p class="intro">${esc(p.intro)}</p>
        <button class="textlink" type="button" data-person="${esc(p.id)}">Full profile ${icon('arrow')}</button>
      </li>`).join('');
    document.addEventListener('click', e => { const b = e.target.closest('[data-person]'); if (b) openPerson(b.getAttribute('data-person'), b); });
    function routeAbout(fromLoad) { const m = hashOf().match(/^person-(.+)$/); if (m && personById[m[1]]) { if (fromLoad) scrollTo($('#people')); openPerson(m[1], document.getElementById('person-' + m[1])); } }
    window.addEventListener('hashchange', () => routeAbout(false));
    routeAbout(true);
  }

  /* ---------- copy ---------- */
  function copyText(text, btn, label, statusEl) {
    const done = () => { if (btn) { const old = btn.textContent; btn.textContent = label || 'Copied'; btn.classList.add('done'); setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1600); } if (statusEl) statusEl.textContent = 'Copied to your clipboard.'; };
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.left = '-999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { if (statusEl) statusEl.textContent = 'Select the text and copy it.'; }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }
  $$('button.copy[data-copy]').forEach(b => b.addEventListener('click', () => copyText(b.getAttribute('data-copy'), b)));

  /* ---------- contact page: enquiry form ---------- */
  const form = $('#enquiry');
  if (form) {
    const needSel = $('#f-need');
    C.finder.forEach(f => { const o = document.createElement('option'); o.value = f.id; o.textContent = f.title; needSel.appendChild(o); });
    const other = document.createElement('option'); other.value = 'other'; other.textContent = 'Something else'; needSel.appendChild(other);
    const sent = $('#sent');
    function readForm() {
      const name = $('#f-name').value.trim(), org = $('#f-org').value.trim(), phone = $('#f-phone').value.trim(), email = $('#f-email').value.trim(), msg = $('#f-msg').value.trim();
      const needText = needSel.options[needSel.selectedIndex].text;
      $('#f-name-err').textContent = name ? '' : 'Add your name so we know who to reply to.';
      $('#f-phone-err').textContent = phone ? '' : 'Add a phone or WhatsApp number.';
      if (!name) { $('#f-name').focus(); return null; }
      if (!phone) { $('#f-phone').focus(); return null; }
      const text = `Hello Quartex,\nName: ${name}${org ? `\nOrganisation: ${org}` : ''}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ''}\nI need help with: ${needText}${msg ? `\nDetails: ${msg}` : ''}\nPlease get in touch to arrange a consultation.`;
      return { name, org, phone, email, msg, need: needSel.value, needText, text };
    }
    function showSent(title, how, text, { wa = false, mail = false, status = '', subject = 'Consultation request' } = {}) {
      $('#sent-title').textContent = title; $('#sent-how').textContent = how; $('#sent-text').textContent = text;
      $('#sent-wa').hidden = !wa; $('#sent-mail').hidden = !mail;
      if (wa) $('#sent-wa').href = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
      if (mail) $('#sent-mail').href = `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      $('#sent-status').textContent = status;
      sent.hidden = false; scrollTo(sent, 'nearest');
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = readForm(); if (!d) return;
      showSent('Your WhatsApp message is ready', 'Review it, then open WhatsApp to send it. Nothing has been sent yet.', d.text, { wa: true, status: `Not sent yet. It goes to ${cfg.phones[0]} when you send it from WhatsApp.` });
    });
    $('#f-send-mail').addEventListener('click', () => {
      const d = readForm(); if (!d) return;
      showSent('Your email is ready', `Open your email app to send it to ${cfg.email}, or copy the text and paste it into any email. Nothing has been sent yet.`, d.text, { mail: true, subject: 'Consultation request: ' + d.needText, status: 'Not sent yet. It goes to the firm when you send it from your email app.' });
    });
    $('#sent-copy').addEventListener('click', e => copyText($('#sent-text').textContent, e.currentTarget, 'Copied', $('#sent-status')));
    $('#sent-wa').addEventListener('click', () => { $('#sent-status').textContent = `WhatsApp should now be open with your message. If it did not open, copy the message and send it to ${cfg.phones[0]}.`; });
    $('#sent-mail').addEventListener('click', () => { $('#sent-status').textContent = `Your email app should now be open. If it did not open, copy the message and email ${cfg.email}.`; });
    if (cfg.formEndpoint) {
      const api = $('#f-send-api'); api.hidden = false;
      $('#form-how').textContent = 'Fill in the form and send it. We reply by phone or WhatsApp on working days. You can also send the same details by WhatsApp or email.';
      api.addEventListener('click', async () => {
        const d = readForm(); if (!d) return;
        api.disabled = true; api.textContent = 'Sending…';
        try {
          const res = await fetch(cfg.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name: d.name, organisation: d.org, phone: d.phone, email: d.email, need: d.needText, message: d.msg, page: location.href }) });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          showSent('Sent', `Thank you, ${d.name}. We have your enquiry and will reply to ${d.phone}.`, d.text, { status: 'Sent to the firm.' });
          form.reset();
        } catch (err) {
          showSent('Could not send from the website', 'Something went wrong on the way to our inbox. Your message is below; send it by WhatsApp or email instead.', d.text, { wa: true, mail: true, status: 'Not sent. Use WhatsApp or email.' });
        } finally { api.disabled = false; api.textContent = 'Send enquiry'; }
      });
    }
    $('#privacy-btn').addEventListener('click', e => openDialog(`
      <div class="dlg-body dlg-plain">
        <span class="kicker">Privacy</span>
        <h2 id="dlg-title">How this form handles your details</h2>
        ${cfg.formEndpoint
          ? `<p>When you press “Send enquiry”, the details you typed are sent to the firm’s enquiry inbox so that we can reply. They are used only to respond to your enquiry and to set up any work you ask for.</p>`
          : `<p>The form prepares a message in your browser. This website does not submit the form to a server or store its contents.</p><p>If you choose WhatsApp, the prepared text is passed to WhatsApp and you send it from there. If you choose email, your email app opens with the text in a new message. “Copy message” copies the draft so you can send it any way you like.</p>`}
        <p>Website hosting and your messaging or email provider may process technical information under their own policies. Please use the first message to describe your needs; we agree a suitable way to receive any documents the engagement requires.</p>
        <p>Your details are not sold or shared outside the firm, and we delete them on request. Questions: ${esc(cfg.email)}.</p>
      </div>`, e.currentTarget));
    function routeContact() { const m = hashOf().match(/^need-(.+)$/); if (m && $$('option', needSel).some(o => o.value === m[1])) { needSel.value = m[1]; scrollTo($('#enquiry')); } }
    window.addEventListener('hashchange', routeContact);
    routeContact();
  }
  /* ---------- navigation: the Services and Tools panels (desktop) and the menu sheet (phones) ---------- */
  const svcLinks = full => C.services.map((s, i) => `<li><a href="services.html#service-${esc(s.id)}"><span class="n">${n2g(i)}</span><span>${full ? `<b>${esc(s.title)}</b><small>${esc(s.promise)}</small>` : esc(s.shortTitle)}</span></a></li>`).join('');
  const megaS = $('#mega-services'), megaT = $('#mega-tools');
  if (megaS) megaS.innerHTML = `<div class="mega-grid">
      <div><div class="mega-head"><span class="kicker">Eight practice areas</span><a class="textlink" href="services.html">All services, in full ${icon('arrow')}</a></div><ol class="mega-list">${svcLinks(true)}</ol></div>
      <aside class="mega-side"><span class="kicker">Not sure where you fit?</span><p>Pick the situation closest to yours and see what we would do first, what to send and what is worth knowing.</p><a class="btn btn-primary" href="index.html#start">Tell us what you need</a><ul class="mega-links"><li><a href="services.html#who">${icon('briefcase')}Who we serve</a></li><li><a href="${esc(cfg.profilePdf)}" target="_blank" rel="noopener">${icon('doc')}Company profile (PDF)</a></li></ul></aside></div>`;
  if (megaT) {
    let dates = '';
    try { const { items } = upcoming(); dates = `<ul class="mega-dates">${items.slice(0, 3).map(x => `<li><b>${esc(fmt(x.d))}</b><span>${esc(x.r.label)} for ${esc(x.covers)}</span></li>`).join('')}</ul>`; } catch (e) { /* the link below still works */ }
    megaT.innerHTML = `<div class="mega-grid mega-grid-3">
      <div class="mega-col"><h4>Statutory deadlines</h4>${dates}<a class="textlink" href="tools.html#deadlines">Full calendar, with sources ${icon('arrow')}</a></div>
      <div class="mega-col"><h4>Calculators</h4><ul>${(C.calculators || []).map(c => `<li><a href="tools.html#tool-${esc(c.id)}">${esc(c.title)}</a></li>`).join('')}</ul></div>
      <div class="mega-col"><h4>What to have ready</h4><ul>${C.checklists.map(c => `<li><a href="tools.html#check-${esc(c.id)}">${esc(c.title)}</a></li>`).join('')}</ul></div></div>`;
  }
  const hms = $$('.has-menu');
  if (hms.length) {
    let hoverT = null;
    const fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function closeMegas(except) { hms.forEach(li => { if (li !== except && li.classList.contains('open')) { li.classList.remove('open'); $('.mega-btn', li).setAttribute('aria-expanded', 'false'); $('.mega', li).hidden = true; } }); }
    function openMega(li) { closeMegas(li); li.classList.add('open'); $('.mega-btn', li).setAttribute('aria-expanded', 'true'); $('.mega', li).hidden = false; }
    hms.forEach(li => {
      $('.mega-btn', li).addEventListener('click', () => (li.classList.contains('open') ? closeMegas() : openMega(li)));
      li.addEventListener('mouseenter', () => { if (!fine) return; clearTimeout(hoverT); hoverT = setTimeout(() => openMega(li), 110); });
      li.addEventListener('mouseleave', () => { clearTimeout(hoverT); hoverT = setTimeout(() => { if (!li.contains(document.activeElement)) closeMegas(); }, 240); });
      li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) closeMegas(); });
    });
    document.addEventListener('click', e => { if (!e.target.closest('.has-menu')) closeMegas(); });
    document.addEventListener('keydown', e => { const open = hms.find(l => l.classList.contains('open')); if (e.key === 'Escape' && open) { closeMegas(); $('.mega-btn', open).focus(); } });
  }
  const sheetNav = $('#menu-sheet-nav');
  if (sheetNav) {
    const curp = p => (p === page ? ' aria-current="page"' : '');
    sheetNav.innerHTML = `
      <div class="ms-top">
        <a href="index.html"${curp('index')}>${icon('home')}<span>Home</span></a>
        <a href="answers.html"${curp('answers')}>${icon('help')}<span>Answers</span></a>
        <a href="about.html"${curp('about')}>${icon('shield')}<span>About</span></a>
        <a href="contact.html"${curp('contact')}>${icon('chat')}<span>Contact</span></a>
      </div>
      <section class="ms-group"><a class="ms-head" href="services.html"${curp('services')}>Services <small>${C.services.length} practice areas</small>${icon('arrow')}</a><ol class="ms-list">${svcLinks(false)}</ol></section>
      <section class="ms-group"><a class="ms-head" href="tools.html"${curp('tools')}>Tools <small>work it out before you call</small>${icon('arrow')}</a><ul class="ms-list plain">
        <li><a href="tools.html#deadlines">${icon('calendar')}<span>Statutory deadlines</span></a></li>
        <li><a href="tools.html#calculators">${icon('calc')}<span>Calculators</span></a></li>
        <li><a href="tools.html#checklists">${icon('list')}<span>What to have ready</span></a></li>
        <li><a href="answers.html">${icon('help')}<span>Common questions</span></a></li></ul></section>
      <section class="ms-group"><a class="ms-head" href="about.html"${curp('about')}>About <small>the firm and the people</small>${icon('arrow')}</a><ul class="ms-list plain">
        <li><a href="about.html#firm">${icon('shield')}<span>Why Quartex</span></a></li>
        <li><a href="about.html#people">${icon('briefcase')}<span>Our people</span></a></li>
        <li><a href="about.html#process">${icon('notice')}<span>How an engagement runs</span></a></li>
        <li><a href="${esc(cfg.profilePdf)}" target="_blank" rel="noopener">${icon('doc')}<span>Company profile (PDF)</span></a></li></ul></section>
      <div class="ms-cta"><a class="btn btn-primary" href="contact.html">Request a consultation</a>
        <div class="ms-routes"><a class="wa" href="${waLink('I would like to talk about my accounts.')}" target="_blank" rel="noopener">${icon('chat')}WhatsApp</a><a href="tel:${esc(cfg.phones[0].replace(/\s+/g, ''))}">${icon('phone')}Call</a><a href="mailto:${esc(cfg.email)}">${icon('mail')}Email</a></div></div>`;
  }

  /* ---------- sub-navigation: mark the section in view; on phones the page bar follows it ---------- */
  const subnavEl = $('.subnav');
  const subnavLinks = $$('.subnav a[href^="#"]').filter(a => document.getElementById(a.getAttribute('href').slice(1)));
  if (subnavLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(subnavLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const items = subnavLinks.map(a => ({ id: a.getAttribute('href').slice(1), label: a.textContent.trim() }));
    const bar = page !== 'services' ? pageBar({ items, trigger: subnavEl, stage: $('#main'), kicker: 'On this page', onPick: i => scrollTo(document.getElementById(items[i].id)) }) : null;
    let current = null;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { const a = byId.get(en.target.id); if (a && a !== current) { if (current) current.classList.remove('active'); current = a; a.classList.add('active'); if (bar) bar.paint(items.findIndex(x => x.id === en.target.id)); } } });
    }, { rootMargin: '-30% 0px -60% 0px' });
    byId.forEach((a, id) => { const t = document.getElementById(id); if (t) io.observe(t); });
  }

  /* ---------- reveal: a short rise as card groups enter the viewport ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    const groups = ['#tiles > li', '#svc-mini > li', '.tool-card', '.service-block', '#why > li', '#team > li', '#steps > li', '#team-mini > li', '#now > div', '.aud', '.svc'];
    const items = [];
    groups.forEach(sel => $$(sel).forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', Math.min(i, 7) * 60 + 'ms'); items.push(el); }));
    const io = new IntersectionObserver(entries => { entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    items.forEach(el => io.observe(el));
    setTimeout(() => items.forEach(el => el.classList.add('in')), 2500); /* belt and braces: nothing stays hidden */
  }

  /* ---------- back to top ---------- */
  const toTop = $('#to-top');
  if (toTop) {
    const check = () => { toTop.hidden = window.scrollY < 900; };
    window.addEventListener('scroll', check, { passive: true }); check();
    toTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }
})();
