# rental-search: your rental search agent (beta)

An agent that looks for a flat to rent for you, optimised for Paris and the French portals.

- Several times a day, it reads new listings: portal alerts by email, results pages in the built-in browser, a few agency sites.
- It drops what breaks your deal-breakers, removes duplicates, scores the rest and files it in Notion, under "To decide".
- You answer Yes or No, with a word if you like. Two rejections for the same reason become a rule, which you can remove.
- Your yeses move to "My selection" at the agent's next run: a board by stage (shortlisted, contacted, visit, applied…). A listing left a week in "shortlisted" or "contacted", dropped or gone, moves to the Archives tab.
- A short email tells you when there is something new. When an agency replies, the answer is ready as a draft in Gmail.
- To apply, one sentence is enough: "apply to the one on rue X". Nothing goes out without your ok.

## Before you start

| You need | Why | Required? |
|---|---|---|
| A paid Claude plan (Pro, Max, Team or Enterprise) | The scheduled tasks that run the agent are not on the free plan | Yes |
| Claude desktop app (Cowork) | Runs the agent. For now, leave your computer on, app open, at run times (see Beta limits) | Yes |
| Notion connector | The space where you decide. A free Notion account is enough | Yes |
| Gmail connector | Receive the alerts, send the recap, prepare replies | Yes (personal Outlook accounts cannot connect: use a Gmail address for the search) |
| Built-in browser | Create the alerts, read the portals, fill in application forms | Recommended: without it, the agent reads your emails only |
| Accounts on the portals you want alerts from (SeLoger, Bien'ici, Leboncoin, PAP…) | Alerts need an account. You log in yourself: the agent never types a password | For their alerts |
| A DossierFacile file | The agent gives its link instead of attaching your documents | Recommended |
| Computer use | Two or three Notion settings the tools cannot do | No, you can do them by hand |

Setup takes about 30 minutes. Every run uses your Claude plan's usage: four a day by default, each followed by a cloud fallback that stops at once when the computer run went through.

## Install

- **Claude desktop app**: open **Customize > Plugins > Add > Add marketplace**, enter `florian-belliard/claude-plugins`, then install `rental-search`.
- **Claude Code**: `/plugin install rental-search --marketplace florian-belliard/claude-plugins`. The agent itself runs in the desktop app (see Before you start).

## Getting started

Just say: "I'm looking for a flat to rent, help me set up the agent."

Setup takes 7 steps, in conversation: presentation, your criteria, your file and application message, the Notion workspace, the alerts, the times, then a first live search. It picks up where you left off if you close the window.

## The four skills

| Skill | When | Examples |
|---|---|---|
| `setup` | Set up (or resume) the search | "help me find a flat to rent" |
| `run` | One agent run; started by the scheduled tasks | "run a search now" |
| `apply` | Apply, reply to an agency | "apply to the last one", "reply to the agency" |
| `tune` | Change criteria, pause, ask about a listing | "is the rent legal?", "pause the search" |

## What the agent touches

- **Gmail**: it reads your portal alerts, and the mails to your application address that look like an agency's reply. It creates a "Rental search" label, and a Gmail filter after your ok. It writes reply drafts and sends you the recap, and sends nothing else on its own.
- **Notion**: it creates a home page, three databases (listings, criteria, run log), a "My application" page and a "Settings" page. Your contact details, situation and DossierFacile link live in "My application".
- **The built-in browser**: it reads result pages and listings. It creates alerts and fills application forms only after your ok. Sites you log in to there stay logged in; the agent signs you out of Google after creating the Gmail filter.
- **Outside services**: listing addresses go to the French government geocoder (`data.geopf.fr`) to place them on the map, and a weekly web search checks that the rental rules it applies are still current.

## What the agent never does

- Type a password, create an account, get past a CAPTCHA.
- Send anything to an agency or a landlord (message, application, reply) without your explicit ok, listing by listing. The only mail that goes out on its own is your recap.
- Write your decision or comment for you, or delete a listing.
- Drop a listing on an assumption: a deal-breaker only counts if the listing states it.

Your contact details, situation and file stay in your Notion, and go only into the applications you approve.

## Beta limits

- For now, Claude needs your computer on, with the Claude app open, at run times: that is how it opens the browser and does its best work. When the computer is off, a fallback runs on your emails only: it still works, but sees fewer listings and less detail. So leave it on at those hours: you get the full search.
- Designed for Paris, the French portals (SeLoger, Bien'ici, Leboncoin, PAP, Figaro Immo, Gens de Confiance) and Paris rent control. Elsewhere it works, but less precisely.
- Not built for flatshares: by default, colocation listings are set aside.
- Some sites sometimes show an anti-bot check: the agent then skips that site for that run and tells you.
- Links in the recap mail go through a Google redirect warning page: that is the Gmail connector, nothing to do.
- A few Notion settings (order of the board columns, card size) cannot be done with the tools: the agent tells you what to click, or does it with computer use if you allow it.
