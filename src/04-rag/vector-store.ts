import { cosineSimilarity } from "./similarity.js";

interface StoredChunk {
  text: string;
  embedding: number[];
}

export interface SearchResult {
  text: string;
  score: number;
}

/** A tiny in-memory vector database. Swap for pgvector/Pinecone in production. */
export class VectorStore {
  private items: StoredChunk[] = [];

  add(text: string, embedding: number[]): void {
    this.items.push({ text, embedding });
  }

  search(queryEmbedding: number[], topK: number = 2): SearchResult[] {
    return this.items
      .map((item) => ({
        text: item.text,
        score: cosineSimilarity(queryEmbedding, item.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
