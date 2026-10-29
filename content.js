/* Quartex Synergy & Associates — site content.
 *
 * Everything the page says lives in this one file: firm details, the eight
 * services, audiences, people, the engagement process, the "what do you need"
 * scenarios, statutory deadlines, calculator rates, checklists and the answers.
 *
 * Business content is adapted from the firm's 41-page company profile
 * (services pp. 6–27, who we serve pp. 31–32, team pp. 35–38, process p. 39).
 * Tax figures carry a `reviewedOn` date and a source link; update them after
 * each Finance Act, NSSF, SHA or KRA notice. Keep strings as plain text — the
 * page escapes them when rendering.
 */
window.QUARTEX_CONTENT = {
  config: {
    firm: 'Quartex Synergy & Associates',
    shortName: 'Quartex',
    tagline: 'Integrity, Precision, Innovation, Growth.',
    /* Public origin. Update before deploying to the live domain; it feeds the
       canonical, Open Graph and JSON-LD URLs. */
    siteUrl: 'https://quartexsynergy.com',
    email: 'info@quartexsynergy.co.ke',
    whatsapp: '254795019199',
    phones: ['+254 795 019 199', '+254 742 773 395', '+254 720 621 311'],
    location: 'Westlands, Nairobi, Kenya',
    postal: 'P.O. Box 10 – 00100, Nairobi, Kenya',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Westlands%2C%20Nairobi%2C%20Kenya',
    profilePdf: 'assets/Quartex-Company-Profile.pdf',
    /* Optional: a form endpoint that accepts a JSON POST (for example a
       Formspree form, a Cloudflare Worker or your own API). When set, the
       enquiry form submits to it and reports the real result. When empty, the
       form prepares a WhatsApp message or an email draft that the visitor
       sends themselves. Nothing is ever reported as "sent" unless it was. */
    formEndpoint: '',
    reviewedOn: '28 October 2026'
  },

  services: [
    {
      id: 'audit-assurance',
      title: 'Audit & Assurance',
      shortTitle: 'Audit & assurance',
      promise: 'An independent opinion that shareholders, lenders, donors and regulators can rely on.',
      highlights: [
        'Statutory audits under International Standards on Auditing',
        'Donor-funded project and grant compliance audits',
        'Internal audit on a risk-based plan, with a management letter'
      ],
      audience: 'Companies, NGOs and donor projects, SACCOs and public bodies.',
      tags: ['Companies', 'NGOs and donor projects', 'SACCOs', 'Public bodies'],
      related: [{ label: 'Statutory audit checklist', href: 'tools.html#check-audit' }, { label: 'Donor audit checklist', href: 'tools.html#check-donor' }, { label: 'Does my company need an audit?', href: 'answers.html#find-need an audit' }],
      description: 'We examine financial information, systems and controls so that the people who rely on your reporting can trust it. From statutory audits to targeted investigations, the work follows the applicable standards and an agreed scope, and ends with clear findings and practical recommendations rather than a list of exceptions.',
      bullets: [
        'External and statutory financial statement audits under ISA',
        'Internal audit on a risk-based plan agreed with the board or audit committee',
        'Donor-funded project audits and grant compliance audits',
        'Special-purpose audits and agreed-upon procedures',
        'Forensic investigations and fraud risk assessments',
        'Due diligence reviews for acquisitions, lending and partnerships',
        'Performance and value-for-money audits',
        'ICT, procurement and internal control reviews, with follow-up audits'
      ],
      outcome: 'A signed opinion, a management letter that names the weaknesses, and a follow-up plan.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'Signed auditor’s report with an independent opinion',
        'Management letter on control weaknesses, with recommendations',
        'A report you can file with KRA, SASRA, a donor or the PBO Regulatory Authority',
        'Follow-up on the actions management agrees'
      ],
      need: 'audit',
      image: 'audit-review',
      imageAlt: 'Professionals reviewing printed financial charts at a desk',
      imageRatio: '2000/1335'
    },
    {
      id: 'taxation',
      title: 'Taxation Services',
      shortTitle: 'Taxation',
      promise: 'Every return filed right, and a position you can defend when KRA asks.',
      highlights: [
        'Income tax, VAT, PAYE, withholding, turnover and rental income returns',
        'KRA audit representation, objections, appeals and voluntary disclosure',
        'Tax health checks, reconciliations and compliance certificates'
      ],
      audience: 'Every registered taxpayer, from sole traders and landlords to groups.',
      tags: ['Sole traders', 'Landlords', 'SMEs', 'Companies and groups'],
      related: [{ label: 'Late penalty estimator', href: 'tools.html#tool-penalty' }, { label: 'VAT calculator', href: 'tools.html#tool-vat' }, { label: 'Statutory deadlines', href: 'tools.html#deadlines' }, { label: 'What is eTIMS?', href: 'answers.html#find-etims' }],
      description: 'We help businesses and individuals organise their tax records, understand their obligations and deal with KRA in a structured, timely way. The work runs from return preparation and iTax support to tax health checks, planning and the correspondence that follows an audit or an assessment.',
      bullets: [
        'Corporate, individual and partnership income tax returns',
        'VAT, PAYE and withholding tax compliance, filed by the statutory dates',
        'Excise duty, digital service tax, capital gains, turnover and rental income tax',
        'KRA PIN and VAT registration, tax compliance certificates and iTax support',
        'eTIMS onboarding and electronic invoicing compliance',
        'Tax health checks and reconciliations of returns, payments and ledgers',
        'KRA audit representation, objections, appeals and dispute resolution',
        'Voluntary disclosures and the 2026 tax amnesty',
        'Tax planning, restructuring, transaction and cross-border advice'
      ],
      outcome: 'Returns that reconcile to the books, a clean iTax ledger and a documented position for every filing.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'Returns filed on iTax by the statutory dates',
        'Your iTax ledger reconciled to your books',
        'Help applying for your tax compliance certificate',
        'Written objections and responses when KRA sends a notice'
      ],
      need: 'kra',
      image: 'tax-review',
      imageAlt: 'Financial records being reviewed with a calculator and notebook',
      imageRatio: '2000/1335'
    },
    {
      id: 'accounting-financial-management',
      title: 'Accounting & Financial Management',
      shortTitle: 'Accounting & payroll',
      promise: 'Books that are current and reconciled, and staff paid correctly with the filings done.',
      highlights: [
        'Bookkeeping, ledgers and bank and M-Pesa reconciliations',
        'Payroll with payslips, and PAYE, NSSF, SHIF and Housing Levy remitted',
        'Monthly management accounts; financial statements under IFRS'
      ],
      audience: 'SMEs, start-ups, NGOs, SACCOs and anyone whose books have fallen behind.',
      tags: ['SMEs', 'Start-ups', 'NGOs', 'SACCOs', 'Books in arrears'],
      related: [{ label: 'Net pay and PAYE calculator', href: 'tools.html#tool-paye' }, { label: 'Bookkeeping hand-over checklist', href: 'tools.html#check-bookkeeping' }, { label: 'Payroll deadlines', href: 'tools.html#deadlines' }],
      description: 'We keep dependable books of account, prepare reports that management can read and connect everyday accounting with the decisions it should inform: cash flow, budgets, working capital and payroll. Where records have fallen behind, we rebuild them from bank and M-Pesa statements and bring the filings up to date.',
      bullets: [
        'Bookkeeping, general ledger, journals, trial balances and reconciliations',
        'Financial statements under IFRS or IFRS for SMEs, including consolidations',
        'Monthly management accounts, dashboards and variance analysis',
        'Cash-flow forecasting, working capital and receivables and payables management',
        'Budgets, cost and profitability analysis',
        'Payroll processing, payslips, leave records and statutory deductions',
        'Catch-up bookkeeping and reconstruction of records',
        'Accounting software implementation and migration'
      ],
      outcome: 'A month-end close you can rely on, and financial information that supports control and planning.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'Reconciled ledgers, bank and M-Pesa included',
        'Monthly management accounts with variance analysis',
        'Payslips and payroll reports, with statutory deductions remitted',
        'Year-end financial statements under IFRS or IFRS for SMEs'
      ],
      need: 'monthly',
      image: 'accounting-systems',
      imageAlt: 'Professional reviewing financial data on a laptop',
      imageRatio: '2000/1125'
    },
    {
      id: 'compliance-governance',
      title: 'Compliance & Corporate Governance',
      shortTitle: 'Compliance & governance',
      promise: 'The filings, licences, policies and records a well-run organisation keeps.',
      highlights: [
        'Annual returns, statutory filings, permits and licences',
        'Board charters, finance and procurement manuals, HR policies',
        'Company secretarial and business registration support'
      ],
      audience: 'Boards, company secretaries and regulated entities.',
      tags: ['Boards', 'Company secretaries', 'Regulated entities'],
      related: [{ label: 'Company set-up checklist', href: 'tools.html#check-company' }, { label: 'What is an annual return?', href: 'answers.html#find-annual return' }, { label: 'Which licences does a new business need?', href: 'answers.html#find-licence' }],
      description: 'We review governance arrangements, clarify who is responsible for what and put reliable processes behind your statutory, regulatory and internal obligations. Policies, records and oversight practices are assessed together, and the recommendations are written for the people who will use them.',
      bullets: [
        'Corporate governance reviews, frameworks and board advisory',
        'Board and internal audit charters',
        'Corporate policies, standard operating procedures, and finance, HR and procurement manuals',
        'Regulatory compliance reviews, monitoring and compliance audits',
        'Annual returns, statutory filings and company secretarial support',
        'Business registration, permits, licensing and company restructuring'
      ],
      outcome: 'Clear responsibilities, a compliance calendar that is kept, and records that stand up to inspection.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'A compliance calendar with owners and dates',
        'Board and internal audit charters',
        'Finance, HR and procurement manuals and policies',
        'Annual returns and statutory filings kept current'
      ],
      need: 'controls',
      image: 'client-collaboration',
      imageAlt: 'Two professionals discussing information on a laptop',
      imageRatio: '2000/1333'
    },
    {
      id: 'risk-internal-controls',
      title: 'Risk Management & Internal Controls',
      shortTitle: 'Risk & internal controls',
      promise: 'Risks named, owned and watched, and controls that staff can actually follow.',
      highlights: [
        'Risk registers with owners and planned responses',
        'Internal control design, testing and improvement',
        'Fraud prevention, business continuity and crisis plans'
      ],
      audience: 'Management, boards and audit committees.',
      tags: ['Management', 'Boards', 'Audit committees'],
      related: [{ label: 'Internal versus external audit', href: 'answers.html#find-internal' }, { label: 'What we would do first', href: 'index.html#need-controls' }],
      description: 'We help organisations identify the risks that matter, assess the controls around them and decide where to strengthen. The work brings structure to risk ownership, monitoring and response, proportionate to your objectives and resources, and looks at the causes behind a control weakness rather than the symptom.',
      bullets: [
        'Enterprise risk management frameworks and risk registers',
        'Risk appetite statements and risk maturity assessments',
        'Internal control design and COSO framework support',
        'Control testing, control self-assessment and remediation',
        'Business continuity and crisis management planning',
        'Fraud prevention frameworks and awareness'
      ],
      outcome: 'A practical view of your exposure and controls that are tested, documented and followed.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'A risk register with owners and planned responses',
        'Documented controls, tested, with a remediation plan',
        'Business continuity and crisis plans',
        'A fraud prevention framework and staff awareness'
      ],
      need: 'controls',
      image: 'audit-review',
      imageAlt: 'Professionals examining financial charts and taking notes',
      imageRatio: '2000/1335'
    },
    {
      id: 'business-advisory',
      title: 'Business Advisory & Financial Consulting',
      shortTitle: 'Business advisory',
      promise: 'Decisions backed by numbers, before the commitment is made.',
      highlights: [
        'Financial models, feasibility studies and valuations',
        'Strategic planning, KPIs and balanced scorecards',
        'Turnaround, cost reduction and restructuring'
      ],
      audience: 'Owners and boards weighing an investment, a loan, an expansion or a turnaround.',
      tags: ['Owners', 'Boards', 'Borrowers and investors'],
      related: [{ label: 'How do you charge?', href: 'answers.html#find-charge' }, { label: 'How an engagement runs', href: 'about.html#process' }, { label: 'Not sure what you need?', href: 'index.html#need-unsure' }],
      description: 'We turn financial and operational information into analysis you can decide on. Whether you are reviewing performance, weighing an investment or considering a change of direction, we test the assumptions, set out the financial implications and name the risks, so the decision is disciplined and defensible.',
      bullets: [
        'Business diagnostics and strategic planning',
        'Financial modelling, scenario analysis and capital budgeting',
        'Business valuations, feasibility studies and investment appraisal',
        'Credit advisory and lender-ready financial packs',
        'Cost reviews, restructuring and turnaround strategies',
        'Performance management systems, KPIs and balanced scorecards'
      ],
      outcome: 'A clear basis for choosing between options, with the numbers to show a lender, an investor or a board.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'Financial models with scenarios you can test',
        'Feasibility studies and valuation reports',
        'Lender-ready financial packs',
        'KPIs and a balanced scorecard to track the plan'
      ],
      need: 'unsure',
      image: 'advisory-conversation',
      imageAlt: 'Two professionals reviewing a tablet during a conversation',
      imageRatio: '1600/1066'
    },
    {
      id: 'digital-transformation',
      title: 'Digital Finance & Business Transformation',
      shortTitle: 'Digital finance & systems',
      promise: 'The right accounting software, set up properly and reporting what management needs.',
      highlights: [
        'QuickBooks, Xero, Sage, Odoo, Zoho Books and ERPNext implementation',
        'Scoped migrations, reconciled before sign-off',
        'Power BI dashboards, analytics and automation'
      ],
      audience: 'Organisations outgrowing spreadsheets or the software they started with.',
      tags: ['Growing SMEs', 'Finance teams', 'Multi-entity groups'],
      related: [{ label: 'Which software fits a small business?', href: 'answers.html#find-software' }, { label: 'Moving to new software: first steps', href: 'index.html#need-software' }],
      description: 'We combine financial expertise with appropriate technology to modernise how your finance function works: the systems, the reporting and the workflows around them. The aim is less repetitive effort, better visibility of financial information and controls that are built into the process.',
      bullets: [
        'Accounting software selection, implementation and migration',
        'ERP selection, implementation and optimisation support',
        'Finance process review, re-engineering and workflow automation',
        'Microsoft Power BI dashboards and data analytics',
        'Financial reporting automation and business intelligence',
        'Digital controls, access management and audit trails'
      ],
      outcome: 'A system your team can run, reconciled opening balances, and reports that answer management’s questions.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'An accounting or ERP system set up for how you work',
        'Opening balances migrated and reconciled before sign-off',
        'Power BI dashboards and automated reports',
        'User access controls and audit trails'
      ],
      need: 'software',
      image: 'accounting-systems',
      imageAlt: 'Professional examining charts and financial data on a laptop',
      imageRatio: '2000/1125'
    },
    {
      id: 'training-capacity-building',
      title: 'Professional Training & Capacity Building',
      shortTitle: 'Training & capacity building',
      promise: 'Skills your finance team keeps, taught on your own documents and systems.',
      highlights: [
        'Tax compliance and payroll training',
        'Financial management, budgeting and reporting',
        'Internal audit, controls and accounting software'
      ],
      audience: 'Finance teams, managers and boards.',
      tags: ['Finance teams', 'Managers', 'Boards'],
      related: [{ label: 'What are the PAYE bands?', href: 'answers.html#find-bands' }, { label: 'Train my team: first steps', href: 'index.html#need-training' }],
      description: 'We build practical capability in the people responsible for finance, audit, tax, risk and compliance. Sessions are shaped around participants’ roles, their existing knowledge and your own procedures, so what is learned is applied the following week.',
      bullets: [
        'Internal audit, internal controls and fraud awareness',
        'Financial management, budgeting, forecasting and reporting',
        'Tax compliance, payroll and procurement compliance',
        'Risk management and corporate governance for boards',
        'Accounting software and digital finance tools',
        'Leadership, communication and decision-making for finance teams'
      ],
      outcome: 'A team that understands its obligations and can run the month without waiting for the adviser.',
      /* What the client receives: concrete deliverables, from the company profile. */
      deliverables: [
        'Sessions tailored to your team’s roles and procedures',
        'Practical exercises built on your own processes',
        'Board sessions on governance and risk',
        'Training on your accounting software and digital tools'
      ],
      need: 'training',
      image: 'training-workshop',
      imageAlt: 'Presenter discussing charts with a group at a meeting table',
      imageRatio: '2000/1333'
    }
  ],

  audiences: [
    {
      id: 'smes',
      label: 'Small or medium business', short: 'SMEs',
      /* Practice areas where work for this kind of organisation usually starts (Services page selector). */
      start: ['accounting-financial-management', 'taxation', 'risk-internal-controls'],
      title: 'Small and medium-sized enterprises',
      summary: 'Reliable books, tax filed on time and a monthly view of cash. We help SMEs manage their obligations, monitor cash flow and strengthen the controls behind everyday operations.',
      answersTo: 'KRA, your bank and the county licensing office.',
      focus: ['Bookkeeping, payroll and monthly filings', 'VAT, PAYE and income tax compliance', 'Practical financial controls and management accounts']
    },
    {
      id: 'startups-entrepreneurs',
      label: 'Start-up or entrepreneur', short: 'start-ups',
      /* Practice areas where work for this kind of organisation usually starts (Services page selector). */
      start: ['compliance-governance', 'digital-transformation', 'business-advisory'],
      title: 'Start-ups and entrepreneurs',
      summary: 'Registered and set up correctly, with nothing you do not need yet. We help emerging businesses put sound financial practices in place, understand their obligations and test viability as they grow.',
      answersTo: 'The Business Registration Service, KRA and your county, in that order.',
      focus: ['Registration, PIN and first-year compliance calendar', 'Opening the books on the right software', 'Business plans, models and viability']
    },
    {
      id: 'ngos-development',
      label: 'NGO or development partner', short: 'NGOs',
      /* Practice areas where work for this kind of organisation usually starts (Services page selector). */
      start: ['audit-assurance', 'accounting-financial-management'],
      title: 'NGOs and development partners',
      summary: 'Grant-funded work carries specific reporting and accountability responsibilities. We provide financial management and assurance shaped around each donor agreement and the organisation’s operating environment.',
      answersTo: 'Donors and their auditors, the PBO Regulatory Authority and your board.',
      focus: ['Project and donor audits', 'Grant compliance reviews before the donor’s own', 'Financial reporting and accountability processes']
    },
    {
      id: 'saccos',
      label: 'SACCO or member organisation', short: 'SACCOs',
      /* Practice areas where work for this kind of organisation usually starts (Services page selector). */
      start: ['accounting-financial-management', 'compliance-governance', 'audit-assurance'],
      title: 'SACCOs and member-based organisations',
      summary: 'Member resources call for transparent reporting and responsible stewardship. We strengthen control environments, governance practices and compliance processes for SACCOs and other member organisations.',
      answersTo: 'Members, SASRA for regulated SACCOs, and the Commissioner for Co-operative Development.',
      focus: ['Financial reporting and member account reconciliations', 'Governance, board charters and compliance', 'Internal audit and controls over member funds']
    },
    {
      id: 'corporates',
      label: 'Corporate or established business', short: 'corporates',
      /* Practice areas where work for this kind of organisation usually starts (Services page selector). */
      start: ['audit-assurance', 'taxation', 'business-advisory'],
      title: 'Corporates and established businesses',
      summary: 'Established organisations need dependable information and oversight as they grow. We connect assurance, reporting, tax and advisory to strengthen accountability and inform decisions at board level.',
      answersTo: 'Shareholders, lenders, KRA, the Business Registration Service and your board.',
      focus: ['Statutory audit and IFRS reporting', 'Tax, governance and internal controls', 'Advisory for investment, financing and restructuring']
    },
    {
      id: 'public-institutions',
      label: 'Government or public body', short: 'public bodies',
      /* Practice areas where work for this kind of organisation usually starts (Services page selector). */
      start: ['audit-assurance', 'compliance-governance', 'accounting-financial-management'],
      title: 'Government and public-sector institutions',
      summary: 'Public institutions need clear evidence of accountability and effective use of resources. Our support covers assurance, compliance, performance and value-for-money reviews under the applicable public-sector frameworks.',
      answersTo: 'The Office of the Auditor-General, Public Finance Management requirements and oversight committees.',
      focus: ['Assurance and compliance reviews', 'Performance and value-for-money assessments', 'Public-sector reporting frameworks']
    }
  ],

  industries: [
    'Financial services and SACCOs', 'Healthcare', 'Construction and real estate', 'Manufacturing and trading',
    'Logistics and supply chain', 'Hospitality', 'Technology and professional services', 'NGOs and development projects',
    'Public and institutional organisations'
  ],

  people: [
    {
      id: 'mulki-eno-hassano',
      name: 'Mulki Eno Hassano',
      credential: 'CPA(K), MSc Finance',
      role: 'Financial Management, Reporting & Business Advisory Lead',
      displayRole: 'Financial management and advisory',
      intro: 'Certified Public Accountant with an MSc in Finance and over five years in accounting, budgeting, tax and audit, including work with non-governmental organisations.',
      bio: 'Mulki is a Certified Public Accountant of Kenya and holds a Master of Science in Finance. She has over five years of professional experience, including work with non-governmental organisations, spanning accounting, financial management, budgeting, taxation, auditing, financial reporting, financial analysis and compliance. She combines technical financial knowledge with a practical, service-oriented approach to consultancy, helping clients maintain dependable financial processes, understand their financial position and meet their obligations. Her work is guided by professionalism and integrity, with a focus on clear, practical solutions that help clients make informed decisions.'
    },
    {
      id: 'mwenesi-abel-kabila',
      name: 'Mwenesi Abel Kabila',
      credential: 'CPA(K)',
      role: 'Senior Accountant | Tax, Audit & Compliance Lead',
      displayRole: 'Tax, audit and compliance',
      intro: 'Certified Public Accountant with more than five years across multi-entity and cross-border portfolios in East Africa, and the firm’s point of contact with KRA.',
      bio: 'Abel is a Certified Public Accountant with more than five years of progressive experience in accounting, tax and audit across multi-entity and cross-border portfolios in East Africa. He provides oversight of tax, audit and statutory compliance for client entities in manufacturing, trading, logistics, real estate and construction. His technical experience covers VAT, PAYE, withholding tax, management accounts, financial statement preparation, internal controls and liaison with the Kenya Revenue Authority and external auditors. He has worked with financial and enterprise systems including SAP, QuickBooks Online, ERPNext, Xero and Focus, and is known for improving reporting processes and supporting automation, combining technical rigour with a commercially minded approach.'
    },
    {
      id: 'ifrah-abdi-ibrahim',
      name: 'Ifrah Abdi Ibrahim',
      credential: 'CPA(K)',
      role: 'Risk Advisory, Internal Controls & Regulatory Compliance Lead',
      displayRole: 'Risk, controls and compliance',
      intro: 'Accounting and finance professional with over five years in real estate and trading, connecting financial analysis with stronger procedures and controls.',
      bio: 'Ifrah is an accounting and finance professional with over five years of practical experience in the real estate and trading sectors. Her expertise spans financial reporting, budgeting, tax planning and compliance, financial analysis, risk management and business advisory. She reviews financial procedures and business operations to support accuracy, accountability and adherence to applicable requirements, and helps organisations keep reliable records and use financial information well in planning and management. Her work focuses on strengthening internal controls, improving financial processes and supporting sound decisions with practical, professionally grounded recommendations.'
    },
    {
      id: 'masara-n-kevin',
      name: 'Masara N Kevin',
      credential: '',
      role: 'Governance, Assurance & Strategic Performance Lead',
      displayRole: 'Governance and strategic performance',
      intro: 'Over five years across private and public organisations, spanning governance, audit, accounting, taxation, compliance, financial analysis and business advisory.',
      bio: 'Masara is a versatile professional with over five years of progressive experience spanning governance, audit, accounting, taxation, compliance, financial analysis and business advisory. Having worked with organisations in both the private and public sectors, he understands diverse organisational structures, financial systems and regulatory environments. He assesses financial performance and operational processes, identifies areas for improvement and supports accuracy, accountability and compliance with applicable standards. Combining technical knowledge, analytical thinking and practical industry insight, he helps organisations strengthen financial integrity and internal controls, manage risk and make informed strategic decisions.'
    }
  ],

  process: [
    { title: 'Consultation', text: 'We discuss your organisation’s needs, challenges and objectives, and the outcome you want.' },
    { title: 'Needs assessment', text: 'We review the information you already have to identify key needs, risks and opportunities.' },
    { title: 'Proposal and scope', text: 'You receive a written proposal setting out our approach, deliverables, timeline and fees.' },
    { title: 'Engagement confirmation', text: 'We formalise the engagement and agree responsibilities, communication and the records we need.' },
    { title: 'Execution', text: 'The agreed work is carried out using appropriate professional procedures, standards and evidence.' },
    { title: 'Reporting and recommendations', text: 'Clear findings and practical recommendations, explained in plain language.' },
    { title: 'Continuous support', text: 'Where agreed, follow-up guidance and support with implementation as your needs evolve.' }
  ],

  mission: 'To provide exceptional professional services through integrity, technical excellence, innovation and client-focused solutions that enhance governance, strengthen financial performance and create lasting value for every organisation we serve.',
  vision: 'To be a leading trusted advisory and professional services firm delivering innovative financial, audit, tax and compliance solutions that drive sustainable business success.',
  values: [
    { title: 'Integrity', text: 'Ethical conduct, independence, confidentiality and professional responsibility in every engagement.' },
    { title: 'Precision', text: 'Close attention to evidence, accuracy, standards and detail, so analysis and recommendations can be relied on.' },
    { title: 'Innovation', text: 'Openness to better methods and appropriate technology that make financial and operational processes more effective.' },
    { title: 'Excellence', text: 'Quality in planning, execution, communication and delivery, with a commitment to professional standards and continuous learning.' },
    { title: 'Growth', text: 'Helping clients strengthen their capabilities, make informed decisions and build sustainable performance over time.' }
  ],
  whyUs: [
    { title: 'One team across the disciplines', text: 'Audit, tax, accounting, compliance, risk and advisory overlap in practice. Working them together means findings connect instead of landing in silos.' },
    { title: 'Scoped to your organisation', text: 'We begin with your operations, objectives, constraints and obligations, then tailor the scope to the issues that matter most.' },
    { title: 'Standards you can name', text: 'Audits under International Standards on Auditing, financial statements under IFRS or IFRS for SMEs, public-sector frameworks where they apply, and Kenyan tax and company law.' },
    { title: 'Findings you can act on', text: 'Reports explain what needs attention, why it matters and what to do about it, in language management can use.' },
    { title: 'Controls, not just corrections', text: 'We look at the systems and processes behind an error, so the fix lasts.' },
    { title: 'Discretion as a working rule', text: 'Client information is handled with confidentiality, independence where required and due care.' }
  ],
  technology: [
    { title: 'Cloud accounting', text: 'Secure access to financial information and collaboration from anywhere.' },
    { title: 'Data analytics', text: 'Financial and operational data turned into insight for planning and monitoring.' },
    { title: 'ERP systems', text: 'Finance, procurement, inventory and operations connected in one system.' },
    { title: 'Microsoft Power BI', text: 'Interactive dashboards that track performance and trends.' },
    { title: 'Process automation', text: 'Repetitive tasks and workflows automated to reduce manual effort and error.' },
    { title: 'AI-assisted analysis', text: 'Where appropriate, AI tools support data analysis and routine work.' }
  ],
  software: ['QuickBooks', 'Xero', 'Sage', 'Odoo', 'Zoho Books', 'ERPNext', 'Microsoft Power BI'],

  /* "What do you need today?" — eight situations a visitor arrives with. */
  finder: [
    {
      id: 'kra', icon: 'notice', label: 'KRA sent a notice', sub: 'Assessment, audit letter or demand',
      title: 'KRA has sent a notice, assessment or audit letter',
      wa: 'KRA has sent me a notice and I would like your help.',
      steps: [
        'Read the notice against your iTax ledger and your own records',
        'Prepare the records and responses the audit queries call for',
        'Lodge an objection or appeal where the assessment is wrong',
        'Use voluntary disclosure or the 2026 tax amnesty where it reduces what you owe'
      ],
      first: 'Send us the notice. We read it and reconcile your iTax ledger before anything goes back to KRA.',
      know: 'An objection to an assessment must be lodged within 30 days of the notice, so the clock is already running.',
      service: 'taxation',
      tools: [{ label: 'Late penalty estimator', href: 'tools.html#tool-penalty' }, { label: 'How long do I have to object?', href: 'answers.html#find-object' }, { label: 'What is the 2026 amnesty?', href: 'answers.html#find-amnesty' }]
    },
    {
      id: 'audit', icon: 'shield', label: 'We need an audit', sub: 'Statutory, donor or internal',
      title: 'We need an audit',
      wa: 'We need an audit and would like a proposal.',
      steps: [
        'Statutory audit of the financial statements under International Standards on Auditing',
        'Donor-funded project audits and agreed-upon procedures to the donor’s terms',
        'Internal audit on a risk-based plan for the board or audit committee',
        'A management letter on the control weaknesses the audit found'
      ],
      first: 'Send the trial balance, bank statements and last year’s signed accounts, or the grant agreement for a donor audit. We plan from there.',
      know: 'Company returns are due within six months of year-end and the audit comes first, so plan backwards from that date.',
      service: 'audit-assurance',
      tools: [{ label: 'Statutory audit checklist', href: 'tools.html#check-audit' }, { label: 'Donor audit checklist', href: 'tools.html#check-donor' }, { label: 'Company deadlines', href: 'tools.html#deadlines' }]
    },
    {
      id: 'monthly', icon: 'book', label: 'Books and payroll, monthly', sub: 'Bookkeeping, payslips, filings',
      title: 'I need bookkeeping and payroll handled every month',
      wa: 'I need monthly bookkeeping and payroll support.',
      steps: [
        'Monthly bookkeeping with bank and M-Pesa reconciliations',
        'Payroll with payslips; PAYE, NSSF and SHIF remitted by the 9th and the Housing Levy by the 9th working day',
        'VAT and other monthly returns filed by the 20th',
        'Management accounts you can read, every month'
      ],
      first: 'We review your current records and agree a monthly close date and a monthly fee.',
      know: 'Late payroll remittances attract penalties and interest, so the 9th is the date we build the month around.',
      service: 'accounting-financial-management',
      tools: [{ label: 'Net pay and PAYE calculator', href: 'tools.html#tool-paye' }, { label: 'This month’s deadlines', href: 'tools.html#deadlines' }, { label: 'Bookkeeping hand-over checklist', href: 'tools.html#check-bookkeeping' }]
    },
    {
      id: 'startup', icon: 'plus', label: 'I’m starting a company', sub: 'Registration, PIN, first-year setup',
      title: 'I’m starting a company',
      wa: 'I am starting a company and need help setting up.',
      steps: [
        'Business registration support and the KRA PIN',
        'VAT registration only where your sales or customers require it',
        'Open the books on QuickBooks, Zoho Books or Xero with a chart of accounts that fits the business',
        'A compliance calendar for the first year: who files what, and when'
      ],
      first: 'A conversation about what you must register for now and what can wait until the business is trading.',
      know: 'Registering for VAT before you need to creates monthly filing obligations even in months with no sales.',
      service: 'compliance-governance',
      tools: [{ label: 'Company set-up checklist', href: 'tools.html#check-company' }, { label: 'Turnover tax calculator', href: 'tools.html#tool-tot' }, { label: 'Which licences does a new business need?', href: 'answers.html#find-licence' }]
    },
    {
      id: 'controls', icon: 'lock', label: 'Stronger controls', sub: 'Internal audit, risk, governance',
      title: 'Our board wants stronger controls and governance',
      wa: 'Our board wants stronger internal controls and governance.',
      steps: [
        'Internal audit on a risk-based plan agreed with the board or audit committee',
        'Internal control reviews over cash, approvals, procurement and payroll',
        'A risk register with owners and planned responses',
        'Board and audit charters, finance and procurement manuals'
      ],
      first: 'A short diagnostic of where money, approvals and records currently flow.',
      know: 'Controls that staff cannot follow get bypassed. We write procedures for the people who will actually use them.',
      service: 'risk-internal-controls',
      tools: [{ label: 'Risk and internal controls', href: 'services.html#service-risk-internal-controls' }, { label: 'Compliance and governance', href: 'services.html#service-compliance-governance' }, { label: 'Internal versus external audit', href: 'answers.html#find-internal' }]
    },
    {
      id: 'software', icon: 'screen', label: 'New accounting software', sub: 'QuickBooks, Xero, Sage, Odoo, ERPNext',
      title: 'We’re moving to new accounting software',
      wa: 'We want to move to new accounting software.',
      steps: [
        'Selection and implementation of QuickBooks, Xero, Sage, Odoo, Zoho Books or ERPNext',
        'A scoped migration of opening balances, customers, suppliers and history, reconciled before sign-off',
        'Power BI dashboards on top of the new system',
        'Training for the people who will run it'
      ],
      first: 'We map your chart of accounts and reporting needs before anyone chooses a system.',
      know: 'Migrate at a month-end with reconciled balances. Mid-month cut-overs are where figures go missing.',
      service: 'digital-transformation',
      tools: [{ label: 'Which software fits a small business?', href: 'answers.html#find-software' }, { label: 'Digital finance and systems', href: 'services.html#service-digital-transformation' }]
    },
    {
      id: 'training', icon: 'cap', label: 'Train my team', sub: 'Tax, finance, audit, software',
      title: 'I want to train my team',
      wa: 'I would like training for my finance team.',
      steps: [
        'Tax compliance and payroll training built around your own filings',
        'Financial management, budgeting and reporting for managers',
        'Internal audit, controls and fraud awareness for finance and operations staff',
        'Hands-on accounting software sessions in the system you use'
      ],
      first: 'Tell us who is in the room and what they handle. The session is built around their real work.',
      know: 'Short, repeated sessions with your own documents stick better than a one-day generic course.',
      service: 'training-capacity-building',
      tools: [{ label: 'Training and capacity building', href: 'services.html#service-training-capacity-building' }, { label: 'What are the PAYE bands?', href: 'answers.html#find-bands' }]
    },
    {
      id: 'unsure', icon: 'help', label: 'I’m not sure yet', sub: 'Start with a conversation',
      title: 'I’m not sure what I need',
      wa: 'I am not sure what I need. Can we talk?',
      steps: [
        'A business diagnostic: a look at your records, obligations and controls',
        'A short written note of what needs attention, in order of priority',
        'A proposal only for the work that is actually needed'
      ],
      first: 'A conversation first. No proposal until we understand the situation.',
      know: 'You do not need to tidy your records before you call. Untidy is where most engagements start.',
      service: 'business-advisory',
      tools: [{ label: 'How an engagement runs', href: 'about.html#process' }, { label: 'How do you charge?', href: 'answers.html#find-charge' }, { label: 'Common questions', href: 'answers.html' }]
    }
  ],

  /* Statutory deadlines. `monthly` rules drive the live strip and the "this
     month" cards; `calendar` is the full table. Working days exclude weekends
     and the public holidays gazetted in advance. */
  deadlines: {
    monthly: [
      { id: 'nine', label: 'PAYE, NSSF and SHIF', rule: { day: 9 }, source: 'https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye' },
      { id: 'ahl', label: 'Affordable Housing Levy', rule: { workingDay: 9 }, source: 'https://www.kra.go.ke/news-center/public-notices/2099-collection-of-the-affordable-housing-levy-by-kenya-revenue-authority-2' },
      { id: 'twenty', label: 'VAT, turnover and rental income tax', rule: { day: 20 }, source: 'https://www.kra.go.ke/images/publications/Everything-About-Turnover-Tax.pdf' }
    ],
    calendar: [
      { group: 'Every month' },
      { when: 'By the 9th', what: 'PAYE, NSSF and SHIF for the previous month', who: 'Every employer', source: 'https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye', sourceLabel: 'KRA' },
      { when: '9th working day after month end', what: 'Affordable Housing Levy for the previous month', who: 'Every employer, and other income earners', source: 'https://www.kra.go.ke/news-center/public-notices/2099-collection-of-the-affordable-housing-levy-by-kenya-revenue-authority-2', sourceLabel: 'KRA notice', liveId: 'ahl' },
      { when: 'By the 20th', what: 'VAT, turnover tax, monthly rental income tax and excise duty for the previous month', who: 'VAT-registered businesses, businesses on turnover tax, landlords and excise licensees', source: 'https://www.kra.go.ke/images/publications/Everything-About-Turnover-Tax.pdf', sourceLabel: 'KRA' },
      { when: 'Within 5 working days of deduction', what: 'Withholding tax', who: 'Anyone who deducts withholding tax from a payment', source: 'https://www.kra.go.ke/individual/filing-paying/types-of-taxes/individual-withholding-tax', sourceLabel: 'KRA' },
      { group: 'Every year' },
      { when: '30 April, from 2027', what: 'Individual income tax return for the previous year, nil returns included. Under the Finance Act 2026 the 2026 return is due by 30 April 2027; returns for 2025 and earlier years were due by 30 June. KRA has issued clarifications on who the new date covers, so confirm your own case.', who: 'Individuals with a KRA PIN, including employees and the self-employed', source: 'https://www.kra.go.ke/finance-act-2026-what-it-means-for-you', sourceLabel: 'KRA, Finance Act 2026' },
      { when: 'Anniversary of incorporation', what: 'Annual return to the Business Registration Service', who: 'Companies and LLPs', source: 'https://brs.go.ke/', sourceLabel: 'BRS' },
      { when: '31 December 2026', what: 'Tax amnesty closes: principal tax for periods up to 31 December 2025 must be paid for penalties, interest and fines to be waived. Payment plans must also be cleared by this date.', who: 'Anyone with old tax arrears', source: 'https://www.kra.go.ke/2026-tax-amnesty-programme-at-a-glance', sourceLabel: 'KRA amnesty' },
      { group: 'Companies, counted from your financial year' },
      { when: '20th of the 4th, 6th, 9th and 12th month', what: 'Instalment tax, a quarter of the estimate each time', who: 'Companies expecting a tax bill', source: 'https://www.kra.go.ke/business/companies-partnerships/companies-partnerships-pin-taxes/company-partnership-installment-tax', sourceLabel: 'KRA' },
      { when: 'End of the 4th month after year-end', what: 'Balance of company income tax', who: 'Companies', source: 'https://www.kra.go.ke/business/companies-partnerships/companies-partnerships-pin-taxes/company-partnership-income-tax', sourceLabel: 'KRA' },
      { when: '6 months after year-end', what: 'Company income tax return, with audited accounts', who: 'Companies', source: 'https://www.kra.go.ke/finance-act-2026-what-it-means-for-you', sourceLabel: 'KRA' }
    ],
    note: 'When a calendar date lands on a weekend or public holiday, iTax still accepts the return, but bank payments may not clear in time. File and pay on the last working day before it. Penalties and interest run from the day after the deadline. Working-day rules here skip weekends and the public holidays gazetted in advance; holidays declared at short notice, including Eid, are not reflected.'
  },

  /* Rates used by the calculators. One place to update after a Finance Act. */
  rates: {
    paye: {
      bands: [[24000, 0.10], [32333, 0.25], [500000, 0.30], [800000, 0.325], [Infinity, 0.35]],
      relief: 2400,
      source: 'https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye'
    },
    nssf: { rate: 0.06, tier1: 9000, upper: 108000, source: 'https://www.pwc.com/ke/en/assets/pdf/tax-alert-year-4nssf-rates-2026.pdf', note: 'Year 4 limits from February 2026' },
    shif: { rate: 0.0275, min: 300 },
    ahl: { rate: 0.015 },
    vat: { rate: 0.16, threshold: 5000000, source: 'https://www.kra.go.ke/business/companies-partnerships/companies-partnerships-pin-taxes/company-partnership-vat' },
    tot: { rate: 0.015, min: 1000000, max: 25000000, source: 'https://kra.go.ke/individual/filing-paying/types-of-taxes/turnover-tax-tot' },
    mri: { rate: 0.075, min: 280000, max: 15000000, source: 'https://www.kra.go.ke/individual/filing-paying/types-of-taxes/rental-income-tax' },
    penalties: {
      latePaymentPct: 0.05,
      interestPerMonth: 0.01,
      source: 'https://www.kra.go.ke/component/kra_faq/faq/737',
      types: [
        { id: 'paye', label: 'PAYE return (employer)', pct: 0.25, min: 10000 },
        { id: 'vat', label: 'VAT return', pct: 0.05, min: 10000 },
        { id: 'individual', label: 'Individual income tax return', pct: 0.05, min: 2000 },
        { id: 'company', label: 'Company or partnership income tax return', pct: 0.05, min: 20000 },
        { id: 'mri', label: 'Monthly rental income return (individual landlord)', pct: 0.05, min: 2000 },
        { id: 'tot', label: 'Turnover tax return', flatPerMonth: 1000 }
      ]
    }
  },

  /* The calculators on tools.html, for the home page links and site search. */
  calculators: [
    { id: 'paye', title: 'Net pay and PAYE', keywords: 'salary take-home payslip NSSF SHIF housing levy employer cost' },
    { id: 'vat', title: 'VAT', keywords: 'value added tax 16% inclusive exclusive price' },
    { id: 'tot', title: 'Turnover tax', keywords: 'TOT small business 1.5% gross sales' },
    { id: 'mri', title: 'Rental income tax', keywords: 'landlord rent 7.5% monthly rental income MRI' },
    { id: 'penalty', title: 'Late penalty estimator', keywords: 'late filing penalty interest fine missed return amnesty' }
  ],

  /* What to have ready. Each list can be copied with one tap. */
  checklists: [
    {
      id: 'audit', title: 'Statutory audit', intro: 'What the audit team asks for in the planning meeting. Having it ready shortens the fieldwork.',
      items: [
        'Trial balance and general ledger for the year, exported from your accounting system',
        'Bank statements for every account, with monthly reconciliations',
        'M-Pesa and other mobile money statements, if used for business',
        'Sales and purchase ledgers, with receivables and payables ageing at year-end',
        'Fixed asset register, with additions, disposals and depreciation',
        'Payroll register and the PAYE, NSSF, SHIF and Housing Levy returns filed',
        'VAT returns filed and the reconciliation to sales and purchases',
        'Loan agreements, lease agreements and repayment schedules',
        'Last year’s signed financial statements and management letter',
        'Board minutes, AGM minutes and statutory records (CR12, annual returns)',
        'Read-only access to the accounting system for the audit period'
      ]
    },
    {
      id: 'tax-return', title: 'Individual tax return', intro: 'For employees, landlords and the self-employed filing on iTax.',
      items: [
        'KRA PIN and iTax password (reset it before the deadline week)',
        'P9 form from every employer during the year',
        'Mortgage interest certificate, if you own the home you live in',
        'Insurance relief certificates for life, education or health policies',
        'Pension or provident fund contribution statements',
        'Rental income schedule: rent received per property per month',
        'Business income and expenses, with supporting records',
        'Withholding tax certificates for fees, interest or dividends received',
        'Bank interest certificates',
        'Acknowledgement receipt of last year’s return'
      ]
    },
    {
      id: 'company', title: 'Registering a company', intro: 'What the Business Registration Service and KRA will ask for, and what follows incorporation.',
      items: [
        'Three proposed company names, in order of preference',
        'Directors’ and shareholders’ ID or passport copies, KRA PINs and passport photographs',
        'Shareholding percentages and the proposed share capital',
        'Registered office address and postal address',
        'A short description of the nature of business',
        'After incorporation: company KRA PIN, then NSSF and SHIF employer registration',
        'County single business permit before trading',
        'eTIMS onboarding so your invoices are KRA-compliant from the first sale',
        'Bank account opening documents: certificate, CR12, PIN, board resolution'
      ]
    },
    {
      id: 'donor', title: 'Donor or project audit', intro: 'Most findings come from missing paperwork rather than misspent funds. Gather this before the auditor arrives.',
      items: [
        'Grant agreement, amendments and the donor’s financial reporting guidelines',
        'Approved budget and any approved modifications',
        'Project ledger and expenditure report by budget line',
        'Supporting documents for every expense: invoices, eTIMS receipts, payment vouchers, approvals',
        'Procurement records: requests, quotations, bid analyses, contracts',
        'Payroll allocation to the project and signed timesheets',
        'Bank statements and reconciliations for the project account',
        'Asset register for equipment bought with project funds',
        'Previous financial reports and donor correspondence',
        'Sub-grantee agreements and reports, where applicable'
      ]
    },
    {
      id: 'bookkeeping', title: 'Starting monthly bookkeeping and payroll', intro: 'What we need to take over your books and run the first payroll.',
      items: [
        'Latest financial statements or trial balance, and the date the books were last reconciled',
        'Bank and M-Pesa statements for the past twelve months',
        'Sales invoices and purchase bills since the last close',
        'Employee list with contracts, ID copies, KRA PINs, NSSF and SHIF numbers',
        'Payroll register and payslips for the last three months',
        'iTax, NSSF and SHA employer portal access details',
        'Status of returns filed and any outstanding KRA, NSSF or SHIF matters',
        'Access to your current accounting software, or the spreadsheets in use',
        'Fixed assets and loans, with the latest statements'
      ]
    }
  ],

  /* Common questions. `cat` is one of: tax, payroll, audit, company, ngo, firm.
     `top` marks the ten shown before "Show all". */
  faqs: [
    { cat: 'tax', top: true, q: 'When is VAT due?', a: 'VAT returns and payment are due by the 20th of the following month. While you are registered you must file every month, including a nil return in months with no sales.' },
    { cat: 'payroll', top: true, q: 'When are payroll deductions due?', a: 'PAYE, NSSF and SHIF are due by the 9th of the month after the payroll month. The Affordable Housing Levy is due by the 9th working day after the end of the month. Pay before the deadline when it falls close to a weekend.' },
    { cat: 'tax', top: true, q: 'What is the 2026 tax amnesty?', a: 'Under the Finance Act 2026, penalties, interest and fines on tax debts for periods up to 31 December 2025 are waived once the principal tax is paid. The programme runs from 1 July to 31 December 2026, and any principal, including an iTax payment plan, must be cleared by 31 December 2026. Where no principal is owed, the waiver is automatic once outstanding returns are filed. Customs duties are excluded, and disputed amounts must be resolved first.' },
    { cat: 'tax', top: true, q: 'When is my individual tax return due?', a: 'The Finance Act 2026 moves the individual deadline to 30 April, the last day of the fourth month after the year ends, with effect from 1 January 2027. The 2026 return is therefore due by 30 April 2027. Returns for 2025 and earlier years were due by 30 June. KRA has issued clarifications on who the new date applies to, so confirm your own position with us before the deadline.' },
    { cat: 'tax', top: true, q: 'Do I need to file a nil return?', a: 'Yes. Anyone with a KRA PIN files an annual return even with no income. A late individual return costs 5% of the tax due or KES 2,000, whichever is higher, and unfiled years block your tax compliance certificate.' },
    { cat: 'payroll', top: true, q: 'What are the NSSF rates in 2026?', a: 'From February 2026, 6% from the employee and 6% from the employer on pensionable pay up to KES 108,000. Tier I covers the first KES 9,000 (KES 540 each) and Tier II the next KES 99,000 (KES 5,940 each), so the maximum is KES 6,480 a month per side.' },
    { cat: 'tax', top: true, q: 'How long do I have to object to a KRA assessment?', a: '30 days from the date of the assessment notice. The objection must state the grounds and attach supporting documents, so start assembling the file the day the notice arrives.' },
    { cat: 'audit', top: true, q: 'Does my company need an audit?', a: 'Most companies prepare audited accounts, and banks, donors and regulators often ask for them regardless. Some small private companies qualify for an exemption under the Companies Act. We will tell you which applies to you.' },
    { cat: 'company', top: true, q: 'How do I register a company?', a: 'Through the Business Registration Service on eCitizen: name search, incorporation documents and directors’ details, then the company’s KRA PIN, NSSF and SHIF employer registrations, and the county business permit before trading. Our set-up checklist lists what to have ready.' },
    { cat: 'firm', top: true, q: 'How do you charge?', a: 'Every engagement starts with a written proposal that sets out the approach, deliverables, timeline and fees. Nothing starts until you have confirmed it. Monthly services such as bookkeeping and payroll are quoted as a monthly fee; one-off work such as an audit or a system migration is quoted for the assignment.' },
    { cat: 'tax', q: 'What is the VAT rate and when must I register?', a: 'The standard rate is 16%. Registration is required once your taxable supplies reach KES 5 million in any 12-month period; you can register voluntarily below that if your customers need VAT invoices.' },
    { cat: 'tax', q: 'What is eTIMS and do I need it?', a: 'eTIMS is KRA’s electronic tax invoice system. Businesses are expected to issue their invoices through it, and KRA does not allow expenses that are not supported by eTIMS invoices as deductions for income tax. There are simpler eTIMS options for small businesses. We onboard clients and check that invoices and the records behind them match.' },
    { cat: 'tax', q: 'Who pays turnover tax?', a: 'Resident businesses with annual sales above KES 1 million and up to KES 25 million. It is 1.5% of gross monthly sales, filed and paid by the 20th of the following month. Rental income, professional fees and income already taxed at source are excluded.' },
    { cat: 'tax', q: 'How is residential rent taxed?', a: 'Landlords earning between KES 280,000 and KES 15 million a year pay monthly rental income tax at 7.5% of gross rent, by the 20th of the following month, with no expenses deducted. Outside that band, rent is declared under normal income tax.' },
    { cat: 'tax', q: 'How do I get a tax compliance certificate?', a: 'Apply on iTax. It is issued when all returns are filed and taxes paid, or a payment plan is in place, and it stays valid for 12 months. We check the ledger before applying so the request does not bounce.' },
    { cat: 'tax', q: 'What is withholding tax and when is it paid?', a: 'Tax deducted at source on certain payments, such as professional fees, rent paid through agents, interest and dividends. The deducted amount must be remitted to KRA within five working days after the deduction, not at the end of the month. The rate depends on the payment type and whether the recipient is resident.' },
    { cat: 'tax', q: 'What is the corporate tax rate and when is it paid?', a: 'Resident companies pay 30% on taxable profit. Instalment tax is paid in four instalments on the 20th of the 4th, 6th, 9th and 12th months of the financial year, the balance by the end of the 4th month after year-end, and the return is filed within six months of year-end.' },
    { cat: 'tax', q: 'What happens if I pay PAYE late?', a: 'A late PAYE return carries a penalty of 25% of the tax due or KES 10,000, whichever is higher. Late payment adds 5% of the tax due plus interest at 1% a month until it is paid. The 9th is the date to build your month around.' },
    { cat: 'payroll', q: 'What are the PAYE bands?', a: 'On monthly taxable pay: 10% up to KES 24,000; 25% from 24,001 to 32,333; 30% from 32,334 to 500,000; 32.5% from 500,001 to 800,000; and 35% above 800,000. Personal relief of KES 2,400 a month is then deducted.' },
    { cat: 'payroll', q: 'How much is SHIF?', a: '2.75% of gross salary with a minimum of KES 300 a month, deducted from the employee and remitted by the 9th of the following month. It replaced NHIF.' },
    { cat: 'payroll', q: 'How does the Housing Levy work?', a: '1.5% of gross pay from the employee, matched by 1.5% from the employer, remitted through iTax by the 9th working day after the end of the month. Other income earners pay 1.5% of gross income.' },
    { cat: 'payroll', q: 'Are NSSF, SHIF and the Housing Levy deducted before PAYE?', a: 'Yes. All three are allowable deductions, so taxable pay is gross pay less NSSF, SHIF and the Housing Levy, and PAYE is computed on what remains.' },
    { cat: 'payroll', q: 'Do casual workers go through payroll?', a: 'Yes. Casual wages are employment income, so PAYE applies where pay is above the tax-free level, and the statutory deductions follow the same rules. Keep attendance and payment records for every casual.' },
    { cat: 'audit', q: 'What do you need from us to start an audit?', a: 'The trial balance, bank statements, the fixed asset register, the previous year’s signed accounts and access to your accounting system. The statutory audit checklist on this page has the full list; a tailored request list follows the planning meeting.' },
    { cat: 'audit', q: 'What is the difference between internal and external audit?', a: 'An external audit gives an independent opinion on the financial statements for shareholders, lenders and regulators. Internal audit works for management and the board, testing controls and processes through the year so problems are found before the external auditor does.' },
    { cat: 'audit', q: 'My records are a mess. Can you still help?', a: 'Yes. Reconstructing records and catching up on late filings is routine work. We start from bank and M-Pesa statements and rebuild from there. You do not need to tidy anything before you call.' },
    { cat: 'company', q: 'What is an annual return?', a: 'A yearly filing to the Business Registration Service confirming the company’s directors, shareholders and registered office, made up to the anniversary of incorporation. It is separate from the tax return and attracts penalties when late.' },
    { cat: 'company', q: 'Which licences does a new business need?', a: 'At minimum a county single business permit and the KRA PIN. Sector licences follow the trade, for example food handling, health, transport or financial services. VAT registration becomes compulsory at KES 5 million of taxable supplies.' },
    { cat: 'company', q: 'Which accounting software should a small business use?', a: 'For most SMEs, QuickBooks, Zoho Books or Xero. Odoo and ERPNext suit businesses that also need inventory, procurement or projects in one system. We set up, migrate and train on all of them.' },
    { cat: 'ngo', q: 'What should we prepare for a donor audit?', a: 'The grant agreement and approved budget, the project ledger, every supporting document for expenditure, procurement records, timesheets or payroll allocations, bank statements and the previous reports. Most findings come from missing paperwork rather than misspent funds. The donor audit checklist on this page sets it out.' },
    { cat: 'ngo', q: 'What is a grant compliance review?', a: 'A check of spending, records and procedures against the conditions in the grant agreement before the donor’s own review, so gaps are fixed while they can still be fixed.' },
    { cat: 'ngo', q: 'How can a SACCO strengthen its financial reporting?', a: 'Monthly reconciliations of member accounts and bank balances, a documented loan provisioning policy, an internal audit plan approved by the board, and financial statements prepared to the standards your regulator and auditor expect.' },
    { cat: 'firm', q: 'How does an engagement start?', a: 'With a conversation about your needs and the outcome you want. We then assess the information you already have and send a written proposal with scope, deliverables, timeline and fees. Work begins once the engagement is confirmed, and ends with findings explained in plain language and, where agreed, support while you put them in place.' },
    { cat: 'firm', q: 'Is our information kept confidential?', a: 'Yes. Confidentiality, independence where required and professional responsibility are part of how the firm works, and the engagement letter sets out how your records are handled. We agree with you how documents are shared, and anything sensitive is not sent by open email.' },
    { cat: 'firm', q: 'Do you work with organisations outside Nairobi?', a: 'The firm is based in Westlands, Nairobi. Much of the work (bookkeeping, tax filings, reviews, training) can run on shared systems and calls, with site visits where the engagement needs them. Tell us where you are and we will say how we would run it.' }
  ]
};
