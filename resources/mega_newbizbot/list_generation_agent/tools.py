"""This module provides tools for web scraping, search functionality, and PDF reading.

It includes Tavily search, web scraping, and PDF reading capabilities.
"""

import os
from typing import List, Optional, Any, Dict
import requests
import re
from langchain_core.tools import tool
import aiohttp
import asyncio

@tool
def web_search(query: str) -> str:
    """A semantic search engine (Tavily) that understands the contextual meaning and intent behind queries.
    
    This tool excels at:
    - Understanding complex or ambiguous queries
    - Interpreting natural language questions
    - Finding relevant content even when exact keywords aren't present
    - Comprehending relationships between concepts
    
    Use this as your primary search tool for research questions, conceptual understanding, and when seeking comprehensive results.
    
    input format: {"query": "query1"}
    """
    try:
        tavily_api_key = os.getenv("TAVILY_API_KEY")
        if not tavily_api_key:
            return "Error: TAVILY_API_KEY not found in environment variables"

        from tavily import TavilyClient
        client = TavilyClient(api_key=tavily_api_key)
        
        response = client.search(
            query=query,
            search_depth="advanced",
            include_answer=True,
            max_results=10
        )

        # Simply return the response dictionary
        return response
    except Exception as e:
        return f"Error performing web search: {str(e)}"

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
                    async with session.get(full_url, headers=headers, timeout=10) as response:
                        content = await response.text()
                
                # Replace dollar signs to avoid escaping issues
                content = content.replace("$", r"\$")

                # Remove images
                content_without_images = remove_images(content)
                return content_without_images

            except asyncio.TimeoutError:
                return f"Timeout for {link}: Request timed out after 10 seconds."
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
async def youtube_search(query: str) -> Optional[Dict[str, Any]]:
    """Search for videos on YouTube using Search1API.
    
    This tool searches YouTube for videos related to your query.
    
    This tool is best used for:
    - Finding company information or presentations
    - Locating personal biographies or background information
    - Discovering past interviews, talks, or podcast appearances
    
    input format: {"query": "search query"}
    """
    api_key = os.getenv("SEARCH1API_KEY")
    if not api_key:
        return None

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "query": query,
        "max_results": 10,
        "crawl_results": 0,
        "image": False,
        "search_service": "youtube"
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.search1api.com/search",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    print(f"YouTube search API error: Status {response.status}")
                    return None
                result = await response.json()
                return result
    except Exception as e:
        print(f"YouTube search API error: {str(e)}")
        return None

@tool
async def youtube_transcript(url: str) -> Optional[Dict[str, Any]]:
    """Get transcript from a YouTube video.
    
    This tool should be used closely with the YouTube search tool. First use the YouTube search tool to find 
    relevant videos, then use this tool to get the full transcript of specific videos of interest.
    
    This gives you detailed content of what was said in the video, allowing for more in-depth analysis 
    of video content without having to watch the entire video.
    
    input format: {"url": "https://www.youtube.com/watch?v=VIDEO_ID"}
    
    Args:
        url: YouTube video URL
    """
    api_key = os.getenv("SUPADATA_API_KEY")
    if not api_key:
        return "Error: SUPADATA_API_KEY not found in environment variables"
    
    headers = {
        "x-api-key": api_key
    }
    
    params = {
        "url": url,
        "text": "true"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                "https://api.supadata.ai/v1/youtube/transcript",
                headers=headers,
                params=params
            ) as response:
                if response.status != 200:
                    print(f"YouTube transcript API error: Status {response.status}")
                    error_text = await response.text()
                    return f"Error fetching transcript: {error_text}"
                result = await response.json()
                return result
    except Exception as e:
        print(f"YouTube transcript API error: {str(e)}")
        return f"Error fetching transcript: {str(e)}"


@tool
def skip_tool(skip: bool) -> str:
    """A tool that does nothing and just returns 'Continue.' You can use this tool to skip a tool call if have already gathered enough information and ready to return the final answer.
    input format: {"skip": "true"}
    """
    return "Provide the final answer if you have enough information. Do not repeatly call the skip_tool tool and stuck in a loop. Directly provide the final answer if you notice that you are stuck in a loop. Final Answer:"

# List of available tools
TOOLS = [web_search, batch_web_search, scrape_webpages, youtube_search, youtube_transcript, skip_tool]