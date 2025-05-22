/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Exa } from "exa-js";

// Define an interface for the search result object from Exa
interface ExaSearchResult {
  id: string;
  url?: string;
  title?: string | null;
  text?: string;
  // Add other fields if necessary based on what you expect to use
}

interface ExaContentsResponse {
  results: ExaSearchResult[];
}

const webCrawlSchema = z.object({
  links: z.array(z.string()).describe("A list of strings (URLs) to scrape."),
});
/**
 * Scrapes web pages using Exa AI.
 */
const webCrawl = new DynamicStructuredTool({
  name: "web_crawl",
  description:
    'Scrape the provided web pages for detailed information using Exa AI. Use with less than 20 links (most optimally less than 10). Input format: {"links": ["site1.com", "site2.com", ...]}',
  schema: webCrawlSchema, // Schema for validation by the framework
  func: async (args: z.infer<typeof webCrawlSchema>) => {
    const { links } = args;

    const EXA_API_KEY = process.env.EXA_API_KEY;
    if (!EXA_API_KEY) {
      return "Error: EXA_API_KEY not found in environment variables.";
    }
    if (!links || links.length === 0) {
      return "Error: No URLs provided.";
    }

    const exa = new Exa(EXA_API_KEY);
    let combinedContent: string[] = [];

    try {
      const contentsResponse: ExaContentsResponse = (await exa.getContents(
        links,
      )) as ExaContentsResponse;

      if (contentsResponse.results && contentsResponse.results.length > 0) {
        combinedContent = contentsResponse.results.map(
          (result: ExaSearchResult) => {
            let content =
              result.text ||
              `No content retrieved for ${result.url || result.id}`;
            content = content.replace(/\$/g, "\\$"); // Escape dollar signs
            return content;
          },
        );
      } else {
        return "Error: No content retrieved from Exa or empty results.";
      }
    } catch (error: any) {
      // Handle potential errors from the Exa API call
      return `Error scraping with Exa: ${error.message}`;
    }

    // Return the array of content strings directly
    return combinedContent;
  },
});

const batchWebSearchSchema = z.object({
  queries: z.array(z.string()).describe("A list of search queries."),
});
/**
 * Performs batch web searches using Search1API.
 */
const batchWebSearch = new DynamicStructuredTool({
  name: "batch_web_search",
  description:
    'Traditional keyword-based search (Google via Search1API) that processes multiple queries simultaneously. Use with less than 50 queries (most optimally less than 30). Input format: {"queries": ["query1", "query2", "query3"]}',
  schema: batchWebSearchSchema,
  func: async (args: z.infer<typeof batchWebSearchSchema>) => {
    const { queries } = args;

    const SEARCH1API_KEY = process.env.SEARCH1API_KEY;
    if (!SEARCH1API_KEY) {
      return JSON.stringify({
        error: "SEARCH1API_KEY not found in environment variables.",
      });
    }
    if (!queries || queries.length === 0) {
      return JSON.stringify({ error: "No queries provided." });
    }

    const headers = {
      Authorization: `Bearer ${SEARCH1API_KEY}`,
      "Content-Type": "application/json",
    };

    const batchRequest = queries.map((query: string) => ({
      query: query,
      search_service: "google",
      max_results: 10,
      gl: "us",
      hl: "en",
    }));

    try {
      const response = await fetch("https://api.search1api.com/search", {
        method: "POST",
        headers,
        body: JSON.stringify(batchRequest),
        signal: AbortSignal.timeout(15000), // 15 second timeout for the batch
      });

      if (!response.ok) {
        console.error(`Search API error: Status ${response.status}`);
        return JSON.stringify({
          error: `Search API error: Status ${response.status}`,
        });
      }
      const result = await response.json();
      return JSON.stringify(result);
    } catch (error: any) {
      console.error(`Search API error: ${error.message}`);
      if (error.name === "TimeoutError") {
        return JSON.stringify({
          error: "Search API request timed out after 15 seconds.",
        });
      }
      return JSON.stringify({ error: `Search API error: ${error.message}` });
    }
  },
});

// Define the schema for an individual entity
const entitySchema = z.object({
  name: z.string().describe("The name of the extracted entity."),
  url: z.string().describe("The URL associated with the entity."),
});

const extractEntitiesSchema = z.object({
  entities: z
    .array(entitySchema)
    .describe("A list of entities, where each entity has a name and a URL."),
});

/**
 * Extracts and reports entities identified by the agent.
 * Each entity should have a name and a URL.
 * The graph will handle updating the overall state with these entities.
 */
