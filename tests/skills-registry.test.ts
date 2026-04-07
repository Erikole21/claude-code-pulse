import { describe, expect, it } from 'vitest'
import { filterByPriority, SKILLS_REGISTRY } from '../src/config/skills-registry.js'

describe('filterByPriority', () => {
  it('excludes medium when filtering critical and high', () => {
    const filtered = filterByPriority(['critical', 'high'])
    expect(filtered.every((s) => s.priority !== 'medium')).toBe(true)
    expect(filtered.length).toBeGreaterThan(0)
  })

  it('includes medium when using all', () => {
    const all = filterByPriority(['all'])
    const medium = SKILLS_REGISTRY.filter((s) => s.priority === 'medium')
    expect(all.filter((s) => s.priority === 'medium').length).toBe(medium.length)
  })
})
