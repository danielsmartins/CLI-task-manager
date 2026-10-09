# Diretrizes de Interface CLI (Dplay Solutions)

Este arquivo detalha as regras de entrada e saída da CLI para garantir total conformidade com a especificação do desafio técnico da Dplay Solutions.

---

## 1. Padrões de Comandos e Entradas

A aplicação deve responder aos seguintes comandos principais:

| Comando | Sintaxe Exemplo | Efeito Esperado |
| :--- | :--- | :--- |
| `adicionar` | `tarefas adicionar "Estudar Git"` | Cria nova tarefa com status pendente e data atual |
| `listar` | `tarefas listar` | Lista todas as tarefas cadastradas |
| `listar` (filtro) | `tarefas listar --status pendente` ou `tarefas listar pendentes` | Lista tarefas filtradas pelo status |
| `concluir` | `tarefas concluir 1` | Marca tarefa com ID 1 como concluída |
| `remover` | `tarefas remover 1` | Remove a tarefa com ID 1 |
| `editar` | `tarefas editar 1 "Nova descrição"` | Atualiza a descrição da tarefa com ID 1 |
| `ajuda` | `tarefas ajuda` ou `tarefas --help` | Lista todos os comandos disponíveis e exemplos |

---

## 2. Padrões de Saída no Terminal

Conforme os exemplos do documento do desafio:

- **Adicionar**:
  ```plaintext
  Tarefa #1 adicionada.
  ```
- **Listar**:
  ```plaintext
  [ ] #1 Estudar Git 07/10/2026
  [x] #2 Revisar PR 08/10/2026
  ```
  *(Se a lista estiver vazia, exibir: `Nenhuma tarefa encontrada.`)*
- **Concluir**:
  ```plaintext
  Tarefa #1 concluída.
  ```
- **Remover**:
  ```plaintext
  Tarefa #1 removida.
  ```
- **Editar**:
  ```plaintext
  Tarefa #1 atualizada.
  ```

---

## 3. Tratamento de Erros

- **Comando inválido ou desconhecido**:
  ```plaintext
  Erro: Comando "xyz" não reconhecido. Use "tarefas ajuda" para ver os comandos disponíveis.
  ```
- **ID não informado ou inválido**:
  ```plaintext
  Erro: Por favor, informe um ID numérico válido.
  ```
- **ID inexistente**:
  ```plaintext
  Erro: Tarefa #5 não encontrada.
  ```
- **Descrição vazia ao adicionar ou editar**:
  ```plaintext
  Erro: A descrição da tarefa não pode estar vazia.
  ```
- **Regra de ouro de UX**: **NUNCA** despejar mensagens como `TypeError: Cannot read properties of undefined` ou pilhas de stack trace no terminal do usuário. Todos os erros esperados devem ser capturados e convertidos em mensagens limpas com código de saída `process.exitCode = 1`.
