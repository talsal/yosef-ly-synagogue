---
name: check-analytics
description: Pull current Google Analytics 4 traffic stats for the yosef-ly-synagogue site and summarize them, optionally as a Hebrew WhatsApp-ready message. Use when the user asks to check analytics, traffic, visitor numbers, or how the site is performing.
---

# Check Google Analytics for the synagogue site

## The property ID — get this right

The correct GA4 property is **"בית הכנסת יוסף-לי"**, property ID
**551089477** (account ID 405032197). The user has multiple GA properties
under the same Google account ("my sites"), including an unrelated one
("...חיים סלמן" / playlist-viewer) with a similarly-shaped ID
(550397269) that is easy to confuse this with — that has happened before
and produced wrong links sent to the user. Always double check you're on
the right property (visible in the top-left property switcher) before
reading or reporting any numbers.

Base URL for the correct property's home:
`https://analytics.google.com/analytics/web/#/a405032197p551089477/reports/reportinghub`

## Loading tools

`ToolSearch` for
`mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__tabs_close_mcp`
covers most of this. Add `resize_window` if you end up needing Explore
(see below).

## Quickest path: Reports snapshot + get_page_text

For a general "how's the site doing" check, this is the fastest reliable
method:

1. `navigate` to the reportinghub URL above.
2. Wait ~2s for it to load, then call `get_page_text` (not screenshots —
   the GA UI renders narrow and truncates column text in screenshots,
   `get_page_text` gets the full untruncated values in one shot).
3. This single call returns: Active users, New users, Event count, avg
   engagement time, Top pages/screens with views/users/bounce rate,
   traffic source breakdown, new-vs-returning, and Town/City breakdown —
   everything needed for a normal status update.

**Known GA UI quirks to expect:**
- Guessed deep-link URLs to specific sub-reports (e.g.
  `/reports/engagement-pages-and-screens`) often just redirect back to
  the home/intelligenthome report instead of loading. Navigating via
  actual UI clicks (left sidebar → Reports → expand the relevant
  business-objective section → click the sub-report) is more reliable
  than guessing URLs.
- If you land on the wrong property (see above), use the property
  switcher at the top-left (click the property name, pick "בית הכנסת
  יוסף-לי" — property 551089477 — from the list under "my sites").

## Deeper dive: outbound link clicks (e.g. donation button)

Page views alone don't show whether people *clicked through* to an
external destination like jgive.com. To get that:

1. Go to **Explore** (left sidebar) and reuse the existing saved
   "Free-form 1" exploration for this property if one exists (faster than
   building from scratch), or start a new Free-form exploration.
2. You need the **Link domain** dimension (and optionally **Link text**).
   It's not in the default dimension list — click the **+** next to
   Dimensions, then either search "link domain" or manually expand the
   **Link** category (click "Collapse all" first to make it findable,
   then expand just "Link").
3. **UI trap:** in this narrow-rendered GA UI, the dimension-picker's
   search box and **Confirm** button are often positioned off-screen to
   the right of the visible screenshot. Use `computer` action `scroll`
   with `scroll_direction: "right"` inside the dialog to reveal them
   before you can click Confirm. Select the dimension, then scroll right
   again to click Confirm — don't assume Confirm is visible just because
   nothing else changed on screen.
4. **Also verify selections stuck**: after confirming, scroll the
   Variables panel to check the dimension actually got added — checkbox
   selections in this dialog have been silently lost/reset before
   (e.g. closing via the wrong X button cancels instead of confirming).
5. Set ROWS to Link domain (remove/replace whatever was there), set
   VALUES to Active users, resize as needed. `get_page_text` the result —
   rows will show domains like `jgive.com`, `docs.google.com` (the Google
   Form buttons), etc. with click counts per domain/date.
6. Always caveat this kind of number: it's *click-throughs*, not
   confirmed conversions/donations — anything that completes on the
   external site (like an actual jgive donation) isn't visible in this
   GA property at all.

## Reporting back

Ask (or infer from context) whether the user wants: a plain-English
summary, or a Hebrew WhatsApp-ready message. For WhatsApp, use `*bold*`
(single asterisks — WhatsApp's own bold syntax, not markdown `**`), short
lines, and match the tone already established in this project's messages:
warm, concise, a few relevant emoji, no corporate-report feel. Always be
explicit about what a number does and doesn't prove (e.g. "new users"
counts devices/sessions, not distinct people — repeat visitors on mobile
Safari or WhatsApp's in-app browser frequently get recounted as "new" due
to cookie clearing, so don't overstate precision).
