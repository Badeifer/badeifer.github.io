// Builds the static site from src/site.mjs: index.html and one page per project in p/<slug>/index.html.
// Run: node build.mjs
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { site, shelves, projects, statusLabel, toolbox, toolboxIntro, widgetPermissions } from './src/site.mjs';
import { loadArticles, cover, prettyDate, TOPICS } from './src/news.mjs';

const articles = loadArticles();

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const year = new Date().getFullYear();

// Share previews use the designed cards from tools/og.mjs (media/og/*.jpg, 1200x630) and a short title.
function head({ title, description, root, path, image = 'media/claude-l.webp', jsonld, share, shareTitle }) {
  const url = site.url + path;
  const card = share && existsSync(share) ? share : 'media/og/home.jpg';
  const ogTitle = shareTitle || title;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(site.url)}/${esc(card)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogTitle)}: ${esc(description)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(site.url)}/${esc(card)}">
<meta name="theme-color" content="#141833">
<link rel="icon" href="${root}assets/avatar.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${root}media/avatar-512.png">
<link rel="preload" href="${root}assets/fonts/atkinson-hyperlegible-next.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/chakra-petch-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}assets/site.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
<script>try{var t=new URLSearchParams(location.search).get('theme')||localStorage.getItem('theme');document.documentElement.dataset.theme=t==='day'?'day':'night'}catch(e){}</script>
</head>`;
}

function topbar(root) {
  const nav = shelves.map((s) => `<a href="${root}#${s.id}">${esc(s.nav)}</a>`).join('');
  return `<header class="top">
  <a class="mark" href="${root}"><img src="${root}assets/avatar.svg" alt="" width="40" height="40">${esc(site.name)}</a>
  <nav class="nav" aria-label="Sections"><a href="${root}news/">News</a>${nav}<a href="${root}#toolbox">Toolbox</a><a href="${root}#support">Support</a></nav>
  <div class="theme" role="group" aria-label="Colour mode">
    <button type="button" data-mode="night" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>Night</button>
    <button type="button" data-mode="day" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path stroke="currentColor" stroke-width="2.2" stroke-linecap="square" d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></svg>Day</button>
  </div>
</header>`;
}

function footer(root) {
  return `<footer class="foot">
  <p>${esc(site.name)}, ${year}. Updates and issues on <a href="${esc(site.github)}">GitHub</a>. Stuck? <a href="${root}#help">Get help</a>.</p>
  <p class="fine">Privacy: no cookies, no analytics, nothing loaded from other sites. Your Night or Day choice is saved in your own browser. The site is hosted on GitHub Pages, which keeps standard server logs under <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub's privacy statement</a>.</p>
  <p class="fine">Corsair, iCUE, Xeneon, Elgato, Stream Deck, NVIDIA, Obsidian and Claude are trademarks of their owners. These are independent projects, not made by or endorsed by them.</p>
</footer>
<script src="${root}assets/site.js" defer></script>
</body>
</html>`;
}

// The picture that stands for a project in a shelf, a share card and search results: the one marked cover, else the first.
const leadMedia = (p) => p.media.find((m) => m.cover) || p.media[0];

const badge = (p) => `<span class="badge s-${p.status}">${esc(p.status === 'paid' && p.price ? p.price : statusLabel[p.status])}</span>`;

function getButtons(p, root) {
  const out = [];
  if (p.links?.store) out.push(`<a class="btn primary" href="${esc(p.links.store)}">${p.status === 'paid' ? 'Buy on Elgato Marketplace' : 'Get it on Elgato Marketplace'}</a>`);
  if (p.links?.download) out.push(`<a class="btn" href="${esc(p.links.download)}">Download</a>`);
  if (p.links?.repo) out.push(`<a class="btn" href="${esc(p.links.repo)}">Source on GitHub</a>`);
  return out.join('');
}

// A framed picture or a looping silent clip (m.video). The lead item on a project page loads first, the rest lazily.
function frame(m, root, cls = '') {
  const lead = cls.includes('lead');
  const media = m.video
    ? `<video src="${root}media/${esc(m.src)}" poster="${root}media/${esc(m.poster)}" width="${m.w}" height="${m.h}" autoplay muted loop playsinline preload="${lead ? 'auto' : 'metadata'}" aria-label="${esc(m.alt)}"></video>`
    : `<img src="${root}media/${esc(m.src)}" alt="${esc(m.alt)}" width="${m.w}" height="${m.h}"${lead ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  return `<figure class="pix ${cls}">${media}</figure>`;
}

