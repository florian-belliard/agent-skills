# Step 6 — Digest and scheduled runs

Goal: the agent runs on its own, from the person's computer when it is on, from the cloud when it is not, and they get one short mail when there is something to see.

## Ask, one at a time

Say the quoted sentences in the user's language.

1. "Which address should I send the recap to?" Default: their main email. Store it in Settings › Digest › `Sent to`.
2. First say what is in "What to say about the computer" (below). Then: "I'll run the search at 9:00, 12:00, 15:00 and 18:00. Other times?" Update the number of runs and the hours in the home page callout.
3. Their time zone: take it from the city (Europe/Paris for France) unless they say otherwise. Store it in Settings › User › `Time zone`.

## Create two scheduled tasks

Use the scheduled-task tools (`create_trigger`). Read their current schema first and follow their own guidance on cron minutes and jitter.

| | Task 1 — on the computer | Task 2 — cloud fallback |
|---|---|---|
| Name | "Rental search — computer", in the user's language (+ " (test)" in test mode) | "Rental search — fallback", in the user's language (+ " (test)") |
| When | the chosen hours, `CRON_TZ=<timezone>` | 45 minutes after each, same timezone |
| `requires_local_device` | true (needs the built-in browser) | false |
| Prompt | below | below |

`CRON_TZ` means no manual fix at daylight-saving changes. Test mode: shift both tasks by 20 minutes, so two agents never use the browser at the same time.

**Prompt, task 1** (keep it in English: it is read by the agent, not the user):
```
Run the skill rental-search:run in mode "computer". Settings page: <Settings URL>. Unattended run: ask no questions.
```

**Prompt, task 2:**
```
Run the skill rental-search:run in mode "fallback". Settings page: <Settings URL>. Unattended run: ask no questions.
```

**No built-in browser** (step 1 found none): create task 2 only, at the chosen hours instead of 45 minutes after, and skip "What to say about the computer". The runs then read the emails only: say so in one sentence.

Store the task ids in Settings › Runs, and in `Times` the **exact** times the computer task got (after any minute jitter the tool applies): the digest announces them. The fallback runs 45 minutes after each of those times.

If `run/references/digest.md` gives no version of the digest's fixed texts in the user's language: write them (headlines, sublines, info lines, button, the next-run line, subjects), translated once, in Settings › Digest › `Texts`. Every run uses that translation as is.

## Approval setting

Unattended runs stop whenever an action needs approval and nobody is there. After creating the tasks, tell them in one sentence which approval setting each task got (the tool result says it). If a task will ask for approval, add:

> "For the search to run without you, open each task in Claude and turn on 'Automatically approve' (if your organisation allows it)."

## What to say about the computer

Say it plainly, before asking about the hours:

> "For now, I need your computer on, with the Claude app open, at run times: that's how I open the browser and do the job well. When it's off, a fallback runs 45 minutes later, on your emails only. It still works, but it sees fewer listings and less detail (no floor, no DPE from the result pages). So leave your computer on at those times if you can. When is it usually on? I'll pick the run times to match."
