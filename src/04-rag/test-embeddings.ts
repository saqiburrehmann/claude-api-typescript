import { generateEmbedding } from "./embeddings.js";
import { cosineSimilarity } from "./similarity.js";

async function main(): Promise<void> {
  const base = await generateEmbedding("The company faces intense competition.");
  const similar = await generateEmbedding("The firm has many rivals in the market.");
  const different = await generateEmbedding("I had pasta for lunch.");

  console.log("Embedding length:", base.length);
  console.log("base vs similar  :", cosineSimilarity(base, similar).toFixed(3));
  console.log("base vs different:", cosineSimilarity(base, different).toFixed(3));
}

main().catch(console.error);
