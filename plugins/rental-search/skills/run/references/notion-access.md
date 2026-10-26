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

A key set to `null` means the workspace has no such property or option. `run_log.agency_source: null`: the Run log has no agency marker, so look for "agency sweep" in the Notes instead, and write it there.

A workspace built by hand before this plugin works once its map is written in Settings. To write or fix such a map, read `hand-built-workspace.md`; a normal run does not need it.
