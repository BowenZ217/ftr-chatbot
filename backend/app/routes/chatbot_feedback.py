"""
TODO: replace to database such as SQLite or PostgreSQL
TODO: Maybe need to add authentication to routes ?
TODO: Add more error handling with data integrity checks
TODO: sanitize or escape characters to prevent injection harmful code
"""

from flask import Blueprint, jsonify, request
from app.models import db, Like, Dislike, User, Reply
from sqlalchemy.exc import IntegrityError

chatbot_feedback_bp = Blueprint('chatbot_feedback', __name__)


@chatbot_feedback_bp.route('/like', methods=['POST'])
def add_like():
    """
    Add liked reply to feedback.
    """
    reply_id = request.json.get("replyID", None)
    user_id = request.json.get("userID", None)
    
    if not reply_id or not user_id:
        return jsonify({"error": "Missing replyID or userID"}), 400
    
    new_like = Like(ReplyID=reply_id, UserID=user_id)
    try:
        db.session.add(new_like)
        
        reply = Reply.query.get(reply_id)
        if reply:
            reply.Selected = True
        else:
            return jsonify({"error": "Reply not found"}), 404

        db.session.commit()
        return jsonify({"message": "Reply liked successfully!"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Invalid or duplicate reply"}), 400

@chatbot_feedback_bp.route('/dislike', methods=['POST'])
def add_dislike():
    """
    Add disliked reply to feedback.
    """
    reply_id = request.json.get("replyID", None)
    user_id = request.json.get("userID", None)
    feedback = request.json.get("feedback", None)
    
    if not reply_id or not user_id or not feedback:
        return jsonify({"error": "All fields (replyID, userID, feedback) are required"}), 400
    
    new_dislike = Dislike(ReplyID=reply_id, UserID=user_id, Feedback=feedback)
    try:
        db.session.add(new_dislike)
        db.session.commit()
        return jsonify({"message": "Reply disliked successfully!"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Error handling dislike"}), 400

@chatbot_feedback_bp.route('/likes', methods=['GET'])
def get_likes():
    """
    Get all liked replies. (`/api/chatbot_feedback/likes`)
    """
    # Joining the Likes table with the Replies table
    likes = db.session.query(Like.ReplyID, Reply.Content, Like.UserID).\
        join(Reply, Reply.ReplyID == Like.ReplyID).all()
    like_list = [{'ReplyID': like.ReplyID, 'Content': like.Content, 'UserID': like.UserID} for like in likes]
    return jsonify(like_list)

@chatbot_feedback_bp.route('/dislikes', methods=['GET'])
def get_dislikes():
    """
    Get all disliked replies. (`/api/chatbot_feedback/dislikes`)
    """
    # Joining the Dislikes table with the Replies table
    dislikes = db.session.query(Dislike.ReplyID, Reply.Content, Dislike.UserID, Dislike.Feedback).\
        join(Reply, Reply.ReplyID == Dislike.ReplyID).all()
    dislike_list = [{'ReplyID': dislike.ReplyID, 'Content': dislike.Content, 'UserID': dislike.UserID, 'Feedback': dislike.Feedback} for dislike in dislikes]
    return jsonify(dislike_list)
