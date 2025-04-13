# 🧠 Gusto MCP Server

A Model Context Protocol (MCP) server that integrates with Gusto's payroll API to expose structured tools for use by LLM agents. This server enables authenticated access to company-level resources, including payroll, employee, and pay schedule data.  

⚠️ **Note:** This is a proof of concept (POC) and currently supports the Gusto **sandbox environment**. To use it in production, update `GustoApiService` to point to the production endpoint.

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm
- A Gusto developer account with access to a demo company

---

## 📚 Docs & Resources

- 📘 [Gusto API Documentation](https://docs.gusto.com/embedded-payroll/docs/introduction)  
- 📘 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)

---

## ⚙️ Setup

### 🔐 1. Create a Gusto Developer Account

- Sign up at the [Gusto Developer Portal](https://docs.gusto.com/embedded-payroll/docs/getting-started)
- Choose the **Embedded Payroll** integration type
- Create a **demo company** to generate access and refresh tokens

---

### 🔐 2. Authentication Notes

- This implementation uses **company-level tokens** (OAuth2)
- Tokens are **automatically refreshed** while the server is running
- ⚠️ **Current Limitation:** If the server restarts, you'll need to re-inject the most recent tokens manually

---

### 💻 3. Run Locally / Integrate with Claude Desktop

#### Install dependencies:

```bash
npm install
```

#### Build the project:

```bash
npm run build
```

#### Update Claude desktop config:

Open `Settings > Developer > Edit config` and update your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gusto": {
      "command": "node",
      "args": [
        "/path-to-your-project-folder/gusto-mcp/build/index.js"
      ],
      "env": {
        "GUSTO_BASE_URL": "https://api.gusto-demo.com",
        "GUSTO_CLIENT_ID": "your-client-id",
        "GUSTO_CLIENT_SECRET": "your-client-secret",
        "GUSTO_ACCESS_TOKEN": "initial-access-token",
        "GUSTO_REFRESH_TOKEN": "company-refresh-token"
      }
    }
  }
}
```

---

## 🚀 Available MCP Tools (Overview)

This server exposes tools that allow LLMs to:

- View payroll status, check dates, and blockers
- Retrieve employee data including jobs and compensations
- Access pay schedule details


