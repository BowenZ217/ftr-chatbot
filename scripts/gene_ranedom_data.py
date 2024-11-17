import random
import string
import datetime

REPLY_START_IDX = 1
TOTAL_REPLIES = 60

# Generate random text
def random_text(length=20):
    return ''.join(random.choices(string.ascii_letters + string.digits + ' ', k=length))

# Generate SQL for inserting Replies, Likes, and Dislikes
replies_sql = []
likes_sql = []
dislikes_sql = []

for i in range(TOTAL_REPLIES):
    content = random_text(50)
    user_input = random_text(20)
    replies_sql.append(f"INSERT INTO Replies (UserInput, Content) VALUES ('{user_input}', '{content}');")

user_ids = [1, 2, 3]
reply_ids = list(range(REPLY_START_IDX, REPLY_START_IDX + TOTAL_REPLIES))

for i, reply_id in enumerate(reply_ids):
    user_id_like = user_ids[i % len(user_ids)]  # Rotate user IDs for likes
    user_id_dislike = user_ids[(i + 1) % len(user_ids)]  # Rotate user IDs for dislikes

    if random.random() < 0.5 and len(likes_sql) < 30:
        # Add like entry
        likes_sql.append(f"INSERT INTO Likes (ReplyID, UserID) VALUES ({reply_id}, {user_id_like});")
    else:
        # Add dislike entry with random feedback
        dislike_feedback = random_text(30)
        dislikes_sql.append(f"INSERT INTO Dislikes (ReplyID, UserID, Feedback) VALUES ({reply_id}, {user_id_dislike}, '{dislike_feedback}');")


# Combine all SQL statements
all_sql = replies_sql + likes_sql + dislikes_sql

# Write to file
with open('random_data.sql', 'w') as f:
    f.write('\n'.join(all_sql))
