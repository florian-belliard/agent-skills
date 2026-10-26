# "Settings — Rental search"

Created at the very start of the setup (title gets " (test)" in test mode), filled as the setup goes. `run`, `apply` and `tune` read it first, every time. **Keep the labels exactly as written, in English, in every language.**

~~~
## Setup progress
- [ ] 1. Presentation
- [ ] 2. Criteria
- [ ] 3. My application
- [ ] 4. Notion workspace
- [ ] 5. Alerts
- [ ] 6. Digest and scheduled runs
- [ ] 7. First run

## User
- Language = …
- Application language = French
- Time zone = Europe/Paris

## Criteria draft
(removed once the Criteria database is filled)

## Message draft
(removed once "My application" exists)

## Workspace
- Home page = <page URL>
- Listings = <collection:// URL>
- Criteria = <collection:// URL>
- Run log = <collection:// URL>
- My application = <page URL>

## Views
- To decide = <view URL>
- To decide link = https://www.notion.so/<view block id>?v=<view id without dashes> (the mail's button)
- Tracking = <view URL>
- Archives = <view URL>
- Feedback queue = <view URL>
- My criteria = <view URL>
- Recent listings = <view URL>
- Run log = <view URL>

## Schema
```json
{"listings": {"title": "Listing", "link": "Link", "...": "every key of the Listings table"},
 "options": {"decision": {"yes": "Yes", "no": "No"}, "...": "every option table"},
 "criteria": {"title": "Criterion", "...": "every key of the Criteria table"},
 "run_log": {"name": "Run log", "browser_source": "Browser", "agency_source": "Agency sites",
             "outcome": {"ok": "OK", "nothing_new": "Nothing new", "partial": "Partial", "failed": "Failed"}}}
```

## Search
- City = …
- Alert address = …
- Application email = …
- Gmail query = (deliveredto:<alias> OR to:<alias> OR label:"Rental search")
- Human mail query = (to:<application email> -from:(noreply OR no-reply OR alerte OR alertes OR newsletter OR notification) (visite OR dossier OR candidature OR appartement OR logement OR annonce)) OR (from:(<picked domains, joined with OR>) subject:(message OR répondu OR écrit))
- Sites followed = …
- SeLoger search URL = …
- Bien'ici search URL = …
- Agency sites read directly = … (or "none")

## Digest
- Sent to = <email>
- Test mode = no
- Texts = (only if `run/references/digest.md` has no version in the user's language: the fixed translation of the digest texts, written at step 6)

## Runs
- Times = …
- Computer task = <trigger id>
- Fallback task = <trigger id>

## Upkeep
- Last rules check = <date>
~~~

Write the Schema block in full at step 4 (every key and option of the Listings, Criteria and Run log tables in `notion-workspace.md`), never with "...". The Gmail queries carry **no time window**: `run` adds `after:<T>` itself. In `Human mail query`, the relayed-messages clause (`from:(…) subject:(…)`) lists only the sender domains of the sites picked at step 5.1 (`alerts-in-browser.md` › 5.1).
