# Ybyra AI-Friendly

Instruções estruturadas para que coding agents (GitHub Copilot, Claude Code, Cursor, etc.) sejam capazes de gerar código Ybyra de forma autônoma.

## O que é

Esta pasta contém **rules**, **skills**, **prompts** e **exemplos** que ensinam IAs a:

- Criar domínios completos (schema, events, handlers, hooks, service)
- Gerar pages/routes para qualquer framework suportado
- Adicionar campos, actions e traduções a domínios existentes
- Seguir as convenções e padrões do Ybyra

## Estrutura

```
ai-friendly/
├── rules/          ← Convenções e padrões (carregados automaticamente)
├── skills/         ← Capacidades de geração com exemplos reais
├── prompts/        ← Atalhos para tarefas de alta frequência
├── frameworks/     ← Referência por framework (React, Vue, Svelte)
└── examples/       ← Domínio "person" como referência canônica
```

## Como usar em seu projeto

### 1. Copie a pasta `ai-friendly/` para a raiz do seu projeto

```bash
cp -r ai-friendly/ /seu-projeto/ai-friendly/
```

### 2. Configure o GitHub Copilot

Copie os arquivos nativos para `.github/`:

```bash
# Instruções globais
cp ai-friendly/.generated/copilot-instructions.md .github/copilot-instructions.md

# Instructions por caminho (path-specific)
cp ai-friendly/.generated/instructions/* .github/instructions/

# Skills
cp -r ai-friendly/skills/* .github/skills/

# Prompts
cp ai-friendly/prompts/* .github/prompts/
```

### 3. Configure o Claude Code

Copie ou faça referência no `CLAUDE.md` da raiz:

```bash
cp ai-friendly/.generated/CLAUDE.md ./CLAUDE.md
```

### 4. Verifique

Abra o projeto no VS Code / Cursor e teste com um prompt como:

> "Crie o cadastro de produtos com nome, preço, SKU e data de vencimento"

## Camadas de suporte

| Camada | Quando ativa | Para quê |
|--------|-------------|----------|
| **Instructions** (rules/) | Sempre, em background | Convenções, padrões, contexto |
| **Skills** (skills/) | Quando o contexto é relevante | Geração de código orientada a tarefas |
| **Prompts** (prompts/) | Sob demanda, invocado pelo dev | Atalhos para tarefas comuns |

## Frameworks suportados

- **React Web** — react-router-dom, Vite
- **React Native** — Expo, expo-router
- **Vue + Quasar** — vue-router, Quasar Framework
- **SvelteKit** — file-based routing, Svelte 5

## Requisitos

- Projeto usando `@ybyra/core` e um adapter de framework (`@ybyra/react`, `@ybyra/vue`, `@ybyra/svelte`)
- `@ybyra/persistence` para persistência
