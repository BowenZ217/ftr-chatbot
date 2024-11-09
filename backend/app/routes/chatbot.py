"""
Chatbot route module
"""
from flask import Blueprint, jsonify, request

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get("message")

    assistant_reply = f"Response to: {user_message}"

    return jsonify({"reply": assistant_reply})
