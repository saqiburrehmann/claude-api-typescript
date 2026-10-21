# Claude API in TypeScript

Hands-on exercises from Anthropic Academy's **Building with the Claude API** course, rebuilt in TypeScript.
Each folder under `src/` is a small, runnable module that demonstrates one idea, from a first API call to an MCP server and client.

> These are learning projects, not production services. Model calls use `claude-haiku-5-5` to keep costs low.

## What is inside

| Module | What it shows | Key files |
|---|---|---|
| `01-basics` | Multi-turn chat with a system prompt, streaming, structured output with Zod | `chat.ts`, `structured-output.ts` |
| `02-evals` | A small prompt-evaluation pipeline: generate a test dataset, run the prompt on it, grade the outputs | `gen-dataset.ts`, `run-eval.ts`, `grade-eval.ts` |
| `03-tool-use` | Tool functions with input validation, tool schemas, reading `tool_use` blocks, the web search tool | `tools.ts`, `tool-intro.ts`, `web-search.ts` |
| `04-rag` | A full RAG flow: chunking, embeddings (VoyageAI), cosine similarity, an in-memory vector store, grounded answers | `rag.ts`, `chunking.ts`, `vector-store.ts` |
| `05-mcp` | An MCP server (2 tools, 2 resources) and a client that wires its tools into a Claude chat loop | `server.ts`, `mcp-chat.ts` |
| `shared` | Config, `.env` loading from the project root, text extraction helper | `config.ts`, `env.ts` |

## Project layout

```
src/
  shared/        config, env loading, output paths
  01-basics/
  02-evals/      prompt under test, dataset, runner, graders
  03-tool-use/
  04-rag/
  05-mcp/        server.ts is spawned by the client over stdio
output/          generated eval files (git-ignored)
```

## Setup

Requires Node 20+.

```bash
npm install
cp .env.example .env     # then add your keys
```

`.env` needs `ANTHROPIC_API_KEY`, and `VOYAGE_API_KEY` for the RAG module. It is git-ignored; never commit it.

## Run

```bash
npm run typecheck

# no API key needed
npm run tools:test
npm run rag:chunking
npm run rag:check
npm run mcp:test
npm run mcp:test-resources

# need ANTHROPIC_API_KEY
npm run basics:chat
npm run basics:structured
npm run evals:generate && npm run evals:run && npm run evals:grade
npm run tools:intro
npm run mcp:chat

# need VOYAGE_API_KEY as well
npm run rag:run
```

## Things I learned the hard way

- **Never assume `response.content[0]` is text.** With thinking enabled, the first block can be a `thinking` block. In one eval run, thinking used the whole `max_tokens` budget, so 1 of 6 outputs came back empty while the other 5 looked fine. A test set caught what manual testing would have missed. See `extractText` in `shared/config.ts`.
- **Tool selection uses the name, the description and the parameters together.** A bad description alone did not stop Claude from calling a tool whose name and parameters clearly matched the question.
- **Semantic search finds meaning, not exact strings.** For IDs and exact terms, a lexical search (BM25) should be combined with embeddings. This repo implements the semantic half only.
- **RAG can retrieve the right chunk and still not contain the answer.** The prompt tells the model to say so when the context lacks the answer.
- **Resources and tools are different MCP primitives.** Tools are called by the model; resources are read by the application (for example, to resolve an `@document` mention).
- **Run scripts from any folder.** `.env` is loaded from the project root, not from the current directory.

## Costs

Everything is sized to be cheap: a handful of Haiku calls per script, short outputs, and `max_uses: 2` on web search (searches are billed separately from tokens).

## Course

Completed Anthropic Academy, *Building with the Claude API* (October 2026).
