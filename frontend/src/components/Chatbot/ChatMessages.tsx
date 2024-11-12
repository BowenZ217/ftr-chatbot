import React, { useRef, useEffect, useState } from 'react';
import ChatMessageBubble from './ChatMessageBubble';
import { IconArrowDown } from './Icons';
import styles from './ChatMessages.module.css';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
    replyID?: number;
}
interface ChatMessagesProps {
    userID: number;
    messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ userID, messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null); // Reference to the end of the message list for scrolling
    const messagesContainerRef = useRef<HTMLDivElement>(null); // Reference to the container to handle scroll events
    const [showScrollDownButton, setShowScrollDownButton] = useState(false); // State to control the visibility of the "scroll down" button

    // Automatically scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to the bottom every time the messages update
    useEffect(() => {
        scrollToBottom();
        handleScroll(); // Ensure scroll button visibility is updated after new message
    }, [messages]);

    // Detect if the user has scrolled up and show the "scroll down" button if not at the bottom
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const isNearBottom =
                container.scrollHeight - container.scrollTop <= container.clientHeight + 10; // Add 10px tolerance
            setShowScrollDownButton(!isNearBottom);
        }
    };

    return (
        <div className="relative h-full">
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className={`overflow-y-auto h-full ${styles.customScrollbar}`}
            >
                {messages.map((message, index) => (
                    <ChatMessageBubble
                        key={index}
                        userID={userID}
                        message={message}
                        isFirstMessage={message.sender === 'assistant' && index === 0}
                    />
                ))}
                <div ref={messagesEndRef} /> {/* Marker for automatic scroll to this point */}
            </div>
        
            {/* Scroll down arrow button */}
            {showScrollDownButton && (
                <button
                    onClick={scrollToBottom}
                    className={styles.scrollDownButton}
                >
                    <IconArrowDown className={styles.icon} />
                </button>
            )}
        </div>
    );
};

export default ChatMessages;
