"""
Chatbot route module
"""
from flask import Blueprint, jsonify, request
from app.models import db, Reply

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    assistant_reply = f"Response to: {user_message}"
    
    # Create a new reply instance
    new_reply = Reply(Content=assistant_reply)
    db.session.add(new_reply)
    try:
        db.session.commit()
        return jsonify({"replyID": new_reply.ReplyID, "reply": assistant_reply}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
