import { describe, expect, it } from 'vitest'
import { splitDocument } from '../src/core/splitter.js'

describe('splitter sections strategy', () => {
  it('uses H2 headings for ids and avoids intro pseudo-id', () => {
    const markdown = [
      '# Title',
      '',
      'Preamble paragraph.',
      '',
      '## First Section',
      'First content.',
      '',
      '## Second Section',
      'Second content.',
    ].join('\n')

    const sections = splitDocument(markdown, 'sections')

    expect(sections).toHaveLength(2)
    expect(sections[0].id).toBe('first-section')
    expect(sections[0].content).toContain('Preamble paragraph.')
    expect(sections[0].content).toContain('## First Section')
    expect(sections[1].id).toBe('second-section')
    expect(sections[1].content).toContain('## Second Section')
  })

  it('returns single document section when there are no H2 headings', () => {
    const markdown = ['# Title', '', 'Only top-level content.'].join('\n')

    const sections = splitDocument(markdown, 'sections')

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toBe('document')
    expect(sections[0].content).toContain('Only top-level content.')
  })

  it('keeps nested H3/H4 content inside the parent H2 section', () => {
    const markdown = [
      '# Title',
      '',
      '## Parent',
      'Parent intro.',
      '',
      '### Child H3',
      'Child text.',
      '',
      '#### Child H4',
      'Nested text.',
    ].join('\n')

    const sections = splitDocument(markdown, 'sections')

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toBe('parent')
    expect(sections[0].content).toContain('### Child H3')
    expect(sections[0].content).toContain('#### Child H4')
    expect(sections[0].content).toContain('Nested text.')
  })
})

describe('splitter manual strategy', () => {
  const manualSections = [
    { id: 'cc-hooks-events', heading: 'Hook lifecycle', description: 'Events table' },
    { id: 'cc-hooks-config', heading: 'Configuration', description: 'Config details' },
    { id: 'cc-hooks-io', heading: 'Hook input and output', description: 'I/O schemas' },
    { id: 'cc-hooks-missing', heading: 'Not present section', description: 'Missing' },
  ]

  it('extracts only configured headings and keeps manual IDs', () => {
    const markdown = [
      '# Hooks',
      '',
      '## Hook lifecycle',
      'Events list.',
      '',
      '## Configuration',
      'Settings and matchers.',
      '',
      '### Extra details',
      'Nested details stay in this section.',
      '',
      '## Hook input and output',
      'JSON input and output.',
    ].join('\n')

    const sections = splitDocument(markdown, 'manual', manualSections)

    expect(sections).toHaveLength(3)
    expect(sections.map((s) => s.id)).toEqual([
      'cc-hooks-events',
      'cc-hooks-config',
      'cc-hooks-io',
    ])
    expect(sections[1].content).toContain('### Extra details')
  })

  it('skips headings that are not found', () => {
    const markdown = [
      '# Hooks',
      '',
      '## Hook lifecycle',
      'Events list only.',
    ].join('\n')

    const sections = splitDocument(markdown, 'manual', manualSections)

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toBe('cc-hooks-events')
  })
})