const extractEntities = new DynamicStructuredTool({
  name: "extract_entities",
  description:
    "Use this tool to report entities you have identified. Provide entities as a list, where each entity is an object with 'name' and 'url' fields. The graph will update the main state.",
  schema: extractEntitiesSchema,
  func: async (args: z.infer<typeof extractEntitiesSchema>) => {
    // The tool's job is to return the data that should update the 'entities' channel in the state.
    // LangGraph's ToolNode will take this output and merge it into the graph state.
    // Because our AppStateAnnotation defines an 'entities' channel with a reducer,
    // returning { entities: args.entities } will correctly update that part of the state.

    // Optionally, add any cleaning or validation for names and URLs here
    const cleanedEntities = args.entities.map((entity) => ({
      name: entity.name.trim(),
      url: entity.url.trim(),
    }));
    return { entities: cleanedEntities };
  },
});

/**
 * Adds sequential indexes to a list of entities based on the current number of
 * entities already stored.
 *
 * @param newEntities - Array of entities without indexes.
 * @param currentCount - Number of entities currently stored.
 * @returns Array of entities with `index`, `name`, and `url`.
 */
export function addEntityIndexes(
  newEntities: { name: string; url: string }[],
  currentCount: number,
) {
  return newEntities.map((e, i) => ({
    index: currentCount + i,
    name: e.name.trim(),
    url: e.url.trim(),
  }));
}

const exaSearchSchema = z.object({
  queries: z.array(z.string()).describe("A list of search queries."),
  type: z
    .enum(["neural", "keyword"])
    .optional()
    .describe(
      "The type of search to perform for all queries. 'neural' for semantic search, 'keyword' for traditional keyword search.",
    ),
  category: z
    .enum([
      "company",
      "research paper",
      "news",
      "pdf",
      "github",
      "tweet",
      "personal site",
      "linkedin profile",
      "financial report",
    ])
    .optional()
    .describe(
      "The category of content to search for across all queries. Limits results to a certain type of document.",
    ),
});

/**
 * Performs up to five web searches in a **single** call using Exa AI. Supports
 * both 'neural' and 'keyword' modes as well as optional category filtering.
 * 'Neural' mode leverages vector embeddings for semantic, context-aware
 * searches ideal for conceptual queries and list generation (not optimal for
 * precise fact retrieval). 'Keyword' mode uses traditional keyword matching for
 * accurate fact finding. Use 'category' to narrow the search to curated indices
 * like company, research paper, news, pdf, github, tweet, personal site,
 * linkedin profile, or financial report. Returns up to 25 results per query,
 * including entities to qualify and full result details.
 */

const exaSearch = new DynamicStructuredTool({
  name: "exa_search",
  description:
    "Search the web with Exa. Provide **up to five queries** at once in a single call. Supports 'neural' or 'keyword' mode and an optional `category` to limit results to curated indices like company, research paper, news, pdf, github, tweet, personal site, linkedin profile, or financial report. Returns up to 25 results per query. Input format: {\"queries\": [\"query1\", \"query2\", ...]}",
  schema: exaSearchSchema,
  func: async (args: z.infer<typeof exaSearchSchema>) => {
    const { queries, type, category } = args;

    const EXA_API_KEY = process.env.EXA_API_KEY;
    if (!EXA_API_KEY) {
      return "Error: EXA_API_KEY not found in environment variables.";
    }
    if (!queries || queries.length === 0) {
      return "Error: No queries provided.";
    }
    if (queries.length > 5) {
      return "Error: Too many queries. Please provide 5 or fewer queries.";
    }

    const exa = new Exa(EXA_API_KEY);

    try {
      // Type assertion for the options object
      const options: {
        numResults: number;
        type?: "neural" | "keyword";
        category?:
          | "company"
          | "research paper"
          | "news"
          | "pdf"
          | "github"
          | "tweet"
          | "personal site"
          | "linkedin profile"
          | "financial report";
      } = { numResults: 25 };

      if (type) {
        options.type = type;
      }
      if (category) {
        options.category = category;
      }

      const allResults = [] as ExaSearchResult[];
      for (const query of queries) {
        const response = await exa.search(query, options);
        allResults.push(...response.results);
      }


      return JSON.stringify(allResults);
    } catch (error: any) {
      // Handle potential errors from the Exa API call
      return `Error searching with Exa: ${error.message}`;
    }
  },
});

export const TOOLS = [exaSearch, webCrawl, batchWebSearch, extractEntities]; // order matters for tool calling
