import { getCurrentDatetime } from "./tools.js";

console.log(getCurrentDatetime()); // e.g. 2026-10-22 14:30:25
console.log(getCurrentDatetime("%H:%M")); // e.g. 14:30

try {
  getCurrentDatetime("");
} catch (e) {
  console.log("Error:", (e as Error).message);
}
