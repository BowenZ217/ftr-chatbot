import os
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.DevelopmentConfig')
    CORS(app)

    from app.routes import main_bp
    app.register_blueprint(main_bp, url_prefix='/api')

    return app
