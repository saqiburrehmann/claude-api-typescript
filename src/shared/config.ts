import "./env.js";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-haiku-5-5";
export const anthropic = new Anthropic();

/**
 * Join all text blocks of a response.
 * Never assume content[0] is text: the model may return a thinking block first.
 */
export function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}
