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
 * Retorna o menu de ajuda com todos os comandos disponíveis e exemplos de uso.
 * @returns {string} Mensagem de ajuda devidamente formatada.
 */
export function getHelpMessage() {
  return `
Gerenciador de Tarefas CLI

Uso:
  node src/index.js <comando> [argumentos]

Comandos:
  adicionar <descricao>            Adiciona uma nova tarefa
  listar [filtro]                  Lista tarefas cadastradas (opcional: pendente ou concluida)
  concluir <id>                    Marca uma tarefa como concluida
  remover <id>                     Remove uma tarefa pelo ID
  editar <id> <nova_descricao>     Atualiza a descricao de uma tarefa existente
  ajuda                            Exibe esta mensagem de ajuda

Exemplos:
  node src/index.js adicionar "Estudar Git"
  node src/index.js listar
  node src/index.js listar --status pendente
  node src/index.js concluir 1
  node src/index.js editar 1 "Estudar Git avancado"
  node src/index.js remover 1
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
    const raw = args[flagIndex + 1].toLowerCase();
    if (raw.startsWith('pend')) return 'pendente';
    if (raw.startsWith('conc')) return 'concluída';
    return raw;
  }

  const positional = args[0]?.toLowerCase();
  if (positional) {
    if (positional.startsWith('pend')) return 'pendente';
    if (positional.startsWith('conc')) return 'concluída';
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
  const log = io.out || console.log;
  const logError = io.err || console.error;

  const command = args[0];
  const commandArgs = args.slice(1);

  if (!command || command === 'ajuda' || command === '--help' || command === '-h') {
    log(getHelpMessage());
    return;
  }

  try {
    switch (command) {
      case 'adicionar': {
        const description = commandArgs.join(' ').trim();
        if (!description) {
          throw new Error('A descrição da tarefa não pode estar vazia.');
        }
        const created = await service.addTask(description);
        log(`Tarefa #${created.id} adicionada.`);
        break;
      }

      case 'listar': {
        const filter = extractListStatusFilter(commandArgs);
        const tasks = await service.listTasks(filter);
        if (!tasks || tasks.length === 0) {
          log('Nenhuma tarefa encontrada.');
        } else {
          tasks.forEach((task) => log(formatTask(task)));
        }
        break;
      }

      case 'concluir': {
        const id = Number(commandArgs[0]);
        if (!commandArgs[0] || Number.isNaN(id) || id <= 0) {
          throw new Error('Por favor, informe um ID numérico válido.');
        }
        const updated = await service.completeTask(id);
        log(`Tarefa #${updated.id} concluída.`);
        break;
      }

      case 'remover': {
        const id = Number(commandArgs[0]);
        if (!commandArgs[0] || Number.isNaN(id) || id <= 0) {
          throw new Error('Por favor, informe um ID numérico válido.');
        }
        const removed = await service.removeTask(id);
        log(`Tarefa #${removed.id} removida.`);
        break;
      }

      case 'editar': {
        const id = Number(commandArgs[0]);
        if (!commandArgs[0] || Number.isNaN(id) || id <= 0) {
          throw new Error('Por favor, informe um ID numérico válido.');
        }
        const newDescription = commandArgs.slice(1).join(' ').trim();
        if (!newDescription) {
          throw new Error('Por favor, informe a nova descrição da tarefa.');
        }
        const updated = await service.editTask(id, newDescription);
        log(`Tarefa #${updated.id} atualizada.`);
        break;
      }

      default: {
        throw new Error(
          `Comando "${command}" não reconhecido. Use "node src/index.js ajuda" para ver os comandos disponíveis.`
        );
      }
    }
  } catch (err) {
    process.exitCode = 1;
    logError(`Erro: ${err.message}`);
  }
}
