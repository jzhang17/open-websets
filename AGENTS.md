## Project File Structure

```
.
├── AGENTS.md
├── .git/
├── .gitignore
├── README.md
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
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── prompts.ts
│   │   ├── tools.ts
│   │   ├── tsconfig.json
│   │   └── utils.ts
│   │   └── yarn.lock
│   ├── entity_qualification_agent_js/
│   │   ├── .gitignore
│   │   ├── .langgraph_api/
│   │   ├── configuration.ts
│   │   ├── graph.ts
│   │   ├── jest.config.js
│   │   ├── langgraph.json
│   │   ├── node_modules/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── prompts.ts
│   │   ├── tools.ts
│   │   ├── tsconfig.json
│   │   └── utils.ts
│   │   └── yarn.lock
│   └── list_generation_agent_js/
│       ├── .gitignore
│       ├── .langgraph_api/
│       ├── configuration.ts
│       ├── graph.ts
│       ├── jest.config.js
│       ├── langgraph.json
│       ├── node_modules/
│       ├── package-lock.json
│       ├── package.json
│       ├── prompts.ts
│       ├── tools.ts
│       ├── tsconfig.json
│       └── utils.ts
│       └── yarn.lock
├── react_agent_js/
│   ├── .gitignore
│   ├── .langgraph_api/
│   ├── configuration.ts
│   ├── graph.ts
│   ├── jest.config.js
│   ├── langgraph.json
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── prompts.ts
│   ├── tools.ts
│   ├── tsconfig.json
│   └── utils.ts
│   └── yarn.lock
└── resources/
    └── mega_newbizbot/
        ├── .langgraph_api/
        ├── agent.py
        ├── __init__.py
        ├── langgraph.json
        ├── pyproject.toml
        ├── state.py
        ├── entity_extraction_agent/
        │   ├── .langgraph_api/
        │   ├── __init__.py
        │   ├── __pycache__/
        │   ├── configuration.py
        │   ├── graph.py
        │   ├── langgraph.json
        │   ├── prompts.py
        │   ├── pyproject.toml
        │   ├── state.py
        │   ├── tools.py
        │   └── utils.py
        ├── lead_qualification_agent/
        │   ├── .langgraph_api/
        │   ├── __init__.py
        │   ├── __pycache__/
        │   ├── configuration.py
        │   ├── graph.py
        │   ├── langgraph.json
        │   ├── prompts.py
        │   ├── pyproject.toml
        │   ├── state.py
        │   ├── tools.py
        │   └── utils.py
        └── list_generation_agent/
            ├── __init__.py
            ├── __pycache__/
            ├── configuration.py
            ├── graph.py
            ├── langgraph.json
            ├── mega_newbizbot_list_generation_agent.egg-info/
            ├── prompts.py
            ├── pyproject.toml
            ├── state.py
            ├── tools.py
            └── utils.py
```

## Agent Instructions

**Important:** Always update the "Project File Structure" section in this file (`AGENTS.md`) after making any changes to the project's directory or file structure.

Before making any changes to the code, please ensure you have thoroughly reviewed the relevant documentation. The documentation for the libraries used in this project is located in the `documentations/` directory. These are Markdown files that have been crawled from the respective library websites.

**Note on the `resources` folder:** The `resources/` folder contains code from other unrelated projects. This code is provided for context and to help understand the project's goals. It is not part of the active project codebase and should be used for reference purposes only.
