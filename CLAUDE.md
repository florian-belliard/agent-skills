# Project harness

This repo publishes plugins and Agent Skills; `CONTEXT.md` gives its vocabulary and layout. It uses [Superpowers](https://github.com/obra/superpowers) as the execution harness: a skill is created or changed with its `writing-skills` skill.

## Entering this repo
1. Read `CONTEXT.md`.
2. Run `task check` before every commit: no hook and no CI runs it for you. It runs the repo's own checks (`check-marketplace`), then `claude plugin validate .`. It needs [Task](https://taskfile.dev), Bun 1.2.21 or later (for `Bun.YAML`) and the `claude` CLI.

## Rules
- **This repo is public: nothing personal or confidential goes in.** No name of a person other than the author, no client, no Notion, SharePoint or Drive ID, no internal URL, no charter, logo or licensed asset such as a font. A skill written elsewhere is generalised before it comes here. Read the whole diff before every push: once pushed, content can be cached or forked even if it is deleted later.
- **Everything is MIT**, like the repo. `starters/` already sets the licence.
- **Where a skill goes** (`CONTEXT.md`): in its plugin when it relies on one vendor's features, in `skills/` when it is portable.
- **This repo is the source of truth.** Never edit a skill in the claude.ai interface: an edit made there is lost at the next sync.
- **Create or change a skill with `writing-skills`**, starting from `starters/skill/`. A new plugin starts from `starters/plugin/`.
- **Frontmatter holds the six keys of the Agent Skills spec only**: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. claude.ai rejects any other key, Claude Code-only ones included (`src/check-skill.ts`).
- **A new Claude plugin or skill lands in three places in one commit**: its directory, the plugin's entry in `.claude-plugin/marketplace.json` with `"source": "./plugins/<name>"` written out, and its row in the README catalog. `check-marketplace` fails until the three agree.
- **No `version`** in `plugin.json`: the plugin then updates on every commit to `main`. With one, nobody gets a change until it is bumped. `claude plugin validate` warns "No version specified": that warning is expected.
- **No `bin/` directory at the top of a plugin**: claude.ai rejects the plugin. Executables go in a skill's `scripts/`.
- **Skill names are unique in the repo**, since `npx skills` installs every skill flat. The one exception will be a plugin's checked copy of a portable skill, identical to its original.
- **`task check` reads the skills under `plugins/` only.** Teaching it `skills/` is part of adding the first portable skill (`CONTEXT.md`).
- **Language**: skills, docs, code and commits are in English. A skill talks to its user in the user's language, and writes to anyone else (an agency, a landlord) in theirs.
- **Evals** (optional): `plugins/<plugin>/skills/<skill>/evals/evals.json`, in the agentskills.io format. Run outputs go in `<skill>-workspace/` beside the skill, which git ignores and `task zip` leaves out. The suffix is reserved: `check-marketplace` skips those directories and refuses a skill whose name ends in `-workspace`.
