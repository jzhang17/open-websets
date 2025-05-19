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
```

## Running

Start the development server for the frontend with:

```bash
cd frontend
npm run dev
```

The LangGraph agents can be built via:

```bash
cd langgraph
npm run build
```
