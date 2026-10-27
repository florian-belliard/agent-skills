# Step 4 — Notion workspace

Goal: one page the person opens to decide in seconds. Everything the agent needs but the person does not is hidden: in the card's "For the agent" section, and in "BACKEND (DO NOT TOUCH)" at the bottom of the page.

**Reference build.** This file describes, block by block, the workspace validated in testing, in French. Reproduce it **exactly**: same blocks, order, heading sizes, icons, colours, sections, views and formulas. Only the language of names and texts changes. Do not add, merge or "improve" anything.

Ask once, in the user's language: "Where should I create the workspace in your Notion? In an existing page, or a new private page?" Default: a new private top-level page. Move the Settings page (created at the start) under it.

## Names follow the user's language

Every property and option has a **canonical key** (used by the skills) and a **display name** (what the user sees). Create the databases with display names in the user's language: English and French sets are below (the French set is the validated reference for French-speaking users); for another language, translate them. Then write the key → name map in Settings › Schema. Every skill reads that map first and never hardcodes a display name.

The page markup, view configurations, formulas and page layout below, and the Settings template in `settings-page.md`, use the English display names: use the user's-language names from Settings › Schema.

Fixed in every language: the **Run log** (machine log, English), the **Settings** page labels, the toggle "BACKEND (DO NOT TOUCH)". The section names of a listing page follow the user's language: Essentials / L'essentiel, For the agent / Pour l'agent.

## What to create, in this order

