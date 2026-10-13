// Cloudflare Worker serving the site's clips from a private R2 bucket at
// media.hgoncalves.uk. Not part of the site build: paste it into the Worker
// in the Cloudflare dashboard, with the bucket bound as MEDIA.
//
// It stays on the Workers Free plan on purpose: past the daily request limit
// it fails instead of billing, which caps R2 reads below the free tier.
// The bucket must stay private (no r2.dev URL, no custom domain on the
// bucket itself) so this Worker is the only way in.

const ALLOWED_HOSTS = ['hgoncalves.uk', 'localhost'];

// Clips keep their names when re-encoded, so browsers must re-check them.
const CACHE_CONTROL = 'public, max-age=604800';

function allowedReferer(request) {
  const referer = request.headers.get('Referer');
  // Some privacy settings strip the Referer; let those through.
  if (!referer) return true;
  try {
    const host = new URL(referer).hostname;
    return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

function objectKey(request) {
  try {
    return decodeURIComponent(new URL(request.url).pathname.slice(1));
  } catch {
    return null;
  }
}

function baseHeaders(object) {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'video/mp4');
  headers.set('ETag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', CACHE_CONTROL);
  return headers;
}

// One long stream from R2 through a Worker crawls (well under the clips'
// bitrate), while short reads are fast. So each response carries at most
// CHUNK bytes; a 206 shorter than asked is valid, and players fetch the rest.
const CHUNK = 4 * 1024 * 1024;

// The range to read for a Range header: a single `bytes=a-b` or `bytes=a-`
// is capped at CHUNK; anything else is left for R2 to parse (or reject).
function cappedRange(request) {
  const match = /^bytes=(\d+)-(\d*)$/.exec(request.headers.get('Range') ?? '');
  if (!match) return request.headers;
  const offset = Number(match[1]);
  const requested = match[2] === '' ? Infinity : Number(match[2]) - offset + 1;
  if (requested <= 0) return request.headers;
  return { offset, length: Math.min(requested, CHUNK) };
}

// R2 reports the range it served with some fields left undefined.
function servedRange(range, size) {
  if (typeof range.suffix === 'number') {
    const start = Math.max(0, size - range.suffix);
    return { start, end: size - 1 };
  }
  const start = typeof range.offset === 'number' ? range.offset : 0;
  const end = typeof range.length === 'number' ? Math.min(start + range.length, size) - 1 : size - 1;
  return { start, end };
}

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (!allowedReferer(request)) {
      return new Response('Forbidden', { status: 403 });
    }

    const key = objectKey(request);
    if (key === null) return new Response('Bad request', { status: 400 });
    if (!key) return new Response('Not found', { status: 404 });

    if (request.method === 'HEAD') {
      const object = await env.MEDIA.head(key);
      if (!object) return new Response(null, { status: 404 });
      const headers = baseHeaders(object);
      headers.set('Content-Length', String(object.size));
      return new Response(null, { headers });
    }

    const range = cappedRange(request);
    let object;
    try {
      object = await env.MEDIA.get(key, { range, onlyIf: request.headers });
    } catch {
      // R2 throws on ranges it can't serve (past the end, or several at once).
      const head = await env.MEDIA.head(key);
      if (!head) return new Response('Not found', { status: 404 });
      if (typeof range.offset === 'number' && range.offset < head.size) {
        object = await env.MEDIA.get(key, { range: { offset: range.offset }, onlyIf: request.headers });
      } else {
        return new Response('Range not satisfiable', {
          status: 416,
          headers: { 'Content-Range': `bytes */${head.size}` },
        });
      }
    }
    if (!object) return new Response('Not found', { status: 404 });

    const headers = baseHeaders(object);

    // A failed precondition returns the object without a body.
    if (!('body' in object)) {
      const revalidating = request.headers.has('If-None-Match') || request.headers.has('If-Modified-Since');
      return new Response(null, { status: revalidating ? 304 : 412, headers });
    }

    if (request.headers.has('Range') && object.range) {
      const { start, end } = servedRange(object.range, object.size);
      headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
      headers.set('Content-Length', String(end - start + 1));
      return new Response(object.body, { status: 206, headers });
    }

    headers.set('Content-Length', String(object.size));
    return new Response(object.body, { headers });
  },
};