// One shelf entry. When every project on the shelf shares a status, the shelf heading shows it once (sharedStatus).
function listing(p, root, sharedStatus) {
  const m = leadMedia(p);
  const more = p.status === 'workshop' ? `See how ${esc(p.name)} works` : `Set up ${esc(p.name)}`;
  return `<article class="item${m ? '' : ' no-art'}">
  ${m ? `<a class="item-art" href="${root}p/${p.slug}/" tabindex="-1" aria-hidden="true">${frame(m, root)}</a>` : ''}
  <div class="item-text">
    <h3><a href="${root}p/${p.slug}/">${esc(p.name)}</a></h3>
    <p class="kind">${esc(p.kind)}${sharedStatus ? '' : ' ' + badge(p)}</p>
    <p>${esc(p.tagline)}</p>
    <p class="more"><a href="${root}p/${p.slug}/">${more}</a></p>
  </div>
</article>`;
}

// Each page shows one widget alone at Extra Large, the full width of the Edge; a phone gets its Large render instead.
function edgeHero(root) {
  const pages = ['claude-usage', 'prompt-cache', 'pets', 'universal-repo-sync', 'print-monitor', 'phosphor', 'nvidia-deck', 'needs-you', 'vela', 'agent-home-scene']
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((p) => ({ label: { 'universal-repo-sync': 'Repo Sync', 'agent-home-scene': 'Agent Home' }[p.slug] || p.name, xl: p.media.find((m) => m.size === 'Extra Large'), l: p.media.find((m) => m.size === 'Large') }))
    .filter((pg) => pg.xl && pg.l);
  const screens = pages.map((pg, i) => `<div class="edge-page" role="tabpanel" id="edge-p${i}" aria-labelledby="edge-t${i}"${i ? ' hidden' : ''}><picture class="slot"><source media="(max-width: 640px)" srcset="${root}media/${pg.l.src}" width="${pg.l.w}" height="${pg.l.h}"><img src="${root}media/${pg.xl.src}" alt="${esc(pg.xl.alt)}" width="${pg.xl.w}" height="${pg.xl.h}"${i ? ' loading="lazy"' : ''}></picture></div>`).join('');
  const tabs = pages.map((pg, i) => `<button type="button" role="tab" id="edge-t${i}" aria-controls="edge-p${i}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${esc(pg.label)}</button>`).join('');
  return `<div class="edge" data-edge>
  <div class="edge-bezel"><div class="edge-screen">${screens}</div></div>
  <div class="edge-stand" aria-hidden="true"></div>
  <div class="edge-nav">
    <button class="edge-arrow" type="button" data-step="-1" aria-label="Previous page"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" d="M15 4l-8 8 8 8"/></svg></button>
    <p class="edge-count" aria-live="polite"><b data-count>1 / ${pages.length}</b><span data-name>${esc(pages[0].label)}</span></p>
    <button class="edge-arrow" type="button" data-step="1" aria-label="Next page"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" d="M9 4l8 8-8 8"/></svg></button>
  </div>
  <p class="edge-hint"><svg viewBox="0 0 40 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" d="M7 3L2 8l5 5M33 3l5 5-5 5M2 8h36"/></svg>${esc(site.caption)}</p>
  <div class="edge-tabs" role="tablist" aria-label="Pages on the Edge">${tabs}</div>
</div>`;
}

