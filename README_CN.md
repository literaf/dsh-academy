<p align="center"><a href="https://ai4scholar.net?src=dsh"><img src="https://raw.githubusercontent.com/literaf/ai4scholar-plugin-dsh/main/docs/logo.svg" width="110" alt="AI4Scholar"></a></p>
<p align="center"><strong>dsh-academy</strong></p>

# DeepSeek Harness 学术模式

[English](README.md) | 中文

[![npm](https://img.shields.io/npm/v/dsh-academy?label=npm)](https://www.npmjs.com/package/dsh-academy) ![license](https://img.shields.io/badge/license-MIT-green)

一个很小的插件，只改变 Agent 在科研场景下的**行为方式**：科研助手人格、学术写作里最要命的防编造规则、以及中英混排的语言约定。

它**不注册任何工具和技能**——能力属于别的插件。这一层负责让那些能力用起来像个科研助手。

```sh
dsh plugin --profile web add dsh-academy
dsh web
```

## 它往系统提示词里加了什么

**科研助手人格** —— 面向的是研究者，要的是能写进论文、经得起审稿人追问的东西，不是听起来正确的段落。

**学术诚信规则** —— 绝不编造论文标题、作者、年份、期刊、DOI 和引用数；绝不编造数据；区分"来自文献"与"我的推断"；引用必须可核对；是否可信、是否采用由研究者自己判断。

**语言约定** —— 用户用什么语言就用什么语言回答；标题、期刊名、术语保持原文；写中文时遵循中文学术表达习惯，不直译英文句式。

## 配置

```yaml
- id: academy
  config:
    persona: true
    integrity: true
    language: true
    field: ""          # 例如 分子生物学，会写进人格
    personaOrder: 0    # 部署人格所在的位置
    rulesOrder: 120
```

## 建议搭配

- [`dsh-ai4scholar`](https://github.com/literaf/ai4scholar-plugin-dsh) —— 38 个文献工具（Semantic Scholar、PubMed、Google Scholar、arXiv、bioRxiv/medRxiv、DOI 全文、自动引用、科研绘图）。**只有当 Agent 真能查到论文时，"不许编造引用"才是可执行的要求**。
- [`dsh-research`](https://github.com/literaf/dsh-research) —— 科研技能套件（审稿、引言、排版、参考文献审计）。
- [`dsh-research-hub`](https://github.com/literaf/dsh-research-hub) —— dsh 科研插件索引。

## 许可证

MIT
