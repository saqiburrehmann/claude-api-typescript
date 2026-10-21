import "../shared/env.js";

const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

export type InputType = "query" | "document";

/** Embed many texts in one API call (VoyageAI; Anthropic has no embeddings API). */
export async function generateEmbeddings(
  texts: string[],
  inputType: InputType = "document",
  model: string = "voyage-3-large"
): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error("VOYAGE_API_KEY is missing in .env");
  }

  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: texts, model, input_type: inputType }),
  });

  if (!res.ok) {
    throw new Error(`Voyage API error ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as {
    data: { embedding: number[]; index: number }[];
  };

  // Keep the same order as the input texts
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

export async function generateEmbedding(
  text: string,
  inputType: InputType = "query",
  model: string = "voyage-3-large"
): Promise<number[]> {
  const [embedding] = await generateEmbeddings([text], inputType, model);
  return embedding;
}
