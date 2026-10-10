// Scratch check: are the homelab decision descriptions consistent in length?
// One outlier breaks the scannable rhythm of the list.
import fs from 'node:fs';

const src = fs.readFileSync('src/data/homelab.ts', 'utf8');
const block = src.match(/decisions: \[([\s\S]*?)\n {2}\],/)[1];
const items = [...block.matchAll(/title: '(.*?)',\n\s*description:\s*\n?\s*'([\s\S]*?)',\n/g)];

for (const [, title, description] of items) {
  const words = description.split(/\s+/).length;
  const sentences = description.split(/[.;]\s/).length;
  console.log(
    `${String(description.length).padStart(4)} ch  ${String(words).padStart(3)} w  ${sentences} sent   ${title}`,
  );
}
