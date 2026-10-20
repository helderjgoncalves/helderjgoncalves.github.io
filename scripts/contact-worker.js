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
const SITE = 'https://hgoncalves.uk';
// Only the live site: Turnstile's key issues no tokens on localhost, so a
// local preview can't send anyway and needn't be let in.
const ORIGIN = SITE;
const HOSTNAME = new URL(SITE).hostname;

const MIN_FILL_MS = 3000;
const LIMITS = { name: 100, email: 200, trip: 100, message: 4000 };
const MIN_MESSAGE = 10;
const MAX_LINKS = 5;
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[a-z]{2,}$/i;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const cors = origin === ORIGIN
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
    if (request.method !== 'POST' || origin !== ORIGIN) return reply(405, { error: 'method' });

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

    if (field('website') || !(Number(form.elapsed) >= MIN_FILL_MS)) {
      console.log('dropped quietly:', field('website') ? 'hidden field filled' : `sent ${Number(form.elapsed)} ms after opening`);
      return reply(200, { ok: true });
    }

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

    const path = oneLine(field('page'));
    const page = /^\/[\w\-/]{0,200}$/.test(path) ? `${SITE}${path}` : '';
    const letter = { name, email, trip, message, page };

    try {
      await env.EMAIL.send(new EmailMessage(FROM, env.TO, mime(env, letter)));
    } catch (error) {
      console.error('send failed:', error);
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
  return result.success === true && result.hostname === HOSTNAME;
}

// The inbox shows who wrote and about where ("Ana via hgoncalves.uk",
// "Patagonia: a question from Ana"), and Reply goes to the visitor.
function mime(env, letter) {
  const who = letter.name || letter.email;
  const subject = letter.trip ? `${letter.trip}: a question from ${who}` : `A trip question from ${who}`;
  const replyTo = letter.name ? `${encodeWord(letter.name)} <${letter.email}>` : letter.email;
  const boundary = `part-${crypto.randomUUID()}`;
  const part = (type, content) => [
    `--${boundary}`,
    `Content-Type: ${type}; charset=utf-8`,
    'Content-Transfer-Encoding: base64',
    '',
    base64(content).replace(/.{76}/g, '$&\r\n'),
  ];
  return [
    `From: ${encodeWord(`${letter.name || 'Trips form'} via hgoncalves.uk`)} <${FROM}>`,
    `To: ${env.TO}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${encodeWord(subject)}`,
    `Message-ID: <${crypto.randomUUID()}@hgoncalves.uk>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    ...part('text/plain', text(letter)),
    ...part('text/html', html(letter, subject)),
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

function text({ name, email, trip, message, page }) {
  return [
    trip ? `A question about ${trip}` : 'A trip question',
    '',
    message,
    '',
    '—',
    `From   ${name ? `${name} <${email}>` : email}`,
    trip ? `Trip   ${trip}` : null,
    page ? `Page   ${page}` : null,
    '',
    'Sent through the trips form on hgoncalves.uk. Reply to answer them directly.',
  ]
    .filter((line) => line !== null)
    .join('\n');
}

// Tables and inline styles, since that's what every mail app renders the
// same. No images: nothing to block, nothing to load. The palette is the
// site's: brand blue, ink text, the canvas behind the card, a sunrise rule.
// The inline colours are the light theme; the <style> swaps in the site's
// dark one wherever the mail app is dark and reads it (Apple Mail, Proton,
// Outlook), and apps that ignore it (Gmail) darken the light one themselves.
function html({ name, email, trip, message, page }, subject) {
  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif";
  const reply = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const row = (label, value) => `
            <tr>
              <td class="m-muted" style="padding:6px 0;width:64px;vertical-align:top;font-size:13px;color:#7a879c">${label}</td>
              <td class="m-text" style="padding:6px 0;font-size:14px;color:#1c2330">${value}</td>
            </tr>`;
  const link = (href, label) => `<a class="m-accent" href="${escape(href)}" style="color:#3a6ea5;text-decoration:none">${escape(label)}</a>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escape(subject)}</title>
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  @media (prefers-color-scheme: dark) {
    ${DARK.replace(/\n/g, '\n    ')}
  }
  ${DARK.replace(/(^|\n)\./g, '$1[data-ogsc] .')}
</style>
</head>
<body class="m-bg" style="margin:0;padding:0;background:#f7f9fc;font-family:${font};-webkit-font-smoothing:antialiased">
  <table class="m-bg" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table class="m-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e3e8ef;border-radius:16px;overflow:hidden">
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:#ff9a4d;background-image:linear-gradient(90deg,#ffd27a,#ff9a4d,#ff6f91)">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px">
              <div class="m-accent" style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#3a6ea5">Trip question</div>
              <h1 class="m-text" style="margin:6px 0 0;font-size:24px;line-height:1.25;font-weight:700;color:#1c2330">${escape(trip || 'Somewhere new')}</h1>
              <p class="m-muted" style="margin:6px 0 0;font-size:15px;color:#54627a">from <strong class="m-soft" style="color:#2f3947">${escape(name || email)}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0">
              <div class="m-quote" style="padding:16px 18px;background:#f7f9fc;border-left:3px solid #3a6ea5;border-radius:4px 10px 10px 4px;font-size:16px;line-height:1.6;color:#1c2330;white-space:pre-wrap;word-wrap:break-word">${escape(message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="m-button" style="border-radius:999px;background:#3a6ea5">
                    <a href="${escape(reply)}" class="m-button-text" style="display:inline-block;padding:11px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">Reply to ${escape(name.split(/\s+/)[0] || 'them')}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 28px">
              <table class="m-rule" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3e8ef;padding-top:10px">${[
                name ? row('Name', escape(name)) : '',
                row('Email', link(`mailto:${email}`, email)),
                trip ? row('Trip', escape(trip)) : '',
                page ? row('Page', link(page, page.replace(/^https:\/\//, ''))) : '',
              ].join('')}
              </table>
            </td>
          </tr>
        </table>
        <p class="m-muted" style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#7a879c">Sent through the trips form on <a class="m-muted" href="${SITE}/trips/" style="color:#7a879c">hgoncalves.uk</a>. Replying goes straight to them.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// The site's dark theme, by class (inline styles win unless !important).
const DARK = [
  '.m-bg { background: #0e131c !important; }',
  '.m-card { background: #161d2c !important; border-color: #2a3242 !important; }',
  '.m-text { color: #e8edf7 !important; }',
  '.m-soft { color: #c2cad9 !important; }',
  '.m-muted { color: #8e98ab !important; }',
  '.m-accent { color: #6fa3da !important; }',
  '.m-quote { background: #1c2436 !important; border-left-color: #6fa3da !important; color: #e8edf7 !important; }',
  '.m-rule { border-top-color: #2a3242 !important; }',
  '.m-button { background: #6fa3da !important; }',
  '.m-button-text { color: #1c2330 !important; }',
].join('\n');

function escape(text) {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
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
