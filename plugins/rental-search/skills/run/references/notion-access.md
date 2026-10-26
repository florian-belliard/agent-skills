# Reading and writing Notion

## The allowance problem

On most Notion plans, SQL and rows-mode queries (`notion-query-data-sources` with `mode: sql` or `rows`) share a **workspace-wide allowance** that resets within the hour. Four runs a day, a second agent in test mode, plus the user's own use, and it runs out: the run then cannot dedup and fails. **View mode** (`mode: view` with a view URL) does not count against it.

So:

| Read | How |
|---|---|
| Last 8 Run log rows | View mode on the Run log view, `page_size: 8` |
| Verdicts to learn from | View mode on "Feedback queue" |
| Active criteria | View mode on "My criteria" |
| Known portal IDs / references for the batch | **One** SQL query for the whole batch (below) |
| Dedup candidates by postcode | **One** SQL query for all of today's postcodes (below) |
| Earlier rejections, for feedback patterns | **One** SQL query, only when "Feedback queue" is not empty |
| Stages to date (`status_changed` = true) | **One** rows-mode query with a formula filter (view filters cannot read formulas). Refused: skip it this run and note it; the cards stay on the board until a later run dates them, nothing is lost |
| Fallback when SQL is refused | View mode on "Recent listings" (last month), compare in memory |

If a SQL call returns a usage-limit error, do not retry it: switch to the fallback, and write "SQL quota reached, dedup on recent view" in the Run log notes. Never skip dedup.

## The two SQL queries

These use the English display names; use the names from Settings › Schema.

```sql
-- 1. Known listings, whole batch at once
SELECT url, "Link", "Stage", "Decision"
FROM "<Listings collection URL>"
WHERE "Link" LIKE ? OR "Link" LIKE ? OR ...        -- one '%<ID>%' per candidate (its key, dedup-and-scoring.md › 2); batches of 50

-- 2. Dedup candidates, all postcodes of the batch at once
SELECT url, "Listing", "Link", "Fingerprint", "Rent", "Rent excludes charges", "Surface", "Area", "Address", "Floor", "Furnished", "Source", "Stage", "Decision"
FROM "<Listings collection URL>"
WHERE "Fingerprint" LIKE ? OR "Fingerprint" LIKE ? OR "Area" LIKE ? ...   -- '<postcode>-%' and '%<postcode>%'
```

Bind values with `params`, never by string concatenation.

## Writing

- **Create all new rows of the run in one `notion-create-pages` call** when possible. Set the page cover to the listing photo.
- Updates (feedback ticks, `status = gone`, a better link on an existing row): batch them too.
- Agent fields only. Never `decision`, never `comment`.
- **Page icon = state of the listing** (`icon` parameter, not a property): `icons/search_brown` for a new or undecided row, `icons/heart_red` when `decision = yes`, `icons/archive_gray` when `decision = no` or `status = gone`. Set it at creation, in the feedback update, and whenever you set `status = gone`.
- **Every time you set `status`, set `status_seen` and `status_since` in the same call**: `status_seen` = the status option's **display name**, exactly as in Schema › options › status ("Contacted", not `contacted`: the views and the `status_changed` formula compare display names); `status_since` = today. "My selection" reads them to send a card left a week in `shortlisted` or `contacted` to "Archives".

## Schema

Settings › Schema maps canonical keys to the workspace's property and option names. Resolve every name through it. If a key is missing from the workspace, skip that field and say so once in the Run log notes, never invent the property.

### Workspaces created before this plugin

A workspace built by hand can be used by writing its map in Settings. Example, an older workspace with English names:

```json
{"listings": {"title": "Listing", "link": "Link", "score": "Score", "decision": "My decision",
  "summary": "Summary", "floor": "Floor", "dpe": "DPE", "charges": "Charges",
  "available_from": "Available from", "rent_cap": "Rent cap check", "reject_reasons": "Reject tags",
  "comment": "My comment", "status": "Stage", "agent_notes": "Agent notes", "source": "Source",
  "verdict": "Verdict", "rent": "Rent", "surface": "Surface", "rooms": "Rooms", "area": "Area",
  "furnished": "Furnished", "posted": "Posted", "photo": "Photo", "fingerprint": "Fingerprint",
  "feedback_processed": "Feedback processed", "added_on": "Ajoutée le", "freshness": "Fraîcheur",
  "rent_display": "Loyer", "rent_excl_charges": "Rent excludes charges", "location": "Location",
  "surface_display": "Superficie", "address": "Address", "status_since": "Stage since",
  "status_seen": "Stage seen", "status_changed": "Stage changed"},
 "options": {"decision": {"yes": "Approved", "no": "Rejected"},
  "status": {"new": "New", "shortlisted": "Shortlisted", "contacted": "Contacted", "applied": "Applied", "visit_booked": "Visit booked",
             "visited": "Visited", "won": "Got it", "dropped": "Passed", "gone": "Gone"},
  "dpe": {"unknown": "Unknown"},
  "rent_cap": {"within": "Within cap", "over": "Over cap", "unknown": "Not checkable"},
  "type": {"dealbreaker": "Éliminatoire", "must": "Prioritaire", "nice": "Souhaité", "bonus": "Bonus"},
  "origin": {"declared": "Déclaré", "learned": "Appris de tes retours"}},
 "criteria": {"title": "Critère", "type": "Type", "weight": "Poids", "category": "Catégorie",
  "detail": "Détail", "active": "Actif", "origin": "Origine", "evidence": "Preuve"},
 "run_log": {"name": "Run log", "browser_source": "Direct pull", "agency_source": null,
             "outcome": {"ok": "OK", "nothing_new": "Nothing new", "partial": "Partial", "failed": "Failed"}}}
```

Missing keys there (`applied_on`): skip them, or, in an interactive mode, ask the user whether to add the properties. `agency_source: null` means the Run log has no agency marker: look for "agency sweep" in the Notes instead, and write it there.
