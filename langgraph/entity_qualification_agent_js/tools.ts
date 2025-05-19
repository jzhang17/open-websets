/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { QualificationItem } from "./graph.js";
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

// --- New Tools for Qualification ---

// Schema for qualifyAllEntitiesTool
const qualifyAllEntitiesSchema = z.object({
  summary: z
    .array(
      z
        .object({
          entity_name: z.string(),
          qualified: z.boolean(),
          reasoning: z.string(),
        })
        .passthrough(), // Allows other fields defined in QualificationItem
    )
    .describe(
      "The complete list of qualification summary items for ALL entities processed or re-evaluated in this step.",
    ),
});

/**
 * Updates or sets the qualification summary for all entities.
 * This REPLACES the existing summary in the state.
 */
export const qualifyAllEntitiesTool = new DynamicStructuredTool({
  name: "qualify_entities",
  description:
    "Updates or sets the qualification summary for all entities. Provide the complete list of qualification information. This REPLACES the existing summary.",
  schema: qualifyAllEntitiesSchema,
  func: async (args: z.infer<typeof qualifyAllEntitiesSchema>) => {
    // Return an object that instructs the graph to update its state
    return {
      update: {
        qualificationSummary: args.summary as QualificationItem[],
      },
    };
  },
});

// Schema for verifyQualificationConsistencyTool
const verifyInputsSchema = z.object({
  entitiesToQualify: z
    .array(z.string())
    .describe(
      "The list of entity names that should be qualified (from state).",
    ),
  qualificationSummary: z
    .array(
      z
        .object({
          entity_name: z.string(),
          qualified: z.boolean(),
          reasoning: z.string(),
        })
        .passthrough(),
    )
    .describe("The current list of qualification summary items (from state)."),
});

/**
 * Verifies the consistency of the qualification summary.
 * Returns results to update 'verificationResults' in state.
 */
export const verifyQualificationConsistencyTool = new DynamicStructuredTool({
  name: "verify_qualification_consistency",
  description:
    "Verifies the consistency of the qualification summary against the list of entities to qualify. Checks for duplicates, missing entities, extra entities, and potential name mismatches (e.g. due to spacing/casing). Requires the current list of entities to qualify and the current qualification summary from the state.",
  schema: verifyInputsSchema,
  func: async (args: z.infer<typeof verifyInputsSchema>) => {
    const { entitiesToQualify, qualificationSummary } = args;
    const summaryEntityNames = qualificationSummary.map(
      (item: QualificationItem) => item.entity_name,
    );

    const issues: Record<string, any> = {
      duplicates_found_now: [],
      missing_entities_now: [],
      extra_entities_now: [],
      potential_name_mismatches_details: [], // tracks possible name typos
      final_consistency: true,
    };

    // Calculate duplicates
    const nameCounts = summaryEntityNames.reduce(
      (acc: Record<string, number>, name: string) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    issues.duplicates_found_now = Object.entries(nameCounts)
      .filter(([_name, count]: [string, number]) => count > 1)
      .map(([name]) => name);

    const summarySet = new Set(summaryEntityNames);
    const entitiesToQualifySet = new Set(entitiesToQualify);

    // Calculate initial missing and extra entities
    const initialMissingEntities = entitiesToQualify.filter(
      (name: string) => !summarySet.has(name),
    );
    issues.missing_entities_now = [...initialMissingEntities]; // Store the full list

    const initialExtraEntities = summaryEntityNames.filter(
      (name: string) => !entitiesToQualifySet.has(name),
    );
    issues.extra_entities_now = [...initialExtraEntities]; // Store the full list

    // Identify potential name mismatches (case/space differences)
    const normalizedMissing = new Map(
      initialMissingEntities.map((name) => [name.trim().toLowerCase(), name]),
    );
    const potentialMismatchesList: Array<{
      summary_name: string;
      qualify_list_name: string;
      reason: string;
    }> = [];

    for (const extraName of initialExtraEntities) {
      const match = normalizedMissing.get(extraName.trim().toLowerCase());
      if (match) {
        potentialMismatchesList.push({
          summary_name: extraName,
          qualify_list_name: match,
          reason: "Probable typo due to spacing/casing differences.",
        });
        normalizedMissing.delete(extraName.trim().toLowerCase());
      }
    }
    issues.potential_name_mismatches_details = potentialMismatchesList;

    // The final_consistency check should still rely on the original definitions of missing/extra being empty.
    // If potential_name_mismatches_details is not empty, it implies that
    // initialMissingEntities and/or initialExtraEntities will also not be empty,
    // thus final_consistency will be false.
    issues.final_consistency =
      issues.duplicates_found_now.length === 0 &&
      initialMissingEntities.length === 0 &&
      initialExtraEntities.length === 0;

    return { verificationResults: issues };
  },
});

// Replacing operation-based update tool with full-summary overwrite tool
const overwriteSummarySchema = z.object({
  summary: z
    .array(
      z
        .object({
          entity_name: z.string(),
          qualified: z.boolean(),
          reasoning: z.string(),
        })
        .passthrough(),
    )
    .describe(
      "The complete list of qualification summary items to replace the existing summary.",
    ),
});

/**
 * Replaces the entire qualification summary with the provided list.
 */
export const updateQualificationSummaryStateTool = new DynamicStructuredTool({
  name: "update_qualification_summary_state",
  description:
    "Replaces the entire qualification summary with the provided list. Provide the complete, updated qualification summary via the 'summary' argument.",
  schema: overwriteSummarySchema,
  func: async (args: z.infer<typeof overwriteSummarySchema>) => {
    // Signal a state update for qualificationSummary by wrapping in 'update'
    return {
      update: { qualificationSummary: args.summary as QualificationItem[] },
    };
  },
});

export const AGENT_TOOLS = [webCrawl, batchWebSearch, qualifyAllEntitiesTool]; // used by the main qualification agent

export const VERIFICATION_LLM_TOOLS = [qualifyAllEntitiesTool]; // used by the verification agent
