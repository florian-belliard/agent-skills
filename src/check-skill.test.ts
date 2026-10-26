import { describe, expect, test } from 'bun:test'
import { checkSkill } from './check-skill'

const FILE = 'plugins/p/skills/my-skill/SKILL.md'

const skill = (frontmatter: string, body = '# My skill\n') => `---\n${frontmatter}\n---\n\n${body}`

const errors = (content: string, dirName = 'my-skill') =>
  checkSkill(dirName, FILE, content)
    .filter((f) => f.level === 'error')
    .map((f) => f.message)

describe('checkSkill', () => {
  test('accepts a skill that uses every key of the spec', () => {
    const content = skill(
      [
        'name: my-skill',
        'description: Does one thing. Use when the user asks for it.',
        'license: MIT',
        'compatibility: Needs the Notion connector',
        'metadata:',
        '  author: Florian Belliard',
        'allowed-tools: Read Grep',
      ].join('\n'),
    )
    expect(checkSkill('my-skill', FILE, content)).toEqual([])
  })

  test('accepts a quoted name', () => {
    expect(errors(skill('name: "my-skill"\ndescription: "Does one thing."'))).toEqual([])
  })

  test('reports a file without frontmatter', () => {
    expect(errors('# My skill\n')).toEqual(['no YAML frontmatter between --- lines at the top'])
  })

  test('reports frontmatter that is not valid YAML', () => {
    expect(errors(skill('name: my-skill\ndescription: [unclosed'))[0]).toStartWith(
      'frontmatter is not valid YAML',
    )
  })

  test('reports a key outside the Agent Skills spec', () => {
    expect(
      errors(skill('name: my-skill\ndescription: Does one thing.\ndisable-model-invocation: true')),
    ).toEqual([
      'key "disable-model-invocation" is not in the Agent Skills spec (claude.ai rejects the skill)',
    ])
  })

  test('reports a name that differs from its directory', () => {
    expect(errors(skill('name: other-skill\ndescription: Does one thing.'))).toEqual([
      'name "other-skill" must equal its directory name "my-skill"',
    ])
  })

  test('reports a name outside lowercase letters, digits and single hyphens', () => {
    expect(errors(skill('name: My_Skill\ndescription: Does one thing.'), 'My_Skill')).toEqual([
      'name "My_Skill" must be lowercase letters, digits and single hyphens, at most 64 characters',
    ])
  })

  test('reports a name longer than 64 characters', () => {
    const long = 'a'.repeat(65)
    expect(errors(skill(`name: ${long}\ndescription: Does one thing.`), long)).toHaveLength(1)
  })

  test('reports a name that contains a word Anthropic reserves', () => {
    expect(
      errors(skill('name: claude-helper\ndescription: Does one thing.'), 'claude-helper'),
    ).toEqual([
      'name "claude-helper" must not contain "anthropic" or "claude" (reserved by Anthropic)',
    ])
  })

  test('reports XML tags in the description', () => {
    expect(errors(skill('name: my-skill\ndescription: Does <b>one</b> thing.'))).toEqual([
      'description must not contain XML tags (claude.ai rejects the skill)',
    ])
  })

  test('accepts a lone angle bracket in the description', () => {
    expect(
      errors(skill('name: my-skill\ndescription: Use when the rent is < 2000 euros.')),
    ).toEqual([])
  })

  test('reports a missing name and a missing description', () => {
    expect(errors(skill('license: MIT'))).toEqual([
      'name is required',
      'description is required, 1 to 1024 characters',
    ])
  })

  test('reports a description longer than 1024 characters', () => {
    expect(errors(skill(`name: my-skill\ndescription: ${'é'.repeat(1025)}`))).toEqual([
      'description is required, 1 to 1024 characters',
    ])
  })

  test('counts characters, not UTF-16 code units', () => {
    expect(errors(skill(`name: my-skill\ndescription: ${'🙂'.repeat(1024)}`))).toEqual([])
  })

  test('reports a compatibility longer than 500 characters', () => {
    expect(
      errors(
        skill(`name: my-skill\ndescription: Does one thing.\ncompatibility: ${'x'.repeat(501)}`),
      ),
    ).toEqual(['compatibility must be a string of at most 500 characters'])
  })

  test('reports metadata that is not a map of strings', () => {
    expect(
      errors(
        skill('name: my-skill\ndescription: Does one thing.\nmetadata:\n  requires:\n    - notion'),
      ),
    ).toEqual(['metadata must map strings to strings ("requires" does not)'])
  })

  test('warns, without failing, past 500 lines', () => {
    const findings = checkSkill(
      'my-skill',
      FILE,
      skill('name: my-skill\ndescription: Does one thing.', 'line\n'.repeat(501)),
    )
    expect(findings).toEqual([
      {
        level: 'warning',
        file: FILE,
        message: 'SKILL.md has 506 lines; the spec advises under 500, with detail in references/',
      },
    ])
  })
})
