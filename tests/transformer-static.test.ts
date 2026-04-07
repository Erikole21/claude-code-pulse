import { describe, expect, it } from 'vitest'
import { transformStatic } from '../src/core/transformer-static.js'

const fixture = [
  '# Main Title',
  '',
  '## Section A',
  'Intro text with [internal docs](/docs/en/hooks).',
  '',
  '<Note>This should be removed.</Note>',
  '<Tip>Also removed.</Tip>',
  '<Steps>Removed too.</Steps>',
  '',
  '### Subsection',
  '',
  '```ts',
  'const value = 42',
  'console.log(value)',
  '```',
  '',
  '| Name | Value |',
  '|---|---|',
  '| retries | 2 |',
  '| timeout | 10000 |',
  '',
  '![diagram](/docs/en/image.png)',
].join('\n')

describe('transformer-static', () => {
  it('removes JSX component tags', () => {
    const out = transformStatic(fixture, 1000)
    expect(out).not.toContain('<Note>')
    expect(out).not.toContain('<Tip>')
    expect(out).not.toContain('<Steps>')
  })

  it('preserves code blocks', () => {
    const out = transformStatic(fixture, 1000)
    expect(out).toContain('```ts')
    expect(out).toContain('const value = 42')
    expect(out).toContain('console.log(value)')
  })

  it('preserves tables', () => {
    const out = transformStatic(fixture, 1000)
    expect(out).toContain('| Name | Value |')
    expect(out).toContain('| retries | 2 |')
  })

  it('preserves headings H1/H2/H3', () => {
    const out = transformStatic(fixture, 1000)
    expect(out).toContain('# Main Title')
    expect(out).toContain('## Section A')
    expect(out).toContain('### Subsection')
  })

  it('removes images and internal links', () => {
    const out = transformStatic(fixture, 1000)
    expect(out).not.toContain('![diagram]')
    expect(out).not.toContain('/docs/en/hooks')
    expect(out).not.toContain('/docs/en/image.png')
  })

  it('truncates large docs to token budget', () => {
    const big = new Array(30)
      .fill(0)
      .map((_, i) => `## Section ${i}\n\n${'Long paragraph. '.repeat(50)}`)
      .join('\n\n')

    const out = transformStatic(big, 120)
    expect(out.length).toBeLessThanOrEqual(120 * 4)
  })

  it('does not truncate small docs within budget', () => {
    const small = '# Small\n\nThis doc is short.\n'
    const out = transformStatic(small, 600)
    expect(out).toContain('# Small')
    expect(out).toContain('This doc is short.')
  })
})
