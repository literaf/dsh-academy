/**
 * dsh-academy: academic mode for DeepSeek Harness. One small plugin that
 * changes how the agent behaves on scholarly work — the research persona, the
 * anti-fabrication rules that matter most in academic writing, and the
 * language conventions for bilingual work.
 *
 * It deliberately registers no tools and no skills: capabilities belong to
 * `dsh-ai4scholar` (literature search, full text, citations, figures) and
 * `dsh-research` (the research skill pack). This package is the behaviour
 * layer that makes either of them read like a research assistant.
 * @module dsh-academy
 */

import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-system-prompt'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'academy'

/** Services required before `apply` runs. */
export const inject = ['systemPrompt']

/** Plugin configuration. */
export interface Config {
  /** Register the research persona. */
  persona?: boolean
  /** Register the academic-integrity rules. */
  integrity?: boolean
  /** Register the bilingual language conventions. */
  language?: boolean
  /** Field named in the persona, e.g. `分子生物学`; empty stays general. */
  field?: string
  /** Order of the persona section; 0 is the deployment persona slot. */
  personaOrder?: number
  /** Order of the rules section; tool guidance uses 100-199. */
  rulesOrder?: number
}

export const Config: Schema<Config> = Schema.object({
  persona: Schema.boolean().default(true).description('Register the research persona.'),
  integrity: Schema.boolean().default(true).description('Register the academic-integrity rules.'),
  language: Schema.boolean().default(true).description('Register the bilingual language conventions.'),
  field: Schema.string().default('').description('Field named in the persona; empty stays general.'),
  personaOrder: Schema.number().default(0).description('Order of the persona section.'),
  rulesOrder: Schema.number().default(120).description('Order of the rules section.'),
})

/** Complete config after schemastery applies every default. */
type ResolvedConfig = Required<Config>

/**
 * The research persona.
 * @param field - field to name, or an empty string for a general persona.
 * @returns the persona text.
 */
export function buildPersona(field: string): string {
  const scope = field.trim().length > 0 ? `${field.trim()}领域的` : ''
  return `你是一位${scope}科研助手，服务对象是研究者：研究生、博士后和高校教师。`
    + `他们要的是可以写进论文、经得起审稿人追问的东西，不是听起来正确的段落。`
    + `所以：给出结论时说明依据，遇到方法、数据、统计的细节不要含糊带过，`
    + `不确定的地方直接说不确定，并指出需要什么材料才能确定。`
}

/** The rules that decide whether output is usable in a manuscript. */
export const INTEGRITY_RULES: readonly string[] = [
  '绝不编造文献。论文标题、作者、年份、期刊、DOI、页码、引用数只能来自工具返回的结果或用户提供的材料；没有来源就说没有，不要"给一个大概的引用"。',
  '绝不编造数据。实验数值、统计量、样本量、效应量同理；示例数据必须显式标注为示例。',
  '区分事实与推断。哪些来自文献、哪些是你的推理、哪些是常见做法但缺少直接证据，要能分清并说明。',
  '引用要可核对。提到某篇论文的观点时，给出可定位的信息（DOI 或链接），并说明该结论出自摘要、正文还是你的概括。',
  '不替用户下判断。是否可信、是否采用、是否投这本期刊，给出依据和权衡，由研究者自己决定。',
]

/** Language conventions for bilingual academic work. */
export const LANGUAGE_RULES = '用户用什么语言提问就用什么语言回答；'
  + '论文标题、期刊名、作者名、专业术语保持原文，必要时在括号里给出译名；'
  + '涉及中文论文写作时，遵循中文学术表达习惯，不要直译英文句式。'

/**
 * Register the enabled sections. Each is an effect on `ctx`, so unloading the
 * plugin withdraws them together.
 * @param ctx - plugin context with `systemPrompt` ready.
 * @param config - schemastery-validated config with defaults applied.
 */
export function apply(ctx: Context, config: Config): void {
  const resolved = config as ResolvedConfig
  for (const [field, value] of [['personaOrder', resolved.personaOrder], ['rulesOrder', resolved.rulesOrder]] as const) {
    if (!Number.isFinite(value)) throw new Error(`academy: ${field} must be a finite number`)
  }
  if (resolved.persona) {
    ctx.systemPrompt.section({
      name: 'academy:persona',
      order: resolved.personaOrder,
      text: buildPersona(resolved.field),
    })
  }
  const rules: string[] = []
  if (resolved.integrity) rules.push('学术诚信要求：', ...INTEGRITY_RULES.map(rule => `- ${rule}`))
  if (resolved.language) rules.push(LANGUAGE_RULES)
  if (rules.length > 0) {
    ctx.systemPrompt.section({
      name: 'academy:rules',
      order: resolved.rulesOrder,
      text: rules.join('\n'),
    })
  }
}
