import { anthropic, MODEL } from "../shared/config.js";

// Server-side tool: Anthropic runs the search, not us.
// Must be enabled for your organization in the Claude console.
const webSearch = {
  type: "web_search_20250305",
  name: "web_search",
  max_uses: 2, // each search is billed, keep it low
} as const;

async function main(): Promise<void> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    thinking: { type: "disabled" },
    tools: [webSearch],
    messages: [{ role: "user", content: "What is the latest stable version of Node.js?" }],
  });

  console.log("stop_reason:", response.stop_reason);

  for (const block of response.content) {
    if (block.type === "server_tool_use") {
      console.log("\n[SEARCH QUERY]", JSON.stringify(block.input));
    } else if (block.type === "web_search_tool_result") {
      console.log("\n[SEARCH RESULTS]");
      if (Array.isArray(block.content)) {
        for (const r of block.content) console.log(`- ${r.title}\n  ${r.url}`);
      } else {
        console.log("Error:", JSON.stringify(block.content));
      }
    } else if (block.type === "text") {
      console.log("\n[ANSWER]", block.text);
      for (const c of block.citations ?? []) {
        if ("url" in c) console.log(`   cite: ${c.url}`);
      }
    }
  }

  console.log("\nUsage:", JSON.stringify(response.usage));
}

main().catch(console.error);
