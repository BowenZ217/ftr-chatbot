
CREATE DATABASE IF NOT EXISTS ftrchatbotdb;
USE ftrchatbotdb;

DROP TABLE IF EXISTS `Likes`;
DROP TABLE IF EXISTS `Dislikes`;
DROP TABLE IF EXISTS `Replies`;
DROP TABLE IF EXISTS `Users`;

-- User Info Table (save password here since it's just a demo)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    UserPassword VARCHAR(255),
    Role ENUM('admin', 'user', 'guest') NOT NULL DEFAULT 'user',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Replies (
    ReplyID INT AUTO_INCREMENT PRIMARY KEY,
    UserInput TEXT,
    Content TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Selected TINYINT(1) DEFAULT 0
);

CREATE TABLE Likes (
    LikeID INT AUTO_INCREMENT PRIMARY KEY,
    ReplyID INT UNIQUE,
    UserID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReplyID) REFERENCES Replies(ReplyID)
        ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
);

CREATE TABLE Dislikes (
    DislikeID INT AUTO_INCREMENT PRIMARY KEY,
    ReplyID INT UNIQUE,
    UserID INT,
    Feedback TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReplyID) REFERENCES Replies(ReplyID)
        ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
);


-- Insert some data
INSERT INTO Users (Username, Email, UserPassword, Role)
VALUES ('ftr-admin', 'ftradmin@test.com', 'ftradmin', 'admin');
-- it should be hashed in real world scenario, such as bcrypt
-- VALUES ('ftr-admin', 'ftradmin@test.com', SHA2('ftradmin', 256), 'admin');
