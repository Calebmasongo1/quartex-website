/* Quartex Synergy & Associates — page behaviour.
 * Renders content.js into the page, runs the deadline engine, the calculators,
 * the question filter and the enquiry form. Nothing here sends data anywhere
 * unless config.formEndpoint is set (see content.js). */
(() => {
  'use strict';
  const C = window.QUARTEX_CONTENT;
  if (!C) return;
  const cfg = C.config;

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

  $$('[data-reviewed]').forEach(el => { el.textContent = cfg.reviewedOn; });
  $('#year').textContent = String(new Date().getFullYear());

  /* ---------- dialog ---------- */
  const dlg = $('#dlg');
  const dlgContent = $('#dlg-content');
  let dlgTrigger = null;
  let dlgHash = '';
  function openDialog(html, trigger, hash) {
    dlgTrigger = trigger || document.activeElement;
    dlgHash = hash || '';
    dlgContent.innerHTML = html;
    closeMenu();
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    document.body.classList.add('modal-open');
    if (dlgHash && location.hash !== '#' + dlgHash) history.replaceState(null, '', '#' + dlgHash);
    const h = $('h2', dlgContent); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  function closeDialog() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (dlgHash && location.hash === '#' + dlgHash) history.replaceState(null, '', location.pathname + location.search);
    dlgHash = '';
    if (dlgTrigger && dlgTrigger.isConnected && document.activeElement === document.body) dlgTrigger.focus({ preventScroll: true });
  });
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { closeDialog(); return; }
    if (e.target === dlg) {
      const r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
    }
  });

  /* ---------- header ---------- */
  const head = $('.site-head'), menuBtn = $('#menu-btn');
  function closeMenu() { head.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu'; }
  menuBtn.addEventListener('click', () => {
    const open = head.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  $$('.primary a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && head.classList.contains('open')) { closeMenu(); menuBtn.focus(); } });
  const progress = $('#progress');
  let ticking = false;
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  if ('IntersectionObserver' in window) {
    const links = new Map($$('.primary a[href^="#"]').map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { const a = links.get(en.target.id); if (!a) return; if (en.isIntersecting) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }, { rootMargin: '-20% 0px -65% 0px' });
    links.forEach((a, id) => { const sec = document.getElementById(id); if (sec) io.observe(sec); });
  }

  /* ---------- enquiry routing ---------- */
  const needSel = $('#f-need');
  C.finder.forEach(f => { const o = document.createElement('option'); o.value = f.id; o.textContent = f.title; needSel.appendChild(o); });
  const other = document.createElement('option'); other.value = 'other'; other.textContent = 'Something else'; needSel.appendChild(other);
  function goToForm(needId) {
    if (needId && $$('option', needSel).some(o => o.value === needId)) needSel.value = needId;
    closeDialog();
    scrollTo($('#contact'));
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 450);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-need]');
    if (b) { e.preventDefault(); goToForm(b.getAttribute('data-need')); }
  });

  /* ---------- services ---------- */
  const svcById = Object.fromEntries(C.services.map(s => [s.id, s]));
  $('#svc-grid').innerHTML = C.services.map(s => `
    <article class="svc" id="service-${esc(s.id)}">
      <h3>${esc(s.title)}</h3>
      <p class="promise">${esc(s.promise)}</p>
      <ul>${s.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="for"><b>For:</b> ${esc(s.audience)}</p>
      <div class="acts">
        <button class="btn btn-light btn-sm" type="button" data-service="${esc(s.id)}">Full service</button>
        <button class="textlink" type="button" data-need="${esc(s.need)}">Discuss this</button>
      </div>
    </article>`).join('');
  $('#foot-services').innerHTML = C.services.map(s => `<li><a href="#service-${esc(s.id)}">${esc(s.shortTitle)}</a></li>`).join('');
  function openService(id, trigger) {
    const s = svcById[id]; if (!s) return;
    openDialog(`
      <div class="dlg-service">
        <div class="pic">${pictureFor(s.image, s.imageAlt, s.imageRatio, '(max-width: 980px) 100vw, 400px')}</div>
        <div class="dlg-body">
          <span class="kicker">Service</span>
          <h2 id="dlg-title">${esc(s.title)}</h2>
          <p class="promise">${esc(s.promise)}</p>
          <p>${esc(s.description)}</p>
          <h3>How we can support you</h3>
          <ul class="dlg-list">${s.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
          <div class="dlg-outcome"><b>What you end up with:</b> ${esc(s.outcome)}</div>
          <div class="dlg-acts">
            <button class="btn btn-primary" type="button" data-need="${esc(s.need)}">Discuss this service</button>
            <a class="btn btn-wa" href="${waLink('I would like to talk about ' + s.title.toLowerCase() + '.')}" target="_blank" rel="noopener">${icon('chat')}Ask on WhatsApp</a>
          </div>
        </div>
      </div>`, trigger, 'service-' + id);
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-service]'); if (b) openService(b.getAttribute('data-service'), b); });

  /* ---------- finder ---------- */
  const finderById = Object.fromEntries(C.finder.map(f => [f.id, f]));
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
    $('#p-know').textContent = f.know;
    $('#p-wa').href = waLink(f.wa);
    $('#p-tools').innerHTML = f.tools.map(t => `<li><a href="${esc(t.href)}">${esc(t.label)}</a></li>`).join('');
    const svc = svcById[f.service];
    $('#p-service').textContent = svc ? 'See ' + svc.shortTitle.toLowerCase() + ' in full' : 'See the full service';
    $('#p-service').hidden = !svc;
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
    if (scroll) scrollTo(panel, 'nearest');
  }
  $$('.tile').forEach(t => t.addEventListener('click', () => selectFinder(t.getAttribute('data-id'), window.innerWidth < 980)));
  $('#p-form').addEventListener('click', () => goToForm(currentNeed));
  $('#p-service').addEventListener('click', e => { const f = finderById[currentNeed]; if (f && f.service) openService(f.service, e.currentTarget); });
  selectFinder(currentNeed, false);

  /* ---------- audiences and industries ---------- */
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

  /* ---------- deadline engine ---------- */
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
  function renderDeadlines() {
    const today = sod(new Date());
    const items = C.deadlines.monthly.map(r => Object.assign({ r }, nextDue(r.rule, today))).filter(x => x.d).sort((a, b) => a.d - b.d);
    $('#strip-list').innerHTML = items.map(x => { const n = daysBetween(today, x.d); return `<li class="${n <= 5 ? 'soon' : ''}"><b>${esc(fmt(x.d))}</b><span>${esc(x.r.label)} for ${esc(x.covers)}</span></li>`; }).join('');
    $('#now').innerHTML = items.map(x => {
      const n = daysBetween(today, x.d);
      const cls = n === 0 || n <= 5 ? 'soon' : 'ok';
      const state = n === 0 ? 'Due today' : n <= 5 ? `Due in ${n} day${n === 1 ? '' : 's'}` : `In ${n} days`;
      const prev = dueFor(x.r.rule, x.d.getFullYear(), x.d.getMonth() - 1);
      return `<div class="${cls}"><span class="state">${esc(state)}</span><strong>${esc(x.r.label)} for ${esc(x.covers)}</strong><span>Due ${esc(fmt(x.d))}. The previous one was due ${esc(fmt(prev))}; late filings attract penalties and interest.</span></div>`;
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
  }
  try { renderDeadlines(); } catch (e) { /* the static strip copy stays in place */ }

  /* ---------- calculator tabs ---------- */
  function showTab(id, focus) {
    const tab = $(`.tab[data-tab="${id}"]`); if (!tab) return false;
    $$('#calculators .tab').forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
    $$('#calculators .tool').forEach(p => { p.hidden = p.id !== 'tool-' + id; });
    if (focus) tab.focus({ preventScroll: true });
    return true;
  }
  $$('#calculators .tab').forEach(t => t.addEventListener('click', () => showTab(t.getAttribute('data-tab'))));

  /* ---------- calculators ---------- */
  const R = C.rates;
  function nssfOf(g) { return R.nssf.rate * Math.min(g, R.nssf.tier1) + R.nssf.rate * Math.max(0, Math.min(g, R.nssf.upper) - R.nssf.tier1); }
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

  /* ---------- checklists ---------- */
  const checkById = Object.fromEntries(C.checklists.map(c => [c.id, c]));
  $('#check-tabs').innerHTML = C.checklists.map((c, i) => `<button class="tab" role="tab" data-check="${esc(c.id)}" aria-selected="${i === 0 ? 'true' : 'false'}">${esc(c.title)}</button>`).join('');
  let currentCheck = C.checklists[0].id;
  function showCheck(id) {
    const c = checkById[id]; if (!c) return;
    currentCheck = id;
    $$('#check-tabs .tab').forEach(t => t.setAttribute('aria-selected', t.getAttribute('data-check') === id ? 'true' : 'false'));
    $('#check-title').textContent = c.title;
    $('#check-intro').textContent = c.intro;
    $('#check-list').innerHTML = c.items.map(i => `<li>${esc(i)}</li>`).join('');
    $('#check-status').textContent = '';
    $('#check-wa').href = waLink(`I am gathering documents for: ${c.title.toLowerCase()}. Here is what I have so far:`);
  }
  $$('#check-tabs .tab').forEach(t => t.addEventListener('click', () => showCheck(t.getAttribute('data-check'))));
  const checkText = () => { const c = checkById[currentCheck]; return `${c.title} — what to have ready (${cfg.firm})\n` + c.items.map((it, i) => `${i + 1}. ${it}`).join('\n'); };
  $('#check-copy').addEventListener('click', e => copyText(checkText(), e.currentTarget, 'Copied', $('#check-status')));
  showCheck(currentCheck);

  /* ---------- common questions ---------- */
  const CATS = [['all', 'All'], ['tax', 'Tax'], ['payroll', 'Payroll'], ['audit', 'Audit'], ['company', 'Company'], ['ngo', 'NGOs and SACCOs'], ['firm', 'Working with us']];
  const catLabel = { tax: 'Tax', payroll: 'Payroll', audit: 'Audit', company: 'Company', ngo: 'NGOs', firm: 'The firm' };
  $('#qa-chips').innerHTML = CATS.map(([id, l], i) => `<button class="chip" type="button" data-cat="${id}" aria-pressed="${i === 0 ? 'true' : 'false'}">${esc(l)}</button>`).join('');
  $('#qa').innerHTML = C.faqs.map(f => `<details data-cat="${esc(f.cat)}"${f.top ? ' data-top="1"' : ''}><summary><span class="tag">${esc(catLabel[f.cat] || '')}</span>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('') + '<div class="qa-empty" id="qa-empty" hidden>Nothing matches that yet. Ask us directly and we will answer.</div>';
  let qaCat = 'all', qaAll = false;
  const qaTotal = C.faqs.length;
  function filterQa() {
    const q = $('#qa-search').value.trim().toLowerCase();
    const expanded = qaAll || !!q || qaCat !== 'all';
    let shown = 0;
    $$('#qa details').forEach(d => {
      const ok = (qaCat === 'all' || d.getAttribute('data-cat') === qaCat) && (!q || d.textContent.toLowerCase().includes(q)) && (expanded || d.getAttribute('data-top') === '1');
      d.hidden = !ok; if (ok) shown++;
    });
    $('#qa-empty').hidden = shown > 0;
    $('#qa-meta').textContent = (expanded ? `${shown} answer${shown === 1 ? '' : 's'}` : `Showing ${shown} of ${qaTotal} answers`) + (q ? ` for “${$('#qa-search').value.trim()}”` : '');
    $('#qa-more').hidden = expanded;
    $('#qa-more').textContent = `Show all ${qaTotal} answers`;
  }
  $('#qa-search').addEventListener('input', filterQa);
  $('#qa-more').addEventListener('click', () => { qaAll = true; filterQa(); });
  $$('#qa-chips .chip').forEach(c => c.addEventListener('click', () => { qaCat = c.getAttribute('data-cat'); $$('#qa-chips .chip').forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false')); filterQa(); }));
  filterQa();
  /* FAQ structured data for search engines */
  try {
    const ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    document.head.appendChild(ld);
  } catch (e) { /* optional */ }

  /* ---------- the firm ---------- */
  $('#why').innerHTML = C.whyUs.map(w => `<li><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></li>`).join('');
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

  /* ---------- people ---------- */
  const personById = Object.fromEntries(C.people.map(p => [p.id, p]));
  const portrait = (p, expanded) => {
    const base = `assets/people/${p.id}`;
    const sizes = expanded ? '(max-width: 980px) 100vw, 360px' : '(max-width: 640px) 100vw, (max-width: 1120px) 48vw, 24vw';
    return `<img src="${base}-1122.webp" srcset="${base}-560.webp 560w, ${base}-1122.webp 1122w" sizes="${sizes}" data-fallback="${base}-1122.jpg" alt="${esc(p.name)}" width="1122" height="1402" loading="${expanded ? 'eager' : 'lazy'}" decoding="async">`;
  };
  document.addEventListener('error', e => {
    const img = e.target; if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
    const fb = img.dataset.fallback; delete img.dataset.fallback; img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.src = fb;
  }, true);
  $('#team').innerHTML = C.people.map(p => `
    <li class="person" data-person-id="${esc(p.id)}" id="person-${esc(p.id)}">
      <button class="photo-btn" type="button" data-person="${esc(p.id)}" aria-label="Read ${esc(p.name)}’s profile">${portrait(p, false)}</button>
      <p class="cred">${esc(p.credential || 'Governance and advisory')}</p>
      <h3>${esc(p.name)}</h3>
      <p class="role">${esc(p.displayRole)}</p>
      <p class="intro">${esc(p.intro)}</p>
      <button class="textlink" type="button" data-person="${esc(p.id)}">Full profile ${icon('arrow')}</button>
    </li>`).join('');
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
  document.addEventListener('click', e => { const b = e.target.closest('[data-person]'); if (b) openPerson(b.getAttribute('data-person'), b); });

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

  /* ---------- enquiry form ---------- */
  const form = $('#enquiry');
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

  /* ---------- hash routing: shareable links to a service, a person or a tool ---------- */
  function route(fromLoad) {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!h) return;
    let m;
    if ((m = h.match(/^service-(.+)$/)) && svcById[m[1]]) { if (fromLoad) scrollTo(document.getElementById(h)); openService(m[1], document.getElementById(h)); }
    else if ((m = h.match(/^person-(.+)$/)) && personById[m[1]]) { if (fromLoad) scrollTo(document.getElementById(h)); openPerson(m[1], document.getElementById(h)); }
    else if ((m = h.match(/^tool-(.+)$/))) { if (showTab(m[1], !fromLoad)) scrollTo($('#calculators')); }
    else if ((m = h.match(/^need-(.+)$/)) && finderById[m[1]]) { selectFinder(m[1], true); }
  }
  window.addEventListener('hashchange', () => route(false));
  route(true);
})();
