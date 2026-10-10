import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const buf = readFileSync(process.argv[2]);
const s = buf.toString('latin1');

// ---------------------------------------------------------------- object table
const objs = new Map();
{
  const re = /(?:^|[^0-9])(\d+)\s+(\d+)\s+obj\b/g;
  let m;
  while ((m = re.exec(s))) {
    const num = +m[1];
    const dictStart = re.lastIndex;
    const end = s.indexOf('endobj', dictStart);
    const body = s.slice(dictStart, end === -1 ? undefined : end);
    const streamIdx = body.indexOf('stream');
    const dict = (streamIdx === -1 ? body : body.slice(0, streamIdx)).trim();
    let data = null;
    if (streamIdx !== -1) {
      let ds = dictStart + streamIdx + 6;
      if (s[ds] === '\r') ds++;
      if (s[ds] === '\n') ds++;
      const de = s.indexOf('endstream', ds);
      const rawStream = buf.subarray(ds, de);
      if (/FlateDecode/.test(dict)) {
        try {
          data = inflateSync(rawStream);
        } catch {
          try {
            data = inflateSync(rawStream, { finishFlush: 2 });
          } catch {
            data = null;
          }
        }
      } else {
        data = rawStream;
      }
    }
    objs.set(num, { num, dict, data });
  }
}

// ------------------------------------------------------------------ ToUnicode
function parseCMap(text) {
  const map = new Map();
  const hex = (h) => String.fromCodePoint(...(h.match(/.{4}/g) ?? []).map((x) => parseInt(x, 16)));
  for (const block of text.match(/beginbfchar[\s\S]*?endbfchar/g) ?? []) {
    for (const pair of block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      map.set(parseInt(pair[1], 16), hex(pair[2]));
    }
  }
  for (const block of text.match(/beginbfrange[\s\S]*?endbfrange/g) ?? []) {
    for (const r of block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      const lo = parseInt(r[1], 16);
      const hi = parseInt(r[2], 16);
      const dst = parseInt(r[3], 16);
      for (let c = lo; c <= hi; c++) map.set(c, String.fromCodePoint(dst + (c - lo)));
    }
  }
  return map;
}

const fontMaps = new Map();
const fontWidths = new Map();
for (const o of objs.values()) {
  const tu = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(o.dict);
  if (!tu) continue;
  const cmapObj = objs.get(+tu[1]);
  if (cmapObj?.data) fontMaps.set(o.num, parseCMap(cmapObj.data.toString('latin1')));
  const wr = /\/Widths\s+(\d+)\s+0\s+R/.exec(o.dict);
  const first = +(/\/FirstChar\s+(\d+)/.exec(o.dict)?.[1] ?? 0);
  if (wr) {
    const arr = /\[([^\]]*)\]/.exec(objs.get(+wr[1])?.dict ?? '');
    if (arr) {
      const w = arr[1].trim().split(/\s+/).map(Number);
      const map = new Map();
      w.forEach((v, i) => map.set(first + i, v));
      fontWidths.set(o.num, map);
    }
  }
}

// ------------------------------------------------------------------- resources
function balancedDict(str, startIdx) {
  // startIdx points at the '<<'
  let depth = 0;
  for (let i = startIdx; i < str.length - 1; i++) {
    if (str[i] === '<' && str[i + 1] === '<') {
      depth++;
      i++;
    } else if (str[i] === '>' && str[i + 1] === '>') {
      depth--;
      i++;
      if (depth === 0) return str.slice(startIdx, i + 1);
    }
  }
  return '';
}

function subDict(dict, key) {
  const at = dict.indexOf(`/${key}`);
  if (at === -1) return null;
  const ref = new RegExp(`/${key}\\s+(\\d+)\\s+0\\s+R`).exec(dict);
  if (ref) return objs.get(+ref[1])?.dict ?? null;
  const open = dict.indexOf('<<', at);
  if (open === -1) return null;
  return balancedDict(dict, open);
}

function namedRefs(dict) {
  const out = new Map();
  if (!dict) return out;
  for (const f of dict.matchAll(/\/([A-Za-z0-9._-]+)\s+(\d+)\s+0\s+R/g)) out.set(f[1], +f[2]);
  return out;
}

function resourcesOf(dict) {
  const res = subDict(dict, 'Resources') ?? '';
  return { fonts: namedRefs(subDict(res, 'Font')), xobjects: namedRefs(subDict(res, 'XObject')) };
}

