# Deal-breakers, deduplication, scoring, writing

## 1. Deal-breakers — on evidence only

For each candidate, check every active criterion of type `dealbreaker` against **what the listing states**.

- **Postcode first, digit by digit**, against the zone. Reading "Paris" and moving on is how a listing from the wrong arrondissement ends up in the base.
- Sub-zone rules (a street not to cross, a quartier to avoid) are in the criterion's `detail`: apply them only when the listing names the place. A postcode with no quartier is unknown, not excluded.
- Rent is always **charges comprises**. A rent quoted hors charges: add the charges before comparing. No charges amount anywhere: the HC figure is a floor. Above the ceiling already: deal-breaker. Below: keep the row, with `rent_excl_charges` ticked (see 4).
- A listing that breaks a deal-breaker **gets no row**. Count it in the Run log notes and in your final answer, never in the mail.
- A silent listing (no floor, no DPE, no quartier, no lease length) **gets a row**, with the missing fact named first in the summary. Deal-breakers are not scored: the scored criteria that depend on the missing fact count at half (see 3).

## 2. Deduplication — before every write

The same flat arrives from three portals, sometimes the same day, sometimes relisted weeks later. A duplicate costs the user a click; a flat wrongly merged into an old rejection costs them the apartment. When in doubt, write.

**Always reduce a link to its key before matching, and match on the key alone** (in the first user's base, the same listing was written twice 6 times because the link format differed):
- SeLoger: the 12-character ID, whatever the URL form (`/annonce/…/<ID>` or `/annonces/…/<ID>.htm`);
- Bien'ici: decode the redirector first (`sources.md` › 5); key = the path after `/annonce/`, without parameters;
- PAP: `r` + digits;
- Leboncoin: the number in `/vi/<id>.htm`;
- agency sites: their reference.

**In memory first**: merge today's batch with itself (same key, or same postcode + surface + rent and no contradicting field).

**Then against Listings, in this order:**

1. **Portal ID or reference in `link`.** A hit is the same listing: the only match that is a verdict. Done.
2. **Exact fingerprint** `<postcode>-<surface rounded to the m²>-<rent CC rounded to 10>`, e.g. `75014-44-1820`. Three segments, no words, no agency, no reference, never an unrounded rent. **A hit is a candidate, never a verdict on its own**: compare the discriminating fields exactly as for a similarity hit (3). The first user's base had 27 fingerprint collisions among 334 listings, several between clearly different flats (other quartier, agency vs private landlord, furnished vs unfurnished).
3. **Similarity**: same postcode, rent within 5 % (15 % when either row has `rent_excl_charges`: its rent is a floor), surface within 5 %. **A hit is a candidate, not a verdict.** Compare the discriminating fields: quartier or street, agency, listing reference, floor, furnished or not. **One differs → two distinct flats → write the new row.** Nothing differs but you are not sure → write it with "Possible duplicate of <type + street or quartier of the existing row>" at the head of the summary (titles are short: never cite a row by its title alone).

**Never let a new listing inherit one of the user's rejections through a numeric resemblance.**

**When it is a repeat:** no new row. Allowed updates on the existing row, agent fields only: replace a tracker link by a direct one, fill an empty floor or DPE. A price drop on a row the user said yes to: update `rent` (and `charges`, and recompute `fingerprint`) to the new figures, append "Price drop: <old> → <new> € on <date>" to `agent_notes`, and add the digest's ↘️ line. Since the row now holds the new rent, the drop is announced once. A row marked gone that is live again: note it in the Run log, do not resurface it in "To decide".

## 3. Scoring

```
If an active dealbreaker criterion is violated: no row (see 1).

max_points = sum of weight over active criteria whose type is not dealbreaker
earned     = sum over those criteria of:
               + weight       if met
               + weight / 2   if partly met, or unknown but plausible
                 0            if not met
               - weight       if a must criterion is clearly not met
Score = round(100 × max(0, earned) / max_points)
```

| Score | Verdict |
|---|---|
| 70 and above | Match |
| 45 to 69 | Maybe |
| below 45 | Filtered out (still written: low scores are what the user corrects) |

Two or more scam signals (see `french-rental-rules.md`) → `verdict = scam`, said plainly in the summary.

## 4. Writing a row

| Field | Content |
|---|---|
| title | What the card does not already show (the card shows rent, living area and location): `Type · floor · unfurnished|furnished`, plus `· private landlord` for a private landlord, plus at most one standout feature. Floor as `2nd lift`, `3rd no lift`, `4th/7 lift`, `5th lift ?`; unknown floor: `floor ?` (always). `unfurnished`/`furnished` only when stated. In the user's language. Examples: `3-room · 2nd no lift · unfurnished · private landlord`, `3-room duplex · 6th/7 lift · unfurnished`, `3-room · floor ?`. Validated French version: `T3 · 2e sans asc. · vide · particulier`, `T3 duplex · 6e/7 asc. · vide`, `T3 · étage ?`. |
| link | Mandatory. If you truly have none after re-reading the source, still write the row with "LINK NOT FOUND —" at the head of the summary. |
| summary | **Short bullets, not a paragraph**, in the user's language: up to five lines, one fact per line, each starting with `✅` (what makes it worth their time), `⚠️` (what costs it) or `❓` (what is unknown and must be checked). One line break between bullets, no Markdown list syntax. Never restate what the card shows (rent, living area, location). **Unknown floor: the `❓` floor line comes first.** Same for an unknown lease length. A thin alert: one line saying so. Never invent a fact. Example: `❓ Floor not stated: check before anything else` / `✅ Private landlord, no agency fees` / `✅ Dual aspect` / `⚠️ Furnished, DPE E` / `❓ Bedrooms quiet?`. |
| agent_notes | In the user's language, at most two sentences (~200 characters), starting with the score: what carried it, what cost it, the one thing to check. Later runs and `apply` append dated lines; never rewrite what is there. |
| rent, charges | `rent` charges comprises; `charges` whenever the ad gives the amount (the `rent_display` formula shows both). Only an HC rent and no charges: write the HC figure, tick `rent_excl_charges`, and make the first summary line `❓ Rent excludes charges: charges not stated`. Never guess the charges. |
| location | Place property. Geocode with WebFetch: `https://data.geopf.fr/geocodage/search?q=<street>&postcode=<postcode>&limit=1`; the first feature's `coordinates` are [longitude, latitude]. Street named in the ad: use it. Otherwise the quartier's main street or the arrondissement (`q=Paris 11e Arrondissement&type=municipality`), and add "(approx.)" to the name. Write the place's name (as the ad states it), address (the geocoder's label), latitude, longitude. The separate `address` property keeps the ad's own wording. No postcode: leave it empty. A failed lookup never blocks the row. `api-adresse.data.gouv.fr` refuses agents in robots.txt: do not use it. |
| area | Still written (postcode + quartier): dedup reads it. Hidden from the user. |
| photo | The listing's first real photo (portal CDN). Also the page cover. Never a logo, banner, icon or pixel. No photo: leave empty. |
| status | `new`, with `status_seen` and `status_since` like every status write (`notion-access.md` › Writing) |
| icon | `icons/search_brown` (the page icon, not a property). |
| everything else | What the listing states. Unknown stays empty (DPE: `unknown`). Quoted phrases in this file ("Possible duplicate of", "LINK NOT FOUND") are English examples: write them in the user's language. |
