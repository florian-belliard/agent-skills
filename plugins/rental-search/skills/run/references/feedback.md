# Feedback — turn a "no" into a rule

Done first in every full run, so today's listings are judged with today's rules.

## Who owns what

| Field | Owner | Meaning |
|---|---|---|
| verdict, score | agent | Your reading of the listing |
| decision | **user** | Their call. You only read it. |
| reject_reasons | agent | Hidden from the user's page: they do not fill it. Derive the reasons **only** from what their comment says. It is the countable index behind "same reason twice". |
| comment | **user** | Their words. Never edit it. It weighs more than the tags when they disagree. |
| feedback_processed | agent | Ticked once you have learned from the row |

## Steps

Read "Feedback queue" (view mode): rows with a decision and `feedback_processed` unticked. For each:

1. Derive the reasons from the comment. A reason no option covers: add the option to the property (in the user's language) and to Settings › Schema › options › reject_reasons, rather than forcing the nearest one, and say so in your final answer.
2. **One rejection is an opinion; the same reason twice is a rule.** Look at earlier rejections with the same reason (one targeted query, not the whole base). Yes rows are evidence too: what they share tells you what to weigh up.
3. A rule: write a row in Criteria (page icon = the Criteria database's icon), in the user's language, `origin = learned`, the evidence in `evidence` (which listings, which words). Give it the right type: a deal-breaker only if the user's words are absolute ("never", "no go"), otherwise a nice-to-have with a weight. The digest carries the 💡 "New rule learned" line (see `digest.md`).
4. Tick `feedback_processed`, and in the same call set the page icon: heart for yes, archive for no (see `notion-access.md` › Writing). For a yes, also set `status = shortlisted` if it is still `new` or empty (with `status_seen` and `status_since`).

Then **date the stages the user moved** (the gate of a scheduled run already did it): query Listings in rows mode with the formula filter `status_changed` = true (not SQL, not a view: view filters cannot read formulas). On each row set `status_since` = today and `status_seen` = the display name of its `status`. Nothing else on those rows. If the query is refused, skip it (see `notion-access.md`).

**`status` after the yes.** `new` until the user decides, `shortlisted` on their yes, `applied` when `apply` sends, `gone` when the listing is withdrawn. `contacted`, `visit_booked`, `visited`, `won`, `dropped` are the user's; `run` may set `visit_booked` only when an agency email confirms a visit, with the digest's 📅 line. Never move it backwards. The user moves the cards between the columns of "My selection › Tracking" (one column per status); `dropped`, `gone` and a card in `shortlisted` or `contacted` for more than a week (by `status_since`) go to the "Archives" tab, and come back when the user changes the status.

**The checkbox is the watermark: never replace it with a date window.** A row is learned once and never re-read, so the queue stays small forever and nothing decided between two runs is lost.

**A decision with no reason is still valid input.** Count it towards patterns, never invent the reason, never nag. Three unexplained rejections with something obvious in common is a question to ask the user, not a rule to write, and never a line in the digest: write it in the Run log notes as `question: …`; `tune` asks it next time the user talks to you.

**Never silently downweight anything.** A filter the user cannot see is a filter they cannot trust.
