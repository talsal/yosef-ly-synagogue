---
name: update-toranim-aliyot
description: Apply a weekly עליות לתורה (aliyot sale results) update or a תורנים (kiddush duty roster) substitution to the yosef-ly-synagogue site, from a shorthand WhatsApp-style message the user pastes in. Use when the user sends aliyot sale results or a toranim swap/replacement for a specific Shabbat.
---

# Update aliyot results or toranim assignments

The user typically pastes a terse message copied from a WhatsApp group
(often without full punctuation, sometimes with just a parasha name and no
date). Two different data shapes depending on which subject it is — don't
conflate them.

## First: resolve the actual Gregorian date

The user's message almost always names a **parasha**, not a date. Don't
guess the date manually — confirm it against Hebcal:

```
curl -s "https://www.hebcal.com/shabbat?cfg=json&geo=city&city=Modiin&M=on&gy=<Y>&gm=<M>&gd=<D>" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); [print(i['date'], i['title']) for i in d['items'] if 'Parashat' in i.get('title','')]"
```

Iterate candidate Saturdays (the message context usually makes "this
Shabbat" / "next Shabbat" unambiguous relative to today) until the
parasha title matches. Getting this date wrong silently creates a
duplicate/wrong-dated entry, which is hard to spot later.

## Case A: עליות לתורה (aliyot sale results)

Storage: `src/content/aliyot/`, one Markdown file **per week** — this is
an Astro content collection (schema in `src/content.config.ts`:
`date`, `parasha`, `sales[]` with `aliyah`/`name`/`price`). History is
kept deliberately (this was a late change from a single
overwritten-each-week object) — **always create a new file, never edit an
old week's file** to record a new week.

Filename pattern: `YYYY-MM-DD-<parasha-slug-in-english>.md` (look at
existing files in that folder for the exact slug style to match).

Standard aliyah order: פתיחה, הולכה, הגבהה, כהן, לוי, שלישי, רביעי,
חמישי, שישי, שביעי, מפטיר. The message may omit some (not sold, or price
not yet known) — represent those as `name: ''` and `price: null`. If the
user sends a follow-up correction (e.g. just a price for one aliyah) after
you already created the file, edit that file's specific field rather than
recreating it.

Rendering: `src/pages/aliyot.astro` reads the whole collection, sorts by
date, shows the newest prominently and the rest collapsed as history — no
page changes needed for a normal weekly update, just add the content
file.

## Case B: תורנים (kiddush duty roster)

Storage: `src/data/toranim.ts`, a single `TORANIM_TABLE` array — **this
table is already pre-populated months ahead**, so a normal update is a
**substitution on an existing row**, not a new row. The message shape is
typically `<name staying>` / `<new name> (מחליף את <old name>)`.

1. Find the existing entry by date (from Hebcal resolution above) or by
   matching the parasha name string already in the table.
2. Replace only the name that's being swapped out; leave their partner
   and every other field (parasha, date) untouched.
3. Do **not** add a new row for a substitution, and do not touch the
   rotation/cycle logic in `getToranimForShabbat` — that function and the
   underlying rotation are unaffected by one-off substitutions.

If the message is establishing a **brand-new future date** not yet in the
table at all (rare — the table is usually already populated that far
out), append a new row in chronological order instead.

## After editing either one

Follow the `deploy-and-verify` skill: commit with a message naming the
parasha and what changed, push, watch CI, then verify live. For aliyot,
verify via curl (statically rendered). For toranim, verify via curl on
`/toranim` (statically rendered) *and* check the `/tefillah-times` page's
client-rendered "קידוש — תורנים" line if the change affects the
current/nearest-upcoming Shabbat (see deploy-and-verify's client-rendered
section for the browser-automation method — curl alone won't show that
line's content).
