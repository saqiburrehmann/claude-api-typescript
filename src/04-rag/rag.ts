import { anthropic, extractText, MODEL } from "../shared/config.js";
import { chunkByHeading } from "./chunking.js";
import { generateEmbedding, generateEmbeddings } from "./embeddings.js";
import { VectorStore } from "./vector-store.js";

const document = `# Annual Report 2026

## Section 1: Medical Research
This year saw significant strides in our understanding of XDR-47, a "bug" we have not seen before. Clinical trials enrolled 1,200 patients across three hospitals.

## Section 2: Software Engineering
This division dedicated significant effort to studying various infection vectors in our distributed systems. The team fixed 412 bugs and migrated 3 services to the new platform.

## Section 3: Finance
Revenue grew 18 percent year over year, reaching 4.2 million dollars. Operating costs rose 6 percent.`;

async function main(): Promise<void> {
  // 1. Chunk the document
  const chunks = chunkByHeading(document);
  console.log(`Chunks: ${chunks.length}`);

  // 2-3. Embed every chunk and store it
  const embeddings = await generateEmbeddings(chunks, "document");
  const store = new VectorStore();
  chunks.forEach((chunk, i) => store.add(chunk, embeddings[i]));

  // 4. Embed the user's question
  const question = "How many bugs did the engineering team fix this year?";
  const queryEmbedding = await generateEmbedding(question, "query");

  // 5. Find the most similar chunks
  const results = store.search(queryEmbedding, 2);
  console.log("\nSearch results:");
  for (const r of results) {
    console.log(`  score ${r.score.toFixed(3)}  |  ${r.text.split("\n")[0]}`);
  }

  // 6. Build the final prompt and ask Claude
  const context = results.map((r) => r.text).join("\n\n");
  const prompt = `Answer the user's question using only the report below.
If the answer is not in the report, say you don't know.

<user_question>
${question}
</user_question>

<report>
${context}
</report>`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    thinking: { type: "disabled" },
    messages: [{ role: "user", content: prompt }],
  });

  console.log("\nAnswer:", extractText(response.content));
}

main().catch(console.error);
