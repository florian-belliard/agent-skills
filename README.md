# Agent skills

Plugins and Agent Skills by Florian Belliard, free to install and to adapt (MIT).

## What's here

- **Plugins**, in `plugins/<name>/`: a tool built on one vendor's features, installed from that vendor's catalog. Today they are all Claude plugins, listed in `.claude-plugin/marketplace.json`.
- **Portable skills**, in `skills/<name>/`: plain [Agent Skills](https://agentskills.io) that any agent supporting the format can load. None yet; once there is one, `npx skills add florian-belliard/agent-skills --skill <name>` installs it in your agent.

A tool offered to several vendors stays one folder, with one manifest per vendor inside. [`CONTEXT.md`](CONTEXT.md) explains the layout.

## Install a Claude plugin

- **Claude desktop app, claude.ai and Cowork**: open **Customize > Plugins > Add > Add marketplace**, enter `florian-belliard/agent-skills`, then add the plugin. It is saved to your account, so Claude Code receives it too when you sign in there with the same account.
- **Claude Code** (2.1.275 or later): `/plugin install <plugin> --marketplace florian-belliard/agent-skills`. On an older version: `/plugin marketplace add florian-belliard/agent-skills`, then `/plugin install <plugin>@florian-belliard`.

A plugin's skills rely on each other and on the vendor's features: install the plugin, not its skills one by one.

## Updates

Plugins carry no version number: every change merged to `main` is the new version.

- **Desktop app and claude.ai**: in **Customize > Plugins**, turn on **Sync automatically** for this marketplace, or use **Check for updates**.
- **Claude Code**: auto-update is off by default for marketplaces outside Anthropic's. Turn it on in `/plugin` › **Marketplaces** › `florian-belliard` › **Enable auto-update**, or update by hand with **Update marketplace** on the same screen.

## Catalog

<!-- One "### `plugin`" heading per plugin, then one "| `skill` | … |" row per skill.
     `task check` fails when this section and plugins/ disagree. -->

### `rental-search`

A rental search agent for the Claude desktop app (Cowork), in beta: France, optimised for Paris. It needs a paid Claude plan, Notion and Gmail, and does its best work with the computer on at run times. To start, say "I'm looking for a flat to rent, help me set up the agent." The rest, privacy and removal included: [`plugins/rental-search/README.md`](plugins/rental-search/README.md).

| Skill | What it does | Requires |
|---|---|---|
| `setup` | Sets the agent up in conversation, in seven steps, and resumes where the user stopped. | Notion and Gmail connectors, scheduled tasks; the built-in browser is recommended |
| `run` | One pass, started by the scheduled tasks: new listings filtered, deduplicated, scored and filed in Notion, then an email recap. | Notion, Gmail; the built-in browser on the computer (a cloud fallback reads emails only) |
| `apply` | Applies to the listings the user names, and drafts replies to agencies. Nothing is sent without the user's ok. | Built-in browser, Gmail, Notion |
| `tune` | Changes a running agent (criteria, pause, hours, sites) and answers questions about a listing. | Notion; the built-in browser to update alerts |

## Feedback and contributing

Questions, bugs and ideas: [open an issue](https://github.com/florian-belliard/agent-skills/issues/new/choose), or write to support@florianbelliard.com if you have no GitHub account. A security problem goes through [`SECURITY.md`](SECURITY.md), never an issue. To change the code or a skill, read [`CONTRIBUTING.md`](CONTRIBUTING.md) first.

## License

MIT. See [`LICENSE`](LICENSE).
