import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-haiku-5-5";

type TestCase = { goal: string; kind: "easy" | "hard" | "edge" };

// The prompt under test
function buildPrompt(goal: string): string {
  return `Create a one-day meal plan for me.
Goal: ${goal}`;
}

async function runPrompt(goal: string): Promise<string> {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: buildPrompt(goal) }],
    });
  
    // Collect all text blocks (skip thinking blocks)
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
  
    if (!text) {
      console.warn(
        `Empty output for "${goal}" (stop_reason: ${res.stop_reason}, types: ${res.content.map((b) => b.type).join(",")})`
      );
    }
    return text;
  }

async function main() {
  const dataset: TestCase[] = JSON.parse(readFileSync("dataset.json", "utf-8"));

  // Run all test cases in parallel
  const results = await Promise.all(
    dataset.map(async (tc) => ({
      ...tc,
      output: await runPrompt(tc.goal),
    }))
  );

  writeFileSync("results.json", JSON.stringify(results, null, 2));

  for (const r of results) {
    console.log(`\n=== [${r.kind}] ${r.goal}`);
    console.log(r.output.slice(0, 200) + "...");
  }
  console.log(`\nSaved ${results.length} results to results.json`);
}

main().catch(console.error);