function supportBlock(root) {
  const tips = site.tips.filter((t) => t.address);
  const store = site.marketplace.live ? `<a class="btn primary" href="${esc(site.marketplace.url)}">Shop on Elgato Marketplace</a>` : '';
  // Nothing to send people to yet: one quiet line instead of disabled buttons.
  if (!tips.length && !store) {
    return `<section class="support quiet" id="support" aria-labelledby="support-h">
  <div class="support-in">
    <h2 id="support-h">Support development</h2>
    <p>Free projects stay free. The Elgato Marketplace store opens soon; <a href="${esc(site.github)}">follow on GitHub</a> to hear when.</p>
  </div>
</section>`;
  }
  const tipRows = tips.map((t) => `<div class="tip">
      <span class="tip-coin">Tip in ${esc(t.coin)}</span>
      <code class="tip-addr" id="tip-${esc(t.coin.toLowerCase())}">${esc(t.address)}</code>
      <button class="btn" type="button" data-copy="tip-${esc(t.coin.toLowerCase())}">Copy address</button>
    </div>`).join('');
  return `<section class="support" id="support" aria-labelledby="support-h">
  <div class="support-in">
    <h2 id="support-h">Support development</h2>
    <p>Free projects stay free. Tips${store ? ' and purchases on Elgato Marketplace' : ''} fund new widgets, plugins and updates.</p>
    ${store ? `<div class="row">${store}</div>` : ''}
    ${tipRows ? `<div class="tips">${tipRows}</div><p class="tip-note">Send each coin only to its own address, on its own network. Crypto transfers cannot be reversed.</p>` : ''}
  </div>
</section>`;
}
function toolboxBlock() {
  const groups = toolbox.map((g) => `<div class="tool-group">
    <h3 id="tb-${g.id}">${esc(g.name)}</h3>
    <ul class="tools" aria-labelledby="tb-${g.id}">${g.items.map((t) => `<li>${t.url
      ? `<a class="tool-name" href="${esc(t.url)}" rel="noopener">${esc(t.name)}</a>`
      : `<span class="tool-name">${esc(t.name)}</span>`}<span class="tool-note">${esc(t.note)}</span></li>`).join('')}</ul>
  </div>`).join('');
  return `<section class="shelf toolbox" id="toolbox" aria-labelledby="toolbox-h">
  <div class="shelf-head"><h2 id="toolbox-h">Toolbox</h2><p>${esc(toolboxIntro)}</p></div>
  <div class="tool-groups">${groups}</div>
</section>`;
}

