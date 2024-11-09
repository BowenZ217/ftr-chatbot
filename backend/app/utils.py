
import json
from pathlib import Path

DATA_FILE = Path("data.json")

def read_data():
    """
    read data from JSON file
    """
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"likes": [], "dislikes": []}

def write_data(data):
    """
    write data to JSON file
    """
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)
