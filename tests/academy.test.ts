import { describe, expect, it } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import type { PromptSection } from '@deepseek-ai/dsh-system-prompt'
import { Config, INTEGRITY_RULES, LANGUAGE_RULES, apply, buildPersona } from '../src/index.js'
import type { Config as ConfigType } from '../src/index.js'

function mount(overrides: Partial<ConfigType> = {}) {
  const sections: PromptSection[] = []
  const ctx = {
    systemPrompt: {
      section(section: PromptSection) {
        sections.push(section)
        return () => undefined
      },
    },
  } as unknown as Context
  apply(ctx, new Config(overrides))
  const text = (name: string): string => {
    const section = sections.find(s => s.name === name)
    if (section === undefined) return ''
    return typeof section.text === 'string' ? section.text : section.text({} as never)
  }
  return { sections, text }
}

describe('academy', () => {
  it('registers a persona at the deployment slot and rules with tool-range order', () => {
    const fake = mount()
    expect(fake.sections.map(s => s.name)).toEqual(['academy:persona', 'academy:rules'])
    expect(fake.sections[0]?.order).toBe(0)
    expect(fake.sections[1]?.order).toBe(120)
  })

  it('states every integrity rule and the language convention', () => {
    const rules = mount().text('academy:rules')
    for (const rule of INTEGRITY_RULES) expect(rules).toContain(rule)
    expect(rules).toContain(LANGUAGE_RULES)
    // The two rules that decide whether output is usable in a manuscript.
    expect(rules).toContain('绝不编造文献')
    expect(rules).toContain('绝不编造数据')
  })

  it('names a field when one is configured', () => {
    expect(buildPersona('')).toContain('你是一位科研助手')
    expect(buildPersona(' 分子生物学 ')).toContain('分子生物学领域的科研助手')
    expect(mount({ field: '材料科学' }).text('academy:persona')).toContain('材料科学领域的')
  })

  it('honors every toggle', () => {
    expect(mount({ persona: false }).sections.map(s => s.name)).toEqual(['academy:rules'])
    expect(mount({ integrity: false }).text('academy:rules')).toBe(LANGUAGE_RULES)
    expect(mount({ language: false }).text('academy:rules')).not.toContain(LANGUAGE_RULES)
    expect(mount({ integrity: false, language: false }).sections.map(s => s.name)).toEqual(['academy:persona'])
    expect(mount({ persona: false, integrity: false, language: false }).sections).toHaveLength(0)
    expect(() => mount({ personaOrder: Number.NaN })).toThrow(/personaOrder/)
  })
})
