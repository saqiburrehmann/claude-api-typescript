import { readFileSync, writeFileSync } from "node:fs";
import { anthropic, extractText, MODEL } from "../shared/config.js";
import { outputPath } from "../shared/paths.js";
import { buildPrompt } from "./prompt.js";
import type { EvalResult, TestCase } from "./types.js";

async function runPrompt(goal: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    thinking: { type: "disabled" }, // thinking tokens once ate the whole budget
    messages: [{ role: "user", content: buildPrompt(goal) }],
  });

  const text = extractText(res.content);
  if (!text) {
    console.warn(`Empty output for "${goal}" (stop_reason: ${res.stop_reason})`);
  }
  return text;
}

async function main(): Promise<void> {
  const dataset: TestCase[] = JSON.parse(
    readFileSync(outputPath("dataset.json"), "utf-8")
  );

  // Run all test cases in parallel
  const results: EvalResult[] = await Promise.all(
    dataset.map(async (tc) => ({ ...tc, output: await runPrompt(tc.goal) }))
  );

  writeFileSync(outputPath("results.json"), JSON.stringify(results, null, 2));

  for (const r of results) {
    console.log(`\n=== [${r.kind}] ${r.goal}`);
    console.log(r.output.slice(0, 200) + "...");
  }
  console.log(`\nSaved ${results.length} results`);
}

main().catch(console.error);
