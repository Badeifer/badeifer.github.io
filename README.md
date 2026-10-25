# badeifer.github.io

Badeifer's product site: projects, previews, setup guides and support links. Served by GitHub Pages from `main` at https://badeifer.github.io.

## Change something

1. Edit `src/site.mjs`. Every word on the site and every project lives there.
2. Run `node build.mjs`. It writes `index.html` and `p/<slug>/index.html`.
3. Commit the source and the built pages together, then push.

## Add a project

Add an entry to `projects` in `src/site.mjs` with a `shelf` (edge, obsidian, streamdeck, claude), put its pictures in `media/`
with their real pixel sizes in `w` and `h`, and rebuild. Set `links.repo` only for a public repo, and `links.store` once it is on
Elgato Marketplace. `status` is `free`, `paid` (add `price`), `soon` or `workshop`.

## Edit the toolbox

The Toolbox section lists hardware, apps and add-ons in use, from `toolbox` in `src/site.mjs`. Add or remove an item there and rebuild. Only list what is really in use; no affiliate links.

## Turn on tips

Paste a public receiving address into `tips` in `src/site.mjs` (use a wallet kept only for tips) and rebuild. The Support section then shows it with a Copy button; with no address it shows one quiet line.

## The Dispatch (news)

Articles are Markdown files in `news/` named `YYYY-MM-DD-slug.md`; the header format is at the top of `src/news.mjs`. `node build.mjs` writes `news/index.html`, one page per article, `news/feed.xml` (RSS) and the home page strip. Covers are drawn from the slug; run `node tools/og.mjs --news` for the share cards. A daily job writes one article, following `tools/dispatch-job.md`.

## Share cards

Link previews (Discord, X, iMessage) use designed 1200x630 cards in `media/og/`. After changing a name, tagline or picture, run `node tools/og.mjs` (needs Chrome and ffmpeg), then `node build.mjs`.

## Preview

```
npx -y http-server@14.1.1 -p 8137 -c-1 .
```

Then open http://localhost:8137.

Fonts: Chakra Petch for headings and Atkinson Hyperlegible Next for text, both from Google Fonts.
