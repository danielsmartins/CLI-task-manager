import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runCli, getHelpMessage, formatTask, extractListStatusFilter } from '../../src/cli/cli.js';

describe('CLI - Camada de Apresentacao', () => {
  let mockService;
  let logs;
  let errors;
  let io;
  let originalExitCode;

  beforeEach(() => {
    logs = [];
    errors = [];
    io = {
      out: (msg) => logs.push(msg),
      err: (msg) => errors.push(msg),
    };
    originalExitCode = process.exitCode;
    process.exitCode = 0;

    mockService = {
      addTask: vi.fn(),
      listTasks: vi.fn(),
      completeTask: vi.fn(),
      removeTask: vi.fn(),
      editTask: vi.fn(),
    };
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
  });

  describe('formatTask() e filtros', () => {
    it('deve formatar tarefa pendente com [ ]', () => {
      const task = { id: 1, description: 'Estudar Git', status: 'pendente', createdAt: '07/10/2026' };
      expect(formatTask(task)).toBe('[ ] #1 Estudar Git 07/10/2026');
    });

    it('deve formatar tarefa concluida com [x]', () => {
      const task = { id: 2, description: 'Ler doc', status: 'concluída', createdAt: '08/10/2026' };
      expect(formatTask(task)).toBe('[x] #2 Ler doc 08/10/2026');
    });

    it('deve extrair filtro de status por flag --status ou posicional', () => {
      expect(extractListStatusFilter(['--status', 'pendente'])).toBe('pendente');
      expect(extractListStatusFilter(['--status', 'concluida'])).toBe('concluída');
      expect(extractListStatusFilter(['--status', 'qualquer'])).toBe('qualquer');
      expect(extractListStatusFilter(['pendentes'])).toBe('pendente');
      expect(extractListStatusFilter(['concluidas'])).toBe('concluída');
      expect(extractListStatusFilter(['outro'])).toBeNull();
      expect(extractListStatusFilter([])).toBeNull();
    });
  });

  describe('Comando: ajuda', () => {
    it('deve exibir o menu de ajuda quando chamado sem argumentos', async () => {
      await runCli([], mockService, io);
      expect(logs[0]).toBe(getHelpMessage());
      expect(logs[0]).toContain('adicionar <descricao>');
      expect(logs[0]).toContain('editar <id>');
    });

    it('deve permitir customizar o nome do executavel no menu de ajuda', () => {
      const customHelp = getHelpMessage('tarefas.exe');
      expect(customHelp).toContain('tarefas.exe <comando> [argumentos]');
      expect(customHelp).toContain('tarefas.exe adicionar "Estudar Git"');
    });

    it('deve exibir o menu de ajuda quando chamado com "ajuda" ou "--help"', async () => {
      await runCli(['ajuda'], mockService, io);
      expect(logs[0]).toBe(getHelpMessage());

      logs = [];
      await runCli(['--help'], mockService, io);
      expect(logs[0]).toBe(getHelpMessage());
    });
  });

  describe('Comando: adicionar', () => {
    it('deve adicionar uma tarefa e exibir a mensagem de sucesso', async () => {
      mockService.addTask.mockResolvedValue({ id: 1, description: 'Estudar Git' });

      await runCli(['adicionar', 'Estudar', 'Git'], mockService, io);

      expect(mockService.addTask).toHaveBeenCalledWith('Estudar Git');
      expect(logs).toContain('Tarefa #1 adicionada.');
      expect(process.exitCode).toBe(0);
    });

    it('deve exibir erro amigavel se a descricao for vazia', async () => {
      await runCli(['adicionar'], mockService, io);

      expect(mockService.addTask).not.toHaveBeenCalled();
      expect(errors[0]).toBe('Erro: A descrição da tarefa não pode estar vazia.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('Comando: listar', () => {
    it('deve informar quando nenhuma tarefa for encontrada', async () => {
      mockService.listTasks.mockResolvedValue([]);

      await runCli(['listar'], mockService, io);

      expect(mockService.listTasks).toHaveBeenCalledWith(null);
      expect(logs).toContain('Nenhuma tarefa encontrada.');
    });

    it('deve listar tarefas formatadas', async () => {
      mockService.listTasks.mockResolvedValue([
        { id: 1, description: 'Estudar Git', status: 'pendente', createdAt: '07/10/2026' },
        { id: 2, description: 'Fazer PR', status: 'concluída', createdAt: '08/10/2026' },
      ]);

      await runCli(['listar'], mockService, io);

      expect(logs).toContain('[ ] #1 Estudar Git 07/10/2026');
      expect(logs).toContain('[x] #2 Fazer PR 08/10/2026');
    });

    it('deve repassar o filtro de status para o servico', async () => {
      mockService.listTasks.mockResolvedValue([]);

      await runCli(['listar', '--status', 'pendente'], mockService, io);

      expect(mockService.listTasks).toHaveBeenCalledWith('pendente');
    });
  });

  describe('Comando: concluir', () => {
    it('deve concluir a tarefa e exibir mensagem de sucesso', async () => {
      mockService.completeTask.mockResolvedValue({ id: 1 });

      await runCli(['concluir', '1'], mockService, io);

      expect(mockService.completeTask).toHaveBeenCalledWith(1);
      expect(logs).toContain('Tarefa #1 concluída.');
    });

    it('deve exibir erro amigavel se o ID for invalido', async () => {
      await runCli(['concluir', 'abc'], mockService, io);

      expect(mockService.completeTask).not.toHaveBeenCalled();
      expect(errors[0]).toBe('Erro: Por favor, informe um ID numérico válido.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('Comando: remover', () => {
    it('deve remover a tarefa e exibir mensagem de sucesso', async () => {
      mockService.removeTask.mockResolvedValue({ id: 1 });

      await runCli(['remover', '1'], mockService, io);

      expect(mockService.removeTask).toHaveBeenCalledWith(1);
      expect(logs).toContain('Tarefa #1 removida.');
    });

    it('deve exibir erro amigavel se o ID for ausente', async () => {
      await runCli(['remover'], mockService, io);

      expect(mockService.removeTask).not.toHaveBeenCalled();
      expect(errors[0]).toBe('Erro: Por favor, informe um ID numérico válido.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('Comando: editar', () => {
    it('deve atualizar a tarefa e exibir mensagem de sucesso', async () => {
      mockService.editTask.mockResolvedValue({ id: 1 });

      await runCli(['editar', '1', 'Estudar', 'TypeScript'], mockService, io);

      expect(mockService.editTask).toHaveBeenCalledWith(1, 'Estudar TypeScript');
      expect(logs).toContain('Tarefa #1 atualizada.');
    });

    it('deve exibir erro se o ID for invalido no comando editar', async () => {
      await runCli(['editar', 'invalido'], mockService, io);

      expect(mockService.editTask).not.toHaveBeenCalled();
      expect(errors[0]).toBe('Erro: Por favor, informe um ID numérico válido.');
      expect(process.exitCode).toBe(1);
    });

    it('deve exibir erro se a nova descricao nao for fornecida', async () => {
      await runCli(['editar', '1'], mockService, io);

      expect(mockService.editTask).not.toHaveBeenCalled();
      expect(errors[0]).toBe('Erro: Por favor, informe a nova descrição da tarefa.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('Tratamento de comando desconhecido e erros do servico', () => {
    it('deve avisar sobre comando nao reconhecido', async () => {
      await runCli(['invalido'], mockService, io);

      expect(errors[0]).toContain('Comando "invalido" não reconhecido.');
      expect(process.exitCode).toBe(1);
    });

    it('deve tratar erro lancado pelo servico sem quebrar execucao', async () => {
      mockService.completeTask.mockRejectedValue(new Error('Tarefa #99 não encontrada.'));

      await runCli(['concluir', '99'], mockService, io);

      expect(errors[0]).toBe('Erro: Tarefa #99 não encontrada.');
      expect(process.exitCode).toBe(1);
    });
  });
});
