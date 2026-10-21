import { chunkByHeading, chunkBySize } from "./chunking.js";

const doc = `# Annual Report

## Overview
The company sells cloud software to small businesses across 40 countries.

## Risk Factors
Competition is intense. Currency swings can hurt revenue. A single data breach could damage trust.

## Financials
Revenue grew 18 percent year over year, reaching 4.2 million dollars.`;

console.log("=== By size ===");
chunkBySize(doc, 120, 30).forEach((c, i) => console.log(`[${i}]`, JSON.stringify(c)));

console.log("\n=== By heading ===");
chunkByHeading(doc).forEach((c, i) => console.log(`[${i}]`, JSON.stringify(c)));
