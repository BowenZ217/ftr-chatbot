import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';
import FeedbackButtons from './FeedbackButtons';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
    replyID?: number;
}

interface ChatMessageBubbleProps {
    userID: number;
    message: Message;
    isFirstMessage?: boolean;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ userID, message, isFirstMessage = false }) => {
    const handleLike = async () => {
        if (message.replyID === undefined) {
            console.error("Cannot like a message without a replyID.");
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8080/api/chatbot_feedback/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ replyID: message.replyID, userID: userID }),
            });

            if (response.ok) {
                console.log('Message liked successfully!');
            } else {
                console.error('Failed to like message:', await response.json());
            }
        } catch (error) {
            console.error('Error liking message:', error);
        }
    };

    const handleDislike = async (feedback: string) => {
        if (message.replyID === undefined) {
            console.error("Cannot dislike a message without a replyID.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/chatbot_feedback/dislike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ replyID: message.replyID, userID: userID, feedback }),
            });

            if (response.ok) {
                console.log('Message disliked successfully!');
            } else {
                console.error('Failed to dislike message:', await response.json());
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
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                    {message.text}
                </ReactMarkdown>
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
