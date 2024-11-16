from collections import defaultdict

# --------------------------------------------------------------
# GLOBAL VARIABLES
# --------------------------------------------------------------

SESSION_HISTORY = defaultdict(list)

# ---------------------------------------------------------
# Session management
# ---------------------------------------------------------

def update_session(session_id: str, role: str, message: str) -> None:
    """
    Update the session history for a given session ID.

    :param session_id: The unique session ID
    :param role: The role of the message ('user' or 'model')
    :param message: The message content
    """
    SESSION_HISTORY[session_id].append({"role": role, "parts": message})
    # Keep only the last 8 messages
    SESSION_HISTORY[session_id] = SESSION_HISTORY[session_id][-8:]
    return None

def get_session_history(session_id) -> list:
    """
    Retrieve the session history for a given session ID.

    :param session_id: The unique session ID
    :return: The session history
    """
    return SESSION_HISTORY[session_id]
