## Project File Structure

```
.
├── AGENTS.md
├── .git/
├── .gitignore
├── README.md
├── frontend/
│   ├── README.md
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── components.json
│   ├── eslint.config.mjs
│   ├── lib/
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public/
│   └── tsconfig.json
├── documentations/
│   ├── aggrid_docs/ (...)
│   ├── exa_docs/ (...)
│   └── langchain_langgraph_docs/
│       ├── langchain_js/ (...)
│       └── langgraph_js/ (...)
├── langgraph/
│   ├── entity_extraction_agent_js/
│   │   ├── .gitignore
│   │   ├── .langgraph_api/
│   │   ├── configuration.ts
│   │   ├── graph.ts
│   │   ├── jest.config.js
│   │   ├── langgraph.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── system_prompt.md
│   │   ├── tools.ts
│   │   ├── tsconfig.json
│   │   ├── utils.ts
│   │   └── yarn.lock
│   ├── entity_qualification_agent_js/
│   │   ├── .gitignore
│   │   ├── .langgraph_api/
│   │   ├── configuration.ts
│   │   ├── graph.ts
│   │   ├── jest.config.js
│   │   ├── langgraph.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── system_prompt.md
│   │   ├── verification_prompt_template.md
│   │   ├── tools.ts
│   │   ├── tsconfig.json
│   │   ├── utils.ts
│   │   └── yarn.lock
│   └── exa_query_agent/
│       ├── configuration.ts
│       ├── graph.ts
│       ├── jest.config.js
│       ├── langgraph.json
│       ├── package-lock.json
│       ├── package.json
│       ├── system_prompt.md
│       ├── tools.ts
│       ├── tsconfig.json
│       ├── utils.ts
│       └── yarn.lock
```

## Agent Instructions

**Important:** Always update the "Project File Structure" section in this file (`AGENTS.md`) after making any changes to the project's directory or file structure.

Before making any changes to the code, please ensure you have thoroughly reviewed the relevant documentation. The documentation for the libraries used in this project is located in the `documentations/` directory. These are Markdown files that have been crawled from the respective library websites.
