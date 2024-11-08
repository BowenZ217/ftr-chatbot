import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_secure_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
