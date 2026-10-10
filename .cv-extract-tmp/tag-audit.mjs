// Scratch check: does every techPill have supporting evidence in the CV body?
// A tag nobody can point at in a bullet trains readers to discount all of them.
import fs from 'node:fs';

const src = fs.readFileSync('src/data/cv.ts', 'utf8');
const body =
  src.match(/groups: \[([\s\S]*?)\n {4}\],\n {4}techPills/)[1] +
  src.match(/paragraphs: \[([\s\S]*?)\n {4}\],/)[1];
const pills = JSON.parse(src.match(/techPills: (\[[^\]]*\])/)[1].replace(/'/g, '"'));

for (const pill of pills) {
  const escaped = pill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const grounded = new RegExp(escaped, 'i').test(body);
  console.log(`${grounded ? '  grounded' : '  ORPHAN  '}  ${pill}`);
}
