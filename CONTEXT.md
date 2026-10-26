# Claude plugins

A Claude plugin marketplace for one audience: everyone. The repo is public, under the MIT licence, and its marketplace name is `florian-belliard`.

## Domain language
- **Skill**: a folder with a `SKILL.md` (Agent Skills spec) and, as needed, `references/`, `scripts/` and `assets/`. Claude loads it when its description matches the task.
- **Plugin**: the unit people install. It is one folder under `plugins/` holding `.claude-plugin/plugin.json` and `skills/`, plus `commands/`, `agents/`, `hooks/` or `.mcp.json` when needed.
- **Marketplace**: this repo, through `.claude-plugin/marketplace.json`. A person or an organisation adds it once, then receives every change merged to `main`.
- **Audience**: who can install from this marketplace. GitHub sets visibility per repo, so each repo serves exactly one audience:
  - you alone: a private repo;
  - one client organisation: a private repo, synced by its Owner;
  - everyone: a public repo.
- **Surface**: where a plugin runs: Claude Code, the Claude apps (claude.ai, desktop, Cowork), and other agents through `npx skills`.

## Tech stack
- Bun 1.2.21 or later + TypeScript for `src/`, the repo's own checks, which ship to no one.
- Tests run with `bun test`. YAML is parsed with `Bun.YAML`, so the checks have no runtime dependency.
- Lint with oxlint. Format with oxfmt, pinned exactly. Both skip `plugins/` and `starters/`, whose content is not this repo's code.

## Layout
- `.claude-plugin/marketplace.json`: the marketplace name, its owner, one entry per plugin.
- `plugins/<plugin>/`: what people install.
- `starters/`: copy one to start a plugin or a skill.
- `src/check-marketplace.ts` and `src/check-skill.ts`: the rules. `src/bin/check-marketplace.ts`: what `task marketplace` runs.

## Workflow
1. Branch, then create or change the skill with `writing-skills`.
2. `task check`, then `/commit`, `/tidy`, `/review`, `/pr`.
3. After the merge, every surface that added the marketplace receives the change:
   - claude.ai: with **Sync automatically** on, or through **Check for updates**;
   - Claude Code: through claude.ai, or `/plugin marketplace update`.
