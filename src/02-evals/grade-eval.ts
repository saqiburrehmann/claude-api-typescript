import { readFileSync, writeFileSync } from "node:fs";
import { outputPath } from "../shared/paths.js";
import type { Check, EvalResult, GradedResult } from "./types.js";

const NUTS = ["peanut", "almond", "walnut", "cashew", "pistachio"];

/** Code-based grader: cheap, fast and deterministic. */
function gradeOutput(r: EvalResult): { score: number; checks: Check[] } {
  const text = r.output.toLowerCase();
  const goal = r.goal.toLowerCase();

  const checks: Check[] = [
    { name: "not empty", passed: r.output.trim().length > 0 },
    { name: "long enough", passed: r.output.length >= 300 },
    {
      name: "has breakfast, lunch, dinner",
      passed: ["breakfast", "lunch", "dinner"].every((m) => text.includes(m)),
    },
  ];

  if (goal.includes("nut-free")) {
    checks.push({
      name: "respects nut-free",
      passed: !NUTS.some((n) => text.includes(n)),
    });
  }

  const passedCount = checks.filter((c) => c.passed).length;
  return { score: passedCount / checks.length, checks };
}

function main(): void {
  const results: EvalResult[] = JSON.parse(
    readFileSync(outputPath("results.json"), "utf-8")
  );
  const graded: GradedResult[] = results.map((r) => ({ ...r, ...gradeOutput(r) }));
  writeFileSync(outputPath("graded.json"), JSON.stringify(graded, null, 2));

  for (const g of graded) {
    console.log(`\n[${g.kind}] ${g.goal}`);
    console.log("Score:", g.score.toFixed(2));
    for (const c of g.checks) console.log(`  ${c.passed ? "PASS" : "FAIL"}  ${c.name}`);
  }

  const avg = graded.reduce((sum, g) => sum + g.score, 0) / graded.length;
  console.log("\nAverage score:", avg.toFixed(2));
}

main();
