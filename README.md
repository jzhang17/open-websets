# Open Websets

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/jzhang17/open-websets)


## Inspired by Exa's [Websets](https://websets.exa.ai/)

This project is inspired by the capability of [Exa's Websets](https://websets.exa.ai/), which enables scalable structured data extraction from unstructured web sources. Websets processes queries like "full-stack engineers in SF with design experience at AI startups" and returns tabular data with LinkedIn profiles, GitHub repositories, graduation dates, and seniority classifications—each result verified by autonomous agents against the specified criteria.

The system handles complex multi-dimensional searches across thousands of entities, such as extracting YC company data with batch information, funding status, and industry classifications, while maintaining data accuracy through systematic verification workflows. Their architecture employs agent-based validation pipelines and automated enrichment processes that consistently deliver structured outputs from ambiguous natural language inputs.

This project recreates those proven architectural patterns using LangGraph's agent orchestration framework, implementing similar verification-driven workflows through distributed processing and real-time interface generation.

---

This repository provides a Next.js based interface and several LangGraph agents written in TypeScript.

## Project structure

- `frontend/` – web client built with Next.js
- `langgraph/` – reusable LangGraph agents
- `documentations/` – crawled markdown documentation (read‑only)

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend Framework | Next.js 15.3.2 | Server-side rendering and React 19 integration |
| Agent Orchestration | LangGraph | Graph-based workflow management |
| Chat Models | Google Gemini | Language model integration |
| External APIs | Exa AI, Search1API | Web search and content crawling |
| UI Components | Radix UI, Tailwind CSS | Component library and styling |
| Type Safety | TypeScript | Static typing across frontend and backend |
| State Management | React Context, LangGraph State | Client and agent state coordination |

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

## Design Thinking

Open Websets implements two architectural patterns enabled by LangGraph's capabilities: **concurrency fan-out mechanisms** and **generative UI components**. These patterns leverage LangGraph's built-in support for parallel processing and streaming to handle large datasets while providing real-time user interfaces.

### Concurrency Fan-Out Architecture

Our system utilizes LangGraph's `Send` API and subgraph functionality to distribute entity qualification tasks across multiple concurrent agents. This implementation follows LangGraph's recommended patterns for parallel processing.

```mermaid
graph LR
    B[Qualification Router<br/>Batch Size: 15 entities<br/>Max: 4 Workers]
    
    B --> C[Worker A<br/>Entities 1-15<br/>60s]
    B --> D[Worker B<br/>Entities 16-30<br/>30s] 
    B --> E[Worker C<br/>Entities 31-45<br/>20s]
    B --> F[Worker D<br/>Entities 46-60<br/>45s]
    
    C --> B
    D --> B
    E --> B  
    F --> B
    
    %% Show dynamic reassignment as workers complete
    E -.-> H[Gets Entities 61-75]
    D -.-> I[Gets Entities 76-90] 
    F -.-> J[Gets Entities 91-105]
    C -.-> K[Gets Entities 106-120]
    
    H --> B
    I --> B
    J --> B
    K --> B
```

**Implementation Details**: The qualification router leverages LangGraph's `Send` primitive to spawn multiple `entityQualification` subgraphs concurrently. Each subgraph processes a batch of 15 entities independently. The router maintains state tracking (`dispatchedBatches`, `finishedBatches`) to manage a pool of up to 4 concurrent workers.

**Technical Benefits**:
- **Parallel Execution**: LangGraph's async task handling enables true concurrent processing
- **State Management**: Shared state updates coordinate worker completion and results aggregation  
- **Automatic Scheduling**: Router logic dispatches new batches as workers become available
- **Batched Processing**: Reduces overhead while maintaining manageable concurrency limits

### Generative UI Components

This system implements LangGraph's streaming UI capabilities to generate interface components dynamically. The backend pushes structured UI events that the frontend renders in real-time using LangGraph's React SDK.

```mermaid
sequenceDiagram
    participant LG as LangGraph Agent
    participant ST as Streaming Layer
    participant FE as Frontend
    participant UI as UI Component
    
    LG->>ST: Push UI Event (agGridTable)
    Note over LG,ST: { id: "table", props: { entities, results } }
    
    ST->>FE: Stream Custom Event
    FE->>FE: Merge Props with Existing UI State
    
    FE->>UI: Render/Update Component
    Note over UI: AG Grid Table Updates in Real-time
    
    LG->>ST: Push Updated UI Event
    Note over LG,ST: New qualification results added
    
    ST->>FE: Stream Update
    FE->>UI: Update Existing Component
    Note over UI: Table rows populate progressively
```

**Technical Implementation**:
1. **Backend Events**: Agents use LangGraph's `typedUi` helper to emit structured UI messages with stable IDs
2. **Streaming Protocol**: Events flow through LangGraph's streaming infrastructure to the frontend
3. **React Integration**: Frontend uses LangGraph's `useStream` hook and `LoadExternalComponent` utility
4. **State Merging**: UI messages with matching IDs merge props automatically, enabling live updates

**LangGraph Integration**: These patterns directly utilize LangGraph's core features - the parallel processing capabilities handle concurrency while the streaming UI system manages real-time interface updates. The framework's design makes it straightforward to implement both patterns without custom infrastructure.

**Results**: Users see qualification progress in real-time through automatically updating tables, with no manual intervention required. The system processes large entity lists efficiently by parallelizing work across multiple agents while maintaining responsive UI feedback throughout the process.

