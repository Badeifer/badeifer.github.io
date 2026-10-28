# Dispatch video job

`.github/workflows/dispatch-video.yml` runs daily at 15:40 UTC (25 minutes after the Dispatch routine). It starts the Dispatch
video agent (a Claude Managed Agent, brief in the private repo Badeifer/video-explainer), waits for it, and unpacks the
archive it hands back into `media/news/<slug>/` and `media/social/<date>-<slug>/`. The agent never gets write access; this job
validates every path, rebuilds the site, keeps the newest 14 social cuts and pushes with the workflow's own token.

`run.mjs` and `state.json` are copies from video-explainer (`node setup.mjs` there refreshes them). `state.json` holds ids only.
Needs the repo secret `ANTHROPIC_API_KEY`. Manual run: Actions, "Dispatch video", Run workflow (optionally a slug).
