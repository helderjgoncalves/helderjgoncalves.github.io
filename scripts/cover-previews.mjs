// Writes each trip cover's `preview` into src/data/photos.ts: the cover at
// 32 px, as an inline JPEG, which the trip hero shows blurred until the photo
// itself arrives (an AVIF draws nothing until it has fully downloaded).
//
// Run by hand when a trip's cover changes, like `npm run cards`; the build
// throws while a cover has no preview. Uses macOS's sips and exiftool.
//
// Usage: npm run previews

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tripsDir = path.join(projectRoot, 'src/data/trips');
const photosFile = path.join(projectRoot, 'src/data/photos.ts');
const SRGB = '/System/Library/ColorSync/Profiles/sRGB Profile.icc';

const covers = new Set();
for (const file of fs.readdirSync(tripsDir)) {
  const match = fs.readFileSync(path.join(tripsDir, file), 'utf-8').match(/cover:\s*\{\s*photo:\s*photos\.(\w+)/);
  if (match) covers.add(match[1]);
}

let source = fs.readFileSync(photosFile, 'utf-8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cover-preview-'));

for (const key of covers) {
  const block = source.match(new RegExp(`\\n  ${key}: \\{\\n[\\s\\S]*?\\n  \\},`));
  if (!block) throw new Error(`photos.${key} not found in photos.ts`);
  const src = block[0].match(/src: '([^']+)'/)[1];
  // 2048/ holds a copy for every photo, lowRes and samples included; sRGB, as
  // the preview carries no profile.
  const input = path.join(projectRoot, 'public', src.replace('/800/', '/2048/'));
  const out = path.join(tmp, `${key}.jpg`);
  execFileSync('sips', ['-m', SRGB, '-s', 'format', 'jpeg', '-s', 'formatOptions', '40', '-Z', '32', input, '--out', out], {
    stdio: 'ignore',
  });
  execFileSync('exiftool', ['-q', '-q', '-overwrite_original', '-all=', out]);
  const line = `    preview: 'data:image/jpeg;base64,${fs.readFileSync(out).toString('base64')}',`;

  const updated = /\n    preview: '[^']*',/.test(block[0])
    ? block[0].replace(/\n    preview: '[^']*',/, () => `\n${line}`)
    : block[0].replace(/\n  \},$/, () => `\n${line}\n  },`);
  source = source.replace(block[0], () => updated);
  console.log(`✓ photos.${key} (${fs.statSync(out).size} bytes)`);
}

fs.writeFileSync(photosFile, source);
fs.rmSync(tmp, { recursive: true, force: true });
