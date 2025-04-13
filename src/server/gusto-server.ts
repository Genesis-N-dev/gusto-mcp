
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export class GustoMcpServer {
  private static instance: McpServer | null = null;

  private constructor() {}

  public static GetServer(): McpServer {
    if (GustoMcpServer.instance === null) {
      GustoMcpServer.instance = new McpServer({
        name: "Gusto MCP Server",
        version: "1.0.0",
        capabilities: {
          resources: {},
          tools: {},
        },
      });
    }
    return GustoMcpServer.instance;
  }
}