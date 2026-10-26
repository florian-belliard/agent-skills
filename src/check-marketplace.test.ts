import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { checkMarketplace } from './check-marketplace'

const roots: string[] = []

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }))
})

type Files = Record<string, string>

const writeRepo = (files: Files) => {
  const root = mkdtempSync(join(tmpdir(), 'check-marketplace-'))
  roots.push(root)
  Object.entries(files).forEach(([path, content]) => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  })
  return root
}

const json = (value: unknown) => JSON.stringify(value, null, 2)

const marketplace = (plugins: unknown[]) =>
  json({ name: 'test-marketplace', owner: { name: 'Test' }, plugins })

const entry = (name: string) => ({ name, source: `./plugins/${name}`, description: 'A plugin.' })

const pluginJson = (name: string) => json({ name, description: 'A plugin.' })

const skillMd = (name: string) =>
  `---\nname: ${name}\ndescription: Does one thing.\n---\n\n# ${name}\n`

const readme = (catalog: string) => `# Test\n\n## Catalog\n\n${catalog}\n## Layout\n\nText.\n`

const catalogOf = (plugins: Record<string, string[]>) =>
  Object.entries(plugins)
    .map(
      ([plugin, skills]) =>
        `### \`${plugin}\`\n\n| Skill | What it does | Requires |\n|---|---|---|\n` +
        skills.map((s) => `| \`${s}\` | Does one thing. | — |\n`).join(''),
    )
    .join('\n')

// One plugin "alpha" with one skill "first", consistent everywhere.
const validRepo = (): Files => ({
  '.claude-plugin/marketplace.json': marketplace([entry('alpha')]),
  'plugins/alpha/.claude-plugin/plugin.json': pluginJson('alpha'),
  'plugins/alpha/skills/first/SKILL.md': skillMd('first'),
  'README.md': readme(catalogOf({ alpha: ['first'] })),
})

const findingsAt = (level: 'error' | 'warning') => (files: Files) =>
  checkMarketplace(writeRepo(files))
    .filter((f) => f.level === level)
    .map((f) => `${f.file}: ${f.message}`)

const errors = findingsAt('error')
const warnings = findingsAt('warning')

