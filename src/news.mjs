// The Dispatch: daily articles. Each article is a Markdown file in news/ named YYYY-MM-DD-slug.md, with a header:
//
//   ---
//   title: The headline
//   dek: One sentence that says what the reader learns.
//   date: 2026-10-25
//   topic: ai | tools | skills | cyber | industry
//   tags: Claude, agents, MCP
//   sources:
//     - Source name | https://example.com/page
//   ---
//   Body in Markdown: ## and ### headings, paragraphs, - and 1. lists, > quotes, **bold**, *italic*, `code`, [links](url),
//   and ``` code blocks.
//
// This file turns them into data, HTML and cover art. build.mjs writes the pages.
import { readdirSync, readFileSync, existsSync } from 'node:fs';

export const TOPICS = {
  ai: { name: 'AI', hue: '#e8b64c', deep: '#3a2a08' },
  tools: { name: 'AI tools', hue: '#74d6bb', deep: '#0d3a30' },
  skills: { name: 'Skills', hue: '#8fa2ff', deep: '#18224f' },
  cyber: { name: 'Cyber', hue: '#ff6b6b', deep: '#3d1016' },
  industry: { name: 'Industry', hue: '#c59bff', deep: '#2a1748' }
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function parseHeader(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = { sources: [] };
  let inSources = false;
  for (const line of m[1].split(/\r?\n/)) {
    if (/^sources:\s*$/.test(line)) { inSources = true; continue; }
    const src = /^\s+-\s+(.*?)\s*\|\s*(https?:\/\/\S+)\s*$/.exec(line);
    if (inSources && src) { meta.sources.push({ name: src[1], url: src[2] }); continue; }
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (kv) { inSources = false; meta[kv[1]] = kv[2].trim(); }
  }
  meta.tags = (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  return { meta, body: m[2] };
}

// Inline Markdown: code first (so nothing inside it is touched), then links, bold, italic.
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, t, u) => `<a href="${u}" rel="noopener">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
}

export function markdown(md) {
  const out = [];
  const lines = md.replace(/\r/g, '').split('\n');
  let para = [], list = null, quote = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; } };
  const flushQuote = () => { if (quote.length) { out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`); quote = []; } };
  const flush = () => { flushPara(); flushList(); flushQuote(); };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^```/.test(l)) {
      flush(); const code = [];
      while (++i < lines.length && !/^```/.test(lines[i])) code.push(lines[i]);
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); continue;
    }
    let m;
    if (!l.trim()) { flush(); continue; }
    // A figure: ![alt](media/news/slug/file.webp "Caption. Credit: Name, licence") on a line of its own.
    if ((m = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/.exec(l))) {
      flush();
      const src = /^https?:\/\//.test(m[2]) ? m[2] : '../../' + m[2].replace(/^\/+/, '');
      out.push(`<figure class="fig"><img src="${esc(src)}" alt="${esc(m[1])}" loading="lazy" decoding="async">${m[3] ? `<figcaption>${inline(m[3])}</figcaption>` : ''}</figure>`);
      continue;
    }
    if ((m = /^(#{2,3})\s+(.*)$/.exec(l))) { flush(); const n = m[1].length; out.push(`<h${n}>${inline(m[2])}</h${n}>`); continue; }
    if ((m = /^>\s?(.*)$/.exec(l))) { flushPara(); flushList(); quote.push(m[1]); continue; }
    if ((m = /^\s*[-*]\s+(.*)$/.exec(l)) || (m = /^\s*\d+\.\s+(.*)$/.exec(l))) {
      flushPara(); flushQuote();
      const tag = /^\s*\d+\./.test(l) ? 'ol' : 'ul';
      if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push(m[1]); continue;
    }
    flushList(); flushQuote(); para.push(l.trim());
  }
  flush();
  return out.join('\n');
}

export function loadArticles(dir = 'news') {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(f)).map((f) => {
    const { meta, body } = parseHeader(readFileSync(`${dir}/${f}`, 'utf8'));
    const slug = f.replace(/\.md$/, '').slice(11);
    const words = body.split(/\s+/).filter(Boolean).length;
    return {
      file: f, slug, date: meta.date || f.slice(0, 10), title: meta.title || slug, dek: meta.dek || '',
      topic: TOPICS[meta.topic] ? meta.topic : 'ai', tags: meta.tags, sources: meta.sources, html: markdown(body),
      minutes: Math.max(1, Math.round(words / 230))
    };
  }).filter((a) => a.date <= new Date().toISOString().slice(0, 10)).sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));
}

export function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Cover art, drawn from the slug so each article gets its own: a deep gradient in the topic colour, a perspective
// grid, a soft glow and one motif per topic. Pure SVG, so it is sharp at every size and costs a few kilobytes.
function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }

