"""This module provides tools for web scraping, search functionality, and PDF reading.

It includes Tavily search, web scraping, and PDF reading capabilities.
"""

import os
from typing import List, Optional, Any, Dict, TypedDict, Annotated, Union, Literal
import requests
import re
from langchain_core.tools import tool
import aiohttp
import asyncio
from pydantic import BaseModel, Field, root_validator

@tool
async def scrape_webpages(links: List[str]) -> str:
    """
    Scrape the provided web pages for detailed information.
    
    Use with less than 20 links (most optimally less than 10).

    input format: {"links": ["site1.com", "site2.com", ...]}

    Args:
        links: A list of strings (URLs) to scrape.

    Returns:
        A single string containing the concatenated content of all scraped pages.
    """
    try:
        # 1. Basic check: do we have any links?
        if not links:
            return "Error: No URLs provided."

        def remove_images(content: str) -> str:
            """
            Finds markdown images like ![alt](url) and removes them entirely.
            """
            pattern = r'!\[([^\]]*)\]\(([^\)]+)\)'
            return re.sub(pattern, '', content)

        # 2. Check for the JINA_API_KEY in environment
        jina_api_key = os.getenv("JINA_API_KEY")
        if not jina_api_key:
            return "Error: JINA_API_KEY not found in environment variables."

        headers = {"Authorization": f"Bearer {jina_api_key}"}
        combined_content = []

        # 3. Define async function to scrape a single URL
        async def scrape_url(link: str):
            try:
                # Build the proxied Jina URL
                full_url = f"https://r.jina.ai/{link}"
                
                async with aiohttp.ClientSession() as session:
                    # Add a 7-second timeout to the request
                    async with session.get(full_url, headers=headers, timeout=7) as response:
                        content = await response.text()
                
                # Replace dollar signs to avoid escaping issues
                content = content.replace("$", r"\$")

                # Remove images
                content_without_images = remove_images(content)
                return content_without_images

            except asyncio.TimeoutError:
                return f"Error scraping {link}: Request timed out after 7 seconds."
            except Exception as e:
                return f"Error scraping {link}: {str(e)}"

        # 4. Create tasks for all URLs and gather results
        tasks = [scrape_url(link) for link in links]
        results = await asyncio.gather(*tasks)
        combined_content = results

        # 5. Combine the content into one large string
        final_content = "\n\n".join(combined_content)

        # 6. Truncate if it's too long
        if len(final_content) > 200_000:
            final_content = final_content[:200_000] + "\n\n[Content truncated due to length...]"

        return final_content

    except Exception as e:
        return f"Error scraping webpages: {str(e)}"
        
@tool
async def batch_web_search(queries: List[str]) -> Optional[Dict[str, Any]]:
    """Traditional keyword-based search (Google via Search1API) that processes multiple queries simultaneously.
    
    This tool excels at:
    - Finding exact keyword matches across multiple queries
    - Syntactic/lexical matching rather than semantic understanding
    - Processing multiple different search queries in parallel
    - Finding specific terms or direct information
    
    Use this tool when you need to search for multiple distinct pieces of information simultaneously or when exact keyword matching is more important than contextual understanding.
    
    Use with less than 50 queries (most optimally less than 30).
    
    input format: {"queries": ["query1", "query2", "query3"]}
    """
    api_key = os.getenv("SEARCH1API_KEY")
    if not api_key:
        return None

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    batch_request = [
        {
            "query": query,
            "search_service": "google",
            "max_results": 10,
            "gl": "us",
            "hl": "en"
        }
        for query in queries
    ]

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.search1api.com/search",
                headers=headers,
                json=batch_request
            ) as response:
                if response.status != 200:
                    print(f"Search API error: Status {response.status}")
                    return None
                result = await response.json()
                # Convert list response to dictionary with queries as keys
                return result
    except Exception as e:
        print(f"Search API error: {str(e)}")
        return None

@tool
def skip_tool(skip: bool) -> str:
    """A tool that does nothing and just returns 'Continue.' You can use this tool to skip a tool call if have already gathered enough information and ready to return the final answer.
    input format: {"skip": "true"}
    """
    return "Provide the final answer if you have enough information. Do not repeatly call the skip_tool tool and stuck in a loop. Directly provide the final answer if you notice that you are stuck in a loop. Final Answer:"

