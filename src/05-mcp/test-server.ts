import { connectToDocServer } from "./connect.js";

const client = await connectToDocServer("test-client");

// 1. Ask the server what tools it has
const { tools } = await client.listTools();
console.log("Tools:", tools.map((t) => t.name));

// 2. Read, edit, read again
const r1 = await client.callTool({ name: "read_doc", arguments: { doc_id: "report.pdf" } });
console.log("read_doc:", JSON.stringify(r1.content));

const r2 = await client.callTool({
  name: "edit_doc",
  arguments: { doc_id: "report.pdf", old_str: "20m", new_str: "25m" },
});
console.log("edit_doc:", JSON.stringify(r2.content));

const r3 = await client.callTool({ name: "read_doc", arguments: { doc_id: "report.pdf" } });
console.log("read again:", JSON.stringify(r3.content));

// 3. Missing document: the server answers with isError instead of crashing
const r4 = await client.callTool({ name: "read_doc", arguments: { doc_id: "nope.txt" } });
console.log("missing:", JSON.stringify(r4));

await client.close();