// ----------------------------------------------------------------- string ops
function decodeLiteral(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '\\') {
      const n = str[++i];
      if (n === 'n') out.push(10);
      else if (n === 'r') out.push(13);
      else if (n === 't') out.push(9);
      else if (n >= '0' && n <= '7') {
        let oct = n;
        while (oct.length < 3 && str[i + 1] >= '0' && str[i + 1] <= '7') oct += str[++i];
        out.push(parseInt(oct, 8));
      } else out.push(n.charCodeAt(0));
    } else out.push(ch.charCodeAt(0));
  }
  return out;
}

const mul = (a, b) => [
  a[0] * b[0] + a[1] * b[2],
  a[0] * b[1] + a[1] * b[3],
  a[2] * b[0] + a[3] * b[2],
  a[2] * b[1] + a[3] * b[3],
  a[4] * b[0] + a[5] * b[2] + b[4],
  a[4] * b[1] + a[5] * b[3] + b[5],
];

// -------------------------------------------------------------- mini renderer
function run(content, res, ctm, items, depth) {
  if (depth > 8) return;
  const tokens = content.match(
    /\((?:[^()\\]|\\[\s\S])*\)|<[0-9A-Fa-f\s]*>|\[|\]|\/[^\s/<>\[\]()]*|[-+]?[\d.]+|[A-Za-z'"*]+/g,
  );
  if (!tokens) return;

  const stack = [];
  let gs = [];
  let cur = ctm;
  let tm = [1, 0, 0, 1, 0, 0];
  let tlm = tm;
  let font = null;
  let size = 0;
  let leading = 0;

  const operands = [];
  const num = (i) => parseFloat(operands[operands.length + i]);

  const emit = (arg) => {
    const map = font != null ? fontMaps.get(font) : null;
    const widths = font != null ? fontWidths.get(font) : null;
    let text = '';
    let advance = 0; // in text-space units (multiply by size for device units)
    for (const chunk of arg) {
      if (typeof chunk === 'number') {
        advance -= chunk / 1000;
        continue;
      }
      for (const c of chunk) {
        const code = c.codePointAt(0);
        text += map?.get(code) ?? '';
        advance += widths?.get(code) ?? 0.5;
      }
    }
    if (!text.trim()) return;
    const trm = mul(mul([size, 0, 0, size, 0, 0], tm), cur);
    const scale = Math.hypot(trm[0], trm[1]);
    items.push({
      x: trm[4],
      y: trm[5],
      size: Math.round(Math.hypot(trm[2], trm[3]) * 10) / 10,
      width: advance * scale,
      font,
      text,
    });
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t[0] === '(' || t[0] === '<' || t[0] === '/' || t[0] === '[' || t[0] === ']' || /^[-+.\d]/.test(t)) {
      operands.push(t);
      continue;
    }
    switch (t) {
      case 'q':
        stack.push(cur);
        break;
      case 'Q':
        cur = stack.pop() ?? cur;
        break;
      case 'cm':
        cur = mul([num(-6), num(-5), num(-4), num(-3), num(-2), num(-1)], cur);
        break;
      case 'BT':
        tm = [1, 0, 0, 1, 0, 0];
        tlm = tm;
        break;
      case 'ET':
        break;
      case 'Tf': {
        const name = operands[operands.length - 2]?.slice(1);
        size = num(-1);
        font = res.fonts.get(name) ?? null;
        break;
      }
      case 'Tm':
        tm = [num(-6), num(-5), num(-4), num(-3), num(-2), num(-1)];
        tlm = tm;
        break;
      case 'Td':
        tlm = mul([1, 0, 0, 1, num(-2), num(-1)], tlm);
        tm = tlm;
        break;
      case 'TD':
        leading = -num(-1);
        tlm = mul([1, 0, 0, 1, num(-2), num(-1)], tlm);
        tm = tlm;
        break;
      case 'TL':
        leading = num(-1);
        break;
      case 'T*':
        tlm = mul([1, 0, 0, 1, 0, -leading], tlm);
        tm = tlm;
        break;
      case 'Tj':
      case "'":
      case '"': {
        if (t !== 'Tj') {
          tlm = mul([1, 0, 0, 1, 0, -leading], tlm);
          tm = tlm;
        }
        const arg = operands[operands.length - 1];
        emit([toStr(arg)]);
        break;
      }
      case 'TJ': {
        // collect between last matching [ ... ]
        let j = operands.length - 1;
        let d = 0;
        for (; j >= 0; j--) {
          if (operands[j] === ']') d++;
          if (operands[j] === '[') {
            d--;
            if (d === 0) break;
          }
        }
        const parts = operands.slice(j + 1, operands.length - 1).filter((p) => p !== '[' && p !== ']');
        emit(parts.map((p) => (p[0] === '(' || p[0] === '<' ? toStr(p) : parseFloat(p))));
        break;
      }
      case 'Do': {
        const name = operands[operands.length - 1]?.slice(1);
        const ref = res.xobjects.get(name);
        const xo = ref != null ? objs.get(ref) : null;
        if (xo?.data && /\/Subtype\s*\/Form/.test(xo.dict)) {
          const mtx = /\/Matrix\s*\[([^\]]*)\]/.exec(xo.dict);
          let inner = cur;
          if (mtx) {
            const n = mtx[1].trim().split(/\s+/).map(Number);
            if (n.length === 6) inner = mul(n, cur);
          }
          const xres = resourcesOf(xo.dict);
          run(xo.data.toString('latin1'), {
            fonts: xres.fonts.size ? xres.fonts : res.fonts,
            xobjects: xres.xobjects.size ? xres.xobjects : res.xobjects,
          }, inner, items, depth + 1);
        }
        break;
      }
      default:
        break;
    }
    operands.length = 0;
  }
}

