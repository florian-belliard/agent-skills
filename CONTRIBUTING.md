# Contributing

This is a personal project, maintained by one person on a best-effort basis. Thank you for helping.

## Issues

Questions, bugs and ideas are welcome as [issues](https://github.com/florian-belliard/agent-skills/issues/new/choose). An issue is public, so keep personal data out of it: no address, phone number, email, Notion page or mailbox screenshot, yours or anyone else's. Without a GitHub account, or for something private, write to support@florianbelliard.com.

A security problem never goes in an issue: see [`SECURITY.md`](SECURITY.md).

## Pull requests

Open an issue first and wait for an answer before you write anything: a pull request without an agreed issue may be closed. A change to a skill is judged by what the agent does with it, so describe the conversation you tested it in.

By contributing, you agree to release your contribution under the repository's MIT licence.

## Working on the repo

You need [Task](https://taskfile.dev), [Bun](https://bun.sh) 1.2.21 or later and the `claude` CLI (Claude Code).

```sh
bun install
task check
```

`task check` lints, formats, type-checks and tests the repo's own code in `src/`. It then checks that the Claude catalog, the plugin folders, their skills and the README catalog agree, and ends with `claude plugin validate .`. It does not read `skills/` yet: that comes with the first portable skill. There is no CI: run it before every commit.

- A new skill starts from `starters/skill/`, a new plugin from `starters/plugin/`.
- [`CLAUDE.md`](CLAUDE.md) holds the rules a change follows, [`CONTEXT.md`](CONTEXT.md) the vocabulary and the layout.
- To try a plugin in the Claude desktop app before it is merged, build its zip with `task zip PLUGIN=<name>`, then upload `dist/<name>.zip` through **Customize > Plugins > Add > Upload plugin**.
