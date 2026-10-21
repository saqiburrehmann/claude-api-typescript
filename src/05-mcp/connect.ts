import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SERVER_PATH = fileURLToPath(new URL("./server.ts", import.meta.url));

/** Start the document server as a child process and connect an MCP client to it. */
export async function connectToDocServer(clientName: string): Promise<Client> {
  const client = new Client({ name: clientName, version: "1.0.0" });
  await client.connect(
    new StdioClientTransport({ command: "npx", args: ["tsx", SERVER_PATH] })
  );
  return client;
}
