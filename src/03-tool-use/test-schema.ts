import { anthropic, MODEL } from "../shared/config.js";
import { getCurrentDatetimeSchema } from "./tools.js";

async function main(): Promise<void> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    thinking: { type: "disabled" },
    tools: [getCurrentDatetimeSchema],
    messages: [
      {
        role: "user",
        content: "What time is it right now? Give me only hours and minutes.",
      },
    ],
  });

  console.log("stop_reason:", response.stop_reason);
  console.log(JSON.stringify(response.content, null, 2));
}

main().catch(console.error);
