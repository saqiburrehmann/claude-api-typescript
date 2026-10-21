import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL } from "../shared/config.js";

const SYSTEM =
  "You are a patient math tutor. Do not give the final answer directly. Guide the student step by step with hints.";

// Claude has no memory between calls, so we resend the whole history every time.
const messages: Anthropic.MessageParam[] = [];

async function chat(userText: string): Promise<void> {
  messages.push({ role: "user", content: userText });

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1000,
    thinking: { type: "disabled" },
    system: SYSTEM,
    messages,
  });

  let reply = "";
  process.stdout.write("Claude: ");
  stream.on("text", (text: string) => {
    process.stdout.write(text);
    reply += text;
  });

  const response = await stream.finalMessage();
  messages.push({ role: "assistant", content: reply });

  console.log(
    `\nTokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out\n`
  );
}

async function main(): Promise<void> {
  await chat("How do I solve 5x + 2 = 3 for x?");
  await chat("I subtracted 2 from both sides. What now?"); // relies on history
}

main().catch(console.error);
