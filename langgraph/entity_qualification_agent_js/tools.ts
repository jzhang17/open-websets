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

// Add utility functions for robust name normalization
function normalizeEntityName(name: string): string {
  // Normalize unicode characters (e.g., é -> e)
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Convert to lowercase for comparison
  const lowercased = normalized.toLowerCase();
  
  // Replace multiple spaces with single space
  const singleSpaced = lowercased.replace(/\s+/g, " ");
  
  // Trim whitespace
  const trimmed = singleSpaced.trim();
  
  // Remove common punctuation that might cause mismatches
  const noPunctuation = trimmed.replace(/['"''""`]/g, "");
  
  return noPunctuation;
}

function areNamesEquivalent(name1: string, name2: string): boolean {
  return normalizeEntityName(name1) === normalizeEntityName(name2);
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
          index: z.number(),
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
    "Finalizes the qualification summary for all entities after all research is done. Call this tool only once you have the full verdict for every entity, with no placeholder reasoning remaining. This REPLACES the existing summary in state.",
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
    .array(
      z.object({
        index: z.number(),
        name: z.string(),
        url: z.string(),
      }),
    )
    .describe("The list of entities that should be qualified (from state)."),
  qualificationSummary: z
    .array(
      z
        .object({
          index: z.number(),
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
    
    const issues: Record<string, any> = {
      duplicates_found_now: [],
      missing_entities_now: [],
      extra_entities_now: [],
      potential_name_mismatches_details: [],
      index_mismatches: [],
      final_consistency: false,
      suggested_corrections: []
    };

    // Create maps for efficient lookup
    const entityMap = new Map(
      entitiesToQualify.map(e => [e.index, { name: e.name, url: e.url }])
    );
    
    const summaryMap = new Map(
      qualificationSummary.map(item => [item.index, item])
    );

    // Check for index mismatches
    for (const [index, entity] of entityMap) {
      const summaryItem = summaryMap.get(index);
      if (summaryItem) {
        // Check if names match (with normalization)
        if (!areNamesEquivalent(entity.name, summaryItem.entity_name)) {
          issues.index_mismatches.push({
            index,
            expected_name: entity.name,
            actual_name: summaryItem.entity_name,
            normalized_expected: normalizeEntityName(entity.name),
            normalized_actual: normalizeEntityName(summaryItem.entity_name)
          });
        }
      }
    }

    // Check for duplicates in summary (by normalized name)
    const normalizedNameCounts = new Map<string, number>();
    const nameToOriginal = new Map<string, string[]>();
    
    for (const item of qualificationSummary) {
      const normalized = normalizeEntityName(item.entity_name);
      normalizedNameCounts.set(normalized, (normalizedNameCounts.get(normalized) || 0) + 1);
      
      if (!nameToOriginal.has(normalized)) {
        nameToOriginal.set(normalized, []);
      }
      nameToOriginal.get(normalized)!.push(item.entity_name);
    }
    
    // Find duplicates
    for (const [normalized, count] of normalizedNameCounts) {
      if (count > 1) {
        const originals = nameToOriginal.get(normalized)!;
        issues.duplicates_found_now.push({
          normalized_name: normalized,
          occurrences: originals,
          count
        });
      }
    }

    // Check for missing entities (by index)
    const missingByIndex: number[] = [];
    for (const [index, entity] of entityMap) {
      if (!summaryMap.has(index)) {
        missingByIndex.push(index);
        issues.missing_entities_now.push({
          index,
          name: entity.name,
          url: entity.url
        });
      }
    }

    // Check for extra entities (indices in summary but not in entitiesToQualify)
    for (const [index, item] of summaryMap) {
      if (!entityMap.has(index)) {
        issues.extra_entities_now.push({
          index,
          entity_name: item.entity_name,
          qualified: item.qualified,
          reasoning: item.reasoning
        });
      }
    }

    // Generate suggested corrections for missing entities
    for (const missingIndex of missingByIndex) {
      const entity = entityMap.get(missingIndex)!;
      
      // Try to find a potential match in extra entities
      let bestMatch = null;
      let bestScore = 0;
      
      for (const extraItem of issues.extra_entities_now) {
        const similarity = calculateNameSimilarity(entity.name, extraItem.entity_name);
        if (similarity > bestScore && similarity > 0.7) {
          bestScore = similarity;
          bestMatch = extraItem;
        }
      }
      
      issues.suggested_corrections.push({
        missing_entity: {
          index: missingIndex,
          name: entity.name
        },
        suggested_action: bestMatch ? 
          `Replace extra entity "${bestMatch.entity_name}" (index ${bestMatch.index}) with correct entity "${entity.name}" at index ${missingIndex}` :
          `Add missing entity "${entity.name}" at index ${missingIndex}`,
        confidence: bestMatch ? bestScore : 0
      });
    }

    // Final consistency check
    issues.final_consistency =
      issues.duplicates_found_now.length === 0 &&
      issues.missing_entities_now.length === 0 &&
      issues.extra_entities_now.length === 0 &&
      issues.index_mismatches.length === 0;

    return { verificationResults: issues };
  },
});

// Helper function to calculate similarity between two names
function calculateNameSimilarity(name1: string, name2: string): number {
  const norm1 = normalizeEntityName(name1);
  const norm2 = normalizeEntityName(name2);
  
  if (norm1 === norm2) return 1.0;
  
  // Simple character-based similarity
  const longer = norm1.length > norm2.length ? norm1 : norm2;
  const shorter = norm1.length > norm2.length ? norm2 : norm1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(shorter, longer);
  return (longer.length - editDistance) / longer.length;
}

// Simple Levenshtein distance implementation
function levenshteinDistance(s1: string, s2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[s2.length][s1.length];
}

// Replacing operation-based update tool with full-summary overwrite tool
const overwriteSummarySchema = z.object({
  summary: z
    .array(
      z
        .object({
          index: z.number(),
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

export const VERIFICATION_LLM_TOOLS = [
  qualifyAllEntitiesTool,
  updateQualificationSummaryStateTool,
]; // used by the verification agent
