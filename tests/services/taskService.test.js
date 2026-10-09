import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService, formatDate } from '../../src/services/taskService.js';

describe('TaskService - Camada de Regras de Negocio', () => {
  let mockStorage;
  let service;

  beforeEach(() => {
    mockStorage = {
      loadTasks: vi.fn(),
      saveTasks: vi.fn(),
    };
    service = new TaskService(mockStorage);
  });

  describe('formatDate()', () => {
    it('deve formatar data no formato DD/MM/YYYY', () => {
      const fixedDate = new Date(2026, 9, 8); // 8 de outubro de 2026
      expect(formatDate(fixedDate)).toBe('08/10/2026');
    });

    it('deve utilizar data atual se nao informada', () => {
      expect(formatDate()).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('addTask()', () => {
    it('deve lancar erro se descricao for vazia ou apenas espacos', async () => {
      await expect(service.addTask('')).rejects.toThrow('A descrição da tarefa não pode estar vazia.');
      await expect(service.addTask('   ')).rejects.toThrow('A descrição da tarefa não pode estar vazia.');
      await expect(service.addTask(null)).rejects.toThrow('A descrição da tarefa não pode estar vazia.');
    });

    it('deve iniciar com ID 1 quando lista estiver vazia', async () => {
      mockStorage.loadTasks.mockResolvedValue([]);

      const created = await service.addTask('Primeira tarefa');

      expect(created.id).toBe(1);
      expect(created.description).toBe('Primeira tarefa');
      expect(created.status).toBe('pendente');
      expect(created.createdAt).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(mockStorage.saveTasks).toHaveBeenCalledWith([created]);
    });

    it('deve incrementar o maior ID existente', async () => {
      mockStorage.loadTasks.mockResolvedValue([
        { id: 1, description: 'T1', status: 'pendente' },
        { id: 4, description: 'T4', status: 'concluída' },
      ]);

      const created = await service.addTask('Nova tarefa');

      expect(created.id).toBe(5);
    });
  });

  describe('listTasks()', () => {
    it('deve retornar todas as tarefas quando nenhum filtro for passado', async () => {
      const tasks = [
        { id: 1, description: 'T1', status: 'pendente' },
        { id: 2, description: 'T2', status: 'concluída' },
      ];
      mockStorage.loadTasks.mockResolvedValue(tasks);

      const result = await service.listTasks();
      expect(result).toEqual(tasks);
    });

    it('deve filtrar corretamente por status pendente ou concluida', async () => {
      const tasks = [
        { id: 1, description: 'T1', status: 'pendente' },
        { id: 2, description: 'T2', status: 'concluída' },
      ];
      mockStorage.loadTasks.mockResolvedValue(tasks);

      const pendentes = await service.listTasks('pendente');
      expect(pendentes).toEqual([tasks[0]]);

      const concluidas = await service.listTasks('concluída');
      expect(concluidas).toEqual([tasks[1]]);
    });
  });

  describe('completeTask()', () => {
    it('deve marcar tarefa como concluida', async () => {
      const task = { id: 1, description: 'Estudar', status: 'pendente' };
      mockStorage.loadTasks.mockResolvedValue([task]);

      const result = await service.completeTask(1);

      expect(result.status).toBe('concluída');
      expect(mockStorage.saveTasks).toHaveBeenCalledWith([task]);
    });

    it('deve lancar erro se tarefa com ID nao existir', async () => {
      mockStorage.loadTasks.mockResolvedValue([]);

      await expect(service.completeTask(99)).rejects.toThrow('Tarefa #99 não encontrada.');
    });
  });

  describe('removeTask()', () => {
    it('deve remover a tarefa da lista', async () => {
      const task1 = { id: 1, description: 'T1' };
      const task2 = { id: 2, description: 'T2' };
      mockStorage.loadTasks.mockResolvedValue([task1, task2]);

      const removed = await service.removeTask(1);

      expect(removed).toEqual(task1);
      expect(mockStorage.saveTasks).toHaveBeenCalledWith([task2]);
    });

    it('deve lancar erro se tarefa a remover nao existir', async () => {
      mockStorage.loadTasks.mockResolvedValue([]);

      await expect(service.removeTask(404)).rejects.toThrow('Tarefa #404 não encontrada.');
    });
  });

  describe('editTask()', () => {
    it('deve atualizar a descricao da tarefa', async () => {
      const task = { id: 1, description: 'Desc antiga', status: 'pendente' };
      mockStorage.loadTasks.mockResolvedValue([task]);

      const updated = await service.editTask(1, 'Desc nova');

      expect(updated.description).toBe('Desc nova');
      expect(mockStorage.saveTasks).toHaveBeenCalledWith([task]);
    });

    it('deve lancar erro se a nova descricao for vazia', async () => {
      await expect(service.editTask(1, '')).rejects.toThrow('A nova descrição não pode estar vazia.');
      await expect(service.editTask(1, '   ')).rejects.toThrow('A nova descrição não pode estar vazia.');
      await expect(service.editTask(1, null)).rejects.toThrow('A nova descrição não pode estar vazia.');
    });

    it('deve lancar erro se o ID nao existir ao editar', async () => {
      mockStorage.loadTasks.mockResolvedValue([]);

      await expect(service.editTask(999, 'Nova')).rejects.toThrow('Tarefa #999 não encontrada.');
    });
  });
});
