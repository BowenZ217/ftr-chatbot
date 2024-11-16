import os

# --------------------------------------------------------------
# GLOBAL VARIABLES
# --------------------------------------------------------------



# --------------------------------------------------------------
# FUNCTIONS
# --------------------------------------------------------------

def load_system_instruction() -> str:
    """
    Load the system instruction for the AI model.

    :return: The system instruction for the AI model
    """
    try:
        file_path = os.getenv("SYSTEM_INSTRUCTION_PATH", "system_instruction.txt")
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read().strip()
    except FileNotFoundError:
        raise RuntimeError(f"System instruction file not found")
    except Exception as e:
        raise RuntimeError(f"Error loading system instruction: {e}")
