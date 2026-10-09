/**
 * @file Ponto de entrada executável da aplicação CLI Task Manager.
 * Orquestra a execução da interface CLI com os argumentos fornecidos pelo usuário via process.argv.
 */
import { runCli } from './cli/cli.js';

runCli(process.argv.slice(2));
