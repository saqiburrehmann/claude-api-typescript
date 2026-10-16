import "dotenv/config";
import { writeFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const client = new Anthropic();

const DatasetSchema = z.object({
  cases: z.array(
    z.object({
      goal: z.string(),
      kind: z.enum(["easy", "hard", "edge"]),
    })
  ),
});

async function main() {
  const response = await client.messages.parse({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Generate 6 test inputs for a prompt that creates a one-day meal plan from a person's goal.
Each input is a short goal written by a user.
Include 2 "easy" (common goals), 2 "hard" (goals with constraints like allergies, budget, or religion), and 2 "edge" (vague, contradictory, or unusual goals).`,
      },
    ],
    output_config: { format: zodOutputFormat(DatasetSchema) },
  });

  const data = response.parsed_output;
  if (!data) {
    console.log("Parsing failed");
    return;
  }

  writeFileSync("dataset.json", JSON.stringify(data.cases, null, 2));
  console.log(data.cases);
  console.log("Saved", data.cases.length, "cases to dataset.json");
  console.log("Tokens:", response.usage.input_tokens, "in,", response.usage.output_tokens, "out");
}

main().catch(console.error);