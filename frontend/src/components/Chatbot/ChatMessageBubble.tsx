import React from 'react';
import Image from 'next/image';
import FeedbackButtons from './FeedbackButtons';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
}

interface ChatMessageBubbleProps {
    message: Message;
    isFirstMessage?: boolean;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, isFirstMessage = false }) => {
    const handleLike = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/chatbot_feedback/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reply: message }),
            });

            if (response.ok) {
                console.log('Message liked successfully!');
            } else {
                console.error('Failed to like message');
            }
        } catch (error) {
            console.error('Error liking message:', error);
        }
    };

    const handleDislike = async (feedback: string) => {
        try {
            const response = await fetch('http://localhost:8080/api/chatbot_feedback/dislike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reply: message, feedback }),
            });

            if (response.ok) {
                console.log('Message disliked successfully!');
            } else {
                console.error('Failed to dislike message');
            }
        } catch (error) {
            console.error('Error disliking message:', error);
        }
    };

    return (
        <div
            className={`flex items-end mb-4 space-x-2 ${
                message.sender === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
        >
            {message.sender === 'assistant' && (
                <Image
                    src="/ftr-logo.avif"
                    alt="Assistant Avatar"
                    width={35}
                    height={35}
                    className="rounded-full mr-2"
                    style={{ width: "auto" }}
                />
            )}
            
            {/* message bubble */}
            <div
                className={`p-4 rounded-xl max-w-[70%] break-words ${
                    message.sender === 'assistant'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-blue-500 text-white'
                } shadow-md`}
            >
                {message.text}
            </div>

            {/* FeedbackButtons are only shown for assistant messages */}
            {message.sender === 'assistant' && !isFirstMessage && (
                <div className="flex items-center">
                    <FeedbackButtons onLike={handleLike} onDislike={handleDislike} />
                </div>
            )}
        </div>
    );
};

export default ChatMessageBubble;
