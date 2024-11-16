"""
Chatbot route module
"""
from flask import Blueprint, jsonify, request
from app.models import db, Reply
from app.utils.ai_client import call_ai_model
import uuid

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get("message", None)
    session_id = data.get("session_id", None)
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    if not session_id:
        session_id = str(uuid.uuid4())

    try:
        assistant_reply = call_ai_model(user_message, session_id)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    
    # Create a new reply instance
    new_reply = Reply(content=assistant_reply, user_input=user_message)
    db.session.add(new_reply)
    try:
        db.session.commit()
        return jsonify({
            "replyID": new_reply.ReplyID,
            "reply": assistant_reply,
            "session_id": session_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
