# Diretrizes de Arquitetura (Módulos & Camadas)

A aplicação segue uma divisão clara em 3 módulos diretos e desacoplados, atendendo ao diferencial exigido no desafio técnico da Dplay Solutions:

```plaintext
src/
├── cli/           # Camada de Entrada & Apresentação (terminal)
│   └── cli.js     # Parser de argumentos e formatação no console
├── services/      # Camada de Regras de Negócio
│   └── taskService.js # Lógica de negócio pura (adicionar, listar, concluir, remover, editar)
├── storage/       # Camada de Armazenamento
│   └── taskStorage.js # I/O seguro em tasks.json (leitura e gravação)
└── index.js       # Ponto de entrada que instancia as dependências
```

---

## 1. Responsabilidades de Cada Módulo

### `src/storage/taskStorage.js` (Armazenamento)
- Responsável exclusivo por ler e escrever no arquivo de persistência (`tasks.json`).
- Deve tratar arquivo inexistente (iniciar com array vazio `[]` sem estourar erro).
- Deve garantir escrita atômica/segura de dados serializados em JSON.
- Deve aceitar opcionalmente o caminho do arquivo (`filePath`) por injeção/parâmetro, permitindo que os testes usem caminhos temporários sem sujar o arquivo real.
- **Não deve conter nenhuma regra de negócio** (não valida descrição, não sabe sobre filtros).

### `src/services/taskService.js` (Regras de Negócio)
- Concentra toda a inteligência e validações da aplicação:
  - Criação de nova tarefa com ID incremental seguro.
  - Formatação da data de criação (`DD/MM/YYYY`).
  - Status inicial sempre `"pendente"`.
  - Validação de descrições vazias ou inválidas.
  - Validação de existência de ID para conclusão, edição ou remoção.
  - Filtragem por status (`pendente` ou `concluída`).
- Recebe a dependência de storage por injeção ou parâmetro para facilitar testes unitários com mocks.
- **Não deve interagir diretamente com `console.log` nem `process.exit`**; deve retornar dados ou lançar erros com mensagens semânticas.

### `src/cli/cli.js` (Entrada & Apresentação)
- Ponto de interação com o usuário via terminal.
- Interpreta o vetor de argumentos (`process.argv` ou fatias tratadas).
- Formata a saída no terminal exatamente no padrão exigido pelo desafio:
  - `Tarefa #<id> adicionada.`
  - `[ ] #<id> <descrição> <data>` (pendente)
  - `[x] #<id> <descrição> <data>` (concluída)
  - `Tarefa #<id> concluída.`
  - `Tarefa #<id> removida.`
- Captura erros lançados pelo serviço e exibe mensagens limpas e objetivas (ex.: `Erro: Tarefa #5 não encontrada.`), sem vazar stack trace no console.
- Exibe o menu de ajuda quando invocado com `ajuda`, `--help` ou `-h`.

---

## 2. Regra de Limite de Arquivos
- Mantenha os arquivos enxutos e focados (menos de 200 linhas). Se algum módulo acumular muitas funções secundárias (por exemplo, formatação ou parsing de flags), extraia para arquivos auxiliares dentro da mesma pasta (ex.: `src/cli/formatter.js`, `src/cli/parser.js`).
