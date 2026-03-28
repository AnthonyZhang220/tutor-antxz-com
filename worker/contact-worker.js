export default {
  async fetch(request, env) {
    const cors = buildCorsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid JSON payload' }, 400, cors);
    }

    if ((payload.website || '').trim()) {
      return json({ ok: true }, 200, cors);
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return json({ error: validationError }, 400, cors);
    }

    const rate = await enforceRateLimit(request, env);
    if (!rate.ok) {
      return json({ error: 'Too many requests. Please wait a minute and try again.' }, 429, cors);
    }

    if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_TO) {
      return json({ error: 'Worker email settings are not configured.' }, 500, cors);
    }

    const subject = `[Tutor Contact] ${payload.subject}`;
    const html = buildEmailHtml(payload);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: [env.RESEND_TO],
        reply_to: payload.email,
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const details = await safeReadText(resendResponse);
      return json({ error: `Email provider rejected request: ${details || resendResponse.status}` }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};

const MEMORY_BUCKET = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_REQUESTS = 5;

function validatePayload(payload) {
  const name = (payload.name || '').toString().trim();
  const email = (payload.email || '').toString().trim();
  const subject = (payload.subject || '').toString().trim();
  const message = (payload.message || '').toString().trim();

  if (!name) return 'Name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required.';
  if (!subject) return 'Subject is required.';
  if (message.length < 12) return 'Message must be at least 12 characters.';
  return '';
}

function buildEmailHtml(payload) {
  const rows = [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Subject', payload.subject],
    ['Language', payload.language || 'en'],
    ['Page', payload.page || ''],
    ['Sent At', payload.sentAt || new Date().toISOString()],
    ['Message', payload.message],
  ];

  const tableRows = rows
    .map(([label, value]) => `<tr><td style="padding:8px 10px;font-weight:600;border:1px solid #e5e0d8;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 10px;border:1px solid #e5e0d8;white-space:pre-wrap;">${escapeHtml(String(value || ''))}</td></tr>`)
    .join('');

  return `<div style="font-family:Inter,Arial,sans-serif;color:#2d2d2d;line-height:1.55;"><h2 style="margin:0 0 12px 0;">New Tutor Inquiry</h2><table style="border-collapse:collapse;width:100%;max-width:760px;">${tableRows}</table></div>`;
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function enforceRateLimit(request, env) {
  const key = getClientKey(request);
  const now = Date.now();

  if (env.RATE_LIMIT_KV) {
    const kvKey = `rl:${key}`;
    const existing = await env.RATE_LIMIT_KV.get(kvKey, { type: 'json' });
    const current = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + RATE_WINDOW_MS };
    if (current.count >= RATE_MAX_REQUESTS) return { ok: false };

    const next = { count: current.count + 1, resetAt: current.resetAt };
    const ttlSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    await env.RATE_LIMIT_KV.put(kvKey, JSON.stringify(next), { expirationTtl: ttlSeconds });
    return { ok: true };
  }

  const current = MEMORY_BUCKET.get(key);
  if (!current || current.resetAt <= now) {
    MEMORY_BUCKET.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }

  if (current.count >= RATE_MAX_REQUESTS) {
    return { ok: false };
  }

  current.count += 1;
  MEMORY_BUCKET.set(key, current);
  return { ok: true };
}

function getClientKey(request) {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  return ip.split(',')[0].trim();
}

function buildCorsHeaders(request, env) {
  const requestOrigin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

  let allowOrigin = '*';
  if (allowed.length && requestOrigin && allowed.includes(requestOrigin)) {
    allowOrigin = requestOrigin;
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return '';
  }
}
