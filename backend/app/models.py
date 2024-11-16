from . import db  # Import the db instance from the app package

class User(db.Model):
    __tablename__ = 'Users'
    UserID = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(255))
    UserPassword = db.Column(db.String(255))
    Role = db.Column(db.Enum('admin', 'user', 'guest'), default='user', nullable=False)
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def __init__(self, username=None, email=None, user_password=None, role='user'):
        if username:
            self.Username = username
        if email:
            self.Email = email
        if user_password:
            self.UserPassword = user_password

class Reply(db.Model):
    __tablename__ = 'Replies'
    ReplyID = db.Column(db.Integer, primary_key=True)
    UserInput = db.Column(db.Text)
    Content = db.Column(db.Text)
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    Selected = db.Column(db.Boolean, default=False)

    def __init__(self, content=None, user_input=None):
        if content:
            self.Content = content
        if user_input:
            self.UserInput = user_input

class Like(db.Model):
    __tablename__ = 'Likes'
    LikeID = db.Column(db.Integer, primary_key=True)
    ReplyID = db.Column(db.Integer, db.ForeignKey('Replies.ReplyID'), unique=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'))
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def __init__(self, reply_id=None, user_id=None):
        if reply_id:
            self.ReplyID = reply_id
        if user_id:
            self.UserID = user_id

class Dislike(db.Model):
    __tablename__ = 'Dislikes'
    DislikeID = db.Column(db.Integer, primary_key=True)
    ReplyID = db.Column(db.Integer, db.ForeignKey('Replies.ReplyID'), unique=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'))
    Feedback = db.Column(db.Text)
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def __init__(self, reply_id=None, user_id=None, feedback=None):
        if reply_id:
            self.ReplyID = reply_id
        if user_id:
            self.UserID = user_id
        if feedback:
            self.Feedback = feedback
