from pathlib import Path


def inspect_folder(folder_path):
    root = Path(folder_path).resolve()
    if not root.exists():
        print("Path does not exist.")
        return

    # Folders you want to completely skip
    IGNORE_FOLDERS = {".venv", "venv", "node_modules", ".git", "__pycache__"}

    # 1. Handle files sitting directly in the root folder
    root_files = [f for f in root.iterdir() if f.is_file()]
    print(f"\n[Folder] {root} ({len(root_files)} files in root)")
    for file in root_files:
        print(f"   ├── {file.name}")

    # 2. Walk through all subdirectories
    for path in root.rglob("*"):
        if path.is_dir():
            # Skip if any part of the path contains an ignored folder name
            if any(part in IGNORE_FOLDERS for part in path.parts):
                continue

            # Count only the files directly inside this specific subfolder
            files_in_dir = [f for f in path.iterdir() if f.is_file()]
            print(f"\n[Folder] {path} ({len(files_in_dir)} files)")
            for file in files_in_dir:
                print(f"   ├── {file.name}")


# Run the inspector
inspect_folder("./server")
