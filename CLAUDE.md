# Project harness

This repo is a Claude plugin marketplace for one audience (`CONTEXT.md` says which). It was created from `templates/plugin-marketplace/` of the claude-code-setup repo, whose ADR-0007 records why there is one repo per audience. It uses **Superpowers** as the execution harness.

## Entering this repo
1. Read `CONTEXT.md`.
2. `task check` before every commit. It runs `check-marketplace` and `claude plugin validate .`: a repo that passes is one every surface accepts.

## Rules
- **This repo is public: nothing personal or client-specific goes in.** A skill coming from `skills` or a `<client>-plugins` repo is generalised first. That means removing:
  - names (Flo, clients, colleagues);
  - Notion, SharePoint or Drive IDs, and internal URLs;
  - charters, logos and licensed assets such as fonts.

  Read the whole diff before every push. Once pushed, the content can be cached or forked even if it is deleted later.
- **Plugins are MIT**, like the repo: `starters/plugin/` already sets `"license": "MIT"`. Skills here are written in English.
- **This repo is the source of truth.** Never edit a skill in the claude.ai interface: claude.ai syncs from here, so an edit made there is lost at the next sync.
- **Create or change a skill with `writing-skills`**, starting from `starters/skill/`. A new plugin starts from `starters/plugin/`.
- **Frontmatter holds the six keys of the Agent Skills spec only**: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. claude.ai rejects any other key, Claude Code-only ones included (`check-skill.ts`, `checkKeys`).
- **A new plugin or skill lands in three places in one commit**: its directory, the plugin's entry in `.claude-plugin/marketplace.json` with `"source": "./plugins/<name>"` written out, and its row in the README catalog. `check-marketplace` fails until the three agree.
- **No `version`** in `plugin.json`: the plugin then updates on every commit to `main`. With one, nobody gets a change until it is bumped. `claude plugin validate` warns "No version specified": that warning is expected.
- **No `bin/` directory at the top of a plugin**: claude.ai rejects the plugin. Executables go in a skill's `scripts/`.
- **Skill names are unique in the repo**, since `npx skills` installs every skill flat. Keep them unique across your other marketplaces too: no check can see those.
- **Language**: a skill is written in the language of the people who use it. The repo's docs, code and commits are in English.
- **Evals** (optional): `plugins/<plugin>/skills/<skill>/evals/evals.json`, in the agentskills.io format. Run outputs go in `<skill>-workspace/`, which git ignores and `task zip` leaves out.
