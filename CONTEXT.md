# Agent skills

Florian Belliard's public collection of plugins and Agent Skills, under the MIT licence. Anyone can install from it. Its Claude marketplace is named `florian-belliard`.

## Domain language
- **Skill**: a folder with a `SKILL.md` ([Agent Skills spec](https://agentskills.io/specification)) and, as needed, `references/`, `scripts/` and `assets/`. An agent loads it when its description matches the task.
- **Portable skill**: a skill that needs nothing beyond the spec, so any agent that supports Agent Skills can run it.
- **Vendor**: a company whose apps install plugins. Anthropic (Claude) is the only one here today.
- **Plugin**: what people install from a vendor's catalog: one tool, in one folder, with that vendor's manifest. A Claude plugin holds `.claude-plugin/plugin.json` and `skills/`, plus `commands/`, `agents/`, `hooks/` or `.mcp.json` when needed.
- **Catalog**: a vendor's list of the plugins in this repo, at the root, where that vendor looks for it. For Claude it is `.claude-plugin/marketplace.json`, the **marketplace** people add once to receive every change merged to `main`.
- **Surface**: where a plugin or a skill runs: Claude Code, the Claude apps (claude.ai, desktop, Cowork), and other agents through `npx skills`.

## Layout
- `.claude-plugin/marketplace.json`: the Claude catalog: the marketplace name, its owner, one entry per plugin.
- `plugins/<name>/`: one tool. Each vendor that supports it adds its own manifest inside; the tool is never copied once per vendor.
- `skills/<name>/`: portable skills. None yet.
- `starters/`: copy one to start a plugin or a skill.
- `src/check-marketplace.ts` and `src/check-skill.ts`: the repo's rules, as code. `src/bin/check-marketplace.ts` is what `task marketplace` runs.

## Where a skill goes
- **It relies on one vendor's features** (scheduled tasks, connectors, a built-in browser): it lives in the plugin that serves it. `rental-search`'s four skills are of this kind.
- **It is portable**: it lives in `skills/<name>/`, where `npx skills` looks first. A plugin that reuses it gets a copy in its own folder, because every Claude surface (desktop sync, organisation sync, zip upload) installs a self-contained plugin folder. A `task sync` will make that copy and `task check` will compare it with the original; both arrive with the first portable skill a plugin reuses.

## Tech stack
- Bun 1.2.21 or later + TypeScript for `src/`, the repo's own checks, which ship to no one.
- Tests run with `bun test`. YAML is parsed with `Bun.YAML`, so the checks have no runtime dependency.
- Lint with oxlint. Format with oxfmt, pinned exactly. Both skip `plugins/` and `starters/`, which hold content rather than this repo's code.

## Workflow
1. An issue first, then a branch.
2. Create or change the skill as `CLAUDE.md` says, then `task check`.
3. A pull request. Once it is merged to `main`, every surface that added the marketplace receives it (README, "Updates").
