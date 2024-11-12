import os
from dotenv import load_dotenv

class Config:
    """Base configuration with default settings."""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Default to in-memory SQLite database

class DevelopmentConfig(Config):
    """Development configuration to use local settings."""
    load_dotenv()
    dbuser = os.getenv('DB_USER', 'root')
    dbpassword = os.getenv('DB_PASSWORD', 'password')
    dbhost = os.getenv('DB_HOST', 'localhost')
    dbname = os.getenv('DB_NAME', 'flask_app')
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{dbuser}:{dbpassword}@{dbhost}/{dbname}'
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration to use production settings."""
    load_dotenv()
    dbuser = os.getenv('DB_USER', 'root')
    dbpassword = os.getenv('DB_PASSWORD', 'password')
    dbhost = os.getenv('DB_HOST', 'localhost')
    dbname = os.getenv('DB_NAME', 'flask_app')
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{dbuser}:{dbpassword}@{dbhost}/{dbname}'
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration for running tests."""
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use in-memory SQLite for tests
    TESTING = True
