// Cloudflare Worker behind the trip-tips form (TripHelp.tsx): it checks a
// message and emails it to Hélder through Cloudflare Email Routing.
// Not part of the site build: paste it into a Worker in the Cloudflare
// dashboard, give it the custom domain contact.hgoncalves.uk (the form posts
// there, `tripsPage.help.form.endpoint`) and disable its workers.dev URL.
//
// Junk is stopped in layers, cheapest first: a field people never see (bots
// fill it in), a minimum time between opening the form and sending it, a
// per-visitor rate limit, a look at the message itself (a few words, not a
// pile of links), and finally Turnstile, Cloudflare's bot check. Turnstile
// runs in "interaction-only" mode, so most visitors never see it.
// Anything turned away by the first two gets a quiet "sent" so a bot learns
// nothing; the rest get an error code the form explains.
//
// Bindings and variables (Settings > Bindings / Variables and Secrets):
//   EMAIL             Send Email binding, destination address = TO
//   TO                the inbox messages go to: a verified destination
//                     address in Email Routing (not travel@ itself, which is a
//                     routing rule rather than a destination)
//   TURNSTILE_SECRET  secret: the Turnstile widget's secret key
//   RATE_LIMITER      optional Rate Limiting binding, e.g. 2 requests per 60 s

import { EmailMessage } from 'cloudflare:email';

const FROM = 'form@hgoncalves.uk';
const ORIGINS = new Set(['https://hgoncalves.uk', 'http://localhost:5173', 'http://localhost:4173']);
const HOSTNAMES = new Set(['hgoncalves.uk', 'localhost']);

const MIN_FILL_MS = 3000;
const LIMITS = { name: 100, email: 200, trip: 100, message: 4000 };
const MIN_MESSAGE = 10;
const MAX_LINKS = 2;
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[a-z]{2,}$/i;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const cors = ORIGINS.has(origin)
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          Vary: 'Origin',
        }
      : {};
    const reply = (status, body) =>
      new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST' || !ORIGINS.has(origin)) return reply(405, { error: 'method' });

    let form;
    try {
      form = await request.json();
    } catch {
      return reply(400, { error: 'invalid' });
    }
    const field = (key) => (typeof form[key] === 'string' ? form[key].trim() : '');
    const name = oneLine(field('name'));
    const email = oneLine(field('email'));
    const trip = oneLine(field('trip'));
    const message = field('message');

    if (field('website') || !(Number(form.elapsed) >= MIN_FILL_MS)) return reply(200, { ok: true });

    const ip = request.headers.get('CF-Connecting-IP') ?? '';
    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip || 'unknown' });
      if (!success) return reply(429, { error: 'rate' });
    }

    if (
      !EMAIL_RE.test(email) ||
      email.length > LIMITS.email ||
      name.length > LIMITS.name ||
      trip.length > LIMITS.trip ||
      message.length > LIMITS.message ||
      !looksReal(message)
    ) {
      return reply(400, { error: 'invalid' });
    }

    if (!(await human(field('token'), ip, env.TURNSTILE_SECRET))) return reply(403, { error: 'bot' });

    const subject = trip ? `Trip question: ${trip}` : 'Trip question';
    const body = [
      message,
      '',
      '—',
      `From: ${name || '(no name)'} <${email}>`,
      trip ? `Trip: ${trip}` : null,
      `Page: ${oneLine(field('page')).slice(0, 200) || '(unknown)'}`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    try {
      await env.EMAIL.send(new EmailMessage(FROM, env.TO, mime({ env, name, email, subject, body })));
    } catch {
      return reply(502, { error: 'failed' });
    }
    return reply(200, { ok: true });
  },
};

function oneLine(text) {
  return text.replace(/[\r\n\t]+/g, ' ').trim();
}

// Kept loose so a short question gets through ("Best season?"); the bots are
// for Turnstile and the checks before it. It still has to be words, not a
// pile of links.
function looksReal(message) {
  if (message.length < MIN_MESSAGE) return false;
  const words = message.match(/\p{L}{2,}/gu) ?? [];
  if (words.length < 2) return false;
  const links = message.match(/https?:\/\/|www\./gi) ?? [];
  return links.length <= MAX_LINKS;
}

async function human(token, ip, secret) {
  if (!token || !secret) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = await response.json();
  return result.success === true && HOSTNAMES.has(result.hostname);
}

function mime({ env, name, email, subject, body }) {
  const replyTo = name ? `${encodeWord(name)} <${email}>` : email;
  return [
    `From: Trips form <${FROM}>`,
    `To: ${env.TO}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${encodeWord(subject)}`,
    `Message-ID: <${crypto.randomUUID()}@hgoncalves.uk>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64(body).replace(/.{76}/g, '$&\r\n'),
  ].join('\r\n');
}

function encodeWord(text) {
  return `=?utf-8?B?${base64(text)}?=`;
}

function base64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
