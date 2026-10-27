import { afterEach, describe, expect, test } from 'bun:test'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

// `task zip` builds what claude.ai's Upload plugin takes: a plugin's tracked files, without its
// evals. Each test runs it with this repo's Taskfile, in a throwaway git repository.
const TASKFILE = join(import.meta.dir, '..', 'Taskfile.yml')
const missingTools = ['task', 'zip', 'unzip', 'git'].filter((tool) => Bun.which(tool) === null)

const roots: string[] = []

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }))
})

type Files = Record<string, string>

const run = (cwd: string, command: string[]) => {
  const result = Bun.spawnSync(command, { cwd })
  return { code: result.exitCode, output: `${result.stdout}${result.stderr}` }
}

const write = (root: string, files: Files) =>
  Object.entries(files).forEach(([path, content]) => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  })

// A git repository holding this repo's Taskfile, with `tracked` added to git and `untracked` not.
const repo = (tracked: Files, untracked: Files = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'zip-task-'))
  roots.push(root)
  copyFileSync(TASKFILE, join(root, 'Taskfile.yml'))
  write(root, tracked)
  run(root, ['git', 'init', '-q'])
  run(root, ['git', 'add', '--', ...Object.keys(tracked)])
  write(root, untracked)
  return root
}

const zip = (root: string, plugin: string) => run(root, ['task', 'zip', `PLUGIN=${plugin}`])

const listing = (root: string, plugin: string) =>
  run(root, ['unzip', '-Z1', join('dist', `${plugin}.zip`)])
    .output.split('\n')
    .filter((line) => line !== '')
    .sort()

const pluginJson = '{ "name": "alpha" }\n'
const skillMd = '---\nname: first\ndescription: Does one thing.\n---\n'

describe.skipIf(missingTools.length > 0)('task zip', () => {
  test('zips the tracked files, without the evals or an untracked file', () => {
    const root = repo(
      {
        'plugins/alpha/.claude-plugin/plugin.json': pluginJson,
        'plugins/alpha/skills/first/SKILL.md': skillMd,
        'plugins/alpha/skills/first/evals/evals.json': '{}\n',
        'plugins/alpha/-TT': 'A file named like an option.\n',
      },
      { 'plugins/alpha/notes.txt': 'Stray notes.\n' },
    )
    expect(zip(root, 'alpha').code).toBe(0)
    expect(listing(root, 'alpha')).toEqual([
      '-TT',
      '.claude-plugin/plugin.json',
      'skills/first/SKILL.md',
    ])
  })

  test('refuses a plugin whose plugin.json git does not track', () => {
    const root = repo(
      { 'plugins/alpha/skills/first/SKILL.md': skillMd },
      { 'plugins/alpha/.claude-plugin/plugin.json': pluginJson },
    )
    const result = zip(root, 'alpha')
    expect(result.code).not.toBe(0)
    expect(result.output).toContain('git add it first')
  })
})
