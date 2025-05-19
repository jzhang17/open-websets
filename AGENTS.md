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
│   ├── list_gen_agent_js/
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

## Routine Maintenance Checklist

Perform the following quick checks on a regular basis to keep the project clean and healthy:

- **Pull the latest changes**: `git pull --rebase` before starting new work.
- **Run linters and tests** to catch small bugs early.
- **Search for `TODO` or commented‑out code** and address or remove it.
- **Ensure code formatting** by running the project's formatter (e.g., `prettier`, `eslint`, or `black`).
- **Review and clean up commit history** before opening a pull request.
- **Scan for unnecessary dependencies** or unused imports.
- **Check documentation** for any updates needed to keep README or other docs in sync with code changes.

These tasks help prevent paper cuts and small issues from piling up over time. Run them regularly or whenever you see "Run your routine tasks" referenced in a task description.