function indexPage() {
  const root = '';
  const shelvesHtml = shelves.map((s) => {
    const items = projects.filter((p) => p.shelf === s.id);
    const shared = items.length > 1 && items.every((p) => p.status === items[0].status) ? items[0] : null;
    const body = items.length ? `<div class="items">${items.map((p) => listing(p, root, !!shared)).join('')}</div>` : `<div class="empty"><p>${esc(s.empty || 'Nothing here yet.')}</p><div class="row"><a class="btn" href="${esc(site.github)}">Follow on GitHub</a></div></div>`;
    return `<section class="shelf" id="${s.id}" aria-labelledby="${s.id}-h">
  <div class="shelf-head"><h2 id="${s.id}-h">${esc(s.name)}${shared ? ' ' + badge(shared) : ''}</h2><p>${esc(s.blurb)}</p></div>
  ${body}
</section>`;
  }).join('\n');

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': site.url + '/#site', url: site.url + '/', name: site.name, description: site.intro, publisher: { '@id': site.url + '/#org' } },
      { '@type': 'Organization', '@id': site.url + '/#org', name: site.name, url: site.url + '/', logo: site.url + '/media/avatar-512.png', sameAs: [site.github] },
      { '@type': 'ItemList', name: 'Projects', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/p/${p.slug}/`, name: p.name })) }
    ]
  };
  return `${head({ title: site.pageTitle, description: site.intro, root, path: '/', jsonld, share: 'media/og/home.jpg', shareTitle: `${site.name}: ${site.headline}` })}
<body>
<a class="skip" href="#main">Skip to content</a>
${topbar(root)}
<main id="main">
<section class="hero" aria-labelledby="hero-h">
  <h1 id="hero-h">${esc(site.headline)}</h1>
  <p class="lede">${esc(site.intro)}</p>
  ${edgeHero(root)}
</section>
${newsStrip(root)}
${shelvesHtml}
${toolboxBlock()}
<section class="shelf help" id="help" aria-labelledby="help-h">
  <div class="shelf-head"><h2 id="help-h">Help</h2><p>Stuck on a step, or found a bug? Here is where to go.</p></div>
  <dl class="help-list">${site.help.map((h) => `<div><dt>${esc(h.title)}</dt><dd>${esc(h.text)}</dd><dd class="help-link"><a href="${esc(h.url)}">${esc(h.link)}</a></dd></div>`).join('')}</dl>
</section>
${supportBlock(root)}
</main>
${footer(root)}`;
}

// What the widget asks iCUE for, in plain English: what it does and why it matters.
function permissionsBlock(p) {
  const list = widgetPermissions[p.slug];
  if (!list) return '';
  return `<section class="perms" aria-labelledby="perms-h">
    <h2 id="perms-h">Permissions</h2>
    <p class="note">iCUE asks you to approve these when you install. Here is what each one is for. Everything stays on this PC unless a line says otherwise.</p>
    <dl class="perm-list">${list.map((x) => `<div class="perm"><dt>${esc(x.name)} <code>${esc(x.detail)}</code></dt><dd><span class="perm-what">${esc(x.what)}</span> <span class="perm-why"><b>Why:</b> ${esc(x.why)}</span></dd></div>`).join('')}</dl>
  </section>`;
}

// A widget at every slot it fits, smallest first, drawn to scale against the widest slot so a buyer can see what fits.
function sizesGallery(p, root) {
  const widest = Math.max(...p.media.map((m) => m.w));
  return `<section class="sizes" aria-labelledby="sizes-h">
    <h2 id="sizes-h">Sizes</h2>
    <p class="note">Every slot on the Xeneon Edge, smallest first, drawn to scale. Pick the one that fits your layout.</p>
    <div class="size-row">${p.media.map((m, i) => `<figure class="size" style="--w:${(m.w / widest).toFixed(4)}"><div class="pix"><img src="${root}media/${esc(m.src)}" alt="${esc(m.alt)}" width="${m.w}" height="${m.h}"${i ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"></div><figcaption><b>${esc(m.size)}</b> ${m.w} x ${m.h}</figcaption></figure>`).join('')}</div>
  </section>`;
}

function projectPage(p) {
  const root = '../../';
  const shelf = shelves.find((s) => s.id === p.shelf);
  const [first, ...rest] = p.media;
  const sized = p.media.length > 0 && p.media.every((m) => m.size);
  const gallery = sized ? sizesGallery(p, root) : first
    ? `<div class="gallery">${frame(first, root, 'lead')}${rest.length ? `<div class="thumbs">${rest.map((m) => frame(m, root)).join('')}</div>` : ''}</div>`
    : '';
  const setup = p.setup.length
    ? `<ol class="steps">${p.setup.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`
    : '';
  const buttons = getButtons(p, root);
  const c = leadMedia(p);
  const image = c ? `media/${c.video ? c.poster : c.src}` : undefined;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.tagline,
    url: `${site.url}/p/${p.slug}/`,
    applicationCategory: p.category || 'UtilitiesApplication',
    operatingSystem: p.os || 'Windows',
    ...(image ? { image: `${site.url}/${image}` } : {}),
    ...(p.status === 'free' ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } : {}),
    ...(p.status === 'paid' && p.priceValue ? { offers: { '@type': 'Offer', price: String(p.priceValue), priceCurrency: 'USD' } } : {}),
    author: { '@type': 'Organization', name: site.name, url: site.url + '/' }
  };
  return `${head({ title: `${p.name}: ${p.kind} by ${site.name}`, description: p.tagline, root, path: `/p/${p.slug}/`, image, jsonld, share: `media/og/${p.slug}.jpg`, shareTitle: `${p.name} | ${site.name}` })}
<body>
<a class="skip" href="#main">Skip to content</a>
${topbar(root)}
<main id="main" class="page">
  <p class="crumb"><a href="${root}#${shelf.id}">${esc(shelf.name)}</a></p>
  <header class="page-head">
    <h1>${esc(p.name)}</h1>
    <p class="kind">${esc(p.kind)} ${badge(p)}</p>
    <p class="lede">${esc(p.tagline)}</p>
    ${p.intro ? `<p class="intro">${esc(p.intro)}</p>` : ''}
    ${buttons ? `<div class="row">${buttons}</div>` : ''}
  </header>
  ${gallery}
  <div class="cols">
    <section aria-labelledby="what-h">
      <h2 id="what-h">What it does</h2>
      <ul class="feats">${p.features.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>
    <aside aria-labelledby="needs-h">
      <h2 id="needs-h">You need</h2>
      <ul class="needs">${p.needs.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </aside>
  </div>
  <section class="setup" aria-labelledby="setup-h">
    <h2 id="setup-h">Set it up</h2>
    ${p.setupNote ? `<p class="note">${esc(p.setupNote)}</p>` : ''}
    ${setup}
  </section>
  ${permissionsBlock(p)}
  ${supportBlock(root)}
</main>
${footer(root)}`;
}

// ---------- The Dispatch: news ----------
const topicChip = (a) => `<span class="topic t-${a.topic}">${esc(TOPICS[a.topic].name)}</span>`;
const byline = `Written with AI for ${site.name}`;

function storyCard(a, root, cls = '') {
  return `<article class="story ${cls}" data-topic="${a.topic}">
  <a class="story-art" href="${root}news/${a.slug}/" tabindex="-1" aria-hidden="true">${cover(a, { id: a.slug + (cls || 'c') })}</a>
  <div class="story-text">
    <h3><a href="${root}news/${a.slug}/">${esc(a.title)}</a></h3>
    <p class="story-dek">${esc(a.dek)}</p>
    <p class="story-meta">${topicChip(a)}<time datetime="${a.date}">${esc(prettyDate(a.date))}</time><span>${a.minutes} min read</span></p>
  </div>
</article>`;
}

function newsStrip(root) {
  if (!articles.length) return '';
  return `<section class="shelf dispatch-strip" id="news" aria-labelledby="news-h">
  <div class="shelf-head"><h2 id="news-h">The Dispatch</h2><p>Daily briefings on AI tools, new skills, cyber and the industry. <a href="${root}news/">All stories</a></p></div>
  <div class="stories">${articles.slice(0, 3).map((a) => storyCard(a, root)).join('')}</div>
</section>`;
}

function newsIndex() {
  const root = '../';
  const [lead, ...rest] = articles;
  const used = [...new Set(articles.map((a) => a.topic))];
  const filters = used.length > 1 ? `<div class="filters" role="group" aria-label="Filter by topic"><button type="button" data-filter="all" aria-pressed="true">All</button>${used.map((t) => `<button type="button" data-filter="${t}" aria-pressed="false">${esc(TOPICS[t].name)}</button>`).join('')}</div>` : '';
  const jsonld = { '@context': 'https://schema.org', '@type': 'Blog', name: `The Dispatch | ${site.name}`, url: `${site.url}/news/`, publisher: { '@type': 'Organization', name: site.name },
    blogPost: articles.slice(0, 20).map((a) => ({ '@type': 'BlogPosting', headline: a.title, datePublished: a.date, url: `${site.url}/news/${a.slug}/` })) };
  return `${head({ title: `The Dispatch | ${site.name}`, description: 'Daily briefings on AI tools, new skills, AI news, cyber and the industry, with every claim linked to its source.', root, path: '/news/', jsonld, share: 'media/og/news.jpg', shareTitle: `The Dispatch | ${site.name}` }).replace('</head>', `<link rel="alternate" type="application/rss+xml" title="The Dispatch" href="${site.url}/news/feed.xml">\n</head>`)}
<body>
<a class="skip" href="#main">Skip to content</a>
${topbar(root)}
<main id="main" class="dispatch">
  <header class="dispatch-head">
    <h1>The Dispatch</h1>
    <p class="lede">Daily briefings on AI tools, new skills, AI news, cyber and the industry. Researched and written with AI, every claim linked to its source.</p>
    <p class="dispatch-links"><a href="${root}news/feed.xml">RSS feed</a></p>
  </header>
  <h2 class="sr-only">Latest stories</h2>
  ${lead ? storyCard(lead, root, 'lead') : '<p class="empty">The first story lands tomorrow morning.</p>'}
  ${filters}
  ${rest.length ? `<div class="stories" id="stories">${rest.map((a) => storyCard(a, root)).join('')}</div>` : ''}
</main>
${footer(root)}`;
}

function articlePage(a, newer, older) {
  const root = '../../';
  const jsonld = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: a.title, description: a.dek, datePublished: a.date, dateModified: a.date,
    url: `${site.url}/news/${a.slug}/`, image: `${site.url}/media/og/news-${a.slug}.jpg`, author: { '@type': 'Organization', name: site.name, url: site.url + '/' },
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: site.url + '/media/avatar-512.png' } }, keywords: a.tags.join(', ') };
  const nav = (x, label) => x ? `<a class="next-story" href="${root}news/${x.slug}/"><span>${label}</span>${esc(x.title)}</a>` : '<span></span>';
  return `${head({ title: `${a.title} | The Dispatch`, description: a.dek, root, path: `/news/${a.slug}/`, jsonld, share: `media/og/news-${a.slug}.jpg`, shareTitle: a.title }).replace('<meta property="og:type" content="website">', `<meta property="og:type" content="article">\n<meta property="article:published_time" content="${a.date}">`)}
<body>
<a class="skip" href="#main">Skip to content</a>
${topbar(root)}
<main id="main" class="article t-${a.topic}">
  <p class="crumb"><a href="${root}news/">The Dispatch</a></p>
  <header class="article-head">
    <h1>${esc(a.title)}</h1>
    <p class="article-dek">${esc(a.dek)}</p>
    <p class="story-meta">${topicChip(a)}<time datetime="${a.date}">${esc(prettyDate(a.date))}</time><span>${a.minutes} min read</span></p>
  </header>
  <div class="article-art">${cover(a, { id: a.slug + 'hero' })}</div>
  <div class="prose">${a.html}</div>
  ${a.sources.length ? `<section class="sources" aria-labelledby="src-h"><h2 id="src-h">Sources</h2><ol>${a.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a></li>`).join('')}</ol></section>` : ''}
  <p class="made">${esc(byline)}. Facts are checked against the sources above on the day of publishing; if one is wrong, <a href="${esc(site.help[0].url)}">open an issue</a>.</p>
  ${a.tags.length ? `<p class="tags">${a.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : ''}
  <nav class="story-nav" aria-label="More stories">${nav(newer, 'Newer')}${nav(older, 'Older')}</nav>
</main>
${footer(root)}`;
}

function rss() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>The Dispatch | ${esc(site.name)}</title><link>${site.url}/news/</link><description>Daily briefings on AI tools, new skills, AI news, cyber and the industry.</description>
<atom:link href="${site.url}/news/feed.xml" rel="self" type="application/rss+xml"/>
${articles.slice(0, 30).map((a) => `<item><title>${esc(a.title)}</title><link>${site.url}/news/${a.slug}/</link><guid>${site.url}/news/${a.slug}/</guid><pubDate>${new Date(a.date + 'T13:00:00Z').toUTCString()}</pubDate><category>${esc(TOPICS[a.topic].name)}</category><description>${esc(a.dek)}</description></item>`).join('\n')}
</channel></rss>
`;
}

// Article sources live in news/*.md; the built pages go to news/<slug>/ and are rebuilt every time.
if (existsSync('news')) {
  for (const d of readdirSync('news', { withFileTypes: true })) if (d.isDirectory()) rmSync(`news/${d.name}`, { recursive: true });
  writeFileSync('news/index.html', newsIndex());
  writeFileSync('news/feed.xml', rss());
  articles.forEach((a, i) => { mkdirSync(`news/${a.slug}`, { recursive: true }); writeFileSync(`news/${a.slug}/index.html`, articlePage(a, articles[i - 1], articles[i + 1])); });
}

if (existsSync('p')) rmSync('p', { recursive: true });
writeFileSync('index.html', indexPage());
for (const p of projects) {
  mkdirSync(`p/${p.slug}`, { recursive: true });
  writeFileSync(`p/${p.slug}/index.html`, projectPage(p));
}

// Renamed projects: the old address forwards to the new page.
const moved = { repos: 'universal-repo-sync' };
for (const [from, to] of Object.entries(moved)) {
  mkdirSync(`p/${from}`, { recursive: true });
  writeFileSync(`p/${from}/index.html`, `<!doctype html><meta charset="utf-8"><title>Moved</title><link rel="canonical" href="${site.url}/p/${to}/"><meta http-equiv="refresh" content="0; url=../${to}/"><a href="../${to}/">This page moved.</a>`);
}

// Search engines: a sitemap of every page, and robots.txt pointing at it.
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', ...(articles.length ? ['/news/', ...articles.map((a) => `/news/${a.slug}/`)] : []), ...projects.map((p) => `/p/${p.slug}/`)];
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nDisallow: /src/\nDisallow: /.impeccable/\n\nSitemap: ${site.url}/sitemap.xml\n`);

// 404: GitHub Pages serves it for any unknown path, so links use absolute paths.
writeFileSync('404.html', `${head({ title: `Page not found | ${site.name}`, description: 'This page does not exist.', root: '/', path: '/404.html' }).replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"')}
<body>
<a class="skip" href="#main">Skip to content</a>
${topbar('/')}
<main id="main" class="page notfound">
  <h1>Page not found</h1>
  <p class="lede">The link may be old, or the project may have moved.</p>
  <div class="row"><a class="btn primary" href="/">Browse all projects</a><a class="btn" href="/#help">Get help</a></div>
</main>
${footer('/')}`);
console.log(`built index.html, ${projects.length} project pages, ${articles.length} news articles, 404.html, sitemap.xml and robots.txt`);
