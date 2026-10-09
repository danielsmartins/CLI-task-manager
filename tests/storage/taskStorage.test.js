import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { TaskStorage } from '../../src/storage/taskStorage.js';

describe('TaskStorage - Camada de Persistencia', () => {
  let tempDir;
  let tempFilePath;
  let storage;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'task-storage-test-'));
    tempFilePath = path.join(tempDir, 'nested', 'tasks.json');
    storage = new TaskStorage(tempFilePath);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('deve retornar array vazio se o arquivo nao existir', async () => {
    const tasks = await storage.loadTasks();
    expect(tasks).toEqual([]);
  });

  it('deve salvar e carregar tarefas com sucesso', async () => {
    const initialTasks = [
      { id: 1, description: 'Estudar Git', status: 'pendente', createdAt: '08/10/2026' },
    ];

    await storage.saveTasks(initialTasks);
    const loaded = await storage.loadTasks();

    expect(loaded).toEqual(initialTasks);
  });

  it('deve retornar array vazio se o arquivo estiver em branco', async () => {
    await storage.saveTasks([]);
    await fs.writeFile(tempFilePath, '   ', 'utf-8');

    const tasks = await storage.loadTasks();
    expect(tasks).toEqual([]);
  });

  it('deve retornar array vazio com seguranca se o JSON estiver corrompido', async () => {
    await storage.saveTasks([]);
    await fs.writeFile(tempFilePath, '{ json corrompido }', 'utf-8');

    const tasks = await storage.loadTasks();
    expect(tasks).toEqual([]);
  });
});
