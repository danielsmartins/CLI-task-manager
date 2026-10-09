# Diretrizes do Projeto (CLI Task Manager)

Este projeto aplica a técnica de **Progressive Disclosure** nas regras do agente para manter o contexto focado e eficiente durante o desenvolvimento.

---

## 📌 Guia de Diretrizes Sob Demanda

Antes de criar, modificar ou refatorar qualquer parte do código, você **DEVE** consultar o arquivo de regras correspondente à área em que está trabalhando:

1. **Arquitetura & Módulos**:
   - Leia [.agents/rules/architecture.md](file:///c:/Users/Daniel/Documents/Faculdade/projects/CLI-task-manager/.agents/rules/architecture.md) para entender a separação em 3 módulos (`cli`, `services`, `storage`), responsabilidades de cada camada e contratos entre elas.
2. **Qualidade & Testes Automatizados**:
   - Leia [.agents/rules/testing.md](file:///c:/Users/Daniel/Documents/Faculdade/projects/CLI-task-manager/.agents/rules/testing.md) ao desenvolver regras de negócio, persistência ou escrever testes com Vitest.
3. **Interface de Linha de Comando & Experiência do Usuário**:
   - Leia [.agents/rules/cli-guidelines.md](file:///c:/Users/Daniel/Documents/Faculdade/projects/CLI-task-manager/.agents/rules/cli-guidelines.md) para padrões de parsing de argumentos, formatação de saída (estilo Dplay) e tratamento gracioso de erros (sem stack traces para o usuário).

---

## ⚙️ Regras Obrigatórias (Sempre Ativas)

- **Node.js & Módulos Modernos**: Use Node.js >= 20 com ES Modules nativos (`"type": "module"` no `package.json`). Use `import`/`export`.
- **Clean Code & Simplicidade**: Funções pequenas, responsabilidade única, nomes semânticos e sem complexidade desnecessária.
- **Validação Local Contínua**: Sempre execute os testes (`npm test`) e o linter (`npm run lint`) antes de finalizar qualquer alteração ou preparar commits.
- **Padrão de Commits**: Realize commits pequenos e frequentes seguindo o padrão Conventional Commits (`feat:`, `chore:`, `test:`, `docs:`, `fix:`, `ci:`), explicando claramente a mudança.
- **Preservação e Execução do Quality Gate**: **NUNCA execute o Quality Gate (`npm run quality-gate` ou `node scripts/quality-gate.js`) localmente**, e **NUNCA execute `--update-baseline` nem modifique `.quality-gate-baseline.json` manualmente**. O Quality Gate roda **exclusivamente via pipeline CI/CD no GitHub**. Localmente, valide o código exclusivamente com testes unitários (`npm test` ou `npx vitest run`) e linter (`npm run lint`).
