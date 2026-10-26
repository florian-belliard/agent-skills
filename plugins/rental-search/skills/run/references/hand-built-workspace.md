# A workspace built by hand

Read this only to write or fix the Settings › Schema map of a workspace built before this plugin. A normal run reads the map from Settings and never needs this file.

Example, an older workspace with English names:

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

Keys this workspace lacks (`applied_on`): leave them out of the map, or, in an interactive mode, ask the user whether to add the properties. A key set to `null` tells the run the workspace has no such property or option (see `notion-access.md` › Schema).
