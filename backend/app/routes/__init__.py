from flask import Blueprint

main_bp = Blueprint('main', __name__)

from app.routes.chatbot import chatbot_bp
main_bp.register_blueprint(chatbot_bp, url_prefix='/chatbot')

from app.routes.chatbot_feedback import chatbot_feedback_bp
main_bp.register_blueprint(chatbot_feedback_bp, url_prefix='/chatbot_feedback')
