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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollDownButton, setShowScrollDownButton] = useState(false);
    const [renderedMessages, setRenderedMessages] = useState<Message[]>([]);
    const lastMessageRef = useRef<Message | null>(null);

    // Automatically scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Render messages one by one
    useEffect(() => {
        const renderMessages = async () => {
            const newMessages: Message[] = [...renderedMessages];

            const lastMessage = messages[messages.length - 1];
            const prevLastMessage = lastMessageRef.current;

            // Animate the assistant's typing effect
            if (
                lastMessage &&
                lastMessage.sender === 'assistant' &&
                (!prevLastMessage || lastMessage.replyID !== prevLastMessage.replyID)
            ) {
                let currentText = '';
                for (let i = 0; i <= lastMessage.text.length; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 20)); // delay 20 ms
                    currentText = lastMessage.text.slice(0, i);
                    const tempMessage = { ...lastMessage, text: currentText };
                    setRenderedMessages([...newMessages, tempMessage]);
                }
                newMessages.push(lastMessage);
            } else {
                newMessages.push(lastMessage);
                setRenderedMessages(newMessages);
            }

            lastMessageRef.current = lastMessage;
        };

        renderMessages();
    }, [messages]);

    // Scroll to the bottom every time the messages update
    useEffect(() => {
        scrollToBottom();
        handleScroll(); // Ensure scroll button visibility is updated after new message
    }, [renderedMessages]);

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
                {renderedMessages.map((message, index) => (
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