# Define the input schema for the lead qualification tool
class LeadInfo(BaseModel):
    """Schema for lead qualification information."""
    entity_name: str = Field(..., description="The name of the entity/lead")
    qualified: bool = Field(..., description="Whether the lead is qualified or not")
    reasoning: str = Field(..., description="The reasoning behind the qualification decision")

class SingleLeadInput(BaseModel):
    """Input schema for qualifying a single lead."""
    entity_name: str = Field(..., description="The name of the entity/lead")
    qualified: bool = Field(..., description="Whether the lead is qualified or not")
    reasoning: str = Field(..., description="The reasoning behind the qualification decision")

class QualifyLeadInput(BaseModel):
    """Input schema for the qualify_lead tool."""
    leads: Union[List[LeadInfo], List[Dict[str, Any]], LeadInfo, Dict[str, Any]] = Field(
        ..., 
        description="A single lead or a list of leads to qualify with their information"
    )

# Define the state structure for lead tracking with proper reducer
# State keys are Annotated to define how they should be reduced when updating state
class LeadState(TypedDict):
    """State schema for tracking qualified leads."""
    qualified_leads: List[Dict[str, Any]]

# Define the tool as a standalone function with proper state management
@tool(args_schema=QualifyLeadInput)
def qualify_lead(leads: Union[List[LeadInfo], List[Dict[str, Any]], LeadInfo, Dict[str, Any]], state: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Qualifies and tracks potential leads with detailed information.

    This tool REPLACES the entire list of qualified leads in the state with the
    list provided in the current call. Ensure you submit the complete and final list
    of all entities processed in the run when calling this tool.

    Use this tool to store and qualify leads you find. You can qualify multiple leads at once
    or a single lead at a time, but the final call should contain the complete list.

    For each lead, provide:
    - entity_name: The name of the entity/lead
    - qualified: Whether the lead is qualified (True/False)
    - reasoning: Why the lead is qualified or disqualified

    Example tool call for a single lead (if it's the only lead):
    ```json
    {
      "name": "qualify_lead",
      "args": {
        "leads": {
          "entity_name": "ACME CORPORATION",
          "qualified": true,
          "reasoning": "Revenue over $50M, 150+ employees, founder-led and based in Southern California"
        }
      }
    }
    ```

    Example tool call for multiple leads (final list):
    ```json
    {
      "name": "qualify_lead",
      "args": {
        "leads": [
          {
            "entity_name": "ACME CORPORATION",
            "qualified": true,
            "reasoning": "Revenue over $50M, 150+ employees, founder-led and based in Southern California"
          },
          {
            "entity_name": "XYZ INDUSTRIES",
            "qualified": false,
            "reasoning": "Located in Northern California, outside our target region"
          }
        ]
      }
    }
    ```

    It will return the complete list of qualified leads provided in this specific call.
    """
    # Initialize state if not provided or empty
    # if state is None:
    #     state = {"leads": []}

    # Ensure state has leads list
    # if "leads" not in state:
    #     state["leads"] = []
    # --> State initialization/retrieval is handled by LangGraph state management

    # Handle case where leads is a single item
    if not isinstance(leads, list):
        leads = [leads]

    # Convert leads to LeadInfo objects if they're dictionaries for validation
    lead_objects = []
    for lead in leads:
        if isinstance(lead, dict):
            try:
                lead_objects.append(LeadInfo(**lead))
            except Exception as e:
                # Try to give a helpful error message
                return {"error": f"Invalid lead format: {str(e)}", "leads": []} # Return empty list on error
        elif isinstance(lead, LeadInfo): # Handle if LeadInfo object is passed directly
            lead_objects.append(lead)
        else:
            # Handle unexpected type if necessary
            return {"error": f"Invalid lead type: {type(lead)}", "leads": []}

    # Convert validated Pydantic models to dictionaries for storage
    lead_dicts = [lead.dict() for lead in lead_objects]

    # *** REPLACE the leads in the state, do not merge/update ***
    # The graph's state reducer will handle taking this output and updating the actual state.
    # We just need to return the list we want to be the new state.
    # current_leads = state["leads"] # No need to read current state
    # updated_leads = current_leads.copy() # No need to copy

    # for new_lead in lead_dicts:
        # Check if the lead already exists by entity_name
        # existing_idx = next((i for i, lead in enumerate(updated_leads)
        #                    if lead["entity_name"] == new_lead["entity_name"]), None)

        # if existing_idx is not None:
            # Update existing lead
            # updated_leads[existing_idx] = new_lead
        # else:
            # Add new lead
            # updated_leads.append(new_lead)
    # --> Removed merging logic

    # Return the provided leads as the new state for 'qualified_leads'
    # LangGraph will use this dictionary to update the 'qualified_leads' field in the overall state.
    return {"qualified_leads": lead_dicts}

# Define the input schema for the verification tool
class VerifyInput(BaseModel):
    entities: List[str] = Field(..., description="List of entity names")
    qualified_leads: List[Dict[str, Any]] = Field(..., description="List of qualified lead objects")

@tool(args_schema=VerifyInput)
def verify_lead_qualification(entities: List[str], qualified_leads: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Verifies the consistency between entities and qualified leads.
    This tool analyzes the current entities list and qualified_leads list to identify:
    - Entities that are missing from qualified_leads
    - Name inconsistencies between entities and qualified_leads entries
    - Entities that are incorrectly split and should be combined
    
    Args:
        entities: The list of entity names from the current state.
        qualified_leads: The list of qualified leads from the current state.
        
    Returns:
        A dictionary containing:
        - all_entities_qualified: Boolean indicating if all entities have been qualified
        - missing_entities: List of entities that aren't in qualified_leads
        - name_inconsistencies: List of potential name mismatches
        - split_entities: List of entities that appear to be incorrectly split
        - is_consistent: Boolean indicating if the state is consistent
    """
    # We receive entities and qualified_leads directly as arguments now
    
    # Check if inputs are provided
    if not entities or not qualified_leads:
        return {
            "all_entities_qualified": False,
            "missing_entities": [],
            "name_inconsistencies": [],
            "split_entities": [],
            "is_consistent": False,
            "error": "Missing required inputs (entities or qualified_leads)"
        }
    
    # Extract entity names from qualified_leads
    qualified_entity_names = [lead["entity_name"] for lead in qualified_leads]
    
    # Find entities that are missing from qualified_leads
    missing_entities = []
    for entity in entities:
        if entity not in qualified_entity_names:
            # Check if the entity might be part of a combined name
            found_as_part = False
            for qualified_name in qualified_entity_names:
                if entity in qualified_name and entity != qualified_name:
                    found_as_part = True
                    break
            
            if not found_as_part:
                missing_entities.append(entity)
    
    # Identify potentially split entities that should be combined
    split_entities = []
    
    # Check for special cases where consecutive entities in the list might be combined
    # This handles cases like "BEST-VIP CHAUFFEURED" + "WORLDWIDE CORP."
    for i in range(len(entities) - 1):
        entity1 = entities[i]
        entity2 = entities[i + 1]
        
        # Try different combination patterns
        combinations = [
            f"{entity1} {entity2}",
            f"{entity1}{entity2}",
            f"{entity1}-{entity2}"
        ]
        
        # Check if any qualified lead matches these combinations
        for qualified_name in qualified_entity_names:
            # Check for exact match with any combination
            if qualified_name in combinations:
                split_entities.append({
                    "combined_name": qualified_name,
                    "parts": [entity1, entity2],
                    "indices": [i, i+1]
                })
                break
                
            # Check if the qualified name contains both entities in sequence
            if entity1 in qualified_name and entity2 in qualified_name:
                idx1 = qualified_name.find(entity1)
                idx2 = qualified_name.find(entity2)
                
                # If they appear in sequence or near each other
                if idx1 >= 0 and idx2 >= 0 and abs(idx2 - (idx1 + len(entity1))) <= 5:
                    split_entities.append({
                        "combined_name": qualified_name,
                        "parts": [entity1, entity2],
                        "indices": [i, i+1]
                    })
                    break
    
    # Additional check for entity names that are joined together in qualified leads
    # This covers cases where "A B" and "C" in entities becomes "A B C" in qualified leads
    for qualified_name in qualified_entity_names:
        if qualified_name not in entities:
            # Find all entities that could be parts of this qualified name
            potential_parts = []
            indices = []
            
            for i, entity in enumerate(entities):
                # Check if this entity is contained in the qualified name
                if entity in qualified_name and entity != qualified_name:
                    potential_parts.append(entity)
                    indices.append(i)
            
            # If we found multiple parts that might make up this qualified name
            if len(potential_parts) >= 2:
                # Only add if not already captured
                already_captured = False
                for item in split_entities:
                    if item["combined_name"] == qualified_name:
                        already_captured = True
                        break
                
                if not already_captured:
                    split_entities.append({
                        "combined_name": qualified_name,
                        "parts": potential_parts,
                        "indices": indices
                    })
    
    # Check for cases where parts of entity names are combined differently
    # For example: "THE LIBERTY COMPANY" + "INSURANCE BROKERS, INC." -> "THE LIBERTY COMPANY INSURANCE BROKERS, INC."
    for qualified_name in qualified_entity_names:
        # Skip if already in split_entities
        skip = False
        for item in split_entities:
            if item["combined_name"] == qualified_name:
                skip = True
                break
        
        if skip:
            continue
            
        # Special case for joined words where the entity has a comma
        for i, entity in enumerate(entities):
            if "," in entity and entity not in qualified_name:
                # Extract the part before the comma
                base_part = entity.split(",")[0].strip()
                
                # See if this base part appears in a qualified name
                if base_part in qualified_name:
                    # Look for other entities that might be part of this qualified name
                    potential_parts = [entity]
                    indices = [i]
                    
                    for j, other_entity in enumerate(entities):
                        if i != j and other_entity in qualified_name:
                            potential_parts.append(other_entity)
                            indices.append(j)
                    
                    if len(potential_parts) > 1:
                        split_entities.append({
                            "combined_name": qualified_name,
                            "parts": potential_parts,
                            "indices": indices
                        })
    
    # Check for name inconsistencies (not accurately captured in split_entities)
    name_inconsistencies = []
    for qualified_name in qualified_entity_names:
        if qualified_name not in entities:
            # Don't report inconsistencies already captured in split_entities
            already_captured = False
            for item in split_entities:
                if item["combined_name"] == qualified_name:
                    already_captured = True
                    break
            
            if not already_captured:
                related_entities_with_indices = []
                for i, entity in enumerate(entities):
                    # Check if entity is a substring of qualified_name or vice versa
                    if entity in qualified_name or qualified_name in entity:
                        # Store both the entity and its original index
                        related_entities_with_indices.append({"name": entity, "index": i})

                if related_entities_with_indices:
                    # Choose the first related entity as the primary one for the inconsistency report
                    first_related = related_entities_with_indices[0]
                    name_inconsistencies.append({
                        "qualified_lead_name": qualified_name,
                        "entity_name": first_related["name"],
                        "entity_index": first_related["index"],
                        "potential_entities": [rel["name"] for rel in related_entities_with_indices]
                    })
    
    # Determine if all entities have been properly accounted for
    all_entities_qualified = len(missing_entities) == 0 and len(name_inconsistencies) == 0 and len(split_entities) == 0
    
    return {
        "all_entities_qualified": all_entities_qualified,
        "missing_entities": missing_entities,
        "name_inconsistencies": name_inconsistencies,
        "split_entities": split_entities,
        "is_consistent": all_entities_qualified
    }

class EntityStateUpdate(BaseModel):
    """Schema for entity state update operations."""
    operation: str = Field(..., description="Operation type: 'combine', 'replace', or 'remove'")
    indices: List[int] = Field(..., description="Indices of entities to operate on")
    new_entity: Optional[str] = Field(None, description="New entity name for 'combine' or 'replace' operations")
    current_entities: List[str] = Field(..., description="The current list of entities from the state")

@tool(args_schema=EntityStateUpdate)
def update_entities_state(
    operation: str,
    indices: List[int],
    current_entities: List[str],
    new_entity: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Updates the entities state based on verification findings.
    
    This tool allows you to modify the entities list in the state to resolve inconsistencies
    with the qualified_leads list. You can:
    
    - 'combine': Merge multiple entities into one (requires indices and new_entity)
    - 'replace': Replace an entity with a new name (requires indices[0] and new_entity)
    - 'remove': Remove entities from the list (requires indices)
    
    Args:
        operation: The operation to perform ('combine', 'replace', or 'remove')
        indices: List of entity indices to operate on (0-based)
        current_entities: The current list of entities from the state
        new_entity: The new entity name for 'combine' or 'replace' operations
        
    Returns:
        Updated state dictionary with modified entities list
        
    Example:
        To combine entities at indices 15 and 16 into "BEST-VIP CHAUFFEURED WORLDWIDE CORP.":
        ```
        update_entities_state(
            operation="combine",
            indices=[15, 16],
            new_entity="BEST-VIP CHAUFFEURED WORLDWIDE CORP.",
            current_entities=["...", "BEST-VIP CHAUFFEURED", "WORLDWIDE CORP.", "..."]
        )
        ```
    """
    entities = current_entities.copy()
    
    # Validate indices
    if not indices:
        return {
            "error": "No indices provided",
            "entities": entities
        }
        
    # Sort indices in descending order to avoid index shifting during removal
    sorted_indices = sorted(indices, reverse=True)
    
    # Check for invalid indices
    if any(idx < 0 or idx >= len(entities) for idx in indices):
        return {
            "error": "Invalid indices: some indices are out of range",
            "entities": entities
        }
    
    if operation == "combine":
        if new_entity is None:
            return {
                "error": "Missing new_entity for combine operation",
                "entities": entities
            }
        
        # Remove the entities at the specified indices (in reverse order)
        for idx in sorted_indices:
            entities.pop(idx)
        
        # Add the new combined entity at the smallest index position
        min_idx = min(indices)
        entities.insert(min_idx, new_entity)
    
    elif operation == "replace":
        if len(indices) != 1:
            return {
                "error": "Replace operation requires exactly one index",
                "entities": entities
            }
            
        if new_entity is None:
            return {
                "error": "Missing new_entity for replace operation",
                "entities": entities
            }
        
        # Replace the entity at the specified index
        entities[indices[0]] = new_entity
    
    elif operation == "remove":
        # Remove the entities at the specified indices (in reverse order)
        for idx in sorted_indices:
            entities.pop(idx)
    
    else:
        return {
            "error": f"Invalid operation: {operation}",
            "entities": entities
        }
    
    # Return the updated state under the 'entities' key
    return {"entities": entities}

# --- Tool to Update Qualified Leads State ---

# Pydantic models for different update operations on qualified_leads
class RemoveDuplicatesOp(BaseModel):
    operation: Literal["remove_duplicates"] = Field(..., description="Operation type.")
    current_qualified_leads: List[Dict[str, Any]] = Field(..., description="The current list of qualified leads from the state.")

class RemoveByNameOp(BaseModel):
    operation: Literal["remove_by_name"] = Field(..., description="Operation type.")
    entity_name: str = Field(..., description="The entity_name of the lead(s) to remove.")
    current_qualified_leads: List[Dict[str, Any]] = Field(..., description="The current list of qualified leads from the state.")

class UpdateFieldsOp(BaseModel):
    operation: Literal["update_fields"] = Field(..., description="Operation type.")
    entity_name: str = Field(..., description="The entity_name of the lead(s) to update.")
    qualified: Optional[bool] = Field(None, description="The new qualification status (optional).")
    reasoning: Optional[str] = Field(None, description="The new reasoning text (optional).")
    current_qualified_leads: List[Dict[str, Any]] = Field(..., description="The current list of qualified leads from the state.")

    @root_validator(skip_on_failure=True) # Pydantic v1 style root_validator
    def check_at_least_one_field_to_update(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        if values.get('qualified') is None and values.get('reasoning') is None:
            raise ValueError("For 'update_fields' operation, at least one of 'qualified' or 'reasoning' must be provided.")
        return values

class QualifiedLeadsUpdateSchema(BaseModel):
    """Input schema for updating the qualified_leads state."""
    update_instruction: Annotated[
        Union[RemoveDuplicatesOp, RemoveByNameOp, UpdateFieldsOp],
        Field(..., discriminator="operation")
    ]

@tool(args_schema=QualifiedLeadsUpdateSchema)
def update_qualified_leads_state(
    update_instruction: Union[RemoveDuplicatesOp, RemoveByNameOp, UpdateFieldsOp]
) -> Dict[str, Any]:
    """
    Updates the qualified_leads state by performing operations like removing duplicates,
    removing a specific lead by name, or updating fields of a specific lead.

    Args:
        update_instruction: An object defining the operation to perform and its parameters.
            - operation: 'remove_duplicates', 'remove_by_name', or 'update_fields'.
            - current_qualified_leads: The current list of qualified lead dictionaries.
            - For 'remove_by_name':
                - entity_name: The name of the lead(s) to remove.
            - For 'update_fields':
                - entity_name: The name of the lead(s) to update.
                - qualified (optional): The new boolean qualification status.
                - reasoning (optional): The new reasoning string. (At least one of 'qualified' or 'reasoning' must be provided).

    Returns:
        Updated state dictionary with the modified qualified_leads list.
        If an error occurs (e.g., invalid operation), an 'error' key will be in the dictionary.

    Examples:

    1. Remove duplicate leads (keeps first occurrence by 'entity_name'):
       ```json
       {
         "tool_name": "update_qualified_leads_state",
         "args": {
           "update_instruction": {
             "operation": "remove_duplicates",
             "current_qualified_leads": [
               {"entity_name": "Lead A", "qualified": true, "reasoning": "Good"},
               {"entity_name": "Lead B", "qualified": false, "reasoning": "Bad"},
               {"entity_name": "Lead A", "qualified": true, "reasoning": "Duplicate"}
             ]
           }
         }
       }
       ```
       Result: `{"qualified_leads": [{"entity_name": "Lead A", ...}, {"entity_name": "Lead B", ...}]}`

    2. Remove a lead by its entity_name:
       ```json
       {
         "tool_name": "update_qualified_leads_state",
         "args": {
           "update_instruction": {
             "operation": "remove_by_name",
             "entity_name": "Lead B",
             "current_qualified_leads": [
               {"entity_name": "Lead A", "qualified": true, "reasoning": "Good"},
               {"entity_name": "Lead B", "qualified": false, "reasoning": "To be removed"}
             ]
           }
         }
       }
       ```
       Result: `{"qualified_leads": [{"entity_name": "Lead A", ...}]}`

    3. Update fields of a lead by its entity_name:
       ```json
       {
         "tool_name": "update_qualified_leads_state",
         "args": {
           "update_instruction": {
             "operation": "update_fields",
             "entity_name": "Lead A",
             "qualified": false,
             "reasoning": "Re-evaluated, not qualified.",
             "current_qualified_leads": [
               {"entity_name": "Lead A", "qualified": true, "reasoning": "Initial assessment"}
             ]
           }
         }
       }
       ```
       Result: `{"qualified_leads": [{"entity_name": "Lead A", "qualified": false, "reasoning": "Re-evaluated, not qualified."}]}`
    """
    leads = update_instruction.current_qualified_leads
    operation_type = update_instruction.operation
    final_processed_list = leads # Default to current leads if operation fails or no changes

    if operation_type == "remove_duplicates":
        seen_names = set()
        unique_leads = []
        for lead in leads:
            name = lead.get("entity_name")
            if name and name not in seen_names:
                unique_leads.append(lead)
                seen_names.add(name)
            elif not name: # Keep leads without an entity_name
                unique_leads.append(lead)
        final_processed_list = unique_leads

    elif operation_type == "remove_by_name":
        if not isinstance(update_instruction, RemoveByNameOp):
            return {
                "error": "Invalid instruction type for remove_by_name", 
                "qualified_leads": {"__replace_leads__": True, "data": leads} # Return original on error
            }
        
        name_to_remove = update_instruction.entity_name
        updated_leads = [lead for lead in leads if lead.get("entity_name") != name_to_remove]
        final_processed_list = updated_leads

    elif operation_type == "update_fields":
        if not isinstance(update_instruction, UpdateFieldsOp):
            return {
                "error": "Invalid instruction type for update_fields", 
                "qualified_leads": {"__replace_leads__": True, "data": leads} # Return original on error
            }

        name_to_update = update_instruction.entity_name
        new_qualified = update_instruction.qualified
        new_reasoning = update_instruction.reasoning
        
        updated_leads_for_op = []
        # updated_at_least_one = False # Not strictly needed for replacement logic
        for lead in leads:
            if lead.get("entity_name") == name_to_update:
                updated_lead = lead.copy()
                if new_qualified is not None:
                    updated_lead["qualified"] = new_qualified
                if new_reasoning is not None:
                    updated_lead["reasoning"] = new_reasoning
                updated_leads_for_op.append(updated_lead)
                # updated_at_least_one = True
            else:
                updated_leads_for_op.append(lead)
        final_processed_list = updated_leads_for_op
    
    else:
        # Should be caught by Pydantic, but as a fallback:
        return {
            "error": f"Invalid operation for qualified_leads: {operation_type}. Supported operations are 'remove_duplicates', 'remove_by_name', 'update_fields'.",
            "qualified_leads": {"__replace_leads__": True, "data": leads} # Return original on error
        }
    
    # All operations in this tool should replace the list, so wrap the final list
    return {"qualified_leads": {"__replace_leads__": True, "data": final_processed_list}}

# Update the TOOLS list to include the new tools
AGENT_TOOLS = [batch_web_search, scrape_webpages, skip_tool, qualify_lead]
VERIFICATION_TOOLS = [update_entities_state, update_qualified_leads_state]