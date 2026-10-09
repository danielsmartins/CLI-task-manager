import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * @typedef {Object} Task
 * @property {number} id - Identificador único sequencial da tarefa.
 * @property {string} description - Descrição textual da tarefa.
 * @property {('pendente'|'concluída')} status - Status atual da tarefa.
 * @property {string} createdAt - Data de criação no formato DD/MM/YYYY.
 */

/**
 * Camada de Armazenamento (Storage).
 * Responsável exclusivo por ler e gravar dados no arquivo tasks.json em disco.
 */
export class TaskStorage {
  /**
   * Inicializa o gerenciador de armazenamento.
   * @param {string} [filePath='tasks.json'] - Caminho do arquivo JSON a ser utilizado.
   */
  constructor(filePath = 'tasks.json') {
    this.filePath = path.resolve(filePath);
  }

  /**
   * Lê as tarefas armazenadas no arquivo JSON.
   * Retorna um array vazio se o arquivo não existir ou se estiver em branco/corrompido.
   * @returns {Promise<Task[]>} Lista de tarefas cadastradas.
   */
  async loadTasks() {
    if (!existsSync(this.filePath)) {
      return [];
    }

    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      if (!data.trim()) {
        return [];
      }
      return JSON.parse(data);
    } catch (_err) {
      return [];
    }
  }

  /**
   * Salva a lista de tarefas no arquivo JSON de forma formatada e atômica.
   * Cria os diretórios necessários caso ainda não existam.
   * @param {Task[]} tasks - Lista de tarefas a serem persistidas.
   * @returns {Promise<void>}
   */
  async saveTasks(tasks) {
    const dir = path.dirname(this.filePath);
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
    const json = JSON.stringify(tasks, null, 2);
    await fs.writeFile(this.filePath, json, 'utf-8');
  }
}

export const defaultTaskStorage = new TaskStorage();
