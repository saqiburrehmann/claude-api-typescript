import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL } from "../shared/config.js";

// Claude picks tools from name + description + parameters together.
const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get the current weather for a city.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name, e.g. Lahore" },
      },
      required: ["city"],
    },
  },
];

async function main(): Promise<void> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    thinking: { type: "disabled" },
    tools,
    messages: [{ role: "user", content: "What's the weather like in Lahore?" }],
  });

  // stop_reason "tool_use" means Claude wants us to run the tool.
  console.log("stop_reason:", response.stop_reason);
  console.log(JSON.stringify(response.content, null, 2));
}

main().catch(console.error);
