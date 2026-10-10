import { defaultTaskService } from '../services/taskService.js';

/**
 * @typedef {import('../storage/taskStorage.js').Task} Task
 */

/**
 * @typedef {Object} CLIOutput
 * @property {(message: string) => void} [out=console.log] - Canal de saída padrão.
 * @property {(message: string) => void} [err=console.error] - Canal de saída de erros.
 */

/**
 * Detecta o comando de invocação apropriado (script node ou binário em dist/).
 * @returns {string} Nome ou caminho do comando a exibir.
 */
export function getProgramName() {
  if (process.env.APP_BIN_NAME) {
    return process.env.APP_BIN_NAME;
  }
  const isPackaged = process.argv[1]?.includes('bundle.cjs') || process.argv0?.includes('tarefas');
  if (isPackaged) {
    return process.platform === 'win32' ? './dist/tarefas.exe' : './dist/tarefas-linux';
  }
  return 'node src/index.js';
}

/**
 * Retorna o menu de ajuda com todos os comandos disponíveis e exemplos de uso.
 * @param {string} [programName=getProgramName()] - Nome do executavel a exibir no menu.
 * @returns {string} Mensagem de ajuda devidamente formatada.
 */
export function getHelpMessage(programName = getProgramName()) {
  return `
Gerenciador de Tarefas CLI

Uso:
  ${programName} <comando> [argumentos]

Comandos:
  adicionar <descricao>            Adiciona uma nova tarefa
  listar [filtro]                  Lista tarefas cadastradas (opcional: pendente ou concluida)
  concluir <id>                    Marca uma tarefa como concluida
  remover <id>                     Remove uma tarefa pelo ID
  editar <id> <nova_descricao>     Atualiza a descricao de uma tarefa existente
  ajuda                            Exibe esta mensagem de ajuda

Exemplos:
  ${programName} adicionar "Estudar Git"
  ${programName} listar
  ${programName} listar --status pendente
  ${programName} concluir 1
  ${programName} editar 1 "Estudar Git avancado"
  ${programName} remover 1
`.trim();
}

/**
 * Formata uma unica tarefa para exibicao na listagem do terminal.
 * @param {Task} task - Objeto da tarefa a ser formatado.
 * @returns {string} Linha formatada com checkbox, ID, descrição e data.
 */
export function formatTask(task) {
  const checkbox = task.status === 'concluída' ? '[x]' : '[ ]';
  return `${checkbox} #${task.id} ${task.description} ${task.createdAt}`;
}

/**
 * Normaliza e extrai o filtro de status dos argumentos do comando listar.
 * Suporta formatos como: `--status pendente`, `--status concluida`, `pendentes`, etc.
 * @param {string[]} args - Argumentos passados após a instrução 'listar'.
 * @returns {string|null} Status normalizado ou null se não houver filtro.
 */
export function extractListStatusFilter(args) {
  if (!args || args.length === 0) return null;

  const flagIndex = args.indexOf('--status');
  if (flagIndex !== -1 && args[flagIndex + 1]) {
    const flagStatus = args[flagIndex + 1].toLowerCase();
    if (flagStatus.startsWith('pend')) return 'pendente';
    if (flagStatus.startsWith('conc')) return 'concluída';
    return flagStatus;
  }

  const directStatus = args[0]?.toLowerCase();
  if (directStatus) {
    if (directStatus.startsWith('pend')) return 'pendente';
    if (directStatus.startsWith('conc')) return 'concluída';
  }

  return null;
}

/**
 * Orquestra a execução dos comandos recebidos via CLI.
 * Captura exceções e exibe mensagens limpas sem expor stack traces.
 * @param {string[]} [args=[]] - Argumentos de linha de comando (process.argv fatiado).
 * @param {import('../services/taskService.js').TaskService} [service=defaultTaskService] - Serviço de tarefas injetado.
 * @param {CLIOutput} [io={}] - Canais de entrada/saída customizados.
 * @returns {Promise<void>}
 */
export async function runCli(args = [], service = defaultTaskService, io = {}) {
  const print = io.out || console.log;
  const printError = io.err || console.error;

  const action = args[0];
  const actionArgs = args.slice(1);

  if (!action || action === 'ajuda' || action === '--help' || action === '-h') {
    print(getHelpMessage());
    return;
  }

  try {
    switch (action) {
      case 'adicionar': {
        const description = actionArgs.join(' ').trim();
        if (!description) {
          throw new Error('A descrição da tarefa não pode estar vazia.');
        }
        const created = await service.addTask(description);
        print(`Tarefa #${created.id} adicionada.`);
        break;
      }

      case 'listar': {
        const filter = extractListStatusFilter(actionArgs);
        const tasks = await service.listTasks(filter);
        if (!tasks || tasks.length === 0) {
          print('Nenhuma tarefa encontrada.');
        } else {
          tasks.forEach((task) => print(formatTask(task)));
        }
        break;
      }

      case 'concluir': {
        const id = Number(actionArgs[0]);
        if (!actionArgs[0] || Number.isNaN(id) || id <= 0) {
          throw new Error('Por favor, informe um ID numérico válido.');
        }
        const updated = await service.completeTask(id);
        print(`Tarefa #${updated.id} concluída.`);
        break;
      }

      case 'remover': {
        const id = Number(actionArgs[0]);
        if (!actionArgs[0] || Number.isNaN(id) || id <= 0) {
          throw new Error('Por favor, informe um ID numérico válido.');
        }
        const removed = await service.removeTask(id);
        print(`Tarefa #${removed.id} removida.`);
        break;
      }

      case 'editar': {
        const id = Number(actionArgs[0]);
        if (!actionArgs[0] || Number.isNaN(id) || id <= 0) {
          throw new Error('Por favor, informe um ID numérico válido.');
        }
        const newDescription = actionArgs.slice(1).join(' ').trim();
        if (!newDescription) {
          throw new Error('Por favor, informe a nova descrição da tarefa.');
        }
        const updated = await service.editTask(id, newDescription);
        print(`Tarefa #${updated.id} atualizada.`);
        break;
      }

      default: {
        const programName = getProgramName();
        throw new Error(
          `Comando "${action}" não reconhecido. Use "${programName} ajuda" para ver os comandos disponíveis.`
        );
      }
    }
  } catch (err) {
    process.exitCode = 1;
    printError(`Erro: ${err.message}`);
  }
}
