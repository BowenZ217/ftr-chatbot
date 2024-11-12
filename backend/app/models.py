from . import db  # Import the db instance from the app package

class User(db.Model):
    __tablename__ = 'Users'
    UserID = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(255))
    UserPassword = db.Column(db.String(255))
    Role = db.Column(db.Enum('admin', 'user', 'guest'), default='user', nullable=False)
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

class Reply(db.Model):
    __tablename__ = 'Replies'
    ReplyID = db.Column(db.Integer, primary_key=True)
    Content = db.Column(db.Text)
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    Selected = db.Column(db.Boolean, default=False)

class Like(db.Model):
    __tablename__ = 'Likes'
    LikeID = db.Column(db.Integer, primary_key=True)
    ReplyID = db.Column(db.Integer, db.ForeignKey('Replies.ReplyID'), unique=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'))
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

class Dislike(db.Model):
    __tablename__ = 'Dislikes'
    DislikeID = db.Column(db.Integer, primary_key=True)
    ReplyID = db.Column(db.Integer, db.ForeignKey('Replies.ReplyID'), unique=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'))
    Feedback = db.Column(db.Text)
    CreatedAt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
