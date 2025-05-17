/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Exa } from 'exa-js';

// Environment variable checks (optional, but good practice)
// It's better to handle these within the tool functions or ensure they are set in the environment
// For simplicity in this example, we'll assume they are set.
// const JINA_API_KEY = process.env.JINA_API_KEY;
// const SEARCH1API_KEY = process.env.SEARCH1API_KEY;
// const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY;

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

const scrapeWebpagesSchema = z.object({
  links: z.array(z.string()).describe("A list of strings (URLs) to scrape."),
});
/**
 * Scrapes web pages using Exa AI.
 */
const webCrawl = new DynamicStructuredTool({
  name: "web_crawl",
  description:
    "Scrape the provided web pages for detailed information using Exa AI. Use with less than 20 links (most optimally less than 10). Input format: {\"links\": [\"site1.com\", \"site2.com\", ...]}",
  schema: scrapeWebpagesSchema, // Schema for validation by the framework
  func: async (args: z.infer<typeof scrapeWebpagesSchema>) => {
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
      const contentsResponse: ExaContentsResponse = await exa.getContents(links) as ExaContentsResponse;

      if (contentsResponse.results && contentsResponse.results.length > 0) {
        combinedContent = contentsResponse.results.map((result: ExaSearchResult) => {
          let content = result.text || `No content retrieved for ${result.url || result.id}`;
          content = content.replace(/\$/g, "\\$"); // Escape dollar signs
          return content;
        });
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


export const TOOLS = [
  webCrawl,
  batchWebSearch,
];
