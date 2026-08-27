---
name: fix-sheet-entry
description: Correct a specific row/cell in the memorials (אזכרות) or refuah (רפואות) Google Sheets that back the self-serve form pages on the yosef-ly-synagogue site. Use when the user reports a typo or wrong value in a submitted entry and wants it fixed.
---

# Fix an entry in the memorials/refuah Google Sheet

These two pages (`/memorials`, `/refuah`) have no admin UI — the only way
to correct a bad submission is editing the underlying Google Sheet
directly. This is finicky in a way that isn't obvious, so follow this
exactly.

## 1. Find the row via the published CSV first

Before touching the UI, fetch the CSV and locate the exact row so you know
what you're looking for (don't rely on scrolling/searching in Sheets):

```
curl -sL "<MEMORIALS_SHEET_CSV_URL or REFUAH_SHEET_CSV_URL from src/data/site.ts>" -o /tmp/check.csv
```

Parse with Python's `csv` module (not naive comma-splitting — fields
contain embedded commas/quotes) and match on distinguishing values the
user gave you (e.g. the deceased's Hebrew date, the relation field).

## 2. Open the actual (editable) Sheet

The CSV URL is read-only publish output — you need the real spreadsheet:

1. Load `mcp__claude-in-chrome__*` tools if not loaded.
2. Navigate to `forms.google.com`.
3. Find the matching form card by its title (memorials form vs refuah
   form look similar — check the title text) and open it.
4. Click the **Responses** tab.
5. Click **View in Sheets** — this opens the real spreadsheet in a new
   tab. Switch to that tab.

## 3. Locate and select the cell

Match the row by the same distinguishing values you used in step 1. Column
order matches the CSV header row exactly.

## 4. Edit the cell correctly — this is the part that silently fails

**You must `double_click` the cell to enter edit mode explicitly.** A
single `left_click` only *selects* the cell; if you then use the `type`
action directly, the **first word you type can be silently dropped**
(confirmed, reproducible bug in this environment) — the cell ends up
missing just the first token, and it's easy not to notice until you
re-check. Always double-click first; you'll see a text cursor appear
inside the cell, which confirms you're actually in edit mode.

Once in edit mode:
- To **replace the whole value**: press `cmd+a` to select existing
  content, then `type` the full replacement.
- To **prepend text**: press `Home` to jump to the logical start of the
  text (works correctly even though the text is RTL), then `type` the
  prefix plus a trailing space.
- To **append/remove a trailing word**: position with `End`/arrow keys as
  needed.

Commit with `Return` or `Tab`.

## 5. Verify before moving on — do not assume it worked

Immediately re-click the same cell and check the formula bar (zoom into
roughly the top-left region of the screenshot, or just take a full
screenshot) to confirm the actual committed value. This UI has silently
reverted edits or dropped content multiple times in practice — never trust
that a `type` action landed without checking.

## 6. Confirm via the published CSV

The Sheet's "Publish to web" CSV has a short propagation delay. Wait ~3
seconds, then re-fetch the CSV URL and confirm the corrected value appears
there (this is what the live site actually reads — see
`deploy-and-verify` skill, "client-side-rendered content" section, for how
to also confirm it renders correctly on the page itself).

## 7. Clean up

Close any extra tabs opened during this (`tabs_close_mcp`) once confirmed.
