// Checks one SKILL.md against the Agent Skills spec (https://agentskills.io/specification).
// The spec is the common ground of every surface: claude.ai and the Skills API reject a
// frontmatter key outside it, so a Claude Code-only key such as `disable-model-invocation`
// would make the skill installable in Claude Code and nowhere else.
import { error, warning, type Finding } from './finding'

const SPEC_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const NAME_MAX = 64
const DESCRIPTION_MAX = 1024
const COMPATIBILITY_MAX = 500
const LINES_ADVISED = 500

// The spec counts characters: spreading a string splits it by code point, not UTF-16 unit.
const length = (text: string) => [...text].length

const isMap = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseFrontmatter = (content: string): { data: unknown } | { problem: string } => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(content)
  if (!match) {
    return { problem: 'no YAML frontmatter between --- lines at the top' }
  }
  try {
    return { data: Bun.YAML.parse(match[1]) }
  } catch (e) {
    return { problem: `frontmatter is not valid YAML: ${(e as Error).message}` }
  }
}

const checkName = (name: unknown, dirName: string): string[] => {
  if (name === undefined) {
    return ['name is required']
  }
  if (typeof name !== 'string' || !NAME_PATTERN.test(name) || length(name) > NAME_MAX) {
    return [
      `name "${String(name)}" must be lowercase letters, digits and single hyphens, at most ${NAME_MAX} characters`,
    ]
  }
  return name === dirName ? [] : [`name "${name}" must equal its directory name "${dirName}"`]
}

const checkDescription = (description: unknown): string[] =>
  typeof description === 'string' &&
  description.trim() !== '' &&
  length(description) <= DESCRIPTION_MAX
    ? []
    : [`description is required, 1 to ${DESCRIPTION_MAX} characters`]

const checkCompatibility = (compatibility: unknown): string[] =>
  compatibility === undefined ||
  (typeof compatibility === 'string' && length(compatibility) <= COMPATIBILITY_MAX)
    ? []
    : [`compatibility must be a string of at most ${COMPATIBILITY_MAX} characters`]

const checkMetadata = (metadata: unknown): string[] => {
  if (metadata === undefined) {
    return []
  }
  if (!isMap(metadata)) {
    return ['metadata must map strings to strings']
  }
  return Object.entries(metadata)
    .filter(([, value]) => typeof value !== 'string')
    .map(([key]) => `metadata must map strings to strings ("${key}" does not)`)
}

const checkKeys = (data: Record<string, unknown>): string[] =>
  Object.keys(data)
    .filter((key) => !SPEC_KEYS.includes(key))
    .map((key) => `key "${key}" is not in the Agent Skills spec (claude.ai rejects the skill)`)

const countLines = (content: string) => {
  const lines = content.split('\n').length
  return content.endsWith('\n') ? lines - 1 : lines
}

export const checkSkill = (dirName: string, file: string, content: string): Finding[] => {
  const parsed = parseFrontmatter(content)
  if ('problem' in parsed) {
    return [error(file, parsed.problem)]
  }
  if (!isMap(parsed.data)) {
    return [error(file, 'frontmatter must be a YAML map of keys')]
  }
  const data = parsed.data
  const problems = [
    ...checkKeys(data),
    ...checkName(data.name, dirName),
    ...checkDescription(data.description),
    ...checkCompatibility(data.compatibility),
    ...checkMetadata(data.metadata),
  ]
  const lines = countLines(content)
  return [
    ...problems.map((message) => error(file, message)),
    ...(lines > LINES_ADVISED
      ? [
          warning(
            file,
            `SKILL.md has ${lines} lines; the spec advises under ${LINES_ADVISED}, with detail in references/`,
          ),
        ]
      : []),
  ]
}
