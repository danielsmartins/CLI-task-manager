# Gerenciador de Tarefas CLI (CLI Task Manager)

Uma aplicação de linha de comando (CLI) simples, robusta e modular para gerenciamento de tarefas pessoais com persistência local em arquivo JSON, desenvolvida em **Node.js (ES Modules)**.

---

## 📋 Sobre o Projeto

O **CLI Task Manager** permite criar, visualizar, filtrar, concluir, editar e remover tarefas diretamente pelo terminal. Todas as tarefas são mantidas em um arquivo local (`tasks.json`), garantindo que os dados permaneçam salvos após o fechamento do programa.

A aplicação foi projetada utilizando Clean Code, arquitetura desacoplada em 3 camadas, tratamento amigável de erros (sem exibição de stack traces ao usuário final), documentação completa em JSDoc e 100% de cobertura de testes automatizados com Vitest.

---

## 🛠️ Tecnologias

- **Node.js** (>= 20.0.0) — Runtime JavaScript moderno com suporte nativo a ES Modules (`import`/`export`).
- **Vitest** (v3.2+) — Framework de testes unitários ultrarrápido com provedor V8 para cobertura de código.
- **ESLint** (v9+) — Análise estática de código com regras estritas de Clean Code e padronização.
- **esbuild** & **caxa** — Ferramental de empacotamento para geração de executáveis autocontidos (Windows e Linux).
- **GitHub Actions** — Esteira de Integração Contínua (CI) com Quality Gate automatizado.

---

## 🚀 Como Instalar

