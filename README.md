# Claude plugins

Claude plugins and Agent Skills by Florian Belliard, free to install and to adapt (MIT).

## Install

- **Claude Code**: `/plugin install <plugin> --marketplace florian-belliard/claude-plugins` adds the marketplace and installs in one step. On older versions, run `/plugin marketplace add florian-belliard/claude-plugins`, then `/plugin install <plugin>@florian-belliard`.
- **claude.ai, the desktop app and Cowork**: open **Customize > Plugins > Add > Add marketplace** and enter `florian-belliard/claude-plugins`. The plugins then show up next to the others, and they reach Claude Code too when you are signed in to the same account.
- **Other agents** (Codex, Cursor, Gemini CLI, GitHub Copilot…): `npx skills add florian-belliard/claude-plugins -a <agent>`. This installs the skills only, without commands or hooks.

## Catalog

<!-- One "### `plugin`" heading per plugin, then one "| `skill` | … |" row per skill.
     `task check` fails when this section and plugins/ disagree. -->

### `rental-search`

A rental search agent for the Claude desktop app (Cowork), in beta and optimised for Paris and the French portals. The skills are written in English and talk to the user in their language; what goes to a landlord or an agency is written in the listing's language. Install it as a plugin: its skills call each other as `rental-search:<skill>` and rely on Cowork's scheduled tasks and built-in browser, so `npx skills` does not give a working agent. To start, say "I'm looking for a flat to rent, help me set up the agent." More in [`plugins/rental-search/README.md`](plugins/rental-search/README.md).

**Needs:** a paid Claude plan (Pro or above) with the desktop app, a Notion account and a Gmail address. Built for Paris and the French portals.

| Skill | What it does | Requires |
|---|---|---|
| `setup` | Sets the agent up in conversation, in seven steps: presentation and prerequisites, criteria interview, application file and message, the Notion workspace, portal alerts created in the browser, the scheduled runs, then a first live run. Resumes where the user stopped. | Notion and Gmail connectors, scheduled tasks; the built-in browser is recommended |
| `run` | One pass, started by the scheduled tasks: reads result pages, alert emails and a few agency sites, drops what breaks a deal-breaker, deduplicates, scores, files the rest in Notion, learns from the user's verdicts, drafts replies to agencies and emails a recap. | Notion, Gmail; the built-in browser on the computer (a cloud fallback reads emails only) |
| `apply` | Applies to the listings the user names: adapts the saved message to each listing, shows each application for approval, then fills the contact form and sends only what the user approves, listing by listing. Also drafts replies to agencies. | Built-in browser, Gmail, Notion |
| `tune` | Changes a running agent (criteria, learned rules, pause, hours, sites) and answers questions about a listing: rent cap, DPE, scam signals, the strength of the user's file. | Notion; the built-in browser to update alerts |

## Contributing

Issues and suggestions are welcome. `CLAUDE.md` holds the rules a new skill or plugin follows, and `task check` enforces them. It needs [Task](https://taskfile.dev), Bun 1.2.21 or later and the `claude` CLI. To report a security issue, see [`SECURITY.md`](SECURITY.md) rather than opening an issue.

## License

MIT. See [`LICENSE`](LICENSE).
