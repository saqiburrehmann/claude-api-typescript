import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".."
);

/** Path inside the git-ignored output/ folder (created on demand). */
export function outputPath(name: string): string {
  const dir = path.join(PROJECT_ROOT, "output");
  mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}
