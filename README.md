# open-websets

This repository provides a Next.js based interface and several LangGraph agents written in TypeScript.

## Project structure

- `frontend/` – web client built with Next.js
- `langgraph/` – reusable LangGraph agents
- `documentations/` – crawled markdown documentation (read‑only)

## Setup

Install dependencies for a package before running commands:

```bash
cd frontend && npm install
```

For the LangGraph agents:

```bash
cd langgraph && npm install
yarn install
```

Install the LangGraph CLI using npx from the LangGraph folder:

```bash
cd langgraph && npx @langchain/langgraph-cli
```

## Running

Start the development server for the frontend with:

```bash
cd frontend
npm run dev
```

Preview the LangGraph agents with:

```bash
cd langgraph
npx @langchain/langgraph-cli@latest dev
```

## Development

Run the frontend linter:

```bash
npm --prefix frontend run lint
```

Format all TypeScript and Markdown files:

```bash
npx prettier --write "frontend/**/*.{ts,tsx,md}" "langgraph/**/*.{ts,md}"
```

