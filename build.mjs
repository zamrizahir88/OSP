// Builds the static site: src/pages/*.html are wrapped in src/layout.html and written to the project root.
// Each page starts with a JSON comment: <!-- {"title": "...", "desc": "...", "nav": "services"} -->
// Run: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const layout = fs.readFileSync(path.join(root, 'src/layout.html'), 'utf8');
const pagesDir = path.join(root, 'src/pages');
const cta = fs.readFileSync(path.join(root, 'src/cta.html'), 'utf8');
const fields = { teal: ['f-teal', '#ffffff', '#29708a'], ink: ['f-ink', '#f1f1ee', '#0e1416'] };

for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  const raw = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const match = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  if (!match) throw new Error(`${file}: missing the JSON header comment`);
  const meta = JSON.parse(match[1]);
  const body = raw.slice(match[0].length).trim();

  let html = layout
    .replaceAll('{{title}}', meta.title)
    .replaceAll('{{desc}}', meta.desc)
    .replaceAll('{{file}}', file === 'index.html' ? '' : file)
    .replace('{{content}}', body);

  // inner pages close with the booking band; meta.cta picks its field, false leaves it out
  const band = meta.cta === false ? '' : (() => { const [cls, ink, bg] = fields[meta.cta || 'teal']; return cta.replace('{{ctaField}}', cls).replace('{{ctaInk}}', ink).replace('{{ctaBg}}', bg); })();
  html = html.replace('{{cta}}', band);

  if (meta.nav) html = html.replaceAll(`data-nav="${meta.nav}"`, `data-nav="${meta.nav}" aria-current="page"`);

  fs.writeFileSync(path.join(root, file), html);
  console.log('built', file);
}
