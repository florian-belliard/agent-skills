# rental-search: your rental search agent (beta)

An agent that looks for a flat to rent for you, in France, optimised for Paris. It runs in the Claude desktop app (Cowork), on a paid Claude plan, with Notion and Gmail.

**Leave your computer on, with the Claude app open, at run times.** That is when the agent opens the browser and does its best work. When the computer is off, a fallback runs in the cloud on your emails only: it still works, but sees fewer listings and less detail.

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
| Claude desktop app (Cowork) | Runs the agent, at its best with the computer on at run times | Yes |
| Notion connector | The space where you decide. A free Notion account is enough | Yes |
| Gmail connector | Receive the alerts, send the recap, prepare replies | Yes (personal Outlook accounts cannot connect: use a Gmail address for the search) |
| Built-in browser | Create the alerts, read the portals, fill in application forms | Recommended: without it, the agent reads your emails only |
| Accounts on the portals you want alerts from (SeLoger, Bien'ici, Leboncoin, PAP…) | Alerts need an account. You log in yourself: the agent never types a password | For their alerts |
| A DossierFacile file | The agent gives its link instead of attaching your documents | Recommended |
| Computer use | Two or three Notion settings the tools cannot do | No, you can do them by hand |

Setup takes about 30 minutes, in conversation.

**Cost.** Each run counts against your Claude plan's usage, and a run that finds new listings is a long task: it reads pages, writes to Notion and sends an email. The default is four runs a day, each followed by a cloud fallback that stops at once when the computer run went through. On a Pro plan this can take a large share of your limits: pick fewer run times during setup, or later ("run only twice a day").

## Install

- **Claude desktop app**: open **Customize > Plugins > Add > Add marketplace**, enter `florian-belliard/agent-skills`, then add `rental-search`.
- **Claude Code**: `/plugin install rental-search --marketplace florian-belliard/agent-skills`. The agent itself runs in the desktop app.

## Getting started

Just say: "I'm looking for a flat to rent, help me set up the agent."

Setup takes seven steps: presentation, your criteria, your file and application message, the Notion workspace, the alerts, the run times, then a first live search. It picks up where you left off if you close the window.

## The four skills

| Skill | When | Examples |
|---|---|---|
| `setup` | Set up (or resume) the search | "help me find a flat to rent" |
| `run` | One agent run; started by the scheduled tasks | "run a search now" |
| `apply` | Apply, reply to an agency | "apply to the last one", "reply to the agency" |
| `tune` | Change criteria, pause, ask about a listing | "is the rent legal?", "pause the search" |

## Updates

The plugin has no version number: each change published to the repository is the new version. In **Customize > Plugins**, turn on **Sync automatically** for the `florian-belliard` marketplace to receive changes as they come, or use **Check for updates**.

An update changes how the next runs behave. It leaves what setup created as it is: your Notion pages, portal alerts, Gmail filter and scheduled tasks.

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

## Privacy and risks

- **Where your data lives.** Your criteria, listings, notes, contact details and DossierFacile link are in your Notion. Alerts, recaps and agency replies are in your Gmail. Neither this repository nor its author receives anything.
- **What Claude sees.** To work, Claude reads your alert emails, the agency replies, the listing pages and your Notion pages, under your Claude account's terms. The Gmail and Notion connectors give it access to your whole mailbox and workspace: the skills tell it to read only the alert mails and the replies to your applications, but the access itself is the connector's.
- **Outside services.** The geocoder receives listing addresses and the weekly web search receives questions about the rules, nothing about you. The portals see the agent's visits as yours, from your browser.
- **Content that tries to steer the agent.** A mail or a listing could hold text written to make the agent act: send a document, write to someone, open a link. The agent treats every mail and page as data, sends no mail but your recap, and applies only after your ok, listing by listing. These rules lower the risk; they cannot remove it, so read what you approve. If you see the agent do something you did not ask for, see [`SECURITY.md`](../../SECURITY.md).
- **A separate mailbox, if you prefer.** Setup suggests a `+location` alias of your Gmail address so alerts are easy to find. To keep the agent away from your main mailbox, create a Gmail account for the search and connect that one instead.

## Stop, pause, uninstall

- **Pause**: say "pause the search". The scheduled tasks are turned off until you say "resume the search". Nothing else changes.
- **Remove everything**, in this order:
  1. Delete the scheduled tasks, "Rental search — computer" and "Rental search — fallback" (named in your language; without the built-in browser, only the fallback exists), from the desktop app's scheduled tasks.
  2. Delete the alerts on each portal, from your account on the site. Keep them if you still want their emails.
  3. In Gmail, delete the filter that applies the "Rental search" label (**Settings › Filters and blocked addresses**), then the label. Deleting a label keeps its mails.
  4. Remove the plugin: in **Customize > Plugins**, open `rental-search`, open its menu and select **Remove**. In Claude Code: `claude plugin uninstall rental-search@florian-belliard`.
  5. Last, delete the "Rental search" page in Notion: its databases, "My application" and "Settings — Rental search" go with it. Export it first if you want to keep your listings and notes.
- **What stays**: the mails you received and the drafts in Gmail, the applications you sent (the agencies have them), your accounts on the portals, the sites you logged in to in the built-in browser (log out there if you like), the Notion and Gmail connectors (disconnect them in **Customize > Connectors** if nothing else uses them), and your conversations with Claude.

## Limits and responsibility

- **France only.** Built for the French portals (SeLoger, Bien'ici, Leboncoin, PAP, Figaro Immobilier, Gens de Confiance) and the French rental rules, and optimised for Paris and its rent control. Elsewhere in France it works, less precisely. It is not designed for other countries.
- **Flatshares.** Listings for a room in a flatshare are set aside. A group renting a whole flat together is fine: whole flats are what the agent looks for.
- **Not legal advice.** What the agent says about rent control, the DPE or your file is information to check, not legal advice. Your département's ADIL answers such questions for free.
- **The sites' terms apply.** The agent reads the portals with your browser and your accounts, and stops at any anti-bot check. Using a site through the agent is still your use of that site.
- **No affiliation.** This plugin is not affiliated with Anthropic, Notion, Google or any portal.
- **You approve what is sent.** Nothing goes to an agency or a landlord without your ok, and what you approve goes out in your name. The agent can miss a listing or misread one: it is a beta.
- **Known rough edges.** Some sites sometimes show an anti-bot check: the agent then skips that site for that run and tells you. Links in the recap mail go through a Google redirect warning page: that is the Gmail connector, nothing to do. A few Notion settings (order of the board columns, card size) cannot be done with the tools: the agent tells you what to click, or does it with computer use if you allow it.

## Glossary

- **Cowork**: the part of the Claude desktop app where Claude carries out tasks on your computer. The agent runs there.
- **Connector**: a link between Claude and one of your services, here Notion and Gmail, set in **Customize > Connectors**.
- **Scheduled task**: a task the desktop app starts on its own at set times. The agent's runs are two of them.
- **Built-in browser**: the browser inside the Claude desktop app. The agent reads sites with it, and creates alerts and fills forms after your ok.
- **DPE** (diagnostic de performance énergétique): a home's energy rating, from A (best) to G (worst).
- **DossierFacile**: the French government's free service to build a verified rental file, shared as a link.
- **Visale**: a free rent guarantee from Action Logement, which can replace a personal guarantor.

## Report a problem

- A bug or an idea: [open an issue](https://github.com/florian-belliard/agent-skills/issues/new/choose). Issues are public: keep personal data out of them.
- No GitHub account, or something private: support@florianbelliard.com.
- A security problem: [`SECURITY.md`](../../SECURITY.md).
