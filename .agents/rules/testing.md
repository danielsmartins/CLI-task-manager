# Diretrizes de Testes Automatizados (Vitest)

Este arquivo define os padrões de testes automatizados do projeto CLI Task Manager.

---

## 1. Padrões de Escrita
- **Framework**: Vitest (`describe`, `it` / `test`, `expect`, `vi`).
- **Nomenclatura**: Arquivos de teste salvos em `tests/**/*.test.js`.
- **Organização**:
  - `tests/services/taskService.test.js`: Casos de sucesso, erros de validação, limites de ID, filtros por status.
  - `tests/storage/taskStorage.test.js`: I/O, criação de arquivo inexistente, recuperação após leitura, persistência correta.
  - `tests/cli/cli.test.js`: Parsing de comandos, saídas formatadas, tratamento de exceções sem stack trace.

---

## 2. Cobertura e Isolamento
- **Meta de Cobertura**: 100% em regras de negócio (`services/`) e persistência (`storage/`).
- **Isolamento de Testes**:
  - Nunca deixe testes alterarem o `tasks.json` da raiz do projeto.
  - Ao testar o storage, utilize caminhos temporários (`node:os` / `mkdtemp`) ou mocks de filesystem para garantir idempotência.
  - No `taskService`, injete instâncias de storage simuladas (in-memory) para testes unitários ultrarrápidos.

---

## 3. Preservação do Quality Gate
- **Exclusividade do CI/CD**: O Quality Gate roda **exclusivamente via pipeline CI/CD no GitHub Actions**.
- **Regra de Ouro**: **NUNCA execute `npm run quality-gate` nem `node scripts/quality-gate.js` localmente**, e **NUNCA execute `--update-baseline` nem altere `.quality-gate-baseline.json` manualmente**.
- **Validação Local**:
  - `npm test`: Executa todos os testes unitários.
  - `npm run test:coverage`: Roda a cobertura com provedor V8 e gera `coverage/coverage-summary.json`.
  - `npm run lint`: Valida conformidade de estilo e ausência de erros estáticos.
