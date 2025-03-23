import json
import glob
import os
import argparse

def extract_preloadsounds(input_dir, output_file):
    # List to hold all the sounds
    all_sounds = []

    # Use glob to find all files matching the pattern "lesson*.json" in the input directory
    pattern = os.path.join(input_dir, 'lesson*.json')
    for filename in glob.glob(pattern):
        try:
            with open(filename, 'r', encoding='utf-8') as file:
                try:
                    data = json.load(file)
                    if not isinstance(data, list):
                        print(f"Warning: {filename} does not contain a list at the top level.")
                        continue
                    for item in data:
                        if isinstance(item, dict) and item.get('type') == 'preloadsounds':
                            sounds = item.get('sounds', [])
                            if isinstance(sounds, list):
                                all_sounds.extend(sounds)
                            else:
                                print(f"Warning: 'sounds' in {filename} is not a list.")
                except json.JSONDecodeError:
                    print(f"Error: {filename} contains invalid JSON.")
        except FileNotFoundError:
            print(f"Error: {filename} not found.")
        except IOError:
            print(f"Error: Could not read {filename}.")

    # Write all sounds to the output file, one per line
    try:
        with open(output_file, 'w', encoding='utf-8') as output_file:
            for sound in all_sounds:
                output_file.write(f"{sound}\n")
    except IOError:
        print(f"Error: Could not write to {output_file}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extract preloadsounds from lesson JSON files.')
    parser.add_argument('input_dir', type=str, help='Directory containing lesson*.json files')
    parser.add_argument('output_file', type=str, help='Output file to write the sounds')

    args = parser.parse_args()

    extract_preloadsounds(args.input_dir, args.output_file)
