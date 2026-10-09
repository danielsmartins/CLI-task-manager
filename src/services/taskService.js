import { defaultTaskStorage } from '../storage/taskStorage.js';

/**
 * @typedef {import('../storage/taskStorage.js').Task} Task
 */

/**
 * Formata um objeto Date para o formato de data brasileiro (DD/MM/YYYY).
 * @param {Date} [date=new Date()] - Instância de data a formatar.
 * @returns {string} Data formatada como DD/MM/YYYY.
 */
export function formatDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Camada de Regras de Negócio (Services).
 * Gerencia a lógica de validação, incremento de IDs, status e manipulação de tarefas.
 */
export class TaskService {
  /**
   * Inicializa o serviço de tarefas com a camada de persistência.
   * @param {import('../storage/taskStorage.js').TaskStorage} [storage=defaultTaskStorage] - Repositório de persistência.
   */
  constructor(storage = defaultTaskStorage) {
    this.storage = storage;
  }

  /**
   * Adiciona uma nova tarefa com status inicial 'pendente'.
   * @param {string} description - Descrição textual da tarefa.
   * @returns {Promise<Task>} A tarefa recém-criada com ID incremental e data.
   * @throws {Error} Caso a descrição seja vazia ou contenha apenas espaços.
   */
  async addTask(description) {
    const trimmed = description?.trim();
    if (!trimmed) {
      throw new Error('A descrição da tarefa não pode estar vazia.');
    }

    const tasks = await this.storage.loadTasks();
    const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const newTask = {
      id: nextId,
      description: trimmed,
      status: 'pendente',
      createdAt: formatDate(),
    };

    tasks.push(newTask);
    await this.storage.saveTasks(tasks);
    return newTask;
  }

  /**
   * Lista todas as tarefas ou filtra por status ('pendente' ou 'concluída').
   * @param {string|null} [filterStatus=null] - Filtro de status desejado.
   * @returns {Promise<Task[]>} Lista de tarefas filtradas ou completa.
   */
  async listTasks(filterStatus = null) {
    const tasks = await this.storage.loadTasks();
    if (!filterStatus) {
      return tasks;
    }
    const normalizedFilter = filterStatus.toLowerCase();
    return tasks.filter((t) => t.status.toLowerCase() === normalizedFilter);
  }

  /**
   * Marca uma tarefa como 'concluída' a partir de seu ID numérico.
   * @param {number|string} id - Identificador da tarefa.
   * @returns {Promise<Task>} A tarefa atualizada com status 'concluída'.
   * @throws {Error} Se a tarefa não for encontrada.
   */
  async completeTask(id) {
    const tasks = await this.storage.loadTasks();
    const task = tasks.find((t) => t.id === Number(id));

    if (!task) {
      throw new Error(`Tarefa #${id} não encontrada.`);
    }

    task.status = 'concluída';
    await this.storage.saveTasks(tasks);
    return task;
  }

  /**
   * Remove uma tarefa da lista pelo seu ID numérico.
   * @param {number|string} id - Identificador da tarefa.
   * @returns {Promise<Task>} A tarefa que foi removida.
   * @throws {Error} Se a tarefa não for encontrada.
   */
  async removeTask(id) {
    const tasks = await this.storage.loadTasks();
    const index = tasks.findIndex((t) => t.id === Number(id));

    if (index === -1) {
      throw new Error(`Tarefa #${id} não encontrada.`);
    }

    const [removed] = tasks.splice(index, 1);
    await this.storage.saveTasks(tasks);
    return removed;
  }

  /**
   * Atualiza a descrição de uma tarefa existente.
   * @param {number|string} id - Identificador da tarefa a ser editada.
   * @param {string} newDescription - Nova descrição textual.
   * @returns {Promise<Task>} A tarefa atualizada.
   * @throws {Error} Se a nova descrição for vazia ou o ID inexistente.
   */
  async editTask(id, newDescription) {
    const trimmed = newDescription?.trim();
    if (!trimmed) {
      throw new Error('A nova descrição não pode estar vazia.');
    }

    const tasks = await this.storage.loadTasks();
    const task = tasks.find((t) => t.id === Number(id));

    if (!task) {
      throw new Error(`Tarefa #${id} não encontrada.`);
    }

    task.description = trimmed;
    await this.storage.saveTasks(tasks);
    return task;
  }
}

export const defaultTaskService = new TaskService();
