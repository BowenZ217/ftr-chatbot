"""
TODO: Maybe need to add authentication to routes ?
TODO: Add more error handling with data integrity checks
TODO: sanitize or escape characters to prevent injection harmful code
"""

from flask import Blueprint, jsonify, request
from app.models import db, Like, Dislike, User, Reply
from datetime import datetime, timedelta
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError

chatbot_feedback_bp = Blueprint('chatbot_feedback', __name__)


@chatbot_feedback_bp.route('/like', methods=['POST'])
def add_like():
    """
    Add liked reply to feedback.
    """
    data = request.get_json()
    reply_id = data.get("replyID", None)
    user_id = data.get("userID", None)
    
    if not reply_id or not user_id:
        return jsonify({"error": "Missing replyID or userID"}), 400
    
    new_like = Like(reply_id=reply_id, user_id=user_id)
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
    data = request.get_json()
    reply_id = data.get("replyID", None)
    user_id = data.get("userID", None)
    feedback = data.get("feedback", None)
    
    if not reply_id or not user_id or not feedback:
        return jsonify({"error": "All fields (replyID, userID, feedback) are required"}), 400
    
    new_dislike = Dislike(reply_id=reply_id, user_id=user_id, feedback=feedback)
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
    start_date_str = request.args.get('start_date', None)
    end_date_str = request.args.get('end_date', None)
    page = int(request.args.get('page', 1))
    per_page = 20

    start_date = datetime.strptime(start_date_str, '%Y-%m-%d') if start_date_str else None
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1) if end_date_str else None

    query = db.session.query(Like.ReplyID, Reply.UserInput, Reply.Content, Like.UserID, Reply.Selected).join(Reply, Reply.ReplyID == Like.ReplyID)

    if start_date:
        query = query.filter(Like.CreatedAt >= start_date)
    if end_date:
        query = query.filter(Like.CreatedAt <= end_date)

    total_count = query.count()
    max_page = (total_count + per_page - 1) // per_page
    likes = query.offset((page - 1) * per_page).limit(per_page).all()

    like_list = [{'ReplyID': like.ReplyID, 'UserInput': like.UserInput, 'Content': like.Content, 'UserID': like.UserID, 'Selected': like.Selected} for like in likes]
    return jsonify({'data': like_list, 'maxpage': max_page})

@chatbot_feedback_bp.route('/dislikes', methods=['GET'])
def get_dislikes():
    """
    Get all disliked replies. (`/api/chatbot_feedback/dislikes`)
    """
    start_date_str = request.args.get('start_date', None)
    end_date_str = request.args.get('end_date', None)
    page = int(request.args.get('page', 1))
    per_page = 20

    start_date = datetime.strptime(start_date_str, '%Y-%m-%d') if start_date_str else None
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1) if end_date_str else None

    query = db.session.query(Dislike.ReplyID, Reply.UserInput, Reply.Content, Dislike.UserID, Dislike.Feedback, Reply.Selected).join(Reply, Reply.ReplyID == Dislike.ReplyID)

    if start_date:
        query = query.filter(Dislike.CreatedAt >= start_date)
    if end_date:
        query = query.filter(Dislike.CreatedAt <= end_date)

    total_count = query.count()
    max_page = (total_count + per_page - 1) // per_page

    dislikes = query.offset((page - 1) * per_page).limit(per_page).all()
    
    dislike_list = [{'ReplyID': dislike.ReplyID, 'UserInput': dislike.UserInput, 'Content': dislike.Content, 'UserID': dislike.UserID, 'Feedback': dislike.Feedback, 'Selected': dislike.Selected} for dislike in dislikes]
    return jsonify({'data': dislike_list, 'maxpage': max_page})

@chatbot_feedback_bp.route('/selected_replies', methods=['GET'])
def get_selected_replies():
    """
    Get a paginated list of contents with Selected=True and optional date range.
    """
    start_date_str = request.args.get('start_date', None)
    end_date_str = request.args.get('end_date', None)
    page = int(request.args.get('page', 1))
    per_page = 20

    start_date = datetime.strptime(start_date_str, '%Y-%m-%d') if start_date_str else None
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d') if end_date_str else None

    query = db.session.query(Reply.UserInput, Reply.Content).filter(Reply.Selected.is_(True))

    if start_date:
        query = query.filter(Reply.CreatedAt >= start_date)
    if end_date:
        query = query.filter(Reply.CreatedAt <= end_date)

    total_count = query.count()
    max_page = (total_count + per_page - 1) // per_page
    selected_replies = query.offset((page - 1) * per_page).limit(per_page).all()

    # Format the data as a list of dictionaries
    content_list = [
        {"text_input": user_input, "output": content}
        for user_input, content in selected_replies
    ]
    return jsonify({'maxpage': max_page, 'data': content_list})

@chatbot_feedback_bp.route('/batch_update_selected', methods=['POST'])
def batch_update_selected():
    """
    Batch update the Selected status and Content for multiple replies.
    Expected input: [{ "ReplyID": <id>, "Selected": <status>, "Content": <new_content> }, ...]
    """
    data = request.get_json()

    if not data or not isinstance(data, list):
        return jsonify({'error': 'A list of ReplyID, Selected, and Content values is required'}), 400

    reply_updates = [
        (item['ReplyID'], item.get('Selected'), item.get('Content'))
        for item in data if 'ReplyID' in item
    ]

    if not reply_updates:
        return jsonify({'error': 'Valid ReplyID, Selected status, and Content values are required'}), 400

    updated_count = 0
    for reply_id, selected_status, content in reply_updates:
        reply = Reply.query.get(reply_id)
        if reply:
            if selected_status is not None:
                reply.Selected = bool(selected_status)
            if content is not None:
                reply.Content = content
            updated_count += 1

    db.session.commit()

    return jsonify({'message': 'Selected statuses and content updated successfully', 'updated_count': updated_count})

