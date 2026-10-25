// Link-preview cards (Open Graph, 1200x630) for the home page and every project, rendered with local Chrome.
// Run after changing names, taglines or media: node tools/og.mjs   (then node build.mjs and push)
// Writes media/og/home.jpg and media/og/<slug>.jpg. Needs Chrome and ffmpeg on this PC; the site build does not.
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { site, shelves, projects } from '../src/site.mjs';
import { loadArticles, cover, prettyDate, TOPICS } from '../src/news.mjs';
const newsOnly = process.argv.includes('--news');   // the daily Dispatch job only needs the news cards

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'media', 'og');
const tmp = join(tmpdir(), 'bade-og');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync(out, { recursive: true }); mkdirSync(tmp, { recursive: true });

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const file = (p) => pathToFileURL(join(root, p)).href;

const css = `
@font-face { font-family: Atk; font-weight: 200 800; src: url(${file('assets/fonts/atkinson-hyperlegible-next.woff2')}); }
@font-face { font-family: Chakra; font-weight: 600; src: url(${file('assets/fonts/chakra-petch-600.woff2')}); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { font-family: Atk, sans-serif; color: #ede6d3; padding: 44px 52px;
  background: radial-gradient(900px 500px at 92% -10%, rgba(232,182,76,.16), transparent 60%),
              radial-gradient(700px 420px at -10% 110%, rgba(92,102,179,.28), transparent 60%), #141833;
  display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 14px; font-family: Chakra; font-size: 30px; }
.brand img { width: 46px; height: 46px; image-rendering: pixelated; }
.brand .url { margin-left: auto; font-family: Atk; font-size: 20px; color: #a9aecf; font-weight: 600; }
h1 { font-family: Chakra; font-weight: 600; letter-spacing: -.01em; line-height: 1.04; }
.tag { color: #a9aecf; font-size: 26px; line-height: 1.35; }
.kind { display: inline-flex; gap: 12px; align-items: center; font-size: 20px; font-weight: 700; color: #e8b64c; }
.kind span { padding: 3px 12px; box-shadow: 0 -2px 0 0 #e8b64c, 0 2px 0 0 #e8b64c, -2px 0 0 0 #e8b64c, 2px 0 0 0 #e8b64c; }
.chips { display: flex; gap: 14px; flex-wrap: wrap; }
.chips span { font-size: 19px; font-weight: 700; padding: 5px 14px; color: #ede6d3;
  box-shadow: 0 -3px 0 0 #5c66b3, 0 3px 0 0 #5c66b3, -3px 0 0 0 #5c66b3, 3px 0 0 0 #5c66b3; }
.pix { box-shadow: 0 -5px 0 0 #5c66b3, 0 5px 0 0 #5c66b3, -5px 0 0 0 #5c66b3, 5px 0 0 0 #5c66b3; background: #000; }
.pix img { display: block; width: 100%; height: 100%; object-fit: contain; }
.edge { background: #050507; border-radius: 12px; padding: 10px; box-shadow: 0 0 0 1px #2a2a30, 0 30px 50px -24px rgba(0,0,0,.7); }
.edge .screen { display: flex; gap: 6px; background: #000; padding: 5px; border-radius: 4px; }
.edge .screen img { height: 100%; border-radius: 9px; display: block; }
`;

