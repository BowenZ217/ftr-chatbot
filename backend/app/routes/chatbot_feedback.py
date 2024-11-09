"""
TODO: replace to database such as SQLite or PostgreSQL
"""

from flask import Blueprint, jsonify, request
from app.utils import read_data, write_data

chatbot_feedback_bp = Blueprint('chatbot_feedback', __name__)

@chatbot_feedback_bp.route('/like', methods=['POST'])
def add_like():
    """
    add liked reply to feedback
    """
    data = read_data()
    reply = request.json.get("reply", {}).get("text", "")
    
    if reply and reply not in data["likes"]:
        data["likes"].append(reply)
        write_data(data)
        return jsonify({"message": "Reply liked successfully!"}), 201
    else:
        return jsonify({"error": "Invalid or duplicate reply"}), 400

@chatbot_feedback_bp.route('/dislike', methods=['POST'])
def add_dislike():
    """
    add disliked reply to feedback
    """
    data = read_data()
    reply = request.json.get("reply", {}).get("text", "")
    feedback = request.json.get("feedback")

    if reply and feedback:
        dislike_entry = {"reply": reply, "feedback": feedback}
        data["dislikes"].append(dislike_entry)
        write_data(data)
        return jsonify({"message": "Reply disliked successfully!"}), 201
    else:
        return jsonify({"error": "Reply and feedback required"}), 400

@chatbot_feedback_bp.route('/likes', methods=['GET'])
def get_likes():
    """
    get all liked replies and feedback
    """
    data = read_data()
    return jsonify(data["likes"])

@chatbot_feedback_bp.route('/dislikes', methods=['GET'])
def get_dislikes():
    """
    get all disliked replies and feedback
    """
    data = read_data()
    return jsonify(data["dislikes"])
