
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const model = "claude-haiku-5-5";

const messages: Anthropic.MessageParam[] = [];

async function chat(userText: string) {
  messages.push({ role: "user", content: userText });

  const stream = client.messages.stream({
    model,
    max_tokens: 1000,
    system:
      "You are a patient math tutor. Do not give the final answer directly. Guide the student step by step with hints.",
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

  console.log("\nTokens:", response.usage.input_tokens, "in,", response.usage.output_tokens, "out\n");
}

async function main() {
  await chat("How do I solve 5x + 2 = 3 for x?");
}

main().catch(console.error);
