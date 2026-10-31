# Public repo

Everything here is public, including commit messages and old versions.

- Use only the public names: Bade's Mod Shop and Badeifer. Never write the owner's real name, personal email or local file paths, in files or commit messages.
- `node tools/check-private.mjs` must pass. `node build.mjs` runs it and fails if it does not.
- If it reports a line, remove the detail. Never weaken the check, skip the hooks or add an exception to get past it.
- A new clone needs `git config core.hooksPath .githooks` to turn on the commit hooks.
