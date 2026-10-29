# Sources

Order of trust: the portal's own page > the alert mail > anything else. Every source goes through the same deal-breaker check, on its own numbers.

## 1. Browser sweep (`computer`, `first run`, and `manual` with a browser)

The portals' result pages are complete and current; alert mails are not (they skip listings, hide floor and DPE, and wrap links in trackers). Two page loads per run, in the built-in browser (`Claude_Browser__*`), URLs from Settings.

**SeLoger** — load the URL, then extract with `javascript_tool`:

```javascript
const seen = new Set(); const out = [];
for (const a of document.querySelectorAll('a[href*="/annonce/location/"]')) {
  const m = a.href.match(/\/([0-9A-Z]{12})(?:[?#]|$)/); const id = m && m[1];
  if (!id || seen.has(id)) continue; seen.add(id);
  let el = a;
  for (let i = 0; i < 10 && el.parentElement; i++) {
    el = el.parentElement; const t = el.innerText || '';
    if (t.includes('€') && t.includes('m²') && t.length > 60) break;
  }
  out.push({ id, url: a.href.split('?')[0], text: (el.innerText || '').replace(/\s+/g, ' ').slice(0, 300) });
}
out
```

Card text carries: rent CC, rooms, bedrooms, surface, **floor** (`Étage 3/8`, `RDC/4`), **DPE** (the lone letter before the price), quartier + postcode in parentheses, agency or `Particulier`, badges (`Nouveau`, `Exclusivité`, `Colocation à louer`). The URL `seloger.com/annonce/…/<12-char ID>` is the `link` to write. Page 1 holds the 30 newest; if every card is new, read page 2 (`&page=2`).

**Bien'ici** — load the URL, wait about 2.5 s (JavaScript page), extract the same way with the selector `a[href*="/annonce/"]` and the path after `/annonce/`, without parameters, as the key. Cards give furnished, rooms, surface, postcode + quartier, rent CC, agency: no floor, no DPE. Open the detail page in the browser for candidates that pass the deal-breakers.

**Card-level filter**, before any lookup:
- Trust the postcode in parentheses, not the quartier label (SeLoger mixes in "similar" listings from elsewhere).
- Drop a card only when what the card itself states breaks an active deal-breaker (zone, ceiling, minimum surface, minimum rooms, a floor rule). Rules that need the detail page (a lift, a lease type) are checked once that page is open.
- Drop `Colocation` cards — **except** a `Particulier` card priced like a whole flat: open it. Such a card has already turned out to be a whole flat with « colocation possible ».

**Leboncoin** is not read through the browser (blank anti-bot page). It stays on mail alerts; its detail pages are readable with WebFetch.

**Rules**: read only (the only click allowed: refusing a cookie banner); one results page per portal per run (plus page 2 when needed), a detail page only per new candidate; CAPTCHA or blank page → stop that site; close every tab at the end.

## 2. Alert mails (every mode)

Search Gmail with the alerts query from Settings plus `after:` the day before T (SKILL.md, Step 0, item 5: a day, never epoch seconds); open only messages received after T, with `get_thread` and `messageFormat: PLAIN_TEXT` (previews truncate). Then the same with the human-mail query, which covers the address used for applications.

- **Read the body, never decide on the subject.** SeLoger subjects can name an arrondissement that has nothing to do with the listings inside.
- Set `source` from the original sender:

| Sender contains | Source |
|---|---|
| seloger.com (`annonces@alertes.`, `seloger@a.`) | SeLoger |
| bienici.com | Bien'ici |
| leboncoin.fr | Leboncoin |
| pap.fr | PAP |
| immobilier.lefigaro.fr | Figaro Immo |
| gensdeconfiance.com (`hello@notif.`) | Gens de Confiance |
| century21.fr and other agency domains | Agency |
| `seloger@s.seloger.com` | transactional (contact confirmations): skip, but note if it confirms a contact the user made |
| jinka.fr | skip: no listing data |
| `hello@news.gensdeconfiance.com` | newsletter: parse only if it lists rentals |

- A forwarded mail (`TR :`, `Fwd:`) hides the original sender: read it from the quoted header or the listing links.
- **SeLoger « exclusivités » template** (subject « <AGENCE> vous adresse ses dernières exclusivités »): one listing, fields on consecutive lines — rent, title, `N pièces · XX m²`, quartier, then a bare line « Voir l'annonce » carrying the URL. That line is the link.
- **Human mails** (an agency or landlord writing to the user): see SKILL.md step 2.7. A mail found by both queries is an alert, unless it relays a person's message (« Nouveau message de… », « … vous a répondu », « … vous a écrit »): then it is a human mail.
- **Silent alerts.** Due when this run found no alert mail, the Run log reaches back at least 24 h (the oldest of the last 8 rows is older than that), none of the rows of the last 24 h has `emails read` above 0, and no row of today notes `warned: silent alerts`. A full day with zero mail is a broken pipe, not an empty market: the digest's ⚠️ "No alert received for 24 h" line, and remind the user in your final answer that Gmail's spam folder is invisible to you.

## 3. Detail pages outside the browser

Open only for candidates that passed the deal-breakers.

| Source | How | Notes |
|---|---|---|
| PAP | WebFetch | Strip `email=`, `md5`, `utm_*` first: the raw link carries the user's address. Gives floor, lift, DPE, charges, reference rent. |
| Leboncoin | WebFetch on `leboncoin.fr/vi/<id>.htm` | A 410 means deleted: `status = gone`, no new row. |
| SeLoger, Bien'ici | Browser only (`computer`) | Never `click.by.seloger.com` (forbidden by robots.txt). In `fallback`, write from the mail alone. |
| Figaro | Not readable (tracker URL too long) | Ship the tracker link. |

Re-reading the source mail in full (title, agency, reference, quartier) often gives what the alert's summary hid, at no cost.

## 4. Agency sites read directly (optional, first run of the day)

Only if Settings lists them. Known to work for Paris:

- **Oralia** — `https://oralia.fr/location/nos-biens-a-louer/ile-de-france/paris-75?page=N`, all pages (no date sort). The reference at the end of each URL is the key: open only new ones. Detail pages give floor, lift, DPE, charges; rent is shown **hors charges**: add the charges.
- **Breteuil** — `https://breteuilhomes.com/louer/paris`: no working filters, counts bedrooms not rooms.
- **Junot** — `https://www.junot.fr/fr/biens-immobiliers/louer/?max_price=<ceiling>&pieces=<minimum rooms>%2B`: read the block « ces biens pourraient aussi vous plaire »; it ignores the filters.

Filter from the list page; never trust the URL's filters.

## 5. Links

- **Bien'ici redirector** `link.bienici.com/lnk/…/<long segment>`: base64url of the real URL. Decode (`-`→`+`, `_`→`/`, pad), keep what is before `?`.
- **PAP**: direct link, strip the personal parameters.
- **SeLoger redirector** `click.by.seloger.com/?qs=…`: not decodable; ship it as is if it is the only link. Prefer the direct URL from the browser sweep when the same listing is there.
- **Never fabricate a URL** from a title. A wrong link is worse than an extra click.
