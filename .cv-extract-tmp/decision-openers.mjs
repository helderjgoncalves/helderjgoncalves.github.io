// Scratch check: does each decision open by asserting the design, or by
// setting up a problem first? The list reads as a set of claims, so an entry
// that opens on a constraint breaks the pattern.
import fs from 'node:fs';

const src = fs.readFileSync('src/data/homelab.ts', 'utf8');
const block = src.match(/decisions: \[([\s\S]*?)\n {2}\],/)[1];
const items = [...block.matchAll(/title: '(.*?)',\n\s*description:\s*\n?\s*'([\s\S]*?)',\n/g)];

for (const [, title, description] of items) {
  const opener = description.split(/[,.;]/)[0];
  console.log(`${title.padEnd(28)} | ${opener.slice(0, 58)}`);
}
