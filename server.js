'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8080);
const AI_TIMEOUT_MS = 20000;

function loadDotEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}
loadDotEnv();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const IS_OPENROUTER = OPENAI_API_KEY.startsWith('sk-or-');
const AI_MODEL = process.env.OPENAI_MODEL || (IS_OPENROUTER ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

const MIME = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon'
};

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff'
  });
  res.end(JSON.stringify(data));
}

async function readJson(req, maxBytes = 120000) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBytes) { reject(new Error('Request too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function cleanText(value, max=4000) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, max);
}

function compactContext(context = {}) {
  // Do not send names, phone numbers or application IDs to the model.
  const p = context.profile || null;
  const profile = p ? {
    scheduled_caste: p.isSC === 'yes', annual_family_income_inr: Number(p.income || 0), purpose: cleanText(p.purpose, 30),
    project_or_course_cost_inr: Number(p.cost || 0), requested_loan_inr: Number(p.requestedLoan || 0),
    need: cleanText(p.needType, 180), city: cleanText(p.city, 80)
  } : null;
  const r = context.recommendation || null;
  const recommendation = r ? {
    scheme: cleanText(r.schemeName, 160), fit_score: Number(r.score || 0), reasons: Array.isArray(r.reasons) ? r.reasons.slice(0, 6).map(x=>cleanText(x,220)) : [],
    modeled_loan_inr: Number(r.loanAmount || 0), applicant_contribution_inr: Number(r.contribution || 0),
    beneficiary_rate_percent: Number(r.rate || 0), moratorium_months: Number(r.moratoriumMonths || 0), max_tenure_months: Number(r.maxTenureMonths || 0)
  } : null;
  const schemes = Array.isArray(context.schemes) ? context.schemes.slice(0, 12).map(s => ({
    id: cleanText(s.id,30), name: cleanText(s.name,160), purpose: cleanText(s.purpose,30), max_income_inr:Number(s.maxIncome||0),
    min_cost_inr:Number(s.minCost||0), max_cost_inr:s.maxCost==null?null:Number(s.maxCost), max_loan_inr:Number(s.maxLoan||0),
    funding_percent:Number(s.fundingPct||0), rate_percent:Number(s.rate||0), max_tenure_months:Number(s.maxTenureMonths||0),
    moratorium_months:Number(s.moratoriumMonths||0), channel:cleanText(s.channel,120), active:Boolean(s.active)
  })) : [];
  return {language: context.language === 'hi' ? 'Hindi' : 'English', profile, recommendation, schemes, note:cleanText(context.officialNote,350)};
}

function extractResponseText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  const parts = [];
  for (const item of data?.output || []) {
    for (const c of item?.content || []) {
      if ((c?.type === 'output_text' || c?.type === 'text') && typeof c.text === 'string') parts.push(c.text);
    }
  }
  return parts.join('\n').trim();
}

function extractChatResponseText(data) {
  return typeof data?.choices?.[0]?.message?.content === 'string'
    ? data.choices[0].message.content.trim()
    : '';
}

async function handleAssistant(req, res) {
  if (!OPENAI_API_KEY) return json(res, 503, {error:'AI is not configured. Add OPENAI_API_KEY to .env.'});
  let body;
  try { body = await readJson(req); } catch (e) { return json(res, 400, {error:e.message}); }
  const question = cleanText(body.question, 1200).trim();
  if (!question) return json(res, 400, {error:'Question is required.'});
  const context = compactContext(body.context || {});
  const history = Array.isArray(body.history) ? body.history.slice(-8).map(m=>({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: cleanText(m.content, 1200)
  })) : [];
  if (history.length && history[history.length - 1].role === 'user' && history[history.length - 1].content.trim() === question) history.pop();

  const system = `You are Ask Setu AI inside YojanaSetu AI, an SIH 2026 scheme-matching website for marginalized entrepreneurs.\n\nSTRICT OPERATING RULES:\n1. Eligibility is NEVER decided by you. The website's deterministic rules engine is authoritative. Explain the supplied recommendation and rules; do not invent eligibility.\n2. Never claim a loan is approved, sanctioned, guaranteed, or that a channel partner will accept it.\n3. Treat partner/fund/NPA status as prototype data unless the supplied context says otherwise.\n4. Do not invent government rules, limits, documents, rates, deadlines, or partner availability. If the supplied context does not contain the answer, say that the current official guideline or channel partner must be checked.\n5. Make answers accessible to low-literacy users: simple language, short paragraphs, concrete numbers, no legalistic jargon.\n6. Respond in ${context.language}. If the user asks for another language, follow their request.\n7. Keep most answers under 170 words. Use bullets only when they materially improve clarity.\n8. When a profile/recommendation is supplied, personalize explanations using only non-identifying profile fields.\n9. YojanaSetu's calculator outputs are indicative planning figures, not sanction terms.\n\nCURRENT WEBSITE CONTEXT:\n${JSON.stringify(context)}`;

  const input = [
    ...history.map(m=>({role:m.role,content:m.content})),
    {role:'user', content:question}
  ];

  try {
    const endpoint = IS_OPENROUTER
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/responses';
    const headers = {'Authorization':`Bearer ${OPENAI_API_KEY}`,'Content-Type':'application/json'};
    if (IS_OPENROUTER) {
      headers['HTTP-Referer'] = `http://localhost:${PORT}`;
      headers['X-Title'] = 'YojanaSetu AI';
    }
    const payload = IS_OPENROUTER
      ? {model:AI_MODEL,messages:[{role:'system',content:system},...input],max_tokens:500}
      : {model:AI_MODEL,instructions:system,input,max_output_tokens:500};
    const upstream = await fetch(endpoint, {
      method:'POST',
      headers,
      body:JSON.stringify(payload),
      signal:AbortSignal.timeout(AI_TIMEOUT_MS)
    });
    const data = await upstream.json().catch(()=>({}));
    if (!upstream.ok) {
      const detail = cleanText(data?.error?.message || `OpenAI request failed (${upstream.status})`, 500);
      console.error(`[Ask Setu AI] HTTP ${upstream.status}:`, detail);
      return json(res, 502, {error:'AI service request failed. Check the server console and API configuration.'});
    }
    const answer = IS_OPENROUTER ? extractChatResponseText(data) : extractResponseText(data);
    if (!answer) return json(res, 502, {error:'AI returned an empty response.'});
    return json(res, 200, {answer, model:AI_MODEL});
  } catch (e) {
    console.error('[Ask Setu AI]', e);
    return json(res, 502, {error:'Could not reach the AI service.'});
  }
}

function serveStatic(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/') pathname = '/index.html';
  const target = path.normalize(path.join(ROOT, pathname));
  const relativeTarget = path.relative(ROOT, target);
  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(target, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Not found'); }
    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff'});
    fs.createReadStream(target).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/api/health')) return json(res, 200, {ok:true, aiConfigured:Boolean(OPENAI_API_KEY), provider:IS_OPENROUTER?'openrouter':'openai', model:AI_MODEL});
  if (req.method === 'POST' && req.url.startsWith('/api/assistant')) return handleAssistant(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, {error:'Method not allowed'});
  serveStatic(req, res);
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing server or run with a different PORT, for example: PORT=8081 npm start`);
    process.exitCode = 1;
    return;
  }
  console.error('[Server]', error);
  process.exitCode = 1;
});

server.listen(PORT, () => {
  console.log(`YojanaSetu AI running at http://localhost:${PORT}`);
  console.log(OPENAI_API_KEY ? `Ask Setu AI: enabled via ${IS_OPENROUTER?'OpenRouter':'OpenAI'} (${AI_MODEL})` : 'Ask Setu AI: demo fallback mode (add OPENAI_API_KEY to .env to enable live AI)');
});
