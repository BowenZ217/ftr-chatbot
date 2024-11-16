import google.generativeai as genai
import os
from dotenv import load_dotenv
from .system_loader import load_system_instruction
from .session_manager import update_session, get_session_history
from .sports_utils import fetch_sports_data

# --------------------------------------------------------------
# GLOBAL VARIABLES
# --------------------------------------------------------------

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
MODEL = genai.GenerativeModel(
    os.environ["GEMINI_MODEL"],
    system_instruction=load_system_instruction()
)

# --------------------------------------------------------------
# FUNCTIONS
# --------------------------------------------------------------

def call_ai_model(user_message: str, session_id: str) -> str:
    """
    Call the AI model and return the response

    :param user_message: The message to be sent to the AI model
    :type user_message: str
    :param session_history: The session history to be sent to the AI model
    :type session_history: str
    :return: The response from the AI model
    """
    try:
        history = get_session_history(session_id) if session_id else []
        chat = MODEL.start_chat(history=history)
        # data_from_api = fetch_sports_data()
        # user_message = f"""
        # Based on this information: `{data_from_api}` 
        # and this question: `{user_message}` 
        # respond to the user in a friendly and informative manner.
        # """.strip()
        response = chat.send_message(user_message)
        if session_id:
            update_session(session_id, "user", user_message)
            update_session(session_id, "model", response.text)
        return response.text
    except Exception as e:
        raise RuntimeError(f"Error calling AI model: {e}")
