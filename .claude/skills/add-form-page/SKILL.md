---
name: add-form-page
description: Set up a new self-serve Google Form + Sheet + CSV page on the yosef-ly-synagogue site, so community members can submit content directly (like אזכרות and רפואות) with no approval step and no manual relay through the user. Use when the user wants a new page where anyone can add an entry themselves.
---

# Add a self-serve Google Form page

This codifies the pattern already used for `/memorials` (אזכרות) and `/refuah`
(רפואות): a Google Form collects submissions into a linked Sheet, the Sheet is
published as CSV, and the Astro page fetches that CSV client-side and renders
it as a list of labeled cards. No backend, no approval gate, no relay through
the גבאי or the developer — submissions show up on the live site immediately.

Before starting, confirm with the user: the page's Hebrew title, the fields
to collect (which are required), and whether this is a brand-new page or
replacing an existing content-collection-backed page.

## 1. Create the Google Form

Requires `mcp__claude-in-chrome__*` tools — load them if not already available
(`ToolSearch` with `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__tabs_close_mcp`).

1. `tabs_context_mcp` with `createIfEmpty: true`, then `navigate` to `https://forms.google.com`.
2. Click "Blank form".
3. Click the title field, `cmd+a`, type the Hebrew title (pattern: `רישום <דבר> – בית הכנסת יוסף-לי`).
4. Click the description field, type a one-line explanation of the form's purpose.
5. For each field: click the question title box and type the question text.
   Then click the type dropdown (usually defaults to "Multiple choice", or
   sometimes auto-detects "Date" for date-looking text) and select
   **"Short answer"** — free text is what we want, not a native date picker
   (Hebrew calendar dates don't fit a Gregorian date widget) or multiple choice.
   **The dropdown often needs two clicks** — the first opens it, take a
   screenshot, then click the option again if it's still showing.
6. Mark required fields via the "Required" toggle at the bottom-right of each
   question card. Add a `Description` (via the ⋮ menu → Description) under a
   question if the expected format needs a hint (e.g. "לדוגמה: כ״ג בתשרי").
7. To add another question, click a question to focus it, then click the "+"
   icon in the floating toolbar to its right.
8. Click **Publish** (top-right). In the dialog, confirm "Anyone with the
   link" is selected under Responders, then click **Publish** again.
9. Get the exact responder URL — **never read it off a screenshot** (visually
   near-identical characters like `l`/`I`/`1` or `0`/`O` are easy to misread
   and will silently produce a broken link). Instead:
   ```
   javascript_tool: [...document.querySelectorAll('input[type=text]')].map(i => i.value).filter(v => v.includes('viewform'))
   ```
   Trim any `?usp=...` query string off the result before saving it.

## 2. Link and publish the Sheet

1. Click the **Responses** tab, then **"Link to Sheets"** → "Create a new
   spreadsheet" (already selected by default) → **Create**. This opens the
   new Sheet in a new tab — switch to it.
2. Sanity-check the header row (row 1) matches your question text.
3. **File → Share → Publish to web.**
4. Change the format dropdown from "Web page" to **"Comma-separated values
   (.csv)"**. Leave "Entire document" as-is (fine for a single-sheet doc).
5. Click **Publish**. **This click will hang** — clicking Publish on a Sheets
   "Publish to web" dialog triggers a native `window.confirm()` browser
   dialog, which freezes Chrome DevTools Protocol automation entirely (the
   click times out, screenshots fail with a "page is busy" error). This is
   expected, not a bug. Tell the user exactly this, and ask them to switch to
   that Chrome tab themselves and click OK/Publish on the dialog. Wait for
   their confirmation before continuing.
6. Once confirmed, extract the exact CSV URL the same way as the form URL —
   via JS execution, not by reading it visually:
   ```
   javascript_tool: [...document.querySelectorAll('textarea, input')].map(i => i.value).filter(v => v && v.includes('pub?output'))
   ```
7. Verify it actually works before wiring up the site:
   ```
   curl -sL "<the csv url>"
   ```
   It should return just the header row (comma-separated question text) at
   this point, not a Google "file not found" HTML error page. If you get an
   HTML error page, you misread the URL — re-extract it via JS.
8. Close both Chrome tabs (`tabs_close_mcp`) once confirmed working.

## 3. Wire up the Astro site

1. In `src/data/site.ts`, add two constants next to the existing
   `MEMORIALS_FORM_URL` / `MEMORIALS_SHEET_CSV_URL` pair, following the same
   naming convention (`<PAGE>_FORM_URL`, `<PAGE>_SHEET_CSV_URL`).
2. Write (or rewrite) the page at `src/pages/<page>.astro` following the
   `refuah.astro` / `memorials.astro` pattern exactly:
   - A `<a class="button" href={...FORM_URL} target="_blank" rel="noopener noreferrer">` linking to the form, with clear Hebrew call-to-action text (e.g. "הוספת שם ל...", "רישום ... חדש/ה").
   - A container div with `aria-live="polite"` and an initial `<p class="loading-state">טוען...</p>`.
   - A `<script>` that imports `fetchSheetRows` from `../lib/csv` and the new
     `..._SHEET_CSV_URL` constant, fetches on load, and renders each row as a
     `<div class="card ...-card"><dl>...</dl></div>` with **labeled** `dt`/`dd`
     pairs — one row per field, using the exact question text as the object
     key when reading `row['...']` (must match the Sheet header exactly,
     including punctuation). Do not render bare unlabeled text — every field
     needs a visible Hebrew label (this was a real bug reported by the user
     for both memorials and refuah on first pass).
   - Handle three states: loading (static HTML default), empty
     (`rows.length === 0`, friendly "אין כרגע..." message), and fetch error
     (`try/catch`, friendly "אירעה שגיאה..." message). Never show a raw error.
   - Reuse the shared `.card`, `dl`/`dt`/`dd` CSS pattern already in the
     codebase (copy the `<style>` block from `memorials.astro` or
     `refuah.astro` and adjust field labels) rather than inventing new styles.
3. If this replaces an existing Astro content-collection page: remove the
   collection from `src/content.config.ts` and delete its
   `src/content/<name>/` folder.
4. Update `README.md`'s section documenting form-based pages (search for
   "Google Form" / "אזכרות ורפואות") to mention the new page and its
   constants.

## 4. Build, verify, ship

1. `rm -rf dist && npm run build` — must complete with no errors.
2. Serve the real production build (not `astro dev`, which skips the
   build-time CSS target fix): `npx astro preview stop` (clears any stale
   tracked server) then `npm run preview -- --port <free port>` in the
   background.
3. Screenshot it with headless Chrome to confirm the button and empty state
   render correctly:
   ```
   /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --disable-gpu --no-sandbox --force-device-scale-factor=1 --window-size=1200,800 --virtual-time-budget=6000 --screenshot=/tmp/check.png "http://localhost:<port>/yosef-ly-synagogue/<page>"
   ```
   Read the resulting PNG. Confirm: button visible with correct label, empty
   state message showing (not stuck on "טוען..."), no unlabeled bare text.
4. If you submitted a test entry through the form while verifying, delete
   that row from the Sheet afterward (right-click the row *number*, not the
   header row — right-clicking row 1 and choosing delete fails with "Cannot
   delete row with form questions") so it doesn't stay live on the site.
5. Clean up: remove the temp screenshot, `npx astro preview stop`.
6. Commit with a message explaining *why* self-serve was chosen (usually:
   manual collection through a single point of contact wasn't working) and
   push. Report both the form URL and the live page URL back to the user.
