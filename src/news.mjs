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
import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { coverPng, COVER_W, COVER_H } from './cover-art.mjs';

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

// The Dispatch video agent drops media/news/<slug>/video.mp4 (+ video-poster.jpg, video.vtt, video.json); no front matter needed.
function videoFor(slug) {
  const dir = `media/news/${slug}`;
  if (!existsSync(`${dir}/video.mp4`)) return null;
  let seconds = 0;
  try { seconds = Math.round(JSON.parse(readFileSync(`${dir}/video.json`, 'utf8')).duration) || 0; } catch { /* the player works without it */ }
  return { src: `${dir}/video.mp4`, poster: existsSync(`${dir}/video-poster.jpg`) ? `${dir}/video-poster.jpg` : null, captions: existsSync(`${dir}/video.vtt`) ? `${dir}/video.vtt` : null, seconds };
}

export function loadArticles(dir = 'news') {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(f)).map((f) => {
    const { meta, body } = parseHeader(readFileSync(`${dir}/${f}`, 'utf8'));
    const slug = f.replace(/\.md$/, '').slice(11);
    const words = body.split(/\s+/).filter(Boolean).length;
    return {
      file: f, slug, date: meta.date || f.slice(0, 10), title: meta.title || slug, dek: meta.dek || '',
      topic: TOPICS[meta.topic] ? meta.topic : 'ai', art: (meta.art || '').split(',').map((t) => t.trim()).filter(Boolean), tags: meta.tags, sources: meta.sources, html: markdown(body),
      minutes: Math.max(1, Math.round(words / 230)), video: videoFor(slug)
    };
  }).filter((a) => a.date <= new Date().toISOString().slice(0, 10)).sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));
}

export function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Cover art: a pixel-art night scene drawn from the slug by cover-art.mjs (one building per topic). writeCovers saves
// them as media/news/covers/<slug>.png at build time; cover() is the <img> for a page at depth `root`.
export function writeCovers(list, dir) {
  mkdirSync(dir, { recursive: true });
  for (const a of list) writeFileSync(join(dir, a.slug + '.png'), coverPng(a.slug, a.topic, TOPICS[a.topic].hue, TOPICS[a.topic].deep, a.art));
}

export function cover(a, root, { lazy = true } = {}) {
  return `<img class="cover" src="${root}media/news/covers/${a.slug}.png" width="${COVER_W}" height="${COVER_H}" alt=""${lazy ? ' loading="lazy"' : ''} decoding="async">`;
}
