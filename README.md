<p align="center"><a href="https://ai4scholar.net?src=dsh"><img src="https://raw.githubusercontent.com/literaf/dsh-ai4scholar/main/docs/logo.svg" width="110" alt="AI4Scholar"></a></p>
<p align="center"><strong>dsh-academy</strong></p>

# Academic mode for DeepSeek Harness

English | [中文](README_CN.md)

[![npm](https://img.shields.io/npm/v/dsh-academy?label=npm)](https://www.npmjs.com/package/dsh-academy) ![license](https://img.shields.io/badge/license-MIT-green)

One small plugin that changes how the agent *behaves* on scholarly work: a research persona, the anti-fabrication rules that matter most in academic writing, and bilingual conventions.

It registers **no tools and no skills** — capabilities belong to other plugins. This is the behaviour layer that makes them read like a research assistant.

```sh
dsh plugin --profile web add dsh-academy
dsh web
```

## What it adds to the system prompt

**Research persona** — the reader is a researcher who needs something that survives peer review, not a paragraph that sounds right.

**Academic-integrity rules** — never invent papers, authors, years, journals, DOIs or citation counts; never invent data; separate what came from the literature from what is your inference; make every citation checkable; leave judgement calls to the researcher.

**Language conventions** — answer in the user's language, keep titles, journal names and terminology in the original, follow Chinese academic phrasing when writing Chinese.

## Configuration

```yaml
- id: academy
  config:
    persona: true
    integrity: true
    language: true
    field: ""          # e.g. 分子生物学 — named in the persona
    personaOrder: 0    # the deployment-persona slot
    rulesOrder: 120
```

## Works well with

- [`dsh-ai4scholar`](https://github.com/literaf/dsh-ai4scholar) — 38 literature tools (Semantic Scholar, PubMed, Google Scholar, arXiv, bioRxiv/medRxiv, DOI full text, auto-cite, figures). The integrity rules are only enforceable when the agent can actually look papers up.
- [`dsh-research`](https://github.com/literaf/dsh-research) — the research skill pack (peer review, introductions, formatting, reference audit).
- [`dsh-research-hub`](https://github.com/literaf/dsh-research-hub) — the index of research plugins for dsh.

## License

MIT
