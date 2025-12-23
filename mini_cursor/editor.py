import sys
import os
import argparse
import difflib
from ai_engine import MockLLM

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def show_diff(original, modified):
    print("\n" + "="*30 + " DIFF VIEW " + "="*30)
    diff = difflib.unified_diff(
        original.splitlines(keepends=True),
        modified.splitlines(keepends=True),
        fromfile='Original',
        tofile='AI_Generated'
    )
    
    diff_text = "".join(list(diff))
    if not diff_text:
        print("No changes detected.")
    else:
        # Simple coloring for terminal
        GREEN = '\033[92m'
        RED = '\033[91m'
        RESET = '\033[0m'
        
        for line in diff_text.splitlines():
            if line.startswith('+'):
                print(f"{GREEN}{line}{RESET}")
            elif line.startswith('-'):
                print(f"{RED}{line}{RESET}")
            else:
                print(line)
    print("="*71 + "\n")

def main():
    parser = argparse.ArgumentParser(description="Mini-Cursor: AI-Assisted Code Editor CLI")
    parser.add_argument("file", help="Path to the file to edit")
    parser.add_argument("-m", "--message", required=True, help="Instruction for the AI (e.g., 'add docstrings')")
    parser.add_argument("--dry-run", action="store_true", help="Show diff but do not write changes")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"Error: File '{args.file}' not found.")
        sys.exit(1)

    # 1. Read Context
    original_code = read_file(args.file)
    print(f"Loaded {args.file}...")

    # 2. Call AI
    llm = MockLLM()
    modified_code = llm.generate_edit(original_code, args.message)

    # 3. Show Diff
    show_diff(original_code, modified_code)

    # 4. Apply Changes
    if not args.dry_run:
        # In a real TUI, we would ask for confirmation here. 
        # For this CLI script, we assume 'dry-run' is the safety mechanism.
        write_file(args.file, modified_code)
        print(f"Successfully applied changes to {args.file}")
    else:
        print("Dry run: No changes written.")

if __name__ == "__main__":
    main()