describe('checkMarketplace', () => {
  test('accepts a consistent repo', () => {
    expect(checkMarketplace(writeRepo(validRepo()))).toEqual([])
  })

  test('accepts an empty marketplace whose catalog says so', () => {
    expect(
      errors({
        '.claude-plugin/marketplace.json': marketplace([]),
        'README.md': readme('No plugins yet.\n'),
      }),
    ).toEqual([])
  })

  test('reports a missing marketplace.json', () => {
    const { '.claude-plugin/marketplace.json': _, ...files } = validRepo()
    expect(errors(files)).toEqual(['.claude-plugin/marketplace.json: missing or not valid JSON'])
  })

  test('reports a source other than ./plugins/<name>, written out', () => {
    expect(
      errors({
        ...validRepo(),
        '.claude-plugin/marketplace.json': marketplace([{ name: 'alpha', source: 'alpha' }]),
      }),
    ).toEqual([
      '.claude-plugin/marketplace.json: plugin "alpha" must have "source": "./plugins/alpha" (organisation sync rejects bare names)',
    ])
  })

  test('reports an entry without a directory and a directory without an entry', () => {
    expect(
      errors({
        ...validRepo(),
        '.claude-plugin/marketplace.json': marketplace([entry('ghost')]),
        'README.md': readme(catalogOf({ alpha: ['first'], ghost: [] })),
      }),
    ).toEqual([
      '.claude-plugin/marketplace.json: plugin "ghost" has no directory plugins/ghost',
      'plugins/alpha: directory is not listed in .claude-plugin/marketplace.json',
    ])
  })

  test('reports a missing plugin.json and a plugin.json name that differs', () => {
    const { 'plugins/alpha/.claude-plugin/plugin.json': _, ...withoutManifest } = validRepo()
    expect(errors(withoutManifest)).toEqual([
      'plugins/alpha/.claude-plugin/plugin.json: missing or not valid JSON',
    ])
    expect(
      errors({ ...validRepo(), 'plugins/alpha/.claude-plugin/plugin.json': pluginJson('beta') }),
    ).toEqual([
      'plugins/alpha/.claude-plugin/plugin.json: name "beta" must equal the directory name "alpha"',
    ])
  })

  test('reports a version in plugin.json', () => {
    expect(
      errors({
        ...validRepo(),
        'plugins/alpha/.claude-plugin/plugin.json': json({ name: 'alpha', version: '1.0.0' }),
      }),
    ).toEqual([
      'plugins/alpha/.claude-plugin/plugin.json: remove "version": without it the plugin updates on every commit, with it nobody gets a change until it is bumped',
    ])
  })

  test('reports a version on a marketplace entry', () => {
    expect(
      errors({
        ...validRepo(),
        '.claude-plugin/marketplace.json': marketplace([{ ...entry('alpha'), version: '1.0.0' }]),
      }),
    ).toEqual([
      '.claude-plugin/marketplace.json: plugin "alpha" sets "version": remove it, or nobody gets a change until it is bumped',
    ])
  })

  test('reports a plugin name outside lowercase letters, digits and single hyphens', () => {
    expect(
      errors({
        '.claude-plugin/marketplace.json': marketplace([entry('My_Plugin')]),
        'plugins/My_Plugin/.claude-plugin/plugin.json': pluginJson('My_Plugin'),
        'README.md': readme(catalogOf({ My_Plugin: [] })),
      }),
    ).toEqual([
      'plugins/My_Plugin: plugin name "My_Plugin" must be lowercase letters, digits and single hyphens',
    ])
  })

  test('ignores an eval workspace beside the skills', () => {
    expect(
      errors({
        ...validRepo(),
        'plugins/alpha/skills/first-workspace/iteration-1/benchmark.json': '{}\n',
      }),
    ).toEqual([])
  })

  test('reports a skill whose name ends in -workspace, which git ignores', () => {
    expect(
      errors({
        ...validRepo(),
        'plugins/alpha/skills/google-workspace/SKILL.md': skillMd('google-workspace'),
        'README.md': readme(catalogOf({ alpha: ['first', 'google-workspace'] })),
      }),
    ).toEqual([
      'plugins/alpha/skills/google-workspace: the -workspace suffix is reserved for eval output, which git ignores; rename the skill',
    ])
  })

  test('reports a top-level bin/ in a plugin', () => {
    expect(errors({ ...validRepo(), 'plugins/alpha/bin/run.sh': 'echo hi\n' })).toEqual([
      'plugins/alpha/bin: claude.ai rejects a plugin with a top-level bin/ directory; use scripts/',
    ])
  })

  test('warns, without failing, when a plugin ships hooks or MCP servers', () => {
    const files = {
      ...validRepo(),
      'plugins/alpha/hooks/hooks.json': json({ hooks: {} }),
      'plugins/alpha/.mcp.json': json({ mcpServers: {} }),
    }
    expect(errors(files)).toEqual([])
    expect(warnings(files)).toEqual([
      "plugins/alpha/hooks: hooks run commands on every installer's machine; review them as code",
      "plugins/alpha/.mcp.json: MCP servers run on every installer's machine; review them as code",
    ])
  })

  test('warns when plugin.json declares hooks or MCP servers inline', () => {
    expect(
      warnings({
        ...validRepo(),
        'plugins/alpha/.claude-plugin/plugin.json': json({
          name: 'alpha',
          description: 'A plugin.',
          hooks: {},
          mcpServers: {},
        }),
      }),
    ).toEqual([
      'plugins/alpha/.claude-plugin/plugin.json: "hooks" runs on every installer\'s machine; review it as code',
      'plugins/alpha/.claude-plugin/plugin.json: "mcpServers" runs on every installer\'s machine; review it as code',
    ])
  })

  test('reports a skill directory without SKILL.md', () => {
    expect(
      errors({ ...validRepo(), 'plugins/alpha/skills/empty/references/notes.md': 'notes\n' }),
    ).toEqual(['plugins/alpha/skills/empty: no SKILL.md'])
  })

  test('passes the SKILL.md findings through', () => {
    expect(
      errors({ ...validRepo(), 'plugins/alpha/skills/first/SKILL.md': skillMd('other') }),
    ).toEqual([
      'plugins/alpha/skills/first/SKILL.md: name "other" must equal its directory name "first"',
    ])
  })

  test('reports a skill name used by two plugins', () => {
    expect(
      errors({
        ...validRepo(),
        '.claude-plugin/marketplace.json': marketplace([entry('alpha'), entry('beta')]),
        'plugins/beta/.claude-plugin/plugin.json': pluginJson('beta'),
        'plugins/beta/skills/first/SKILL.md': skillMd('first'),
        'README.md': readme(catalogOf({ alpha: ['first'], beta: ['first'] })),
      }),
    ).toEqual([
      'plugins/beta/skills/first: skill name "first" is also used by plugin "alpha" (npx skills installs every skill in one flat directory)',
    ])
  })

  test('reports a README without a Catalog section', () => {
    expect(errors({ ...validRepo(), 'README.md': '# Test\n' })).toEqual([
      'README.md: no "## Catalog" section',
    ])
  })

  test('reports a plugin or a skill missing from the catalog', () => {
    expect(errors({ ...validRepo(), 'README.md': readme('Nothing here.\n') })).toEqual([
      'README.md: the catalog has no "### `alpha`" heading',
      'README.md: the catalog has no "| `first` |" row under "### `alpha`"',
    ])
  })

  test('reports catalog entries that match nothing in the repo', () => {
    expect(
      errors({
        ...validRepo(),
        'README.md': readme(catalogOf({ alpha: ['first', 'gone'], old: [] })),
      }),
    ).toEqual([
      'README.md: the catalog lists skill "gone" under "alpha", which has no such skill',
      'README.md: the catalog lists plugin "old", which is neither in the marketplace nor in plugins/',
    ])
  })
})