function toStr(tok) {
  if (tok === undefined) return '';
  if (tok[0] === '(') return String.fromCharCode(...decodeLiteral(tok.slice(1, -1)));
  if (tok[0] === '<') {
    const hexs = tok.slice(1, -1).replace(/\s/g, '');
    let out = '';
    for (let k = 0; k + 1 < hexs.length; k += 2) out += String.fromCharCode(parseInt(hexs.substr(k, 2), 16));
    return out;
  }
  return '';
}

// ----------------------------------------------------------------------- pages
const pages = [];
for (const o of objs.values()) {
  if (!/\/Type\s*\/Page(?![a-zA-Z])/.test(o.dict)) continue;
  const refs = [];
  for (const c of o.dict.matchAll(/\/Contents\s+(?:(\d+)\s+0\s+R|\[([^\]]*)\])/g)) {
    if (c[1]) refs.push(+c[1]);
    else for (const r of c[2].matchAll(/(\d+)\s+0\s+R/g)) refs.push(+r[1]);
  }
  const mb = /\/MediaBox\s*\[([^\]]*)\]/.exec(o.dict);
  const box = mb ? mb[1].trim().split(/\s+/).map(Number) : [0, 0, 595, 842];
  pages.push({ obj: o.num, refs, res: resourcesOf(o.dict), height: box[3] });
}
pages.sort((a, b) => a.obj - b.obj);

const out = [];
const structured = [];
for (let pi = 0; pi < pages.length; pi++) {
  const p = pages[pi];
  const content = Buffer.concat(p.refs.map((r) => objs.get(r)?.data ?? Buffer.alloc(0))).toString('latin1');
  const items = [];
  run(content, p.res, [1, 0, 0, 1, 0, 0], items, 0);

  // top-down y, group into lines
  for (const it of items) it.top = p.height - it.y;
  const rows = new Map();
  for (const it of items) {
    const key = Math.round(it.top / 4);
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(it);
  }
  out.push(`\n===== PAGE ${pi + 1} =====`);
  const pageRows = [];
  for (const [, its] of [...rows.entries()].sort((a, b) => a[0] - b[0])) {
    its.sort((a, b) => a.x - b.x);
    let text = '';
    let end = null;
    for (const it of its) {
      if (end != null && it.x - end > it.size * 0.22 && !/\s$/.test(text) && !/^\s/.test(it.text)) text += ' ';
      text += it.text;
      end = it.x + it.width;
    }
    text = text.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const row = { page: pi + 1, x: Math.round(its[0].x), top: Math.round(its[0].top), size: its[0].size, font: its[0].font, text };
    pageRows.push(row);
    out.push(`[x=${String(row.x).padStart(3)} y=${String(row.top).padStart(3)} sz=${String(row.size).padStart(5)} f=${row.font}] ${text}`);
  }
  structured.push(pageRows);
}

writeFileSync(process.argv[3], out.join('\n'), 'utf8');
writeFileSync(process.argv[3].replace(/\.txt$/, '.json'), JSON.stringify(structured, null, 1), 'utf8');
console.log(`pages=${pages.length} fonts=${fontMaps.size} rows=${out.length}`);
