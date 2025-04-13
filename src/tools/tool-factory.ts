import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTools } from "./get/index.js";


export function ToolFactory(server: McpServer) {
  getTools.map((tool) => tool()).forEach((tool) => server.tool(tool.name, tool.description, tool.schema, tool.handler));
}