export function cover(a, { id = a.slug } = {}) {
  const t = TOPICS[a.topic], r = rng(a.slug), hue = t.hue, deep = t.deep;
  const gx = 900 + r() * 500, gy = 120 + r() * 260;
  const grid = [];
  for (let i = 0; i <= 16; i++) { const x = i * 100; grid.push(`<line x1="${x}" y1="900" x2="${800 + (x - 800) * 0.18}" y2="560"/>`); }
  for (let i = 0; i < 7; i++) { const y = 560 + Math.pow(i / 6, 1.8) * 340; grid.push(`<line x1="0" y1="${y.toFixed(1)}" x2="1600" y2="${y.toFixed(1)}"/>`); }
  const motes = Array.from({ length: 26 }, () => `<rect x="${(r() * 1600).toFixed(0)}" y="${(r() * 560).toFixed(0)}" width="${r() < .3 ? 8 : 4}" height="${r() < .3 ? 8 : 4}" opacity="${(0.2 + r() * 0.6).toFixed(2)}"/>`).join('');
  let motif = '';
  if (a.topic === 'ai') {
    const nodes = Array.from({ length: 9 }, (_, i) => [gx + Math.cos(i * 0.7 + r()) * (80 + r() * 200), gy + 120 + Math.sin(i * 0.9 + r()) * (60 + r() * 120)]);
    motif = nodes.map((n, i) => nodes.slice(i + 1, i + 3).map((m) => `<line x1="${n[0].toFixed(0)}" y1="${n[1].toFixed(0)}" x2="${m[0].toFixed(0)}" y2="${m[1].toFixed(0)}"/>`).join('')).join('')
      + nodes.map((n) => `<circle cx="${n[0].toFixed(0)}" cy="${n[1].toFixed(0)}" r="${(5 + r() * 9).toFixed(0)}" fill="${hue}" stroke="none"/>`).join('')
      + `<circle cx="${gx.toFixed(0)}" cy="${(gy + 120).toFixed(0)}" r="230" opacity=".35"/><circle cx="${gx.toFixed(0)}" cy="${(gy + 120).toFixed(0)}" r="150" opacity=".5"/>`;
  } else if (a.topic === 'cyber') {
    const cx = gx, cy = gy + 110;
    motif = `<path d="M${cx} ${cy - 170} L${cx + 140} ${cy - 110} V${cy + 10} C${cx + 140} ${cy + 110} ${cx + 60} ${cy + 170} ${cx} ${cy + 200} C${cx - 60} ${cy + 170} ${cx - 140} ${cy + 110} ${cx - 140} ${cy + 10} V${cy - 110} Z" stroke-width="5"/>`
      + Array.from({ length: 8 }, (_, i) => `<line x1="${cx - 300}" y1="${cy - 160 + i * 48}" x2="${cx + 300 + r() * 200}" y2="${cy - 160 + i * 48}" stroke-dasharray="${(6 + r() * 30).toFixed(0)} ${(10 + r() * 40).toFixed(0)}" opacity=".45"/>`).join('')
      + `<rect x="${cx - 34}" y="${cy - 20}" width="68" height="60" rx="6" fill="${hue}" stroke="none"/><path d="M${cx - 22} ${cy - 20} v-22 a22 22 0 0 1 44 0 v22" stroke-width="9"/>`;
  } else if (a.topic === 'tools' || a.topic === 'skills') {
    const s = 54, rows = 4, cols = 6;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const px = gx - 280 + x * s * 1.75 + (y % 2) * s * 0.87, py = gy + y * s * 1.5;
      const on = r() < 0.28;
      motif += `<polygon points="${[0, 1, 2, 3, 4, 5].map((k) => `${(px + s * Math.cos(Math.PI / 3 * k + Math.PI / 6)).toFixed(0)},${(py + s * Math.sin(Math.PI / 3 * k + Math.PI / 6)).toFixed(0)}`).join(' ')}"${on ? ` fill="${hue}" fill-opacity=".85"` : ''} opacity="${on ? 1 : .5}"/>`;
    }
  } else {
    let x = gx - 360; const base = gy + 330;
    for (let i = 0; i < 9; i++) { const h = 60 + r() * 260; motif += `<rect x="${x.toFixed(0)}" y="${(base - h).toFixed(0)}" width="46" height="${h.toFixed(0)}"${i === 6 ? ` fill="${hue}"` : ''}/>`; x += 74; }
    motif += `<polyline points="${Array.from({ length: 10 }, (_, i) => `${(gx - 380 + i * 80).toFixed(0)},${(gy + 80 + Math.sin(i * 0.9 + r() * 2) * 70 - i * 18).toFixed(0)}`).join(' ')}" stroke-width="6"/>`;
  }
  return `<svg class="cover" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(t.name)} cover art" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0e26"/><stop offset=".55" stop-color="${deep}"/><stop offset="1" stop-color="#090b1f"/></linearGradient>
<radialGradient id="r-${id}" cx="${(gx / 1600).toFixed(2)}" cy="${(gy / 900 + 0.12).toFixed(2)}" r=".55"><stop offset="0" stop-color="${hue}" stop-opacity=".55"/><stop offset="1" stop-color="${hue}" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#g-${id})"/><rect width="1600" height="900" fill="url(#r-${id})"/>
<g stroke="${hue}" stroke-opacity=".22" stroke-width="2">${grid.join('')}</g>
<g fill="${hue}">${motes}</g>
<g fill="none" stroke="${hue}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${motif}</g>
</svg>`;
}
