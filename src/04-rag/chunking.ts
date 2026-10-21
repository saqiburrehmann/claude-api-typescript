/** Structure-based chunking: split on markdown "## " headings. */
export function chunkByHeading(text: string): string[] {
  return text
    .split(/\n(?=## )/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("## "));
}

/** Size-based chunking with overlap so sentences on a boundary are not lost. */
export function chunkBySize(text: string, chunkSize = 300, overlap = 50): string[] {
  if (overlap >= chunkSize) {
    throw new Error("overlap must be smaller than chunkSize");
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
  }
  return chunks;
}
