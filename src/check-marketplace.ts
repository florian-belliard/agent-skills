// Checks that the marketplace, the plugin directories, their skills and the README catalog
// describe the same repo. Each rule mirrors a constraint of a surface that consumes the repo:
// claude.ai organisation sync, claude.ai upload, Claude Code, and `npx skills` for the rest.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { checkSkill } from './check-skill'
import { error, type Finding } from './finding'

const MARKETPLACE = '.claude-plugin/marketplace.json'
const README = 'README.md'

type Entry = { name: string; source: unknown }

const readText = (path: string): string | undefined =>
  existsSync(path) ? readFileSync(path, 'utf8') : undefined

const readJson = (path: string): unknown => {
  const text = readText(path)
  if (text === undefined) {
    return undefined
  }
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

const isMap = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const subdirectories = (path: string): string[] =>
  existsSync(path)
    ? readdirSync(path, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
        .map((d) => d.name)
        .toSorted()
    : []

const readEntries = (root: string): { entries?: Entry[]; findings: Finding[] } => {
  const data = readJson(join(root, MARKETPLACE))
  if (!isMap(data)) {
    return { findings: [error(MARKETPLACE, 'missing or not valid JSON')] }
  }
  if (!Array.isArray(data.plugins)) {
    return { findings: [error(MARKETPLACE, '"plugins" must be an array')] }
  }
  const named = data.plugins.filter((p): p is Entry => isMap(p) && typeof p.name === 'string')
  const unnamed = data.plugins.length - named.length
  return {
    entries: named,
    findings: unnamed > 0 ? [error(MARKETPLACE, `${unnamed} plugin entries have no "name"`)] : [],
  }
}

// Organisation sync accepts a relative source only written out in full, and a plugin kept in
// its own directory is all a member receives: nothing else of the repo travels with it.
const checkEntries = (entries: Entry[], pluginDirs: string[]): Finding[] => [
  ...entries
    .filter((e) => e.source !== `./plugins/${e.name}`)
    .map((e) =>
      error(
        MARKETPLACE,
        `plugin "${e.name}" must have "source": "./plugins/${e.name}" (organisation sync rejects bare names)`,
      ),
    ),
  ...entries
    .filter((e) => !pluginDirs.includes(e.name))
    .map((e) => error(MARKETPLACE, `plugin "${e.name}" has no directory plugins/${e.name}`)),
  ...pluginDirs
    .filter((dir) => !entries.some((e) => e.name === dir))
    .map((dir) => error(`plugins/${dir}`, `directory is not listed in ${MARKETPLACE}`)),
]

const checkManifest = (root: string, plugin: string): Finding[] => {
  const file = `plugins/${plugin}/.claude-plugin/plugin.json`
  const data = readJson(join(root, file))
  if (!isMap(data)) {
    return [error(file, 'missing or not valid JSON')]
  }
  return [
    ...(data.name === plugin
      ? []
      : [error(file, `name "${String(data.name)}" must equal the directory name "${plugin}"`)]),
    ...('version' in data
      ? [
          error(
            file,
            'remove "version": without it the plugin updates on every commit, with it nobody gets a change until it is bumped',
          ),
        ]
      : []),
  ]
}

const checkNoBin = (root: string, plugin: string): Finding[] => {
  const bin = join(root, 'plugins', plugin, 'bin')
  return existsSync(bin) && statSync(bin).isDirectory()
    ? [
        error(
          `plugins/${plugin}/bin`,
          'claude.ai rejects a plugin with a top-level bin/ directory; use scripts/',
        ),
      ]
    : []
}

type Skill = { plugin: string; name: string }

const listSkills = (root: string, plugin: string): { skills: Skill[]; findings: Finding[] } => {
  const dirs = subdirectories(join(root, 'plugins', plugin, 'skills'))
  const file = (name: string) => `plugins/${plugin}/skills/${name}/SKILL.md`
  const withFile = dirs.filter((name) => existsSync(join(root, file(name))))
  return {
    skills: withFile.map((name) => ({ plugin, name })),
    findings: [
      ...dirs
        .filter((name) => !withFile.includes(name))
        .map((name) => error(`plugins/${plugin}/skills/${name}`, 'no SKILL.md')),
      ...withFile.flatMap((name) =>
        checkSkill(name, file(name), readFileSync(join(root, file(name)), 'utf8')),
      ),
    ],
  }
}

// `npx skills` installs every skill of a repo into one flat directory per agent.
const checkUniqueNames = (skills: Skill[]): Finding[] =>
  skills.flatMap((skill, i) => {
    const first = skills.find((other) => other.name === skill.name)
    return first && skills.indexOf(first) < i
      ? [
          error(
            `plugins/${skill.plugin}/skills/${skill.name}`,
            `skill name "${skill.name}" is also used by plugin "${first.plugin}" (npx skills installs every skill in one flat directory)`,
          ),
        ]
      : []
  })

// The catalog is the `## Catalog` section: one `### \`plugin\`` heading per plugin, then one
// table row per skill whose first cell is the skill name in backticks.
type Catalog = { plugin: string; skills: string[] }[]

const parseCatalog = (readme: string): Catalog | undefined => {
  const lines = readme.split('\n')
  const start = lines.findIndex((line) => line.trim() === '## Catalog')
  if (start < 0) {
    return undefined
  }
  const rest = lines.slice(start + 1)
  const end = rest.findIndex((line) => line.startsWith('## '))
  return (end < 0 ? rest : rest.slice(0, end)).reduce<Catalog>((catalog, line) => {
    const heading = /^### `([^`]+)`/.exec(line)
    if (heading) {
      return [...catalog, { plugin: heading[1], skills: [] }]
    }
    const row = /^\|\s*`([^`]+)`\s*\|/.exec(line)
    if (row) {
      const current = catalog.at(-1) ?? { plugin: '', skills: [] }
      return [...catalog.slice(0, -1), { ...current, skills: [...current.skills, row[1]] }]
    }
    return catalog
  }, [])
}

const checkCatalog = (root: string, plugins: string[], skills: Skill[]): Finding[] => {
  const readme = readText(join(root, README))
  if (readme === undefined) {
    return [error(README, 'missing')]
  }
  const catalog = parseCatalog(readme)
  if (catalog === undefined) {
    return [error(README, 'no "## Catalog" section')]
  }
  const skillsOf = (plugin: string) => skills.filter((s) => s.plugin === plugin).map((s) => s.name)
  const listed = (plugin: string) => catalog.find((c) => c.plugin === plugin)
  const missing = plugins.flatMap((plugin) => [
    ...(listed(plugin) ? [] : [error(README, `the catalog has no "### \`${plugin}\`" heading`)]),
    ...skillsOf(plugin)
      .filter((name) => !listed(plugin)?.skills.includes(name))
      .map((name) =>
        error(README, `the catalog has no "| \`${name}\` |" row under "### \`${plugin}\`"`),
      ),
  ])
  const orphans = catalog.flatMap(({ plugin, skills: rows }) =>
    plugins.includes(plugin)
      ? rows
          .filter((name) => !skillsOf(plugin).includes(name))
          .map((name) =>
            error(
              README,
              `the catalog lists skill "${name}" under "${plugin}", which has no such skill`,
            ),
          )
      : [
          error(
            README,
            plugin === ''
              ? 'the catalog lists skills before any "### `plugin`" heading'
              : `the catalog lists plugin "${plugin}", which is neither in the marketplace nor in plugins/`,
          ),
        ],
  )
  return [...missing, ...orphans]
}

export const checkMarketplace = (root: string): Finding[] => {
  const pluginDirs = subdirectories(join(root, 'plugins'))
  const { entries, findings: marketplaceFindings } = readEntries(root)
  const plugins = [...new Set([...(entries ?? []).map((e) => e.name), ...pluginDirs])]
  const listings = pluginDirs.map((plugin) => listSkills(root, plugin))
  const skills = listings.flatMap((l) => l.skills)
  return [
    ...marketplaceFindings,
    ...(entries ? checkEntries(entries, pluginDirs) : []),
    ...pluginDirs.flatMap((plugin) => [
      ...checkManifest(root, plugin),
      ...checkNoBin(root, plugin),
    ]),
    ...listings.flatMap((l) => l.findings),
    ...checkUniqueNames(skills),
    ...checkCatalog(root, plugins, skills),
  ]
}
