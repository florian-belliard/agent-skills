# Claude plugins

Claude plugins and Agent Skills by Florian Belliard, free to install and to adapt (MIT).

## Install

- **Claude Code**: `/plugin install <plugin> --marketplace florian-belliard/claude-plugins` adds the marketplace and installs in one step. On older versions, run `/plugin marketplace add florian-belliard/claude-plugins`, then `/plugin install <plugin>@florian-belliard`.
- **claude.ai, the desktop app and Cowork**: open **Customize > Plugins > Add > Add marketplace** and enter `florian-belliard/claude-plugins`. The plugins then show up next to the others, and they reach Claude Code too when you are signed in to the same account.
- **Other agents** (Codex, Cursor, Gemini CLI, GitHub Copilot…): `npx skills add florian-belliard/claude-plugins -a <agent>`. This installs the skills only, without commands or hooks.

## Catalog

<!-- One "### `plugin`" heading per plugin, then one "| `skill` | … |" row per skill.
     `task check` fails when this section and plugins/ disagree. -->

No plugins yet.

## Contributing

Issues and suggestions are welcome. `CLAUDE.md` holds the rules a new skill or plugin follows, and `task check` enforces them. It needs [Task](https://taskfile.dev), Bun 1.2.21 or later and the `claude` CLI.

## License

MIT. See [`LICENSE`](LICENSE).
