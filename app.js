(() => {
  'use strict';

  const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const numberIN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  const STORAGE_KEY = 'yojanasetu-sih2026-state-v2';

  const officialNote = 'Prototype rule values reflect NSFDC public guidance available in September 2026. Final sanction remains subject to the channel partner and current official policy.';

  const defaultSchemes = [
    {
      id: 'mfs',
      short: 'Micro Finance',
      name: 'Micro Finance Scheme (MFS)',
      purpose: 'business',
      purposeLabel: 'Small income-generating activities',
      description: 'Designed for small business activities where the total unit cost is up to ₹1.40 lakh.',
      maxIncome: 500000,
      minCost: 0,
      maxCost: 140000,
      maxLoan: 125000,
      fundingPct: 90,
      rate: 6.5,
      maxTenureMonths: 36,
      moratoriumMonths: 3,
      channel: 'SCA / authorized CA',
      active: true,
      source: 'NSFDC public FAQ',
      sourceUrl: 'https://nsfdc.nic.in/faqs',
      priority: 10
    },
    {
      id: 'amy',
      short: 'Aajeevika MFI',
      name: 'Aajeevika Micro-Finance Yojana (AMY)',
      purpose: 'business',
      purposeLabel: 'Need-based micro finance via NBFC-MFIs',
      description: 'Micro-finance route for projects up to ₹1.40 lakh, implemented through selected NBFC-MFIs.',
      maxIncome: 500000,
      minCost: 0,
      maxCost: 140000,
      maxLoan: 125000,
      fundingPct: 90,
      rate: 15,
      maxTenureMonths: 36,
      moratoriumMonths: 3,
      channel: 'Selected NBFC-MFI',
      active: true,
      source: 'NSFDC public FAQ',
      sourceUrl: 'https://nsfdc.nic.in/faqs',
      priority: 5
    },
    {
      id: 'term',
      short: 'Term Loan',
      name: 'Term Loan Scheme',
      purpose: 'business',
      purposeLabel: 'Larger income-generating projects',
      description: 'For viable income-generating projects costing above ₹1.40 lakh and up to ₹50 lakh.',
      maxIncome: 500000,
      minCost: 140001,
      maxCost: 5000000,
      maxLoan: 4500000,
      fundingPct: 90,
      rate: 8,
      maxTenureMonths: 84,
      moratoriumMonths: 6,
      channel: 'SCA / authorized CA',
      active: true,
      source: 'NSFDC public FAQ',
      sourceUrl: 'https://nsfdc.nic.in/faqs',
      priority: 9
    },
    {
      id: 'uny',
      short: 'Udyam Nidhi',
      name: 'Udyam Nidhi Yojana (UNY)',
      purpose: 'business',
      purposeLabel: 'Small / micro activities up to ₹5 lakh',
      description: 'A small-enterprise financing route for projects up to ₹5 lakh through cooperative institutions or Small Finance Banks.',
      maxIncome: 500000,
      minCost: 0,
      maxCost: 500000,
      maxLoan: 450000,
      fundingPct: 90,
      rate: 13,
      alternateRate: 15,
      maxTenureMonths: 60,
      moratoriumMonths: 3,
      channel: 'Co-op / SFB (rate varies)',
      active: true,
      source: 'NSFDC public FAQ',
      sourceUrl: 'https://nsfdc.nic.in/faqs',
      priority: 7
    },
    {
      id: 'els',
      short: 'Education Loan',
      name: 'Educational Loan Scheme (ELS)',
      purpose: 'education',
      purposeLabel: 'Professional / technical education',
      description: 'For regular full-time professional or technical recognized courses in India or abroad.',
      maxIncome: 500000,
      minCost: 0,
      maxCost: Infinity,
      maxLoan: 4000000,
      fundingPct: 90,
      rate: 6.5,
      maxTenureMonths: 144,
      moratoriumMonths: 12,
      moratoriumLabel: 'Course period + 1 year (illustrative in calculator)',
      channel: 'SCA / authorized CA',
      active: true,
      source: 'NSFDC public FAQ',
      sourceUrl: 'https://nsfdc.nic.in/faqs',
      priority: 10
    }
  ];

  const cities = [
    { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090 },
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
    { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
    { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
    { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
    { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
    { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126 }
  ];

  // Clearly-labeled prototype partner records; not represented as an official live directory.
  const defaultPartners = [
    { id:'del-sca', city:'delhi', name:'Delhi Prototype SCA Facilitation Centre', type:'SCA', lat:28.631, lon:77.221, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'del-psb', city:'delhi', name:'Public Sector Bank · Social Finance Desk', type:'PSB', lat:28.602, lon:77.198, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'del-mfi', city:'delhi', name:'Authorized MFI · Prototype Service Point', type:'NBFC-MFI', lat:28.650, lon:77.184, supports:['amy'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-31' },
    { id:'del-coop', city:'delhi', name:'Co-operative Finance · Prototype Desk', type:'Co-op', lat:28.591, lon:77.236, supports:['uny'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },

    { id:'jai-sca', city:'jaipur', name:'Rajasthan Prototype SCA Facilitation Centre', type:'SCA', lat:26.925, lon:75.805, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'jai-bank', city:'jaipur', name:'Public Sector Bank · Scheme Processing Desk', type:'PSB', lat:26.900, lon:75.773, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'jai-mfi', city:'jaipur', name:'Authorized MFI · Micro Enterprise Desk', type:'NBFC-MFI', lat:26.942, lon:75.770, supports:['amy'], active:true, fundEligible:false, portfolioEligible:true, lastVerified:'2026-08-30' },
    { id:'jai-coop', city:'jaipur', name:'Co-operative Bank · Udyam Desk', type:'Co-op', lat:26.887, lon:75.817, supports:['uny'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },

    { id:'luc-sca', city:'lucknow', name:'UP Prototype SCA Facilitation Centre', type:'SCA', lat:26.858, lon:80.960, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'luc-bank', city:'lucknow', name:'Regional Rural Bank · Development Desk', type:'RRB', lat:26.831, lon:80.928, supports:['mfs','term'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-31' },
    { id:'luc-mfi', city:'lucknow', name:'Authorized MFI · Aajeevika Desk', type:'NBFC-MFI', lat:26.871, lon:80.925, supports:['amy'], active:true, fundEligible:true, portfolioEligible:false, lastVerified:'2026-08-29' },
    { id:'luc-coop', city:'lucknow', name:'Co-operative Bank · Udyam Desk', type:'Co-op', lat:26.817, lon:80.968, supports:['uny'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },

    { id:'blr-sca', city:'bengaluru', name:'Karnataka Prototype SCA Facilitation Centre', type:'SCA', lat:12.986, lon:77.604, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'blr-bank', city:'bengaluru', name:'Public Sector Bank · Inclusive Credit Desk', type:'PSB', lat:12.958, lon:77.584, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'blr-mfi', city:'bengaluru', name:'Authorized MFI · Micro Finance Desk', type:'NBFC-MFI', lat:12.979, lon:77.568, supports:['amy'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'blr-coop', city:'bengaluru', name:'Co-operative Finance · Udyam Desk', type:'Co-op', lat:12.947, lon:77.616, supports:['uny'], active:false, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-27' },

    { id:'kol-sca', city:'kolkata', name:'West Bengal Prototype SCA Centre', type:'SCA', lat:22.589, lon:88.374, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'kol-bank', city:'kolkata', name:'Public Sector Bank · Social Lending Desk', type:'PSB', lat:22.557, lon:88.349, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-31' },
    { id:'kol-mfi', city:'kolkata', name:'Authorized MFI · Aajeevika Service Point', type:'NBFC-MFI', lat:22.602, lon:88.352, supports:['amy'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'kol-coop', city:'kolkata', name:'Co-operative Bank · Udyam Desk', type:'Co-op', lat:22.545, lon:88.388, supports:['uny'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },

    { id:'mum-sca', city:'mumbai', name:'Maharashtra Prototype SCA Facilitation Centre', type:'SCA', lat:19.091, lon:72.889, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'mum-bank', city:'mumbai', name:'Public Sector Bank · Credit Inclusion Desk', type:'PSB', lat:19.064, lon:72.862, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'mum-mfi', city:'mumbai', name:'Authorized MFI · Micro Enterprise Point', type:'NBFC-MFI', lat:19.105, lon:72.854, supports:['amy'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-31' },
    { id:'mum-coop', city:'mumbai', name:'Co-operative Finance · Udyam Desk', type:'Co-op', lat:19.049, lon:72.898, supports:['uny'], active:true, fundEligible:false, portfolioEligible:true, lastVerified:'2026-08-28' },

    { id:'hyd-sca', city:'hyderabad', name:'Telangana Prototype SCA Facilitation Centre', type:'SCA', lat:17.399, lon:78.500, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'hyd-bank', city:'hyderabad', name:'Regional Rural Bank · Scheme Desk', type:'RRB', lat:17.370, lon:78.469, supports:['mfs','term'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'hyd-mfi', city:'hyderabad', name:'Authorized MFI · Aajeevika Desk', type:'NBFC-MFI', lat:17.418, lon:78.470, supports:['amy'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'hyd-coop', city:'hyderabad', name:'Co-operative Bank · Udyam Desk', type:'Co-op', lat:17.355, lon:78.506, supports:['uny'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-30' },

    { id:'bho-sca', city:'bhopal', name:'MP Prototype SCA Facilitation Centre', type:'SCA', lat:23.274, lon:77.426, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-02' },
    { id:'bho-bank', city:'bhopal', name:'Public Sector Bank · Development Finance Desk', type:'PSB', lat:23.245, lon:77.397, supports:['mfs','term','els'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'bho-mfi', city:'bhopal', name:'Authorized MFI · Micro Finance Point', type:'NBFC-MFI', lat:23.289, lon:77.399, supports:['amy'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-09-01' },
    { id:'bho-coop', city:'bhopal', name:'Co-operative Bank · Udyam Desk', type:'Co-op', lat:23.232, lon:77.438, supports:['uny'], active:true, fundEligible:true, portfolioEligible:true, lastVerified:'2026-08-31' }
  ];

  const defaultState = {
    language: 'en',
    schemes: defaultSchemes,
    partners: defaultPartners,
    applications: [],
    currentProfile: null,
    selectedSchemeId: 'mfs',
    selectedCityId: 'jaipur',
    selectedPartnerId: null
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => value === Infinity ? '__INF__' : value), (key, value) => value === '__INF__' ? Infinity : value);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY), (key, value) => value === '__INF__' ? Infinity : value);
      if (!saved) return deepClone(defaultState);
      // Merge with defaults so prototype updates do not break old browser state.
      return {
        ...deepClone(defaultState),
        ...saved,
        schemes: Array.isArray(saved.schemes) ? saved.schemes : deepClone(defaultSchemes),
        partners: Array.isArray(saved.partners) ? saved.partners : deepClone(defaultPartners),
        applications: Array.isArray(saved.applications) ? saved.applications : []
      };
    } catch (e) {
      return deepClone(defaultState);
    }
  }

  let state = loadState();
  let wizardStep = 0;
  let wizardDraft = state.currentProfile ? { ...state.currentProfile } : {};
  let lastResults = null;
  let selectedResultTab = 'why';
  let adminView = 'overview';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state, (key, value) => value === Infinity ? '__INF__' : value));
      document.body.dataset.storageState = 'saved';
    } catch (e) {
      document.body.dataset.storageState = 'unavailable';
      toast('Local saving unavailable', 'Your browser could not save this session.');
    }
  }

  function fmtMoney(v, short = false) {
    if (!Number.isFinite(Number(v))) return '—';
    const n = Number(v);
    if (short) {
      if (n >= 10000000) return `₹${(n/10000000).toFixed(n%10000000===0?0:1)}Cr`;
      if (n >= 100000) return `₹${(n/100000).toFixed(n%100000===0?0:1)}L`;
      if (n >= 1000) return `₹${(n/1000).toFixed(n%1000===0?0:1)}K`;
    }
    return INR.format(Math.round(n));
  }

  function toast(title, message = '') {
    const wrap = $('#toastStack');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<b>${escapeHtml(title)}</b>${message ? `<span>${escapeHtml(message)}</span>` : ''}`;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-backdrop.open')) document.body.style.overflow = '';
  }

  function getScheme(id) { return state.schemes.find(s => s.id === id); }
  function getCity(id) { return cities.find(c => c.id === id) || cities[0]; }
  function getPartner(id) { return state.partners.find(p => p.id === id); }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function calculateLoan(profile, scheme) {
    const cost = Number(profile.cost || 0);
    const maxByPct = cost * (Number(scheme.fundingPct) / 100);
    const eligibleMax = Math.min(maxByPct, Number(scheme.maxLoan));
    const requested = Number(profile.requestedLoan || 0);
    const loan = requested > 0 ? Math.min(requested, eligibleMax) : eligibleMax;
    return {
      cost,
      eligibleMax: Math.max(0, eligibleMax),
      loan: Math.max(0, loan),
      contribution: Math.max(0, cost - Math.max(0, loan))
    };
  }

  function monthlyPayment(principal, annualRate, months) {
    principal = Number(principal) || 0;
    months = Math.max(1, Number(months) || 1);
    const r = Number(annualRate || 0) / 1200;
    if (!r) return principal / months;
    return principal * r * Math.pow(1+r, months) / (Math.pow(1+r, months) - 1);
  }

  function evaluateScheme(profile, scheme) {
    const reasons = [];
    const failures = [];
    const income = Number(profile.income || 0);
    const cost = Number(profile.cost || 0);

    if (!scheme.active) failures.push('Scheme is currently marked inactive in the prototype admin panel.');
    if (profile.isSC !== 'yes') failures.push('This NSFDC credit path requires the applicant to belong to the Scheduled Caste community and hold a valid certificate.');
    if (income > scheme.maxIncome) failures.push(`Annual family income exceeds the configured ${fmtMoney(scheme.maxIncome)} ceiling.`);
    else reasons.push(`Annual family income is within the ${fmtMoney(scheme.maxIncome)} ceiling.`);
    if (profile.purpose !== scheme.purpose) failures.push(scheme.purpose === 'education' ? 'This path is for eligible education needs.' : 'This path is for income-generating business activities.');
    else reasons.push(profile.purpose === 'education' ? 'The stated need is a professional/technical education loan.' : 'The stated need is an income-generating activity.');
    if (cost < scheme.minCost) failures.push(`Project cost must be above ${fmtMoney(scheme.minCost - 1)} for this scheme.`);
    if (Number.isFinite(scheme.maxCost) && cost > scheme.maxCost) failures.push(`Cost exceeds this scheme's ${fmtMoney(scheme.maxCost)} project/unit threshold.`);
    else if (cost >= scheme.minCost) reasons.push(Number.isFinite(scheme.maxCost) ? `Cost fits the ${fmtMoney(scheme.maxCost)} scheme range.` : 'Course cost is within the modeled financing path.');

    const eligible = failures.length === 0;
    let score = 0;
    if (eligible) {
      const loanInfo = calculateLoan(profile, scheme);
      const coverage = cost ? Math.min(1, loanInfo.loan / cost) : 0;
      const rateScore = Math.max(0, 1 - (scheme.rate - 6.5) / 10);
      const scaleFit = scheme.id === 'mfs' && cost <= 140000 ? 1 : scheme.id === 'term' && cost > 140000 ? 1 : scheme.id === 'els' ? 1 : .72;
      const channelAvailability = getEligiblePartners(profile.cityId || state.selectedCityId, scheme.id).length ? 1 : .45;
      score = Math.round((coverage * 34 + rateScore * 26 + scaleFit * 25 + channelAvailability * 10 + (scheme.priority/10)*5));
      score = Math.min(98, Math.max(60, score));
      if (scheme.id === 'mfs' && cost <= 140000) reasons.push('For a small project, this avoids moving into a larger loan category unnecessarily.');
      if (scheme.id === 'term') reasons.push('The project scale fits the larger term-loan band.');
      if (scheme.id === 'els') reasons.push('The education-specific repayment structure is aligned with the stated purpose.');
      if (scheme.id === 'amy') reasons.push('Provides an NBFC-MFI channel where that route is available, but at a higher beneficiary rate.');
      if (scheme.id === 'uny') reasons.push('Offers an additional small-enterprise route through cooperative/SFB channels where available.');
    }
    return { scheme, eligible, score, reasons, failures, loanInfo: calculateLoan(profile, scheme) };
  }

  function evaluateProfile(profile) {
    const evaluations = state.schemes.map(s => evaluateScheme(profile, s));
    const eligible = evaluations.filter(x => x.eligible).sort((a,b) => b.score-a.score || a.scheme.rate-b.scheme.rate);
    const ineligible = evaluations.filter(x => !x.eligible);
    return { eligible, ineligible, best: eligible[0] || null };
  }

  function getEligiblePartners(cityId, schemeId, coords = null) {
    const city = getCity(cityId);
    const origin = coords || { lat: city.lat, lon: city.lon };
    return state.partners
      .filter(p => p.city === city.id && p.supports.includes(schemeId))
      .map(p => ({ ...p, distance: haversine(origin.lat, origin.lon, p.lat, p.lon), eligibleNow: p.active && p.fundEligible && p.portfolioEligible }))
      .sort((a,b) => (Number(b.eligibleNow)-Number(a.eligibleNow)) || a.distance-b.distance);
  }

  // ----- Scheme showcase -----
  function renderSchemeShowcase() {
    const tabs = $('#schemeTabs');
    const showcase = $('#schemeShowcase');
    const activeSchemes = state.schemes;
    if (!getScheme(state.selectedSchemeId)) state.selectedSchemeId = activeSchemes[0]?.id;
    tabs.innerHTML = activeSchemes.map(s => `<button type="button" role="tab" aria-selected="${s.id===state.selectedSchemeId}" class="${s.id===state.selectedSchemeId?'active':''}" data-scheme-tab="${s.id}">${escapeHtml(s.short)}</button>`).join('');
    const s = getScheme(state.selectedSchemeId) || activeSchemes[0];
    if (!s) return;
    const maxCostText = Number.isFinite(s.maxCost) ? fmtMoney(s.maxCost) : 'No modeled course-cost cap';
    const moratorium = s.moratoriumLabel || `${s.moratoriumMonths} months`;
    showcase.innerHTML = `
      <div class="scheme-detail-grid">
        <div class="scheme-main">
          <div class="scheme-main-top">
            <div>
              <span class="scheme-tag">${s.active?'Active prototype rule':'Inactive prototype rule'}</span>
              <h3>${escapeHtml(s.name)}</h3>
              <p>${escapeHtml(s.description)}</p>
            </div>
            <div class="scheme-rate-big"><strong>${s.rate}%</strong><span>beneficiary rate / p.a.${s.alternateRate ? ' · base route shown' : ''}</span></div>
          </div>
          <div class="scheme-metrics">
            <div><span>Project / course band</span><b>${s.minCost > 0 ? `Above ${fmtMoney(s.minCost-1)} · ` : ''}${maxCostText}</b></div>
            <div><span>Maximum modeled loan</span><b>${fmtMoney(s.maxLoan)}</b></div>
            <div><span>Financing share</span><b>Up to ${s.fundingPct}%</b></div>
          </div>
          <div class="scheme-checks">
            <div><i>✓</i><span>Annual family income ceiling: ${fmtMoney(s.maxIncome)}</span></div>
            <div><i>✓</i><span>Channel: ${escapeHtml(s.channel)}</span></div>
            <div><i>✓</i><span>Repayment window: up to ${Math.round(s.maxTenureMonths/12*10)/10} years</span></div>
            <div><i>✓</i><span>Moratorium: ${escapeHtml(moratorium)}</span></div>
          </div>
        </div>
        <div class="scheme-side">
          <h4>What the rules engine checks</h4>
          <div class="eligibility-list">
            <div><span>Target community</span><b>Scheduled Caste + valid certificate</b></div>
            <div><span>Income</span><b>≤ ${fmtMoney(s.maxIncome)} / family / year</b></div>
            <div><span>Purpose</span><b>${escapeHtml(s.purposeLabel)}</b></div>
            <div><span>Cost range</span><b>${s.minCost > 0 ? `>${fmtMoney(s.minCost-1)} and ` : ''}${Number.isFinite(s.maxCost) ? `≤ ${fmtMoney(s.maxCost)}` : 'education-specific'}</b></div>
            <div><span>Data source</span><b>${escapeHtml(s.source)}</b></div>
          </div>
          <button class="primary-button finder-open" type="button">Check my eligibility →</button>
        </div>
      </div>`;
    $$('[data-scheme-tab]', tabs).forEach(btn => btn.addEventListener('click', () => {
      state.selectedSchemeId = btn.dataset.schemeTab;
      saveState(); renderSchemeShowcase(); syncSelectors();
    }));
    bindOpeners();
  }

  // ----- Financial calculator -----
  function syncSelectors() {
    const calcScheme = $('#calcScheme');
    const partnerScheme = $('#partnerScheme');
    const options = state.schemes.filter(s=>s.active).map(s=>`<option value="${s.id}">${escapeHtml(s.short)}</option>`).join('');
    if (calcScheme) {
      const prev = calcScheme.value || state.selectedSchemeId;
      calcScheme.innerHTML = options;
      calcScheme.value = getScheme(prev)?.active ? prev : (state.schemes.find(s=>s.active)?.id || 'mfs');
      updateCalculator();
    }
    if (partnerScheme) {
      const prev = partnerScheme.value || state.selectedSchemeId;
      partnerScheme.innerHTML = options;
      partnerScheme.value = getScheme(prev)?.active ? prev : (state.schemes.find(s=>s.active)?.id || 'mfs');
      renderPartners();
    }
  }

  function updateCalculator() {
    const s = getScheme($('#calcScheme')?.value || state.selectedSchemeId);
    if (!s) return;
    const tenure = $('#calcTenure');
    tenure.max = s.maxTenureMonths;
    if (Number(tenure.value) > s.maxTenureMonths) tenure.value = s.maxTenureMonths;
    const amountEl = $('#calcAmount');
    if (Number(amountEl.value) > s.maxLoan) amountEl.value = s.maxLoan;
    amountEl.max = s.maxLoan;
    const p = Math.max(0, Number(amountEl.value) || 0);
    const months = Math.max(1, Number(tenure.value) || 1);
    const emi = monthlyPayment(p, s.rate, months);
    const total = emi * months;
    const interest = Math.max(0, total-p);
    const income = Math.max(0, Number($('#calcIncome').value) || 0);
    const share = income > 0 ? Math.round(emi/income*100) : 0;
    $('#tenureLabel').textContent = `${months} months`;
    $('#maxTenureLabel').textContent = `${s.maxTenureMonths} mo`;
    $('#emiValue').textContent = fmtMoney(emi);
    $('#rateValue').textContent = `${s.rate}% p.a.`;
    $('#moratoriumValue').textContent = s.id === 'els' ? 'Course + 1 yr*' : `${s.moratoriumMonths} months`;
    $('#interestValue').textContent = fmtMoney(interest);
    $('#repaymentValue').textContent = fmtMoney(total);
    $('#affordabilityPct').textContent = `${share}%`;
    $('#affordabilityDonut').style.background = `conic-gradient(${share <= 30 ? '#0b6b5d' : share <= 45 ? '#d38433' : '#c94a57'} 0 ${Math.min(share,100)}%, #dce8e3 ${Math.min(share,100)}% 100%)`;
  }

  // ----- Partner locator -----
  function populateLocationSelect() {
    const select = $('#locationSelect');
    select.innerHTML = cities.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}, ${escapeHtml(c.state)}</option>`).join('');
    select.value = state.selectedCityId;
  }

  function renderPartners(coords = null) {
    const select = $('#locationSelect');
    const schemeSelect = $('#partnerScheme');
    if (!select || !schemeSelect) return;
    state.selectedCityId = select.value || state.selectedCityId;
    const schemeId = schemeSelect.value || state.selectedSchemeId;
    const city = getCity(state.selectedCityId);
    const partners = getEligiblePartners(city.id, schemeId, coords);
    if (!partners.find(p=>p.id===state.selectedPartnerId)) state.selectedPartnerId = partners.find(p=>p.eligibleNow)?.id || partners[0]?.id || null;
    saveState();
    const list = $('#partnerList');
    if (!partners.length) {
      list.innerHTML = `<div class="partner-empty"><b>No modeled partner for this scheme in ${escapeHtml(city.name)}.</b><br/>Try a different scheme path or city.</div>`;
    } else {
      list.innerHTML = partners.map(p=>`
        <article class="partner-card ${p.id===state.selectedPartnerId?'selected':''}" data-partner-card="${p.id}">
          <div class="partner-card-top">
            <div><h4>${escapeHtml(p.name)}</h4><p>${escapeHtml(p.type)} · Prototype directory record</p></div>
            <span class="distance-pill">${p.distance.toFixed(1)} km</span>
          </div>
          <div class="partner-tags">
            <span class="${p.active?'good':'warn'}">${p.active?'Open':'Paused'}</span>
            <span class="${p.fundEligible?'good':'warn'}">${p.fundEligible?'Fund flag OK':'Fund flag hold'}</span>
            <span class="${p.portfolioEligible?'good':'warn'}">${p.portfolioEligible?'Portfolio OK':'Portfolio hold'}</span>
          </div>
          <div class="partner-card-actions">
            <button class="mini-btn" type="button" data-select-partner="${p.id}">Select</button>
            <button class="mini-btn primary" type="button" data-route-partner="${p.id}" ${p.eligibleNow?'':'disabled'}>${p.eligibleNow?'Prepare handoff':'Not routable'}</button>
          </div>
        </article>`).join('');
    }
    renderMapPins(city, partners, coords);
    $$('[data-select-partner]').forEach(btn=>btn.addEventListener('click',()=>{
      state.selectedPartnerId = btn.dataset.selectPartner; saveState(); renderPartners(coords);
      toast('Partner selected', getPartner(state.selectedPartnerId)?.name || '');
    }));
    $$('[data-route-partner]').forEach(btn=>btn.addEventListener('click',()=>{
      state.selectedPartnerId = btn.dataset.routePartner; saveState();
      const scheme = getScheme(schemeId);
      if (!state.currentProfile) {
        startFinder();
        return;
      }
      openApplication(schemeId, state.selectedPartnerId);
    }));
  }

  function renderMapPins(city, partners, coords = null) {
    const pinsWrap = $('#mapPins');
    const user = $('#mapUser');
    const origin = coords || { lat: city.lat, lon: city.lon };
    user.style.left = '50%'; user.style.top = '50%';
    pinsWrap.innerHTML = partners.map(p=>{
      const dx = (p.lon-origin.lon) * 1200;
      const dy = -(p.lat-origin.lat) * 1050;
      const x = Math.max(8, Math.min(92, 50 + dx));
      const y = Math.max(12, Math.min(88, 50 + dy));
      return `<button class="partner-pin ${p.eligibleNow?'eligible':''} ${!p.active?'inactive':''}" style="left:${x}%;top:${y}%" data-map-partner="${p.id}" title="${escapeHtml(p.name)}"></button>`;
    }).join('');
    $$('[data-map-partner]').forEach(btn=>btn.addEventListener('click',()=>{
      state.selectedPartnerId = btn.dataset.mapPartner; saveState(); renderPartners(coords);
    }));
  }

  async function useMyLocation() {
    if (!navigator.geolocation) return toast('Location unavailable', 'Your browser does not support geolocation.');
    $('#useLocationButton').textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = { lat:pos.coords.latitude, lon:pos.coords.longitude };
      const nearestCity = cities.map(c=>({...c,d:haversine(coords.lat,coords.lon,c.lat,c.lon)})).sort((a,b)=>a.d-b.d)[0];
      state.selectedCityId = nearestCity.id;
      $('#locationSelect').value = nearestCity.id;
      $('#useLocationButton').textContent = `⌖ Near ${nearestCity.name}`;
      renderPartners(coords);
      toast('Location matched', `Using ${nearestCity.name} as the nearest prototype service area.`);
    }, err => {
      $('#useLocationButton').textContent = '⌖ Use my location';
      toast('Location permission not available', 'Choose a city manually instead.');
    }, { enableHighAccuracy:false, timeout:7000, maximumAge:120000 });
  }

  // ----- Wizard -----
  const wizardSteps = [
    { title:'Eligibility basics', sub:'We start with the two base checks for NSFDC credit assistance.' },
    { title:'Your requirement', sub:'Tell us whether the financing is for a business activity or education.' },
    { title:'Location & contact', sub:'Location helps us rank channel partners for the selected scheme path.' },
    { title:'Review profile', sub:'Confirm the inputs before the deterministic rules engine evaluates them.' }
  ];

  function startFinder(prefill = null) {
    wizardDraft = prefill ? { ...prefill } : (state.currentProfile ? { ...state.currentProfile } : { isSC:'yes', income:320000, purpose:'business', cost:120000, requestedLoan:108000, needType:'Tailoring / garment unit', cityId:'jaipur', applicantName:'Ravi Kumar', phone:'' });
    wizardStep = 0;
    renderWizard();
    openModal('finderModal');
  }

  function renderWizardProgress() {
    $('#wizardProgress').innerHTML = wizardSteps.map((s,i)=>`
      <div class="wizard-step-label ${i===wizardStep?'active':i<wizardStep?'done':''}">
        <span>${i<wizardStep?'✓':i+1}</span><div><b>${escapeHtml(s.title)}</b><small>${i===0?'Base criteria':i===1?'Purpose + amount':i===2?'Routing context':'Final check'}</small></div>
      </div>`).join('');
    $('#mobileStepLabel').textContent = `Step ${wizardStep+1} of ${wizardSteps.length}`;
    $('#mobileStepBar').style.width = `${(wizardStep+1)/wizardSteps.length*100}%`;
  }

  function optionCard(value, current, title, sub, name) {
    return `<button class="option-card ${value===current?'selected':''}" type="button" data-option-name="${name}" data-option-value="${value}"><span class="option-check">${value===current?'✓':''}</span><b>${title}</b><small>${sub}</small></button>`;
  }

  function renderWizard() {
    renderWizardProgress();
    const c = $('#wizardContent');
    const step = wizardSteps[wizardStep];
    let body = `<div class="wizard-kicker">Smart scheme matcher</div><h2 id="finderTitle">${escapeHtml(step.title)}</h2><p class="wizard-lead">${escapeHtml(step.sub)}</p>`;

    if (wizardStep === 0) {
      body += `<div class="wizard-form">
        <div><span class="input-label">Do you belong to the Scheduled Caste (SC) community?</span><div class="option-grid">
          ${optionCard('yes',wizardDraft.isSC,'Yes','I have / can provide a valid caste certificate','isSC')}
          ${optionCard('no',wizardDraft.isSC,'No','Show why NSFDC credit schemes would not match','isSC')}
        </div></div>
        <div><label class="input-label" for="wizIncome">Annual family income from all sources</label><div class="money-input"><span>₹</span><input class="wizard-input" id="wizIncome" type="number" min="0" step="10000" value="${Number(wizardDraft.income||0)}"></div><div class="helper">Current modeled ceiling: ₹5,00,000 per year.</div></div>
        <div class="eligibility-callout ${wizardDraft.isSC==='no' || Number(wizardDraft.income)>500000 ? 'warn':''}"><span>${wizardDraft.isSC==='yes' && Number(wizardDraft.income)<=500000?'✓':'!'}</span><p><b>${wizardDraft.isSC==='yes' && Number(wizardDraft.income)<=500000?'Base criteria look compatible':'A base criterion may not be met'}</b>The final result will show the exact rule that passes or fails; this screen does not use an AI guess.</p></div>
      </div>`;
    }
    if (wizardStep === 1) {
      body += `<div class="wizard-form">
        <div><span class="input-label">What do you need financing for?</span><div class="option-grid">
          ${optionCard('business',wizardDraft.purpose,'Business / self-employment','Start or expand an income-generating activity','purpose')}
          ${optionCard('education',wizardDraft.purpose,'Professional education','Regular full-time professional / technical course','purpose')}
        </div></div>
        <div class="wizard-fields">
          <div class="full"><label class="input-label" for="wizNeedType">${wizardDraft.purpose==='education'?'Course / field':'Project / activity'}</label><input class="wizard-input" id="wizNeedType" value="${escapeHtml(wizardDraft.needType||'')}" placeholder="${wizardDraft.purpose==='education'?'e.g. B.Tech, MBBS, MBA':'e.g. tailoring unit, dairy, repair shop'}"></div>
          <div><label class="input-label" for="wizCost">${wizardDraft.purpose==='education'?'Course fee / cost':'Estimated project cost'}</label><div class="money-input"><span>₹</span><input class="wizard-input" id="wizCost" type="number" min="1000" step="1000" value="${Number(wizardDraft.cost||0)}"></div></div>
          <div><label class="input-label" for="wizLoan">Requested loan (optional)</label><div class="money-input"><span>₹</span><input class="wizard-input" id="wizLoan" type="number" min="0" step="1000" value="${Number(wizardDraft.requestedLoan||0)}"></div></div>
        </div>
        <div class="eligibility-callout"><span>₹</span><p><b>We calculate the financing cap automatically</b>The engine compares your cost, requested amount, scheme financing percentage and maximum loan limit.</p></div>
      </div>`;
    }
    if (wizardStep === 2) {
      body += `<div class="wizard-form"><div class="wizard-fields">
        <div class="full"><label class="input-label" for="wizCity">City / service area</label><select class="wizard-input" id="wizCity">${cities.map(city=>`<option value="${city.id}" ${city.id===(wizardDraft.cityId||state.selectedCityId)?'selected':''}>${escapeHtml(city.name)}, ${escapeHtml(city.state)}</option>`).join('')}</select><div class="helper">Prototype partner records are seeded for these demo service areas.</div></div>
        <div><label class="input-label" for="wizName">Applicant name</label><input class="wizard-input" id="wizName" value="${escapeHtml(wizardDraft.applicantName||'')}" placeholder="Your name"></div>
        <div><label class="input-label" for="wizPhone">Mobile (optional demo field)</label><input class="wizard-input" id="wizPhone" value="${escapeHtml(wizardDraft.phone||'')}" inputmode="numeric" placeholder="10-digit number"></div>
      </div><div class="eligibility-callout"><span>⌖</span><p><b>Routing uses more than distance</b>YojanaSetu prioritizes partners that support the matched scheme and are marked open, fund-eligible and portfolio-eligible in the prototype directory.</p></div></div>`;
    }
    if (wizardStep === 3) {
      body += `<div class="summary-grid">
        <div class="summary-item"><span>Applicant</span><b>${escapeHtml(wizardDraft.applicantName||'Not provided')}</b></div>
        <div class="summary-item"><span>Base category</span><b>${wizardDraft.isSC==='yes'?'Scheduled Caste':'Not SC / not confirmed'}</b></div>
        <div class="summary-item"><span>Annual family income</span><b>${fmtMoney(wizardDraft.income||0)}</b></div>
        <div class="summary-item"><span>Need</span><b>${wizardDraft.purpose==='education'?'Education':'Business / self-employment'}</b></div>
        <div class="summary-item"><span>Cost</span><b>${fmtMoney(wizardDraft.cost||0)}</b></div>
        <div class="summary-item"><span>Requested loan</span><b>${Number(wizardDraft.requestedLoan)>0?fmtMoney(wizardDraft.requestedLoan):'Auto-calculate max fit'}</b></div>
        <div class="summary-item"><span>Activity / course</span><b>${escapeHtml(wizardDraft.needType||'Not specified')}</b></div>
        <div class="summary-item"><span>Location</span><b>${escapeHtml(getCity(wizardDraft.cityId||state.selectedCityId).name)}</b></div>
      </div>
      <label class="consent-row"><input id="wizConsent" type="checkbox" checked><span>I understand this is a hackathon decision-support prototype, not a loan sanction. Final eligibility and approval must be verified by the authorized channel partner.</span></label>`;
    }
    body += `<div class="wizard-actions"><button class="back-button" id="wizardBack" type="button" ${wizardStep===0?'style="visibility:hidden"':''}>← Back</button><button class="primary-button" id="wizardNext" type="button">${wizardStep===wizardSteps.length-1?'Show my matches →':'Continue →'}</button></div>`;
    c.innerHTML = body;
    bindWizardEvents();
  }

  function collectWizardStep() {
    if (wizardStep === 0) {
      wizardDraft.income = Number($('#wizIncome').value || 0);
      if (!wizardDraft.isSC) wizardDraft.isSC = 'yes';
      if (wizardDraft.income < 0) return false;
    }
    if (wizardStep === 1) {
      wizardDraft.needType = $('#wizNeedType').value.trim();
      wizardDraft.cost = Number($('#wizCost').value || 0);
      wizardDraft.requestedLoan = Number($('#wizLoan').value || 0);
      if (!wizardDraft.purpose) wizardDraft.purpose = 'business';
      if (wizardDraft.cost <= 0) { toast('Enter a valid cost', 'Project/course cost is required for scheme matching.'); return false; }
    }
    if (wizardStep === 2) {
      wizardDraft.cityId = $('#wizCity').value;
      wizardDraft.applicantName = $('#wizName').value.trim() || 'Applicant';
      wizardDraft.phone = $('#wizPhone').value.trim();
    }
    if (wizardStep === 3 && !$('#wizConsent').checked) { toast('Consent required', 'Please acknowledge the prototype disclaimer to continue.'); return false; }
    return true;
  }

  function bindWizardEvents() {
    $$('[data-option-name]').forEach(btn=>btn.addEventListener('click',()=>{
      wizardDraft[btn.dataset.optionName] = btn.dataset.optionValue;
      renderWizard();
    }));
    $('#wizardBack')?.addEventListener('click',()=>{ if(wizardStep>0){ collectWizardStep(); wizardStep--; renderWizard(); }});
    $('#wizardNext')?.addEventListener('click',()=>{
      if (!collectWizardStep()) return;
      if (wizardStep < wizardSteps.length-1) { wizardStep++; renderWizard(); }
      else {
        state.currentProfile = { ...wizardDraft };
        state.selectedCityId = wizardDraft.cityId || state.selectedCityId;
        lastResults = evaluateProfile(state.currentProfile);
        if (lastResults.best) state.selectedSchemeId = lastResults.best.scheme.id;
        saveState();
        closeModal('finderModal');
        renderResults();
        openModal('resultsModal');
        renderSchemeShowcase(); syncSelectors(); updateLatestApplicationCard();
      }
    });
  }

  // ----- Results -----
  function renderResults() {
    const profile = state.currentProfile;
    if (!profile) return;
    lastResults = evaluateProfile(profile);
    const root = $('#resultsContent');
    if (!lastResults.best) {
      const firstFailure = lastResults.ineligible[0]?.failures?.[0] || 'No active modeled scheme matched this profile.';
      root.innerHTML = `<div class="results-hero"><div class="eyebrow light">Eligibility result</div><h2 id="resultsTitle">No eligible scheme found in this prototype</h2><p>The deterministic rules engine did not find a qualifying path.</p></div><div class="results-body"><div class="result-banner"><div><span class="scheme-tag" style="background:#fff0f2;color:#b74c58">Rule mismatch</span><h3>What blocked the match?</h3><div class="reason-list">${lastResults.ineligible.slice(0,4).map(x=>`<div><span>×</span><p><b>${escapeHtml(x.scheme.short)}:</b> ${escapeHtml(x.failures[0]||firstFailure)}</p></div>`).join('')}</div></div><div class="finance-box"><h4>What you can do</h4><p style="font-size:10px;color:#62736d">Review the entered community/income/purpose/cost values. YojanaSetu does not relax a hard rule to force a recommendation.</p><button class="primary-button" id="editProfile" type="button" style="margin-top:12px">Edit profile</button></div></div></div>`;
      $('#editProfile').addEventListener('click',()=>{closeModal('resultsModal'); startFinder(profile);});
      return;
    }
    const best = lastResults.best;
    const s = best.scheme;
    const city = getCity(profile.cityId || state.selectedCityId);
    const nearest = getEligiblePartners(city.id,s.id).find(p=>p.eligibleNow) || getEligiblePartners(city.id,s.id)[0];
    const loan = best.loanInfo.loan;
    const tenure = Math.min(s.maxTenureMonths, s.id==='term'?60:s.id==='els'?120:s.maxTenureMonths);
    const emi = monthlyPayment(loan,s.rate,tenure);
    root.innerHTML = `
      <div class="results-hero">
        <div class="results-hero-top">
          <div><div class="eyebrow light">Deterministic eligibility + transparent ranking</div><h2 id="resultsTitle">${escapeHtml(profile.applicantName||'Applicant')}, your strongest match is ready.</h2><p>${lastResults.eligible.length} eligible modeled path${lastResults.eligible.length===1?'':'s'} found · ${lastResults.ineligible.length} ruled out · ${escapeHtml(city.name)} service area</p></div>
          <div class="result-score" style="--score:${best.score}%"><span><b>${best.score}%</b>fit score</span></div>
        </div>
      </div>
      <div class="results-body">
        <div class="result-banner">
          <div>
            <span class="scheme-tag">Best match</span><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.description)}</p>
            <div class="reason-list">${best.reasons.slice(0,4).map(r=>`<div><span>✓</span><p>${escapeHtml(r)}</p></div>`).join('')}</div>
          </div>
          <div class="finance-box"><h4>Indicative financing plan</h4><div class="finance-grid">
            <div><span>Cost</span><b>${fmtMoney(best.loanInfo.cost)}</b></div><div><span>Modeled loan</span><b>${fmtMoney(loan)}</b></div>
            <div><span>Applicant share</span><b>${fmtMoney(best.loanInfo.contribution)}</b></div><div><span>Rate</span><b>${s.rate}% p.a.</b></div>
            <div><span>Indicative EMI</span><b>${fmtMoney(emi)}</b></div><div><span>Moratorium</span><b>${s.id==='els'?'Course + 1yr*':`${s.moratoriumMonths} mo`}</b></div>
          </div></div>
        </div>
        <div class="result-tabs">
          <button data-result-tab="why" class="${selectedResultTab==='why'?'active':''}">Why this match</button>
          <button data-result-tab="compare" class="${selectedResultTab==='compare'?'active':''}">Compare options</button>
          <button data-result-tab="documents" class="${selectedResultTab==='documents'?'active':''}">Document readiness</button>
          <button data-result-tab="partner" class="${selectedResultTab==='partner'?'active':''}">Nearest partner</button>
        </div>
        <div class="result-tab-panel" id="resultTabPanel"></div>
        <div class="result-footer"><p>${escapeHtml(officialNote)}</p><button class="primary-button" id="prepareApplication" type="button">Prepare application handoff →</button></div>
      </div>`;
    renderResultTab();
    $$('[data-result-tab]').forEach(btn=>btn.addEventListener('click',()=>{ selectedResultTab=btn.dataset.resultTab; renderResults(); }));
    $('#prepareApplication').addEventListener('click',()=>openApplication(s.id, nearest?.id || null));
  }

  function renderResultTab() {
    const panel = $('#resultTabPanel'); if (!panel || !lastResults?.best) return;
    const best = lastResults.best, p = state.currentProfile, s = best.scheme;
    if (selectedResultTab === 'why') {
      panel.innerHTML = `<div class="alternative-grid">
        <div class="alt-card"><div class="alt-card-top"><h4>Hard eligibility passed</h4><span class="alt-score">PASS</span></div><p>The engine checked community, income, purpose and project/course band before ranking.</p><div class="pill-row"><span class="info-pill">Income ≤ ${fmtMoney(s.maxIncome)}</span><span class="info-pill">Purpose matched</span><span class="info-pill">Cost band matched</span></div></div>
        <div class="alt-card"><div class="alt-card-top"><h4>Ranking logic</h4><span class="alt-score">${best.score}/100</span></div><p>Fit score combines financing coverage, borrowing cost, scale fit, modeled partner availability and scheme priority.</p><div class="pill-row"><span class="info-pill">Up to ${s.fundingPct}%</span><span class="info-pill">${s.rate}% rate</span><span class="info-pill">${getEligiblePartners(p.cityId,s.id).filter(x=>x.eligibleNow).length} routable partner(s)</span></div></div>
      </div>`;
    }
    if (selectedResultTab === 'compare') {
      const rows = [...lastResults.eligible, ...lastResults.ineligible].map(x=>`<tr><td><b>${escapeHtml(x.scheme.short)}</b></td><td>${x.eligible?'<span class="badge-small">Eligible</span>':'<span class="badge-small red">Not eligible</span>'}</td><td>${x.scheme.rate}%</td><td>${fmtMoney(x.loanInfo.eligibleMax)}</td><td>${x.eligible?`${x.score}/100`:escapeHtml(x.failures[0]||'Rule mismatch')}</td></tr>`).join('');
      panel.innerHTML = `<table class="comparison-table"><thead><tr><th>Scheme</th><th>Rule result</th><th>Rate</th><th>Max modeled finance</th><th>Fit / reason</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
    if (selectedResultTab === 'documents') {
      const docs = getDocumentsForProfile(p);
      panel.innerHTML = `<div class="document-grid">${docs.map((d,i)=>`<div class="document-item"><span>${i<3?'✓':'○'}</span><div><b>${escapeHtml(d.name)}</b><br><small>${escapeHtml(d.note)}</small></div></div>`).join('')}</div><p class="tiny-note" style="margin-top:12px">Document lists can vary by channel partner. This prototype treats the checklist as readiness guidance, not final documentary requirements.</p>`;
    }
    if (selectedResultTab === 'partner') {
      const partners = getEligiblePartners(p.cityId,s.id);
      const nearest = partners.find(x=>x.eligibleNow);
      panel.innerHTML = nearest ? `<div class="alt-card"><div class="alt-card-top"><h4>${escapeHtml(nearest.name)}</h4><span class="alt-score">${nearest.distance.toFixed(1)} km</span></div><p>${escapeHtml(nearest.type)} · Prototype record · Verified ${escapeHtml(nearest.lastVerified)}</p><div class="pill-row"><span class="info-pill">Open</span><span class="info-pill">Fund flag OK</span><span class="info-pill">Portfolio flag OK</span><span class="info-pill">Supports ${escapeHtml(s.short)}</span></div></div>` : `<p style="font-size:10px;color:#6d7f78">No partner is currently routable for this modeled scheme in ${escapeHtml(getCity(p.cityId).name)}. The recommendation remains visible, but the system will not pretend a handoff is available.</p>`;
    }
  }

  // ----- Application flow -----
  function getDocumentsForProfile(profile) {
    const base = [
      { id:'caste', name:'Caste certificate', note:'Valid certificate from competent authority' },
      { id:'income', name:'Income proof', note:'Annual family income evidence' },
      { id:'kyc', name:'KYC / identity proof', note:'As required by the channel partner' },
      { id:'bank', name:'Bank account details', note:'For application and disbursement processing' }
    ];
    if (profile.purpose === 'education') base.push({ id:'admission', name:'Admission + fee structure', note:'Recognized institution / course evidence' });
    else base.push({ id:'project', name:'Project estimate / business plan', note:'Cost and viability support for the activity' });
    return base;
  }

  function openApplication(schemeId, partnerId = null) {
    if (!state.currentProfile) { startFinder(); return; }
    const scheme = getScheme(schemeId) || lastResults?.best?.scheme;
    if (!scheme) return;
    const cityId = state.currentProfile.cityId || state.selectedCityId;
    const partner = getPartner(partnerId) || getEligiblePartners(cityId, scheme.id).find(p=>p.eligibleNow) || null;
    state.selectedPartnerId = partner?.id || null; saveState();
    renderApplicationForm(scheme, partner);
    openModal('applicationModal');
  }

  function renderApplicationForm(scheme, partner) {
    const profile = state.currentProfile;
    const docs = getDocumentsForProfile(profile);
    const evaln = evaluateScheme(profile, scheme);
    const appRoot = $('#applicationContent');
    appRoot.innerHTML = `<div class="application-wrap">
      <div class="application-head"><div class="wizard-kicker">Application readiness</div><h2 id="applicationTitle">Prepare a clean handoff package</h2><p>Complete the checklist and route the profile context to the selected prototype channel partner.</p></div>
      <div class="readiness-live"><div class="readiness-ring" id="liveReadyRing" style="--ready:40%"><b id="liveReadyValue">40%</b></div><div><h3 id="readyHeading">2 items confirmed</h3><p>Check the documents you already have. The readiness score is a preparation indicator, not a credit score.</p></div></div>
      <div class="application-checks">${docs.map((d,i)=>`<label class="doc-check"><input type="checkbox" data-doc-check="${d.id}" ${i<2?'checked':''}><span><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.note)}</small></span></label>`).join('')}</div>
      <div class="application-summary"><h3>Handoff summary</h3><div class="application-summary-grid">
        <div><span>Applicant</span><b>${escapeHtml(profile.applicantName||'Applicant')}</b></div><div><span>Scheme</span><b>${escapeHtml(scheme.short)}</b></div><div><span>Modeled loan</span><b>${fmtMoney(evaln.loanInfo.loan)}</b></div>
        <div><span>Location</span><b>${escapeHtml(getCity(profile.cityId).name)}</b></div><div><span>Partner</span><b>${escapeHtml(partner?.name||'No eligible partner selected')}</b></div><div><span>Rule result</span><b>${evaln.eligible?'Eligible':'Not eligible'}</b></div>
      </div></div>
      <div class="wizard-actions"><button class="back-button" id="printSummary" type="button">Print summary</button><button class="primary-button" id="submitApplication" type="button" ${!evaln.eligible||!partner?.active||!partner?.fundEligible||!partner?.portfolioEligible?'disabled':''}>Route application →</button></div>
      ${!partner?'<p class="error-text">No routable prototype partner is selected for this scheme and city.</p>':''}
    </div>`;
    const checks = $$('[data-doc-check]', appRoot);
    const updateReady = () => {
      const checked = checks.filter(x=>x.checked).length;
      const pct = Math.round((checked/docs.length)*70 + (evaln.eligible?15:0) + (partner?.active&&partner?.fundEligible&&partner?.portfolioEligible?15:0));
      $('#liveReadyRing').style.setProperty('--ready',`${pct}%`); $('#liveReadyValue').textContent=`${pct}%`; $('#readyHeading').textContent=`${checked} of ${docs.length} documents confirmed`;
    };
    checks.forEach(x=>x.addEventListener('change',updateReady)); updateReady();
    $('#printSummary').addEventListener('click',()=>window.print());
    $('#submitApplication').addEventListener('click',()=>submitApplication(scheme,partner,checks.filter(x=>x.checked).map(x=>x.dataset.docCheck),docs.length));
  }

  function submitApplication(scheme, partner, checkedDocs, totalDocs) {
    const profile = state.currentProfile;
    const e = evaluateScheme(profile, scheme);
    if (!e.eligible || !partner) return;
    const appId = `YS26-${new Date().getFullYear().toString().slice(-2)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    const app = { id:appId, createdAt:new Date().toISOString(), applicantName:profile.applicantName||'Applicant', cityId:profile.cityId, schemeId:scheme.id, partnerId:partner.id, loanAmount:e.loanInfo.loan, status:'Submitted', checkedDocs, totalDocs };
    state.applications.unshift(app); saveState();
    $('#applicationContent').innerHTML = `<div class="success-screen"><div class="success-check">✓</div><h2>Application handoff created</h2><p>The prototype has saved the application locally and routed it to <b>${escapeHtml(partner.name)}</b>. You can change its status from the Admin demo dashboard.</p><div class="application-id-box"><span>Application ID</span><b>${appId}</b></div><div class="hero-actions" style="justify-content:center"><button class="soft-button" id="viewAdminAfterSubmit" type="button">Open admin dashboard</button><button class="primary-button" id="doneApplication" type="button">Done</button></div></div>`;
    $('#doneApplication').addEventListener('click',()=>closeModal('applicationModal'));
    $('#viewAdminAfterSubmit').addEventListener('click',()=>{closeModal('applicationModal'); openAdmin('applications');});
    updateLatestApplicationCard();
    toast('Application routed', `${appId} was saved in this browser.`);
  }

  function updateLatestApplicationCard() {
    const app = state.applications[0];
    if (!app) return;
    $('#sampleAppId').textContent = app.id;
    const card = $('.tracking-card');
    const pill = $('.status-pill', card);
    if (pill) pill.textContent = app.status;
  }

  // ----- Admin -----
  function openAdmin(view='overview') { adminView=view; renderAdmin(); openModal('adminModal'); }

  function renderAdmin() {
    $$('#adminNav button').forEach(b=>b.classList.toggle('active',b.dataset.adminView===adminView));
    const root = $('#adminContent');
    if (adminView==='overview') root.innerHTML = renderAdminOverview();
    if (adminView==='applications') root.innerHTML = renderAdminApplications();
    if (adminView==='schemes') root.innerHTML = renderAdminSchemes();
    if (adminView==='partners') root.innerHTML = renderAdminPartners();
    bindAdminContentEvents();
  }

  function renderAdminOverview() {
    const apps=state.applications, activePartners=state.partners.filter(p=>p.active&&p.fundEligible&&p.portfolioEligible).length, activeSchemes=state.schemes.filter(s=>s.active).length;
    const statusCounts = ['Submitted','Under review','Documents required','Approved'].map(s=>({s,n:apps.filter(a=>a.status===s).length}));
    const max = Math.max(1,...statusCounts.map(x=>x.n));
    return `<div class="admin-header"><div><h2>Operations overview</h2><p>Prototype ecosystem health · local demo data</p></div><button class="soft-button" id="seedAppButton" type="button">+ Add sample application</button></div>
      <div class="admin-kpis"><div class="admin-kpi"><span>Total applications</span><b>${apps.length}</b><small>Stored in this browser</small></div><div class="admin-kpi"><span>Active scheme rules</span><b>${activeSchemes}</b><small>of ${state.schemes.length} modeled paths</small></div><div class="admin-kpi"><span>Routable partners</span><b>${activePartners}</b><small>Open + fund + portfolio flags</small></div><div class="admin-kpi"><span>Data freshness</span><b>${Math.round(state.partners.filter(p=>p.lastVerified>='2026-08-30').length/state.partners.length*100)}%</b><small>Demo records verified recently</small></div></div>
      <div class="admin-grid"><div class="admin-card"><h3>Application pipeline</h3><div class="bar-chart">${statusCounts.map(x=>`<div class="bar-item"><i style="height:${Math.max(8,x.n/max*100)}%"></i><span>${escapeHtml(x.s)}</span></div>`).join('')}</div></div><div class="admin-card"><h3>Modeled channel mix</h3><div class="donut-stat"><div class="donut-large"></div><div class="legend"><div><i></i>SCA / bank routes</div><div><i></i>Micro-finance routes</div><div><i></i>Co-op / SFB routes</div></div></div></div></div>`;
  }

  function renderAdminApplications() {
    const apps = state.applications;
    return `<div class="admin-header"><div><h2>Applications</h2><p>Change statuses to demonstrate end-to-end tracking.</p></div><button class="soft-button" id="seedAppButton" type="button">+ Add sample</button></div>${apps.length?`<table class="admin-table"><thead><tr><th>ID</th><th>Applicant</th><th>Scheme</th><th>Partner</th><th>Loan</th><th>Status</th><th>Created</th></tr></thead><tbody>${apps.map(a=>`<tr><td><b>${a.id}</b></td><td>${escapeHtml(a.applicantName)}</td><td>${escapeHtml(getScheme(a.schemeId)?.short||a.schemeId)}</td><td>${escapeHtml(getPartner(a.partnerId)?.type||'—')}</td><td>${fmtMoney(a.loanAmount)}</td><td><select data-app-status="${a.id}">${['Submitted','Under review','Documents required','Approved','Rejected','Disbursed'].map(s=>`<option ${a.status===s?'selected':''}>${s}</option>`).join('')}</select></td><td>${new Date(a.createdAt).toLocaleDateString('en-IN')}</td></tr>`).join('')}</tbody></table>`:`<div class="admin-card"><h3>No applications yet</h3><p style="font-size:9px;color:#72837c">Run the citizen demo or add a sample application to populate this dashboard.</p></div>`}`;
  }

  function renderAdminSchemes() {
    return `<div class="admin-header"><div><h2>Scheme rules</h2><p>Admin-governed values; eligibility decisions consume these records, not free-form AI text.</p></div><span class="badge-small warn">Prototype controls</span></div><table class="admin-table"><thead><tr><th>Scheme</th><th>Active</th><th>Rate %</th><th>Income ceiling</th><th>Max cost</th><th>Max loan</th><th>Moratorium</th></tr></thead><tbody>${state.schemes.map(s=>`<tr><td><b>${escapeHtml(s.short)}</b><br><small>${escapeHtml(s.source)}</small></td><td><button class="switch ${s.active?'on':''}" data-scheme-active="${s.id}" type="button"></button></td><td><input type="number" step=".1" min="0" max="30" value="${s.rate}" data-scheme-rate="${s.id}"></td><td>${fmtMoney(s.maxIncome)}</td><td>${Number.isFinite(s.maxCost)?fmtMoney(s.maxCost):'Education path'}</td><td>${fmtMoney(s.maxLoan)}</td><td>${s.id==='els'?'Course + 1 yr':`${s.moratoriumMonths} mo`}</td></tr>`).join('')}</tbody></table><p class="tiny-note" style="margin-top:12px">A production system should version rules with effective dates, source documents, approvals and audit logs. This UI demonstrates the governance concept.</p>`;
  }

  function renderAdminPartners() {
    const city = state.selectedCityId || 'jaipur';
    const inCity = state.partners.filter(p=>p.city===city);
    return `<div class="admin-header"><div><h2>Channel partners · ${escapeHtml(getCity(city).name)}</h2><p>Toggle prototype routing flags to see the citizen-side locator react.</p></div><select class="wizard-input" id="adminCitySelect" style="width:180px">${cities.map(c=>`<option value="${c.id}" ${c.id===city?'selected':''}>${c.name}</option>`).join('')}</select></div><table class="admin-table"><thead><tr><th>Partner</th><th>Type</th><th>Open</th><th>Fund eligible</th><th>Portfolio eligible</th><th>Last verified</th></tr></thead><tbody>${inCity.map(p=>`<tr><td><b>${escapeHtml(p.name)}</b></td><td>${escapeHtml(p.type)}</td><td><button class="switch ${p.active?'on':''}" data-partner-flag="${p.id}:active"></button></td><td><button class="switch ${p.fundEligible?'on':''}" data-partner-flag="${p.id}:fundEligible"></button></td><td><button class="switch ${p.portfolioEligible?'on':''}" data-partner-flag="${p.id}:portfolioEligible"></button></td><td>${p.lastVerified}</td></tr>`).join('')}</tbody></table>`;
  }

  function addSampleApplication() {
    const profile={...demoProfile}; const results=evaluateProfile(profile); const best=results.best; if(!best)return;
    const partner=getEligiblePartners(profile.cityId,best.scheme.id).find(p=>p.eligibleNow); if(!partner)return;
    state.applications.unshift({id:`YS26-DEMO-${Math.floor(1000+Math.random()*8999)}`,createdAt:new Date(Date.now()-Math.random()*86400000*3).toISOString(),applicantName:['Ravi Kumar','Priya Devi','Aman Verma','Neha Kumari'][Math.floor(Math.random()*4)],cityId:profile.cityId,schemeId:best.scheme.id,partnerId:partner.id,loanAmount:best.loanInfo.loan,status:['Submitted','Under review','Documents required','Approved'][Math.floor(Math.random()*4)],checkedDocs:['caste','income'],totalDocs:5}); saveState(); renderAdmin(); updateLatestApplicationCard(); toast('Sample application added');
  }

  function bindAdminContentEvents() {
    $('#seedAppButton')?.addEventListener('click',addSampleApplication);
    $$('[data-app-status]').forEach(sel=>sel.addEventListener('change',()=>{ const app=state.applications.find(a=>a.id===sel.dataset.appStatus); if(app){app.status=sel.value;saveState();updateLatestApplicationCard();toast('Status updated',`${app.id} → ${app.status}`);} }));
    $$('[data-scheme-active]').forEach(btn=>btn.addEventListener('click',()=>{const s=getScheme(btn.dataset.schemeActive);s.active=!s.active;saveState();renderAdmin();renderSchemeShowcase();syncSelectors();}));
    $$('[data-scheme-rate]').forEach(inp=>inp.addEventListener('change',()=>{const s=getScheme(inp.dataset.schemeRate);const v=Number(inp.value);if(Number.isFinite(v)&&v>=0&&v<=30){s.rate=v;saveState();renderSchemeShowcase();updateCalculator();toast('Scheme rate updated',`${s.short}: ${v}%`);}}));
    $$('[data-partner-flag]').forEach(btn=>btn.addEventListener('click',()=>{const [id,key]=btn.dataset.partnerFlag.split(':');const p=getPartner(id);p[key]=!p[key];saveState();renderAdmin();renderPartners();}));
    $('#adminCitySelect')?.addEventListener('change',e=>{state.selectedCityId=e.target.value;saveState();renderAdmin();populateLocationSelect();$('#locationSelect').value=state.selectedCityId;renderPartners();});
  }

  // ----- Ask Setu AI -----
  let aiConnected = false;
  let assistantBusy = false;
  const assistantHistory = [];

  function assistantAnswer(question) {
    const q=question.toLowerCase(); const hi=state.language==='hi';
    if (/cheap|lowest|interest|rate|सस्ता|ब्याज/.test(q)) return hi ? 'मॉडल किए गए रास्तों में Micro Finance Scheme और Educational Loan Scheme की लाभार्थी दर 6.5% है। लेकिन सबसे कम दर तभी उपयोगी है जब आपकी प्रोफ़ाइल उस योजना के hard rules में पात्र हो।' : 'Among the modeled paths, Micro Finance Scheme and Educational Loan Scheme use a 6.5% beneficiary rate. The lowest rate only matters if your profile passes that scheme’s hard eligibility rules.';
    if (/moratorium|मोरेटोरियम|स्थगन/.test(q)) return hi ? 'मोरेटोरियम शुरुआती अवधि है जिसमें सामान्य मूलधन भुगतान शुरू नहीं होता। यह अपने-आप ब्याज-मुक्त अवधि नहीं है; वास्तविक ब्याज उपचार sanction terms पर निर्भर करेगा।' : 'A moratorium is an initial period before normal principal repayment starts. It is not automatically interest-free; the exact interest treatment depends on the sanction terms.';
    if (/direct|apply directly|सीधे/.test(q)) return hi ? 'NSFDC सीधे लाभार्थियों से ऋण आवेदन स्वीकार नहीं करता। आवेदन अधिकृत State Channelizing Agency या दूसरे Channel Partner के माध्यम से जाता है। YojanaSetu इसी last-mile routing को आसान बनाता है।' : 'NSFDC does not directly entertain beneficiary loan applications. Applications are routed through authorized State Channelizing Agencies or other channel partners, which is the last-mile routing YojanaSetu simplifies.';
    if (/income|5 lakh|आय/.test(q)) return hi ? 'इस वेबसाइट में वार्षिक पारिवारिक आय सीमा ₹5,00,000 configure की गई है। नियम admin-managed है ताकि policy update होने पर इसे बदला जा सके।' : 'This website uses a configured annual family-income ceiling of ₹5,00,000. The rule is admin-managed so it can be updated when policy changes.';
    if (/document|दस्तावेज/.test(q)) return hi ? 'आधारभूत readiness list में जाति प्रमाणपत्र, आय प्रमाण, KYC, बैंक विवरण और व्यवसाय के लिए project estimate या शिक्षा के लिए admission/fee structure शामिल हैं। अंतिम checklist Channel Partner पर निर्भर कर सकती है।' : 'The base readiness list includes caste certificate, income proof, KYC, bank details, and either a project estimate/business plan or admission/fee structure. The final checklist can vary by channel partner.';
    if (/emi|monthly|installment|किस्त|ईएमआई/.test(q)) {
      const s=getScheme(state.selectedSchemeId); const amount=Number($('#calcAmount')?.value||0); const months=Number($('#calcTenure')?.value||36); const emi=s?monthlyPayment(amount,s.rate,months):0;
      return hi ? `अभी चुने गए उदाहरण में लगभग ${fmtMoney(emi)} प्रति माह की EMI बनती है, ${months} महीनों के लिए। यह indicative calculation है; final repayment schedule sanction terms पर निर्भर करेगा।` : `For the currently selected example, the indicative EMI is about ${fmtMoney(emi)} per month for ${months} months. This is a planning estimate; the final repayment schedule depends on sanction terms.`;
    }
    if (/recommend|my scheme|मेरी योजना|best|match/.test(q) && state.currentProfile) {
      const r=evaluateProfile(state.currentProfile); if(r.best) return hi ? `आपकी वर्तमान प्रोफ़ाइल के लिए सबसे मजबूत मॉडल मैच ${r.best.scheme.name} है, fit score ${r.best.score}/100। Eligibility rules engine ने तय की है; मैं उसका कारण समझा रहा हूँ।` : `For your current profile, the strongest modeled match is ${r.best.scheme.name} with a ${r.best.score}/100 fit score. The deterministic rules engine made the eligibility decision; this assistant only explains it.`;
    }
    if (/partner|bank|agency|after i choose|next|साझेदार|बैंक/.test(q)) return hi ? 'Partner Router selected scheme support, open/paused status, fund-eligibility flag, portfolio-eligibility flag और distance देखता है। Partner चुनने के बाद application handoff तैयार होता है और status tracking शुरू हो सकती है। इस वेबसाइट के partner records demo data हैं।' : 'The Partner Router checks scheme support, open/paused status, fund-eligibility, portfolio-eligibility and distance. After you choose a partner, YojanaSetu prepares the application handoff and can track its status. Partner records in this website are demo data.';
    return hi ? 'मैं eligibility rules, scheme limits, EMI, moratorium, documents और partner routing समझा सकता हूँ। किसी specific profile का eligibility decision deterministic rules engine करता है, chatbot नहीं।' : 'I can explain eligibility rules, scheme limits, EMI, moratorium, document readiness and partner routing. For a specific profile, the deterministic rules engine — not the chatbot — makes the eligibility decision.';
  }

  function addChat(role,text){
    const m=document.createElement('div');
    m.className=`chat-message ${role}`;
    m.textContent=text;
    $('#assistantMessages').appendChild(m);
    $('#assistantMessages').scrollTop=$('#assistantMessages').scrollHeight;
  }

  function setAssistantBusy(busy){
    assistantBusy=busy;
    const typing=$('#assistantTyping'); if(typing) typing.hidden=!busy;
    const input=$('#assistantText'); const send=$('#assistantForm button');
    if(input) input.disabled=busy; if(send) send.disabled=busy;
    if(busy) $('#assistantMessages').scrollTop=$('#assistantMessages').scrollHeight;
  }

  function setAIStatus(online){
    aiConnected=online;
    const badge=$('#aiStatusBadge'); const dot=$('#assistantStatusDot'); const text=$('#assistantStatusText');
    if(badge){badge.classList.toggle('online',online); const label=badge.querySelector('span'); if(label) label.textContent=online?'AI online':'AI demo';}
    if(dot) dot.classList.toggle('online',online);
    if(text) text.textContent=online?'Live AI connected':'Smart demo mode';
  }

  async function checkAIStatus(){
    if(location.protocol==='file:'){setAIStatus(false);return;}
    try{
      const res=await fetch('/api/health',{headers:{'Accept':'application/json'}});
      if(!res.ok) throw new Error('health');
      const data=await res.json(); setAIStatus(Boolean(data.aiConfigured));
    }catch(_){setAIStatus(false);}
  }

  function buildAssistantContext(){
    const profile=state.currentProfile ? {
      isSC: state.currentProfile.isSC,
      income: Number(state.currentProfile.income||0),
      purpose: state.currentProfile.purpose,
      cost: Number(state.currentProfile.cost||0),
      requestedLoan: Number(state.currentProfile.requestedLoan||0),
      needType: state.currentProfile.needType||'',
      city: getCity(state.currentProfile.cityId||state.selectedCityId)?.name||''
    } : null;
    let recommendation=null;
    if(state.currentProfile){
      const result=evaluateProfile(state.currentProfile);
      if(result.best) recommendation={
        schemeId:result.best.scheme.id,
        schemeName:result.best.scheme.name,
        score:result.best.score,
        reasons:result.best.reasons,
        loanAmount:result.best.loanInfo.loan,
        contribution:result.best.loanInfo.contribution,
        rate:result.best.scheme.rate,
        moratoriumMonths:result.best.scheme.moratoriumMonths,
        maxTenureMonths:result.best.scheme.maxTenureMonths
      };
    }
    return {
      language:state.language,
      profile,
      recommendation,
      selectedScheme:getScheme(state.selectedSchemeId),
      schemes:state.schemes.map(s=>({id:s.id,name:s.name,purpose:s.purpose,maxIncome:s.maxIncome,minCost:s.minCost,maxCost:Number.isFinite(s.maxCost)?s.maxCost:null,maxLoan:s.maxLoan,fundingPct:s.fundingPct,rate:s.rate,maxTenureMonths:s.maxTenureMonths,moratoriumMonths:s.moratoriumMonths,channel:s.channel,active:s.active})),
      officialNote
    };
  }

  async function askAssistant(text){
    const question=text.trim(); if(!question || assistantBusy)return;
    addChat('user',question);
    assistantHistory.push({role:'user',content:question});
    if(assistantHistory.length>10)assistantHistory.splice(0,assistantHistory.length-10);
    setAssistantBusy(true);
    let answer='';
    if(aiConnected){
      try{
        const res=await fetch('/api/assistant',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({question,history:assistantHistory.slice(-8),context:buildAssistantContext()})
        });
        const data=await res.json().catch(()=>({}));
        if(!res.ok || !data.answer)throw new Error(data.error||'AI request failed');
        answer=data.answer;
      }catch(err){
        setAIStatus(false);
        answer=assistantAnswer(question);
        toast('AI connection unavailable','Ask Setu switched to its built-in rules-aware demo answers.');
      }
    }else{
      await new Promise(r=>setTimeout(r,260));
      answer=assistantAnswer(question);
    }
    assistantHistory.push({role:'assistant',content:answer});
    if(assistantHistory.length>10)assistantHistory.splice(0,assistantHistory.length-10);
    setAssistantBusy(false); addChat('bot',answer);
  }

  // ----- Language -----
  const translationPairs = [
    ['.nav-links a[href="#how"]','How it works','कैसे काम करता है'],['.nav-links a[href="#schemes"]','Schemes','योजनाएँ'],['.nav-links a[href="#calculator"]','Calculator','कैलकुलेटर'],['.nav-links a[href="#partners"]','Partners','पार्टनर'],['.nav-links a[href="#applications"]','Applications','आवेदन'],
    ['.hero .eyebrow','SIH 2026 · Problem Statement 26092','SIH 2026 · समस्या विवरण 26092'],
    ['.hero h1','From confusion to the <span class="gradient-text">right financial scheme</span> in minutes.','भ्रम से <span class="gradient-text">सही वित्तीय योजना</span> तक, कुछ ही मिनटों में।'],
    ['.hero-subtitle','An explainable, multilingual platform that checks eligibility, ranks suitable NSFDC credit schemes, estimates repayment, and routes applicants to an eligible channel partner.','एक समझने योग्य बहुभाषी मंच जो पात्रता जाँचता है, उपयुक्त NSFDC ऋण योजनाओं को रैंक करता है, पुनर्भुगतान का अनुमान देता है और सही चैनल पार्टनर तक मार्गदर्शन करता है।'],
    ['#how .section-heading h2','One guided flow. No scheme hunting.','एक मार्गदर्शित प्रक्रिया। योजनाएँ खोजने की झंझट नहीं।'],
    ['#schemes .section-heading h2','Rules you can inspect, not a black box.','ऐसे नियम जिन्हें आप देख सकें — कोई ब्लैक बॉक्स नहीं।'],
    ['#calculator .calc-copy h2','Understand the loan before you commit.','आवेदन से पहले ऋण को समझें।'],
    ['#partners .section-heading h2','Find a partner that can actually process your path.','ऐसा पार्टनर खोजें जो आपकी योजना को वास्तव में प्रोसेस कर सके।'],
    ['#applications .app-copy h2','Turn a recommendation into an application-ready handoff.','सिफारिश को आवेदन-तैयार हैंडऑफ में बदलें।']
  ];
  function applyLanguage(){
    const hi=state.language==='hi'; $('.lang-code').textContent=hi?'EN':'हिं';
    translationPairs.forEach(([sel,en,hn])=>{const el=$(sel);if(el)el.innerHTML=hi?hn:en;});
    $$('.finder-open').forEach((b,i)=>{if(b.closest('.scheme-side'))return; if(b.tagName==='BUTTON' && !b.closest('.app-copy')) b.innerHTML=hi?'मेरी योजना खोजें':'Find my scheme';});
    $('#assistantText').placeholder=hi?'योजना के बारे में पूछें…':'Ask about your scheme…';
    saveState();
  }

  // ----- Demo -----
  const demoProfile = { isSC:'yes', income:320000, purpose:'business', cost:120000, requestedLoan:108000, needType:'Tailoring business expansion', cityId:'jaipur', applicantName:'Ravi Kumar', phone:'9876543210' };
  function runDemo(){state.currentProfile={...demoProfile};state.selectedCityId='jaipur';lastResults=evaluateProfile(state.currentProfile);state.selectedSchemeId=lastResults.best?.scheme.id||'mfs';saveState();renderSchemeShowcase();syncSelectors();renderResults();openModal('resultsModal');toast('Demo profile loaded','Ravi Kumar · ₹3.2L income · ₹1.2L tailoring project · Jaipur');}

  // ----- General events -----
  function bindOpeners(){
    $$('.finder-open').forEach(btn=>{ if(btn.dataset.bound)return; btn.dataset.bound='1'; btn.addEventListener('click',()=>startFinder()); });
    $$('.admin-open').forEach(btn=>{ if(btn.dataset.bound)return; btn.dataset.bound='1'; btn.addEventListener('click',()=>openAdmin()); });
  }

  function init() {
    // Reveal-on-scroll
    const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.12});
    $$('.reveal').forEach(el=>io.observe(el));

    renderSchemeShowcase(); populateLocationSelect(); syncSelectors(); renderPartners(); updateLatestApplicationCard(); applyLanguage(); bindOpeners(); checkAIStatus();

    $('#calcScheme').addEventListener('change',e=>{state.selectedSchemeId=e.target.value;saveState();updateCalculator();});
    $('#calcAmount').addEventListener('input',updateCalculator); $('#calcIncome').addEventListener('input',updateCalculator); $('#calcTenure').addEventListener('input',updateCalculator);
    $('#locationSelect').addEventListener('change',e=>{state.selectedCityId=e.target.value;saveState();renderPartners();}); $('#partnerScheme').addEventListener('change',renderPartners); $('#useLocationButton').addEventListener('click',useMyLocation);
    $('#demoButton').addEventListener('click',runDemo);
    $('#languageToggle').addEventListener('click',()=>{state.language=state.language==='en'?'hi':'en';applyLanguage();toast(state.language==='hi'?'हिन्दी चालू':'English enabled',state.language==='hi'?'मुख्य इंटरफ़ेस और सहायक अब हिन्दी मोड में हैं।':'Main interface and assistant are now in English mode.');});
    $('#mobileMenuButton').addEventListener('click',()=>{const menu=$('#mobileNav');const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));$('#mobileMenuButton').setAttribute('aria-expanded',String(open));$('#mobileMenuButton').setAttribute('aria-label',open?'Close menu':'Open menu');}); $$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>{const menu=$('#mobileNav');menu.classList.remove('open');menu.setAttribute('aria-hidden','true');$('#mobileMenuButton').setAttribute('aria-expanded','false');$('#mobileMenuButton').setAttribute('aria-label','Open menu');}));
    $$('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
    $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal(backdrop.id);}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=$('.modal-backdrop.open');if(open)closeModal(open.id);else {const panel=$('#assistantPanel');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');}}});

    // Admin nav
    $$('#adminNav button').forEach(btn=>btn.addEventListener('click',()=>{adminView=btn.dataset.adminView;renderAdmin();}));

    // Assistant
    $('#assistantFab').addEventListener('click',()=>{const panel=$('#assistantPanel');panel.classList.toggle('open');panel.setAttribute('aria-hidden',panel.classList.contains('open')?'false':'true');if(panel.classList.contains('open'))setTimeout(()=>$('#assistantText')?.focus(),80);});
    $('#assistantClose').addEventListener('click',()=>{const panel=$('#assistantPanel');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');});
    $('#assistantForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#assistantText');const value=input.value;input.value='';askAssistant(value);});
    $$('#quickPrompts button').forEach(btn=>btn.addEventListener('click',()=>askAssistant(btn.textContent)));

    $('#resetDemo').addEventListener('click',()=>{localStorage.removeItem(STORAGE_KEY);state=deepClone(defaultState);wizardDraft={};lastResults=null;renderSchemeShowcase();populateLocationSelect();syncSelectors();renderPartners();applyLanguage();toast('Prototype data reset','Local applications and admin changes were cleared.');});

    // If page restored mid-state, sync latest city.
    if (state.currentProfile?.cityId) { state.selectedCityId=state.currentProfile.cityId; $('#locationSelect').value=state.selectedCityId; renderPartners(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
