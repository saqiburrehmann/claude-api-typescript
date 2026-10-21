import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { anthropic, MODEL } from "../shared/config.js";

const LeadSchema = z.object({
  name: z.string(),
  email: z.string(),
  budget: z.number(),
  services: z.array(z.string()),
  urgent: z.boolean(),
});

async function main(): Promise<void> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content:
          "Extract the lead: Hi, I'm Sara Khan (sara@shop.pk). I need a Shopify store and SEO, budget around $800. Need it live before Eid!",
      },
    ],
    output_config: { format: zodOutputFormat(LeadSchema) },
  });

  const lead = response.parsed_output;
  if (!lead) {
    console.log("Parsing failed");
    return;
  }

  console.log(lead);
  console.log(
    `Tokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`
  );
}

main().catch(console.error);
