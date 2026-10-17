import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-haiku-5-5";

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


async function main() {
    const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1000,
        thinking: { type: "disabled" },
        tools,
        messages: [{ role: "user", content: "What's the weather like in Lahore?" }],
  });

  console.log("stop_reason:", response.stop_reason);
  console.log(JSON.stringify(response.content, null, 2));
}

main().catch(console.error);