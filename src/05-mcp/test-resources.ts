import { connectToDocServer } from "./connect.js";

const client = await connectToDocServer("test-client");

function textOf(result: Awaited<ReturnType<typeof client.readResource>>): string {
  const first = result.contents[0];
  return "text" in first ? first.text : "";
}

const { resources } = await client.listResources();
console.log("Resources:", resources.map((r) => r.uri));

const { resourceTemplates } = await client.listResourceTemplates();
console.log("Templates:", resourceTemplates.map((r) => r.uriTemplate));

console.log("ids:", textOf(await client.readResource({ uri: "docs://documents" })));
console.log(
  "plan.md:",
  textOf(await client.readResource({ uri: "docs://documents/plan.md" }))
);

try {
  await client.readResource({ uri: "docs://documents/nope.txt" });
} catch (e) {
  console.log("missing ->", (e as Error).message);
}

await client.close();
