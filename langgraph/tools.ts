/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";



const updateQualificationCriteriaSchema = z.object({
  criteria: z.string().describe("A string containing all qualification criteria, typically formatted as a detailed list, to guide sub-agents in their tasks. This will overwrite any previous criteria."),
});

/**
 * Updates or sets the global qualification criteria for the current session.
 * The provided string should detail all necessary conditions for entity qualification
 * and list generation. This information is passed to subgraphs.
 */
const updateQualificationCriteria = new DynamicStructuredTool({
  name: "update_qualification_criteria",
  description: "Use this tool to set or update the qualification criteria for entity processing. Provide a single string that details all criteria (e.g., a bullet list based on user query). This will overwrite any existing criteria and will be used by all sub-agents.",
  schema: updateQualificationCriteriaSchema,
  func: async (args: z.infer<typeof updateQualificationCriteriaSchema>) => {
    // This tool returns an object structured to update the 'qualificationCriteria'
    // field in the ParentAppStateAnnotation. LangGraph's ToolNode handles merging this.
    return { qualificationCriteria: args.criteria };
  },
});

export const TOOLS = [
  updateQualificationCriteria,
]; 
