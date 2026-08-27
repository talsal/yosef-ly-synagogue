---
name: deploy-and-verify
description: Commit, push, and verify any change to the yosef-ly-synagogue site actually went live correctly. Use this after every edit to site content or code, whether it's a data file, a content collection entry, a component, or a page — this is the standard finishing sequence for this project.
---

# Deploy and verify a change

This project has no staging environment and no reliable local build (see
below) — GitHub Actions CI is the only trustworthy build check, and curl/
browser verification against the live URL is the only trustworthy proof a
change actually shipped correctly. Do all of this every time, not just for
"big" changes — small data fixes have broken silently before.

## 1. Review before committing

`git diff <files>` on exactly the files you touched. Never `git add -A` or
`git add .` — stage the specific files you intended to change.

## 2. Commit and push

Write a commit message explaining *why*, not just what, matching the
existing log style. Then `git push`. If `git commit` fails with something
like `fatal: sha1 file .git/index.lock write error: Operation timed out`,
this is a known intermittent issue on this machine under memory pressure —
just re-check `git status` (the lock usually clears itself) and retry the
commit; don't treat it as a real error.

**Do not attempt `npm run build` or `astro build` locally as a
verification step.** This machine frequently runs low on free RAM from
other running apps/sessions, and local Astro/Vite builds can hang
indefinitely (near-zero CPU, no progress) rather than fail fast. This has
been independently confirmed to be an environment issue, not a code issue
— an unmodified checkout hangs the same way. Skip straight to CI.

## 3. Watch the CI build

```
gh run list --limit 1
gh run watch <run-id> --exit-status
```

Both the `build` and `deploy` jobs must show ✓. This is the real build
verification — if it fails, the error output here is authoritative (unlike
a hung local build).

## 4. Verify the change is actually live

Don't stop at "the build succeeded" — confirm the specific content you
changed actually rendered.

**For statically-rendered content** (page text baked into the HTML at
build time — most pages, and Astro content collections like lessons/
updates/events/aliyot):

```
curl -sL "https://talsal.github.io/yosef-ly-synagogue/<path>" | grep -o "<the text you expect>"
```

or fetch to a temp file and check with Python for exact substring matches.

**For client-side-rendered content** (anything fetched via `<script>` at
page-load time — the Shabbat schedule component, the memorials/refuah
lists that pull from Google Sheets CSV) — curl will only ever show you the
pre-render skeleton (e.g. "טוען..."), never the real content, because
that JS hasn't run. You must use real browser automation instead:

1. Load `mcp__claude-in-chrome__*` tools if not already loaded.
2. `navigate` to the live page (append a throwaway `?v=n` query string to
   dodge any CDN/browser caching of the previous version).
3. `javascript_tool` with something like:
   `await new Promise(r => setTimeout(r, 1500)); document.querySelector('.some-selector')?.textContent`
   — the delay matters, the fetch+render isn't instant.
4. Close the tab when done (`tabs_close_mcp`).

If the thing you changed is Google-Sheets-backed (memorials/refuah), also
independently re-fetch the published CSV directly
(`MEMORIALS_SHEET_CSV_URL` / `REFUAH_SHEET_CSV_URL` from `src/data/site.ts`)
to confirm the underlying data is correct, separately from confirming the
page renders it.

## 5. Report back concisely

Tell the user what changed and that it's confirmed live — don't just say
"pushed," say what you actually verified.
