import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Our "database": documents kept in memory
const docs: Record<string, string> = {
  "report.pdf": "The report details the state of a 20m condenser tower.",
  "plan.md": "The plan outlines the steps for the project's implementation.",
};

const server = new McpServer({ name: "doc-server", version: "1.0.0" });

// ---------- TOOLS (Claude decides when to call them) ----------

server.registerTool(
  "read_doc",
  {
    description: "Read the contents of a document and return it as a string.",
    inputSchema: { doc_id: z.string().describe("Id of the document to read") },
  },
  async ({ doc_id }) => {
    const content = docs[doc_id];
    if (content === undefined) {
      return {
        isError: true,
        content: [{ type: "text", text: `Document ${doc_id} not found` }],
      };
    }
    return { content: [{ type: "text", text: content }] };
  }
);

server.registerTool(
  "edit_doc",
  {
    description: "Edit a document by replacing a string in its contents with a new string.",
    inputSchema: {
      doc_id: z.string().describe("Id of the document to edit"),
      old_str: z.string().describe("Exact text to replace"),
      new_str: z.string().describe("New text to insert"),
    },
  },
  async ({ doc_id, old_str, new_str }) => {
    const content = docs[doc_id];
    if (content === undefined) {
      return {
        isError: true,
        content: [{ type: "text", text: `Document ${doc_id} not found` }],
      };
    }
    if (!content.includes(old_str)) {
      return {
        isError: true,
        content: [{ type: "text", text: `Text not found in ${doc_id}` }],
      };
    }
    docs[doc_id] = content.replace(old_str, new_str);
    return { content: [{ type: "text", text: `Updated ${doc_id}` }] };
  }
);

// ---------- RESOURCES (the app decides when to read them) ----------

// Direct resource: list of all document ids
server.registerResource(
  "doc-ids",
  "docs://documents",
  {
    title: "Document ids",
    description: "List of all document ids",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(Object.keys(docs)),
      },
    ],
  })
);

// Template resource: contents of one document
server.registerResource(
  "doc-content",
  new ResourceTemplate("docs://documents/{doc_id}", { list: undefined }),
  {
    title: "Document content",
    description: "Contents of one document",
    mimeType: "text/plain",
  },
  async (uri, { doc_id }) => {
    const content = docs[String(doc_id)];
    if (content === undefined) {
      throw new Error(`Document ${doc_id} not found`);
    }
    return {
      contents: [{ uri: uri.href, mimeType: "text/plain", text: content }],
    };
  }
);

// The client talks to us over stdin/stdout
await server.connect(new StdioServerTransport());
