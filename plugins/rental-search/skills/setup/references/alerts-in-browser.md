# Step 5 — Alerts and mail reception, in the browser

Goal: every portal the person picks sends its alerts to one address the agent reads, and you did the clicking. They only log in and say ok.

Use the built-in browser (`Claude_Browser__*`). Ask for site access with scope "site" when a tool requires it. If the browser is unavailable, do this step by hand: give the exact filters per site, and they create the alerts themselves.

## 5.1 — Pick the sites

Ask this first. Show the list and let them choose (multiple choice). Write the chosen portals in Settings › Search › `Sites followed`, and the agency sites read directly in `Agency sites read directly` (or "none"). Then put the picked sites' sender domains in the relayed-messages clause of `Human mail query`.

| Site | Why | Alert | Notes |
|---|---|---|---|
| SeLoger | Biggest agency stock | Yes (account) | Also read directly at each run |
| Bien'ici | Same stock, better map | Yes (account) | Also read directly at each run |
| Leboncoin | Many private landlords | Yes (account) | Often blocks automated browsers: if the page stays blank, give them the filters and let them create it |
| PAP | Private landlords only, no fees | Yes (account) | Detail pages readable, good data |
| Figaro Immobilier | Some exclusive listings | Yes | Links are opaque trackers |
| Gens de Confiance | Private landlords, trusted network | Yes | Needs a sponsor (parrainage) to join |

Sender domains: SeLoger `seloger.com` · Bien'ici `bienici.com` · Leboncoin `leboncoin.fr` · PAP `pap.fr` · Figaro Immobilier `lefigaro.fr` · Gens de Confiance `gensdeconfiance.com`. Every query and filter of this step uses only the picked sites' domains.

Paris only, optional: agency sites without alerts that the run reads directly once a day (Oralia directory, Breteuil, Junot). Offer them as "agency sites read directly".

## 5.2 — The reception address

Propose a variant of their Gmail address, so alerts land in their usual inbox but are trivial to find. In the user's language:

> "I suggest receiving the alerts at **firstname.lastname+location@gmail.com**. It's your usual Gmail inbox; the '+location' just lets me find them all at once. OK with you?"

- Works for any Gmail or Google Workspace address.
- Some sites refuse the "+". Then use the plain address for that site, and switch Settings › `Gmail query` to the sender form, built only from the domains of the sites picked in 5.1: `(from:(<picked domains, joined with OR>) OR label:"Rental search")`. The Gmail filter (5.5) matches on senders too.
- If their alerts currently go to another mailbox (Outlook, Yahoo), they must **forward** (not redirect) to Gmail: a redirect breaks the sender check and alerts end up in spam, which the agent cannot read.

Store the address and the Gmail query in Settings, **without any time window** (`run` adds it).

## 5.3 — Reuse what already exists

Before creating anything, search Gmail for alerts received in the last 30 days, from the picked sites' sender domains only:

```
from:(<picked domains, joined with OR>) newer_than:30d
```

List what you found, per site, in one line each. For each existing alert: keep it, never create a duplicate. Changing its address to the alias is a change to their account: show the change, wait for their ok, then do it.

## 5.4 — Per site, the same five moves

1. **Open the search with their filters.** Use the URL patterns below when they exist; otherwise fill the search form on the site.
2. **If an account is needed**, say in the user's language: "Log in (or create your account) in the browser pane, then tell me 'done'." Wait. Never type a password, never fill a sign-up form.
3. **Check the filters on the page itself** (filter chips, result count, a few cards): zone, rental only, apartment, max rent = hard ceiling CC, min surface, min rooms, sorted newest first. Fix what is wrong.
4. **Show a summary before creating the alert**, and wait for an explicit ok:
   > "SeLoger — alert ready: Paris 14th, 15th, 13th · rental · apartment · max €1,950 · 40 m² min · 2 rooms min · sent instantly to firstname+location@gmail.com. Shall I create it?"
5. **On ok only**: click « Créer l'alerte » / « Sauvegarder la recherche », pick the most frequent sending option, untick any newsletter or partner box, confirm on screen that it was saved. Tell them in one line.

Then save the results-page URL (sorted by date) in Settings for SeLoger and Bien'ici: the run reads those two pages directly.

If a confirmation mail arrives (« Confirmez votre alerte »), tell them; open the confirmation link only after their ok.

### URL patterns that are known to work

**SeLoger** (Paris: location code `AD09FR` + (25 + arrondissement), e.g. 10th = AD09FR35, 18th = AD09FR43):
```
https://www.seloger.com/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=<codes, comma-separated>&priceMax=<ceiling>&spaceMin=<m2>&numberOfRoomsMin=<rooms>&order=DateDesc
```
Other cities: set the location in the site's search box, apply the filters, then copy the URL from the address bar and add `&order=DateDesc`.

**Bien'ici**:
```
https://www.bienici.com/recherche/location/<zone slugs, comma-separated>/appartement/<rooms>-pieces-et-plus?prix-max=<ceiling>&surface-min=<m2>&tri=publication-desc
```
Paris slugs: `paris-10e-75010`, `paris-1er-75001`. Other cities: same as SeLoger, from the address bar.

Never invent a code or slug you have not seen working: load the page and check its result list first.

## 5.5 — The Gmail filter

Goal: alerts never land in spam, and they are grouped under one label.

Create the label with the Gmail connector if available (`create_label`: "Rental search", in the user's language; the same name as in `Gmail query`). The filter itself is created in Gmail's settings, in the browser, where they must be logged in. Build it only from the sites picked in 5.1:

- Criteria: `to:(<alias>)` — or, if the "+" was refused anywhere, `from:(<picked domains, joined with OR>)`.
- Actions: apply the label "Rental search", **never send to Spam**. Do not archive unless they ask.

Show the filter, wait for ok, create it. If they prefer to do it themselves, give these exact steps instead.

Once the filter is created, sign out of Google in the built-in browser and tell them why in one sentence: the scheduled searches use this browser and read mail from strangers, so it must not stay logged in to their mailbox. The Gmail connector keeps working: it does not use the browser's session.

## 5.6 — Close the step

One recap line per site: alert created / reused / to do by hand. Check that Settings › Search has the `Alert address`, `Gmail query`, `Sites followed`, `Agency sites read directly` and both results-page URLs. Tick step 5 in Settings. Tell them alerts may take a few hours to send their first mail: the first run will still work from the browser sweep.
