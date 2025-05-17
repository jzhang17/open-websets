/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { QualificationItem } from "./graph.js"; // Added .js extension

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

    const batchRequest = queries.map((query: string) => ({ // Added type for query
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
  description: "Use this tool to report entities you have identified. Provide entities as a list of strings. The graph will update the main state with entities to qualify.",
  schema: extractEntitiesSchema,
  func: async (args: z.infer<typeof extractEntitiesSchema>) => {
    // The tool's job is to return the data that should update the 'entitiesToQualify' channel in the state.
    return { entitiesToQualify: args.entities };
  },
});

// --- New Tools for Qualification ---

// Schema for qualifyAllEntitiesTool
const qualifyAllEntitiesSchema = z.object({
  summary: z.array(
    z.object({
      entity_name: z.string(),
      qualified: z.boolean(),
      reasoning: z.string()
    }).passthrough() // Allows other fields defined in QualificationItem
  ).describe("The complete list of qualification summary items for ALL entities processed or re-evaluated in this step.")
});

/**
 * Updates or sets the qualification summary for all entities.
 * This REPLACES the existing summary in the state.
 */
export const qualifyAllEntitiesTool = new DynamicStructuredTool({
  name: "qualify_entities",
  description: "Updates or sets the qualification summary for all entities. Provide the complete list of qualification information. This REPLACES the existing summary.",
  schema: qualifyAllEntitiesSchema,
  func: async (args: z.infer<typeof qualifyAllEntitiesSchema>) => {
    // Return an object structured to explicitly signal a state update,
    // similar to how a Command object would work.
    return { 
      update: { 
        qualificationSummary: args.summary as QualificationItem[] 
      } 
    };
  },
});


// Schema for verifyQualificationConsistencyTool
const verifyInputsSchema = z.object({
    entitiesToQualify: z.array(z.string()).describe("The list of entity names that should be qualified (from state)."),
    qualificationSummary: z.array(z.object({
        entity_name: z.string(),
        qualified: z.boolean(),
        reasoning: z.string(),
    }).passthrough()).describe("The current list of qualification summary items (from state)."),
});

/**
 * Verifies the consistency of the qualification summary.
 * Returns results to update 'verificationResults' in state.
 */
export const verifyQualificationConsistencyTool = new DynamicStructuredTool({
    name: "verify_qualification_consistency",
    description: "Verifies the consistency of the qualification summary against the list of entities to qualify. Checks for duplicates, missing entities, extra entities, and potential name mismatches (e.g. due to spacing/casing). Requires the current list of entities to qualify and the current qualification summary from the state.",
    schema: verifyInputsSchema,
    func: async (args: z.infer<typeof verifyInputsSchema>) => {
        const { entitiesToQualify, qualificationSummary } = args;
        const summaryEntityNames = qualificationSummary.map((item: QualificationItem) => item.entity_name);

        const issues: Record<string, any> = {
          duplicates_found_now: [],
          missing_entities_now: [],
          extra_entities_now: [],
          potential_name_mismatches_details: [], // New field
          final_consistency: true,
        };

        // Calculate duplicates
        const nameCounts = summaryEntityNames.reduce((acc: Record<string, number>, name: string) => { // Added types for acc and name
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        issues.duplicates_found_now = Object.entries(nameCounts)
          .filter(([_name, count]: [string, number]) => count > 1) // Added type for [name, count]
          .map(([name]) => name);

        const summarySet = new Set(summaryEntityNames);
        const entitiesToQualifySet = new Set(entitiesToQualify);

        // Calculate initial missing and extra entities
        const initialMissingEntities = entitiesToQualify.filter((name: string) => !summarySet.has(name)); // Added type for name
        issues.missing_entities_now = [...initialMissingEntities]; // Store the full list

        const initialExtraEntities = summaryEntityNames.filter((name: string) => !entitiesToQualifySet.has(name)); // Added type for name
        issues.extra_entities_now = [...initialExtraEntities]; // Store the full list

        // Identify potential name mismatches
        const potentialMismatchesList: Array<{ summary_name: string; qualify_list_name: string; reason: string }> = [];
        
        // Use copies for matching logic to preserve the original issues.extra_entities_now and issues.missing_entities_now for reporting
        const tempExtraForMatching = [...initialExtraEntities]; 
        const tempMissingForMatching = [...initialMissingEntities];
        
        const matchedExtraIndicesInTemp = new Set<number>();
        const matchedMissingIndicesInTemp = new Set<number>();


        for (let i = 0; i < tempExtraForMatching.length; i++) {
            if (matchedExtraIndicesInTemp.has(i)) continue; // This extra entity from temp list is already matched

            const extraName = tempExtraForMatching[i];

            for (let j = 0; j < tempMissingForMatching.length; j++) {
                if (matchedMissingIndicesInTemp.has(j)) continue; // This missing entity from temp list is already matched

                const missingName = tempMissingForMatching[j];

                if (extraName.trim().toLowerCase() === missingName.trim().toLowerCase()) {
                    potentialMismatchesList.push({
                        summary_name: extraName, // The name as it appears in the summary (potentially with typo)
                        qualify_list_name: missingName, // The name as it appears in the entitiesToQualify list (the correct one)
                        reason: "Probable typo due to spacing/casing differences."
                    });
                    matchedExtraIndicesInTemp.add(i); // Mark this extraName as matched
                    matchedMissingIndicesInTemp.add(j); // Mark this missingName as matched
                    break; // Found a match for current extraName, move to the next extraName
                }
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

// Schemas for updateQualificationSummaryStateTool operations
const removeDuplicatesOpSchema = z.object({
  operation: z.enum(["remove_duplicates"]),
});
const removeByNameOpSchema = z.object({
  operation: z.enum(["remove_by_name"]),
  entity_name: z.string(),
});
const updateFieldsOpSchema = z.object({
  operation: z.enum(["update_fields"]),
  entity_name: z.string(),
  qualified: z.boolean().optional(),
  reasoning: z.string().optional(),
});

// Schema for updateQualificationSummaryStateTool
const updateSummarySchema = z.object({
    currentSummary: z.array(z.object({
        entity_name: z.string(),
        qualified: z.boolean(),
        reasoning: z.string(),
    }).passthrough()).describe("The current complete list of qualification summary items from the state."),
    instruction: z.union([
        removeDuplicatesOpSchema,
        removeByNameOpSchema,
        updateFieldsOpSchema,
    ]).describe("The specific operation to perform on the qualification summary (remove_duplicates, remove_by_name, update_fields)."),
});

/**
 * Updates the qualification summary based on specific instructions.
 * Returns the new summary to update 'qualificationSummary' in state.
 */
export const updateQualificationSummaryStateTool = new DynamicStructuredTool({
    name: "update_qualification_summary_state",
    description: "Updates the qualification summary based on a specific instruction: remove_duplicates, remove_by_name, or update_fields. Requires the current qualification summary from the state and the specific update instruction. Returns the complete updated qualification summary.",
    schema: updateSummarySchema,
    func: async (args: z.infer<typeof updateSummarySchema>) => {
        let newSummary = [...args.currentSummary]; 
        const instruction = args.instruction;

        if (instruction.operation === "remove_duplicates") {
            const seenNames = new Set<string>();
            newSummary = newSummary.filter(item => {
                if (seenNames.has(item.entity_name)) return false;
                seenNames.add(item.entity_name);
                return true;
            });
        } else if (instruction.operation === "remove_by_name") {
            const op = instruction as z.infer<typeof removeByNameOpSchema>;
            newSummary = newSummary.filter(item => item.entity_name !== op.entity_name);
        } else if (instruction.operation === "update_fields") {
            const op = instruction as z.infer<typeof updateFieldsOpSchema>;
            const index = newSummary.findIndex(item => item.entity_name === op.entity_name);
            if (index > -1) {
                if (op.qualified !== undefined) newSummary[index].qualified = op.qualified;
                if (op.reasoning !== undefined) newSummary[index].reasoning = op.reasoning;
            }
        }
        return { qualificationSummary: newSummary as QualificationItem[] };
    },
});


export const TOOLS = [
  scrapeWebpages,
  batchWebSearch,
  extractEntities,
  qualifyAllEntitiesTool,
  verifyQualificationConsistencyTool,
  updateQualificationSummaryStateTool,
];

export const AGENT_TOOLS = [
  scrapeWebpages,
  batchWebSearch,
  extractEntities,
  qualifyAllEntitiesTool,
];

export const VERIFICATION_LLM_TOOLS = [
  updateQualificationSummaryStateTool,
];