function page(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="brand"><img src="${file('assets/avatar.svg')}" alt=""><span>${esc(site.name)}</span><span class="url">badeifer.github.io</span></div>
${body}</body></html>`;
}

function shoot(name, html) {
  const h = join(tmp, name + '.html'), png = join(tmp, name + '.png'), jpg = join(out, name + '.jpg');
  writeFileSync(h, html);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    `--user-data-dir=${join(tmp, 'profile')}`, '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, pathToFileURL(h).href], { stdio: 'ignore' });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-q:v', '3', jpg]);
  console.log('og/' + name + '.jpg');
}

// Home: the promise, what is inside, and the real widgets on an Edge.
const chips = shelves.filter((s) => projects.some((p) => p.shelf === s.id)).map((s) => `<span>${esc(s.name)}</span>`).join('');
if (!newsOnly) shoot('home', page(`
<h1 style="font-size:58px;margin-top:26px;max-width:1000px">${esc(site.headline)}</h1>
<div class="chips" style="margin-top:22px">${chips}</div>
<div class="edge" style="margin-top:auto;align-self:center;width:1000px">
  <div class="screen" style="height:248px">
    <img src="${file('media/claude-1688.webp')}" style="flex:1688 1 0" alt="">
    <img src="${file('media/printmon-840.webp')}" style="flex:840 1 0" alt="">
  </div>
</div>`));

// One card per project: wide widget renders sit on an Edge under the text; other media sits beside it.
for (const p of newsOnly ? [] : projects) {
  const m = p.media[0];
  const src = m ? (m.video ? m.poster : m.src) : null;
  const wide = m && m.w / m.h > 2;
  const shelf = shelves.find((s) => s.id === p.shelf);
  const head = `<div class="kind" style="margin-top:28px"><span>${esc(p.kind)}</span></div>`;
  let body;
  if (wide) {
    body = `${head}
<h1 style="font-size:56px;margin-top:12px">${esc(p.name)}</h1>
<p class="tag" style="margin-top:6px;max-width:1080px;font-size:23px">${esc(p.tagline)}</p>
<div class="edge" style="margin-top:auto;align-self:center;width:${Math.round(262 * m.w / m.h) + 30}px"><div class="screen" style="height:262px"><img src="${file('media/' + src)}" style="width:100%" alt=""></div></div>`;
  } else if (src) {
    body = `<div style="display:flex;gap:44px;flex:1;align-items:center;margin-top:8px">
  <div style="flex:0 0 430px">${head.replace('margin-top:28px', 'margin-top:0')}
    <h1 style="font-size:58px;margin-top:14px">${esc(p.name)}</h1>
    <p class="tag" style="margin-top:14px">${esc(p.tagline)}</p></div>
  <div class="pix" style="flex:1;aspect-ratio:${m.w} / ${m.h};max-height:440px"><img src="${file('media/' + src)}" alt=""></div>
</div>`;
  } else {
    body = `<img src="${file('assets/avatar.svg')}" alt="" style="position:absolute;right:60px;bottom:50px;width:300px;height:300px;image-rendering:pixelated;opacity:.92">
${head}
<h1 style="font-size:84px;margin-top:20px;max-width:760px">${esc(p.name)}</h1>
<p class="tag" style="margin-top:18px;max-width:720px;font-size:32px">${esc(p.tagline)}</p>
<p class="tag" style="margin-top:auto">${esc(shelf ? shelf.name : '')}</p>`;
  }
  shoot(p.slug, page(body));
}
// The Dispatch: one card for the index and one per article, on the article's own cover art.
const articles = loadArticles(join(root, 'news'));
const newsCard = (a, title, sub) => page(`
<div style="position:absolute;inset:0;z-index:-1">${cover(a, { id: 'og' + a.slug }).replace('class="cover"', 'style="width:100%;height:100%"')}</div>
<div style="position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(11,14,38,.94) 0%,rgba(11,14,38,.78) 48%,rgba(11,14,38,.1) 100%)"></div>
<p style="margin-top:34px;font-size:22px;font-weight:700;color:${TOPICS[a.topic].hue}">The Dispatch</p>
<h1 style="font-size:${title.length > 70 ? 50 : 58}px;margin-top:12px;max-width:820px">${esc(title)}</h1>
<p class="tag" style="margin-top:auto;font-size:22px">${esc(sub)}</p>`);
if (articles.length) {
  shoot('news', newsCard(articles[0], 'The Dispatch: daily AI, tools, skills and cyber briefings', `Latest: ${articles[0].title}`));
  for (const a of articles) {
    if (newsOnly && existsSync(join(out, `news-${a.slug}.jpg`))) continue;
    shoot(`news-${a.slug}`, newsCard(a, a.title, `${TOPICS[a.topic].name}  |  ${prettyDate(a.date)}  |  ${a.minutes} min read`));
  }
}
if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });
