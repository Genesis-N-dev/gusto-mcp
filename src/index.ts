import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { GustoMcpServer } from './server/gusto-server.js';
import { ToolFactory } from './tools/tool-factory.js';
import { GustoAuthService } from './services/gusto-auth-service/index.js';
import { logger } from './helpers/logger.js';

const main = async () => {
  const server = GustoMcpServer.GetServer();
  const gustoAuth = GustoAuthService.getInstance();
  logger.info('Authenticating with Gusto...');
  await gustoAuth.authenticate();
  logger.info('Authenticated successfully with Gusto.');

  ToolFactory(server);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('Gusto MCP Server started and connected to transport.');
};

main().catch((error) => {
  console.error('Error starting Gusto MCP Server:', error);
  logger.error('Error starting Gusto MCP Server:', error);
  process.exit(1);
});
