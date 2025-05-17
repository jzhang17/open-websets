import os
import re

def cleanup_enterprise_docs(directory):
    """
    Scans a directory for AG Grid Markdown documentation files and deletes
    those identified as Enterprise-specific.

    Enterprise-specific files are identified by an H1 heading followed
    within a few lines by a standalone "Enterprise" tag.
    """
    
    # Regex to find an H1 heading followed by "Enterprise" tag within a few lines.
    # - ^# .*                        : Line starting with # (H1 heading).
    # - (?:.{0,150}\n){0,7}          : 0 to 7 subsequent lines, each up to 150 chars 
    #                                  (allows for images, short text, newlines).
    # - ^\s*[Ee][Nn][Tt][Ee][Rr][Pp][Rr][Ii][Ss][Ee]\s*$ : Line with only "Enterprise".
    enterprise_tag_pattern = re.compile(
        r"^# .*\n(?:.{0,150}\n){0,7}^\s*(?:[Ee][Nn][Tt][Ee][Rr][Pp][Rr][Ii][Ss][Ee])\s*$",
        re.MULTILINE | re.IGNORECASE
    )
    
    skipped_file = "react-data-grid-community-vs-enterprise.md"
    deleted_files_count = 0
    processed_files_count = 0
    
    print(f"Starting cleanup in directory: {directory}")
    
    if not os.path.isdir(directory):
        print(f"Error: Directory not found - {directory}")
        return

    for filename in os.listdir(directory):
        if filename.endswith(".md"):
            processed_files_count += 1
            if filename == skipped_file:
                print(f"Skipping (comparison file): {filename}")
                continue
                
            filepath = os.path.join(directory, filename)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                match = enterprise_tag_pattern.search(content)
                
                if match:
                    try:
                        os.remove(filepath)
                        print(f"DELETED (Enterprise tag found): {filename}")
                        deleted_files_count += 1
                    except OSError as e:
                        print(f"Error deleting file {filename}: {e}")
                # else:
                #     print(f"Kept (no Enterprise tag pattern): {filename}") # Uncomment for verbose logging
            except Exception as e:
                print(f"Error processing file {filename}: {e}")
                
    print(f"\nCleanup complete.")
    print(f"Processed {processed_files_count} markdown files.")
    print(f"Deleted {deleted_files_count} Enterprise-specific files.")

if __name__ == "__main__":
    # Ensure this path points to your AG Grid documentation folder
    docs_directory = "/Users/jarviszhang/open-websets/documentations/aggrid_docs"
    
    # Safety check: Ask user to confirm the directory if it's a critical operation.
    # For this automated context, we'll proceed. Consider adding user confirmation
    # if running this script manually outside of this interactive session.
    
    cleanup_enterprise_docs(docs_directory) 