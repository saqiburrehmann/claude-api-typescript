import readline from "node:readline/promises";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, extractText, MODEL } from "../shared/config.js";
import { connectToDocServer } from "./connect.js";

const messages: Anthropic.MessageParam[] = [];

async function main(): Promise<void> {
  // 1. Connect to the MCP server
  const mcp = await connectToDocServer("doc-chat-client");

  // 2. Ask the server for its tools and convert them to Claude's format
  const { tools: mcpTools } = await mcp.listTools();
  const tools: Anthropic.Tool[] = mcpTools.map((t) => ({
    name: t.name,
    description: t.description ?? "",
    input_schema: t.inputSchema as Anthropic.Tool.InputSchema,
  }));
  console.log("Tools from server:", tools.map((t) => t.name).join(", "));

  // 3. Chat loop
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Ready. Type "exit" to quit.\n');

  while (true) {
    const input = (await rl.question("You: ")).trim();
    if (!input) continue;
    if (input.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: input });

    // Keep calling Claude until it stops asking for tools
    while (true) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1000,
        thinking: { type: "disabled" },
        tools,
        messages,
      });
      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        console.log(`\nClaude: ${extractText(response.content)}\n`);
        break;
      }

      // Claude wants tools: run each one on the MCP server
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        console.log(`  [tool call] ${block.name}(${JSON.stringify(block.input)})`);
        const result = await mcp.callTool({
          name: block.name,
          arguments: block.input as Record<string, unknown>,
        });

        const text = (result.content as { type: string; text?: string }[])
          .map((c) => c.text ?? "")
          .join("");

        results.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: text,
          is_error: Boolean(result.isError),
        });
      }
      messages.push({ role: "user", content: results });
    }
  }

  rl.close();
  await mcp.close();
}

main().catch(console.error);