1. Page **"Rental search"** (title in the user's language). Icon `circle-four-eighths`, brown (`icons/circle-four-eighths_brown`). Cover: Notion's solid beige (`https://app.notion.com/images/page-cover/solid_beige.png`).
2. Inside it, three databases, **full page (not inline)**: **Listings** (icon `home`, red), **Criteria** (icon `target`, red), **Run log** (icon `clock`, red).
3. The page **"My application"** (content and icons: `references/application-message.md`).
4. The two BACKEND sub-pages, inside it (the page content below places their `<page>` tags in the BACKEND toggle): **"Feedback queue"** (icon `chat`, red: `icons/chat_red`) and **"Recent listings"** (icon `history`, red: `icons/history_red`), titles in the user's language. Each will hold one machine view, nothing else.
5. Schema of each database (below), then each `page_layout` in a **separate** call.
6. The criteria rows (from Settings › Criteria draft), each with the page icon `icons/target_red`; then clear the draft.
7. The views (below), then the page content (below), then move "My application" into the callout.
8. The Settings page: icon `gear`, red (`icons/gear_red`); then its content: Workspace, Views, Schema.

Tools: `notion-create-database`, `notion-update-data-source` (schema, then `page_layout` in a separate call), `notion-create-view`, `notion-update-view`, `notion-create-pages`, `notion-update-page`. Read each tool's schema before calling it.

## Page content of "Rental search"

Exactly this, in Notion-flavoured Markdown (texts in the user's language, same structure). `<number>` / `<times>` = the number of runs and their hours: write the defaults ("Four", "9:00, 12:00, 15:00, 18:00") now, step 6 updates them; `<decision>` / `<comment>` = the display names of `decision` / `comment`.

```
<callout icon="/icons/home_brown.svg" color="brown_bg">
<b>Your rental-search agent.</b> <number> times a day (<times>), it reads the new listings and puts here the ones that pass your criteria.

Open a card, click the link if needed, then pick <b><decision></b>. A word in <b><comment></b> helps it learn.

To apply, the agent uses your contact details and your message, to keep up to date here:

<page url="<My application>">My application</page>
</callout>

<toggle heading="h2">
To decide

<database url="<To decide view>" inline="true"></database>
</toggle>

<toggle heading="h2">
My selection

<database url="<My selection view>" inline="true"></database>
</toggle>

<toggle heading="h2">
My criteria

<database url="<My criteria view>" inline="true"></database>
</toggle>

---

<toggle heading="h3" color="red_bg">
<span color="red">BACKEND (DO NOT TOUCH)</span>

<page url="<Settings>" color="red">Settings — Rental search</page>

<database url="<Listings>" inline="false" icon="/icons/home_red.svg" color="red">Listings</database>

<database url="<Criteria>" inline="false" icon="/icons/target_red.svg" color="red">Criteria</database>

<database url="<Run log>" inline="false" icon="/icons/clock_red.svg" color="red">Run log</database>

<page url="<Feedback queue page>" color="red">Feedback queue</page>

<page url="<Recent listings page>" color="red">Recent listings</page>
</toggle>
```

Rules:
- The three user sections are **H2 toggle headings of the same size**, no colour. The BACKEND toggle is **H3, red background, red text**, and always last.
- "My application" sits **inside the callout**, as its last child. Create the page under "Rental search", then move its `<page url="…">` tag into the callout with `update_content` (same tag removed from its old place, in one call: Notion moves it, nothing is deleted). Never recreate it to move it.
- The three machine views (Feedback queue, Recent listings, Run log) exist so that `run` can read through views without using Notion's SQL allowance. Feedback queue and Recent listings each sit alone in their red sub-page; the Run log view is the "Latest runs" tab of the Run log database. No view block sits directly in BACKEND, nothing else goes in it, and there is no other "behind the scenes" section.
- No other block on the page: no extra heading, text, divider or view.

## Listings

| Key | Type | EN name | FR name | Description (in the user's language) | Written by | On the listing page |
|---|---|---|---|---|---|---|
| title | title | Listing | Annonce | — | agent (format below) | title |
| link | url | Link | Lien | — | agent — **mandatory** | pinned |
| decision | select | Decision | Décision | — | **user only** | pinned |
| comment | text | My comment | Mon commentaire | "Why? One word is enough: too dark, too far, closed kitchen… Every explanation improves the search." | **user only** | pinned |
| freshness | formula | Freshness | Fraîcheur | — | Notion | Essentials |
| rent_display | formula | Monthly rent | Loyer | "Rent with charges included (CC), with the amount of charges when known" | Notion | Essentials |
| surface_display | formula | Living area | Superficie | "Living area in m²" | Notion | Essentials |
| rooms | number | Rooms | Pièces | "Number of rooms: T2 = 2" | agent | Essentials |
| location | place | Location | Localisation | "Where the flat is: the street when the listing gives it, otherwise the area" | agent (geocoded, see `run`) | Essentials |
| floor | text | Floor | Étage | "e.g. 4th floor, no lift" | agent | Essentials, hide if empty |
| dpe | select | DPE | DPE | — | agent | Essentials, hide if empty |
| furnished | checkbox | Furnished | Meublé | — | agent | Essentials |
| summary | text | Summary | Résumé | — | agent — bullets | Essentials |
| available_from | date | Available from | Disponible le | — | agent | Essentials, hide if empty |
| rent_cap | select | Rent cap | Encadrement | — | agent | Essentials, hide if empty |
| score | number | Score | Score | "Score from 0 to 100 computed by the agent" | agent | For the agent |
| agent_notes | text | Agent notes | Notes de l'agent | "Why the agent gave this score" | agent | For the agent |
| status | select | Stage | Statut | "Where the listing stands after your yes" | agent and user (see `run` › feedback) | For the agent |
| status_since | date | Stage since | Étape depuis le | "Date the listing reached this stage" | agent, with every status change | For the agent, hide if empty |
| source | select | Source | Source | — | agent | For the agent |
| applied_on | date | Applied on | Candidature envoyée le | — | apply | For the agent, hide if empty |
| rent | number, format euro | Rent | Loyer CC | "Monthly rent, charges included (excluding charges only when 'Rent excludes charges' is ticked)" | agent | hidden |
| charges | number, format euro | Charges | Charges | — | agent | hidden |
| rent_excl_charges | checkbox | Rent excludes charges | Loyer hors charges | "Ticked only when the listing gives only a rent excluding charges, without the amount of charges" | agent | hidden |
| surface | number | Surface | Surface | "Living area in m²" | agent | hidden |
| area | text | Area | Quartier | "Arrondissement or town, with the postcode" | agent — read by dedup | hidden |
| address | text | Address | Adresse | — | agent — street or métro as the ad states it | hidden |
| reject_reasons | multi-select | Reasons | Raisons du refus | — | agent, only from the user's own comment | hidden |
| verdict | select | Verdict | Verdict | — | agent | hidden |
| posted | date | Posted | Publiée le | — | agent | hidden |
| photo | url | Photo | Photo | — | agent (also the page cover) | hidden |
| fingerprint | text | Fingerprint | Fingerprint | "Dedup key, do not edit" | agent | hidden |
| feedback_processed | checkbox | Feedback processed | Feedback processed | — | agent | hidden |
| added_on | created time | Added on | Ajoutée le | — | Notion | hidden |
| status_seen | text | Stage seen | Étape vue | "Last stage dated by the agent, do not edit" | agent | hidden |
| status_changed | formula | Stage changed | Étape modifiée | "True when the card has changed column since the last date" | Notion | hidden |

### Options and colours (key → EN / FR, colour)

| Property | Options |
|---|---|
| decision | yes → Yes / Oui (green) · no → No / Non (red) — only these two: where a selected listing stands is the job of `status` |
| dpe | A (green) · B (green) · C (blue) · D (yellow) · E (orange) · F (red) · G (red) · unknown → Unknown / Inconnu (gray) |
| rent_cap | within → Within cap / Dans les clous (green) · over → Over cap / Au-dessus (red) · unknown → Not checkable / Non vérifiable (gray) |
| status | new → New / Nouveau (gray) · shortlisted → Shortlisted / Sélectionnée (blue) · contacted → Contacted / Contacté (yellow) · visit_booked → Visit booked / Visite prévue (orange) · visited → Visited / Visité (purple) · applied → Applied / Candidature envoyée (pink) · won → Got it / Obtenu (green) · dropped → Dropped / Abandonné (brown) · gone → Gone / Partie (red) |
| verdict | match → Match (green) · maybe → Maybe (yellow) · filtered_out → Filtered out (gray) · scam → Suspected scam (brown) — same in every language |
| source | SeLoger (blue) · Bien'ici (green) · Leboncoin (orange) · PAP (yellow) · Gens de Confiance (red) · Figaro Immo (default) · agency → Agency / Agence (brown) · other → Other / Autre (gray); agency sites read directly get their own option (default colour) |
| reject_reasons | too_expensive Too expensive / Trop cher (red) · too_small Too small / Trop petit (orange) · wrong_area Wrong area / Mauvais quartier (yellow) · ground_floor Ground floor / Rez-de-chaussée (gray) · low_floor Floor too low / Étage trop bas (default) · no_lift No lift / Pas d'ascenseur (gray) · too_dark Too dark / Trop sombre (brown) · noisy Noisy / Bruyant (purple) · bad_layout Bad layout / Mauvais agencement (pink) · poor_condition Poor condition / Mauvais état (red) · bad_dpe Bad DPE / Mauvais DPE (orange) · no_outdoor No outdoor space / Pas d'extérieur (blue) · gone Already let / Déjà loué (gray) · agency_fees Agency fees / Frais d'agence (yellow) · scam Likely scam / Arnaque probable (red) · short_lease Short lease / Bail court (brown) · no_photo No photo / Pas de photo (default) · dead_link Dead link / Lien mort (gray) |

### Formulas

Create the properties they read first. English names below; for the workspace's own language, swap the `prop("…")` names, translate the texts, and replace the option literals ("Yes" in "Stage changed") with the display names from Schema › options.

**Freshness** — listings older than three weeks are rarely still available:
```
let(d, if(empty(prop("Posted")), prop("Added on"), prop("Posted")),
  let(age, dateBetween(now(), d, "days"),
    ifs(age < 7, style("🟢 This week", "b", "green"),
        age < 21, style("🟠 " + format(floor(age / 7)) + " wk ago", "orange"),
        style("⚪ Old (3 wk +)", "gray"))))
```

**Monthly rent** — the number is always charges included; the formula says so and adds the charges when known ("1 868 € CC · incl. 110 € charges", or "2 300 € HC · charges not stated"):
```
if(empty(prop("Rent")), "", lets(r, round(prop("Rent")), k, floor(r / 1000), m, mod(r, 1000),
  txt, if(k > 0, format(k) + " " + if(m < 10, "00", if(m < 100, "0", "")) + format(m), format(m)) + " €",
  if(prop("Rent excludes charges"), txt + " HC · charges not stated",
     txt + " CC" + if(empty(prop("Charges")), "", " · incl. " + format(round(prop("Charges"))) + " € charges"))))
```

**Living area** — "44 m²", rounded to the m²:
```
if(empty(prop("Surface")), "", format(round(prop("Surface"))) + " m²")
```

**Stage changed** — the queue `run` reads to date the stages the user moved:
```
and(format(prop("Decision")) == "Yes", format(prop("Stage")) != prop("Stage seen"))
```

### Page layout of a listing

Exactly this (English names):

```json
{"main": [
  {"type": "cover"},
  {"type": "title", "pinnedProperties": ["Link", "Decision", "My comment"], "propertyLabels": "show"},
  {"type": "properties", "sections": [
    {"name": "Essentials", "properties": [
      {"property": "Freshness"}, {"property": "Monthly rent"}, {"property": "Living area"},
      {"property": "Rooms"}, {"property": "Location"},
      {"property": "Floor", "visibility": "hide_if_empty"},
      {"property": "DPE", "visibility": "hide_if_empty"},
      {"property": "Furnished"}, {"property": "Summary"},
      {"property": "Available from", "visibility": "hide_if_empty"},
      {"property": "Rent cap", "visibility": "hide_if_empty"}]},
    {"name": "For the agent", "properties": [
      {"property": "Score"}, {"property": "Agent notes"}, {"property": "Stage"},
      {"property": "Stage since", "visibility": "hide_if_empty"}, {"property": "Source"},
      {"property": "Applied on", "visibility": "hide_if_empty"},
      {"property": "Rent", "visibility": "hide"}, {"property": "Charges", "visibility": "hide"},
      {"property": "Rent excludes charges", "visibility": "hide"}, {"property": "Surface", "visibility": "hide"},
      {"property": "Area", "visibility": "hide"}, {"property": "Address", "visibility": "hide"},
      {"property": "Reasons", "visibility": "hide"},
      {"property": "Verdict", "visibility": "hide"}, {"property": "Posted", "visibility": "hide"},
      {"property": "Photo", "visibility": "hide"}, {"property": "Fingerprint", "visibility": "hide"},
      {"property": "Feedback processed", "visibility": "hide"}, {"property": "Added on", "visibility": "hide"},
      {"property": "Stage seen", "visibility": "hide"}, {"property": "Stage changed", "visibility": "hide"}]}]},
  {"type": "editor"},
  {"type": "discussions"}]}
```

At the top of a listing: only Link, Decision, My comment. The score is the first line of "For the agent".

### What `run` writes on each listing page (for reference)

- **Title**: what the card does not already show — type, floor, unfurnished or furnished, plus private landlord, plus at most one standout feature, in the user's language. Format and examples in `../run/references/dedup-and-scoring.md` (in the `run` skill).
- **Cover**: the listing's first real photo.
- **Icon = state**: `icons/search_brown` (magnifier) while undecided, `icons/heart_red` when the user says yes, `icons/archive_gray` when they say no or the listing is gone.
- **Summary**: up to five bullet lines starting with ✅ ⚠️ ❓.

## Criteria

| Key | Type | EN name | FR name | Description (in the user's language) |
|---|---|---|---|---|
| title | title | Criterion | Critère | — |
| type | select | Type | Type | — |
| weight | number | Weight | Poids | "From 0 to 10, feeds the score" |
| category | select | Category | Catégorie | — |
| detail | text | Detail | Détail | — |
| active | checkbox | Active | Actif | — |
| origin | select | Origin | Origine | — |
| evidence | text | Evidence | Preuve | "The feedback this rule came from" |

Options and colours (key → EN / FR): type → dealbreaker Deal-breaker / Éliminatoire (red) · must Top priority / Prioritaire (orange) · nice Nice-to-have / Souhaité (blue) · bonus Bonus / Bonus (green). category → budget Budget / Budget (yellow) · location Location / Localisation (blue) · size Size & layout / Taille & agencement (purple) · building Building / Immeuble (brown) · comfort Comfort / Confort (pink) · practical Practical / Pratique (gray) · file Application file / Dossier (green). origin → declared Stated / Déclaré (blue) · learned Learned from your feedback / Appris de tes retours (purple).

Every criteria page gets the database's icon, `icons/target_red`, the learned ones included. No custom page layout.

## Run log (English for everyone)

| Property | Type |
|---|---|
| Run | title — `<date> <local time> — <mode>, <outcome>`, e.g. `2026-10-25 12:02 — computer, 2 new` |
| Date | date with time — the run's **start** time, UTC |
| Outcome | select: `OK` (green), `Nothing new` (gray), `Partial` (yellow), `Failed` (red) |
| Sources | multi-select: `Browser` (brown), SeLoger (blue), Bien'ici (green), Leboncoin (orange), PAP (yellow), Figaro Immo (default), Gens de Confiance (red), Agency (brown), `Agency sites` (gray) |
| Seen | number |
| New | number |
| Notes | text — starts with `emails read: N` (alert mails only), ends with `seen-ids: …` (see `run`) |

## Views

Create every linked view block (`parent_page_id`) with **`show_data_source_title: false`**: no database title above any view. A tab added with `database_id` ("Archives") takes no such parameter.

Where the machine views go: "Feedback queue" and "Recent listings" with `parent_page_id` = their BACKEND sub-page; "Latest runs" with `database_id` = the Run log database, as a tab of the database itself, next to its default view. Settings › Views › `Run log` stores the URL of this tab.

| On | Name (EN / FR) | Type | Configure (with display names) |
|---|---|---|---|
| Listings | To decide / À décider | gallery | `FILTER "Decision" IS EMPTY; FILTER "Stage" != "Gone"; SORT BY "Score" DESC, "Posted" DESC; SHOW "Listing", "Monthly rent", "Living area", "Location"; CARD LAYOUT default` — card preview: the page cover |
| Listings | Tracking / Suivi (first tab of "My selection") | board | `GROUP BY "Stage" SHOW EMPTY; FILTER "Decision" = "Yes"; FILTER "Stage" != "Dropped"; FILTER "Stage" != "Gone"; FILTER ("Stage" != "Contacted" OR "Stage seen" != "Contacted" OR "Stage since" >= "one_week_ago" OR "Stage since" IS EMPTY); FILTER ("Stage" != "Shortlisted" OR "Stage seen" != "Shortlisted" OR "Stage since" >= "one_week_ago" OR "Stage since" IS EMPTY); SORT BY "Added on" DESC; SHOW "Listing", "Monthly rent", "Living area", "Location"; CARD LAYOUT default` |
| Listings | Archives / Archives (second tab, same block) | table | `FILTER "Decision" = "Yes"; FILTER ("Stage" = "Dropped" OR "Stage" = "Gone" OR ("Stage" = "Contacted" AND "Stage seen" = "Contacted" AND "Stage since" < "one_week_ago") OR ("Stage" = "Shortlisted" AND "Stage seen" = "Shortlisted" AND "Stage since" < "one_week_ago")); SORT BY "Stage since" DESC; SHOW "Listing", "Monthly rent", "Living area", "Location", "Stage", "Stage since", "My comment", "Link"` |
| Criteria | My criteria / Mes critères | table | `FILTER "Active" = TRUE; SORT BY "Weight" DESC; SHOW "Criterion", "Type", "Weight", "Detail", "Origin"` |
| Listings | Feedback queue / Retours à traiter | table | `FILTER "Decision" IS NOT EMPTY; FILTER "Feedback processed" = FALSE; SHOW "Listing", "Decision", "Stage", "Reasons", "My comment", "Fingerprint", "Rent", "Surface", "Area"` |
| Listings | Recent listings / Annonces récentes | table | `FILTER "Added on" >= "one_month_ago"; SORT BY "Added on" DESC; SHOW "Listing", "Link", "Fingerprint", "Area", "Address", "Rent", "Rent excludes charges", "Surface", "Floor", "Furnished", "Source", "Stage", "Decision", "Reasons"` |
| Run log | Latest runs | table | `SORT BY "Date" DESC; SHOW "Run", "Date", "Outcome", "Sources", "New", "Notes"` |

The card of "To decide" shows only the title, Monthly rent, Living area and Location: no freshness, no score, no summary (the summary is on the page; the score still sorts the cards).

**"My selection" is one linked-database block with two tabs**: create "Tracking" with `parent_page_id` = home page (it lands at the end of the page), then "Archives" with `database_id` = that new block, then move the block's `<database>` tag into the "My selection" toggle with `update_content` (tag removed from the end of the page in the same call).
- "Tracking" is a kanban of the listings the user said yes to, one column per status, in the order of the `status` options. The user moves the cards from column to column as things happen; the agent moves them too (see `run` › feedback).
- A card leaves "Tracking" for "Archives" when its status is Dropped or Gone, or when it has sat in Shortlisted or Contacted for more than a week (validated in testing: a lead nobody acts on for a week is cold). To archive a card by hand, the user sets its status on the page.
- "A week" is measured with `status_since`, kept by the agent: Notion has no per-property change date, and "last edited" would restart at any edit. `status_seen` is the status the agent last dated; while it differs from `status` (the user just moved the card), the card stays on the board until the next run dates it. To bring an archived card back, the user changes its status.
- View filters cannot read a formula (the DSL drops them silently): the views compare `status_seen` and `status_since` directly, and only `run` reads `status_changed`, in rows mode.

**Set by hand.** The Notion tools cannot set the gallery's card preview and card size (`COVER` only accepts a files property, not the page cover). Once "To decide" exists, ask the user, in their language and with Notion's own labels, exactly: "In the To decide view: ••• › Layout › Card preview: Page cover, Card size: Medium." "Tracking" keeps Notion's default card settings. A board created by the tools gets its columns in **alphabetical** order, and the tools can neither reorder nor hide them. By hand, in "Tracking" › view settings › Group: drag the groups into the status order (Shortlisted, Contacted, Visit booked, Visited, Applied, Got it), and hide New, Dropped, Gone and "No Stage" (always empty in this view). Do it with computer use on the Notion app if the user allows it; otherwise ask: "In Tracking: ••• › Group, put the groups back in stage order and hide New, Dropped, Gone and No Stage." Toggles: leave them closed; the user opens them as they like.

**A view's type cannot be changed by the tools.** If the user turns "To decide" into another layout and wants it back, create a new gallery view with `notion-create-view` (`parent_page_id` = home page, `show_data_source_title: false`, the configuration above), move its `<database>` tag into the "To decide" toggle in place of the old one with `update_content` (one call; the user's request to restore it is the consent to drop the old view), then ask for the two hand settings again.

## "Settings — Rental search"

Its template is in `settings-page.md` (created at the very start of the setup). At this step, fill its Workspace, Views and Schema sections: the Schema with every key and option of the Listings, Criteria and Run log tables above, never with "...".

## Check before ticking step 4

Fetch the home page and compare it with the "Page content" block above, line by line: callout (icon, colour, three paragraphs, "My application" inside), three H2 toggles with their views and no database titles ("My selection" with its two tabs Tracking and Archives), divider, red H3 BACKEND toggle last: Settings (red gear, red title), the three databases, then the two red sub-pages, and no view block. Fetch one listing page layout and all the views (the four user views and the three machine views: one in each BACKEND sub-page, one tab of Run log) and compare them with this file: filters, sorts, shown properties. Fix any difference before going on.
