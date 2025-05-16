/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Environment variable checks (optional, but good practice)
// It's better to handle these within the tool functions or ensure they are set in the environment
// For simplicity in this example, we'll assume they are set.
// const JINA_API_KEY = process.env.JINA_API_KEY;
// const SEARCH1API_KEY = process.env.SEARCH1API_KEY;
// const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY;

/**
 * Helper function to remove markdown images from text.
 */
function removeMarkdownImages(content: string): string {
  const pattern = /!\[([^\]]*)\]\(([^\)]+)\)/g;
  return content.replace(pattern, "");
}

const scrapeWebpagesSchema = z.object({
  links: z.array(z.string()).describe("A list of strings (URLs) to scrape."),
});
/**
 * Scrapes web pages using Jina AI.
 */
const scrapeWebpages = new DynamicStructuredTool({
  name: "scrape_webpages",
  description:
    "Scrape the provided web pages for detailed information. Use with less than 20 links (most optimally less than 10). Input format: {\"links\": [\"site1.com\", \"site2.com\", ...]}",
  schema: scrapeWebpagesSchema, // Schema for validation by the framework
  func: async (args: z.infer<typeof scrapeWebpagesSchema>) => {
    const { links } = args;

    const JINA_API_KEY = process.env.JINA_API_KEY;
    if (!JINA_API_KEY) {
      return "Error: JINA_API_KEY not found in environment variables.";
    }
    if (!links || links.length === 0) {
      return "Error: No URLs provided.";
    }

    const headers = { Authorization: `Bearer ${JINA_API_KEY}` };
    let combinedContent: string[] = [];

    const scrapeUrl = async (link: string): Promise<string> => {
      try {
        const fullUrl = `https://r.jina.ai/${link}`;
        const response = await fetch(fullUrl, {
          headers,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        if (!response.ok) {
          return `Error scraping ${link}: ${response.status} ${response.statusText}`;
        }
        let content = await response.text();
        content = content.replace(/\$/g, "\\$"); // Escape dollar signs
        content = removeMarkdownImages(content);
        return content;
      } catch (error: any) {
        if (error.name === 'TimeoutError') {
          return `Timeout for ${link}: Request timed out after 10 seconds.`;
        }
        return `Error scraping ${link}: ${error.message}`;
      }
    };

    const tasks = links.map(scrapeUrl);
    const results = await Promise.all(tasks);
    combinedContent = results;

    let finalContent = combinedContent.join("\n\n");
    if (finalContent.length > 200000) {
      finalContent =
        finalContent.substring(0, 200000) +
        "\n\n[Content truncated due to length...]";
    }
    return finalContent;
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
    "Traditional keyword-based search (Google via Search1API) that processes multiple queries simultaneously. Use with less than 50 queries (most optimally less than 30). Input format: {\"queries\": [\"query1\", \"query2\", \"query3\"]}",
  schema: batchWebSearchSchema,
  func: async (args: z.infer<typeof batchWebSearchSchema>) => {
    const { queries } = args;

    const SEARCH1API_KEY = process.env.SEARCH1API_KEY;
    if (!SEARCH1API_KEY) {
      return JSON.stringify({ error: "SEARCH1API_KEY not found in environment variables." });
    }
    if (!queries || queries.length === 0) {
        return JSON.stringify({ error: "No queries provided." });
    }

    const headers = {
      Authorization: `Bearer ${SEARCH1API_KEY}`,
      "Content-Type": "application/json",
    };

    const batchRequest = queries.map((query) => ({
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
        return JSON.stringify({ error: `Search API error: Status ${response.status}` });
      }
      const result = await response.json();
      return JSON.stringify(result); 
    } catch (error: any) {
      console.error(`Search API error: ${error.message}`);
      if (error.name === 'TimeoutError') {
        return JSON.stringify({ error: "Search API request timed out after 15 seconds." });
      }
      return JSON.stringify({ error: `Search API error: ${error.message}` });
    }
  },
});

const extractEntitiesSchema = z.object({
  entities: z.array(z.string()).describe("A list of entities (strings) to add."),
});

/**
 * Extracts and reports entities identified by the agent.
 * The graph will handle updating the overall state with these entities.
 */
const extractEntities = new DynamicStructuredTool({
  name: "extract_entities",
  description: "Use this tool to report entities you have identified. Provide entities as a list of strings. The graph will update the main state.",
  schema: extractEntitiesSchema,
  func: async (args: z.infer<typeof extractEntitiesSchema>) => {
    // The tool's job is to return the data that should update the 'entities' channel in the state.
    // LangGraph's ToolNode will take this output and merge it into the graph state.
    // Because our AppStateAnnotation defines an 'entities' channel with a reducer,
    // returning { entities: args.entities } will correctly update that part of the state.
    return { entities: args.entities };
  },
});

export const TOOLS = [
  scrapeWebpages,
  batchWebSearch,
  extractEntities,
];
