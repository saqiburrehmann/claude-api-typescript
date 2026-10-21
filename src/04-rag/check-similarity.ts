import { cosineSimilarity } from "./similarity.js";

// Numbers from the course lesson. Expected: query vs software ~0.983, vs medical ~0.435
// (the lesson text says 0.398 for medical, but the dot product of these vectors is ~0.435).
const medical = [0.944, 0.331];
const software = [0.295, 0.955];
const query = [0.112, 0.993];

console.log("query vs software:", cosineSimilarity(query, software).toFixed(3));
console.log("query vs medical :", cosineSimilarity(query, medical).toFixed(3));