### Pré-requisitos
- **Node.js** versão 20.0.0 ou superior instalada ([Download Node.js](https://nodejs.org/)).
- **npm** (geralmente instalado junto com o Node.js).
- **Git** instalado para clonar o repositório.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/danielsmartins/CLI-task-manager.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd CLI-task-manager
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

Pronto! A aplicação já está pronta para ser executada.

---

## 💻 Como Usar

A aplicação suporta dois modos de execução:
1. **Via Script Node.js** (Padrão multiplataforma — Windows, Linux e macOS).
2. **Via Executável Compilado** (Executável autocontido).

---

### Modo 1: Execução via Script Node.js 

O comando de entrada é `node src/index.js <comando> [argumentos]`:

#### 1. Adicionar uma tarefa
Cria uma nova tarefa com status inicial `pendente` e data de criação atual:
```bash
node src/index.js adicionar "Estudar Git"
```
**Saída esperada:**
```plaintext
Tarefa #1 adicionada.
```

#### 2. Listar tarefas
Lista todas as tarefas cadastradas, indicando status `[ ]` para pendente e `[x]` para concluída:
```bash
node src/index.js listar
```
**Saída esperada:**
```plaintext
[ ] #1 Estudar Git 09/10/2026
```

#### 3. Filtrar listagem por status 
Permite listar apenas tarefas com determinado status (`pendente` ou `concluída`):
```bash
node src/index.js listar --status pendente
# ou simplesmente:
node src/index.js listar pendente
```
**Saída esperada:**
```plaintext
[ ] #1 Estudar Git 09/10/2026
```

#### 4. Concluir uma tarefa
Marca uma tarefa existente como concluída utilizando seu identificador numérico:
```bash
node src/index.js concluir 1
```
**Saída esperada:**
```plaintext
Tarefa #1 concluída.
```

Ao listar novamente:
```bash
node src/index.js listar
```
```plaintext
[x] #1 Estudar Git 09/10/2026
```

#### 5. Editar a descrição de uma tarefa (Diferencial)
Atualiza a descrição textual de uma tarefa mantendo seu ID, status e data:
```bash
node src/index.js editar 1 "Estudar Git e GitHub Avançado"
```
**Saída esperada:**
```plaintext
Tarefa #1 atualizada.
```

#### 6. Remover uma tarefa
Remove uma tarefa definitivamente pelo seu ID:
```bash
node src/index.js remover 1
```
**Saída esperada:**
```plaintext
Tarefa #1 removida.
```

#### 7. Ajuda / Comandos disponíveis
Exibe a documentação de uso com exemplos:
```bash
node src/index.js ajuda
# ou:
node src/index.js --help
```

---

### Modo 2: Executável Compilado (Diferencial)

A aplicação pode ser compilada em binários autocontidos que rodam diretamente no terminal sem necessidade do Node.js instalado no ambiente final.

#### Como gerar os executáveis localmente:
- **Para Windows (`dist/tarefas.exe`):**
  ```bash
  npm run build:bin:win
  ```
- **Para Linux (`dist/tarefas-linux`):**
  ```bash
  npm run build:bin:linux
  ```

#### Como executar no Windows:
```powershell
.\dist\tarefas.exe ajuda
.\dist\tarefas.exe adicionar "Comprar café"
.\dist\tarefas.exe listar
.\dist\tarefas.exe concluir 1
.\dist\tarefas.exe remover 1
```

#### Como executar no Linux:
```bash
./dist/tarefas-linux ajuda
./dist/tarefas-linux adicionar "Comprar café"
./dist/tarefas-linux listar
./dist/tarefas-linux concluir 1
./dist/tarefas-linux remover 1
```

> **Nota para usuários de macOS:** No macOS, utilize a execução nativa via Node.js (`node src/index.js <comando>`), que roda sem necessidade de compilação adicional.

---

### 🛡️ Tratamento de Erros e Casos de Borda

A aplicação possui validações para todas as entradas e exibe mensagens claras e sem stack traces:

- **Comando não reconhecido:**
  ```bash
  node src/index.js desconhecido
  ```
  ```plaintext
  Erro: Comando "desconhecido" não reconhecido. Use "node src/index.js ajuda" para ver os comandos disponíveis.
  ```

- **ID inexistente:**
  ```bash
  node src/index.js concluir 99
  ```
  ```plaintext
  Erro: Tarefa #99 não encontrada.
  ```

- **Descrição vazia:**
  ```bash
  node src/index.js adicionar ""
  ```
  ```plaintext
  Erro: A descrição da tarefa não pode estar vazia.
  ```

---

### 🧪 Testes Automatizados e Qualidade

O projeto conta com suíte de testes unitários automatizados com o **Vitest** e verificação de integridade estática com **ESLint**:

```bash
# Executar todos os testes unitários uma única vez:
npm test

# Executar testes em modo contínuo (watch):
npm run test:watch

# Gerar relatório detalhado de cobertura de código (V8):
npm run test:coverage

# Executar o linter:
npm run lint
```

**Métricas de Cobertura de Código:**
- **Linhas:** 100%
- **Instruções:** 100%
- **Funções:** 100%
- **Branches:** 97.5%

---

## 🏗️ Como Foi o Desenvolvimento

### 1. Organização do Código e Arquitetura

O projeto foi organizado em 3 camadas desacopladas dentro de `src/`, respeitando o princípio de responsabilidade única (SRP):

```plaintext
src/
├── storage/
│   └── taskStorage.js    # Camada de Armazenamento: I/O seguro em disco e persistência JSON
├── services/
│   └── taskService.js    # Camada de Regras de Negócio: validações, IDs, datas e filtros
├── cli/
│   └── cli.js            # Camada de Apresentação: parser de argumentos e formatação no terminal
└── index.js              # Ponto de entrada da aplicação
```

- **`storage/taskStorage.js`**: Único módulo que interage com o sistema de arquivos (`node:fs/promises`). Possui tratamento para arquivos inexistentes, em branco ou corrompidos, e permite injeção de caminho customizado (`filePath`), viabilizando testes unitários isolados sem alterar o `tasks.json` de produção.
- **`services/taskService.js`**: Concentra as regras de negócio puras (criação de IDs sequenciais, formatação da data `DD/MM/YYYY`, mudança de status e validações de campos obrigatórios). Não depende de terminal nem de console.
- **`cli/cli.js`**: Faz o parsing dos argumentos de linha de comando (`process.argv`), despacha para a camada de serviços e formata a saída conforme a especificação do desafio. Captura qualquer erro de negócio e converte em mensagem clara para o usuário com código de saída `exitCode = 1`.

### 2. Decisões Tomadas

- **ES Modules Nativos (`"type": "module"`)**: Optou-se por JavaScript moderno puro sem necessidade de etapa de build para rodar. Qualquer avaliador pode clonar o projeto e rodar `node src/index.js` imediatamente.
- **Documentação JSDoc Completa**: Todo o código foi documentado com JSDoc (`@typedef`, `@param`, `@returns`, `@throws`), fornecendo anotações de tipos, autocompletion inteligente na IDE e documentação clara dos contratos de cada função.
- **Implementação de Todos os Diferenciais**:
  - Filtragem por status (`--status pendente` / `listar concluida`).
  - Edição de descrição de tarefa (`editar <id> <nova_descricao>`).
  - Testes automatizados com 100% de cobertura.
  - Separação estrita em camadas (entrada, regras e armazenamento).
  - Executáveis compilados autocontidos para Windows e Linux.
- **Esteira de CI & Quality Gate**: Configuração de pipeline no GitHub Actions comparando métricas de cobertura, duplicação e regras estáticas a cada Pull Request.

### 3. Dificuldades Encontradas e Soluções

- **Adaptação Dinâmica do Nome do Comando no Executável**:
  - *Problema:* Ao executar o binário compilado (`tarefas.exe`), a mensagem de ajuda e os erros sugeriam rodar `node src/index.js`, o que causava estranheza em máquinas sem o Node instalado.
  - *Solução:* Criou-se a função utilitária `getProgramName()` em `cli.js`, que detecta dinamicamente o contexto de execução e a plataforma do sistema operacional (`process.platform`), exibindo `./dist/tarefas.exe` no Windows, `./dist/tarefas-linux` no Linux e `node src/index.js` na execução via script.
- **Isolamento Total dos Testes Unitários**:
  - *Problema:* Evitar que a suíte de testes apagasse ou sobrescrevesse o arquivo `tasks.json` real de desenvolvimento.
  - *Solução:* A camada de persistência foi parametrizada para receber o caminho do arquivo no construtor. Nos testes do Vitest, foram utilizados diretórios temporários criados em tempo de execução com `fs.mkdtemp` no diretório do sistema operacional (`os.tmpdir()`), garantindo idempotência e independência completa dos testes.

---

## 🔮 Próximos Passos

Para os próximos passos as seguintes melhorias seriam implementadas:

1. **Datas de Vencimento e Prioridades**: Adicionar campos como `prioridade` (baixa, média, alta) e `prazo` (due date) com alertas visuais no terminal para tarefas atrasadas.
2. **Busca Textual**: Criar um comando `tarefas buscar <termo>` para filtrar tarefas por palavras-chave na descrição.
3. **Exportação e Importação de Dados**: Permitir exportar a lista de tarefas para formatos como CSV e Markdown.
4. **Publicação Automática de Releases**: Configurar o GitHub Actions para compilar os binários em matriz (`windows`, `ubuntu`, `macos`) e anexá-los automaticamente na aba de *Releases* do GitHub a cada tag de versão criada.
