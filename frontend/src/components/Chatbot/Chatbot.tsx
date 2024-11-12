"use client";

import React, { useState } from 'react';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatInterface from './ChatInterface';
import styles from './Chatbot.module.css';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
    replyID?: number;  // Optional field to store the reply ID from the server
}

const Chatbot: React.FC = () => {
    const [chatHistory, setChatHistory] = useState([
        'Conversation 1',
        'Conversation 2',
        'Conversation 3',
    ]);

    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'assistant',
            text: 'Hi! Welcome to the FANTASY TRADING ROOM! How can I assist you today?',
        },
    ]);
    const [message, setMessage] = useState('');
    const [userID, setUserID] = useState(1);

    const handleSendMessage = async () => {
        if (message.trim()) {
            const newMessage: Message = { sender: 'user', text: message };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
    
            try {
                const response = await fetch('http://localhost:8080/api/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });
    
                const data = await response.json();
                const assistantMessage: Message = {
                    sender: 'assistant',
                    text: data.reply,
                    replyID: data.replyID  // Include the replyID if provided by the server
                };
                setMessages((prevMessages) => [...prevMessages, assistantMessage]);
                setMessage('');
            } catch (error) {
                console.error('Error fetching response:', error);
            }
        }
    };

    return (
        <div className={`${styles.container} flex`}>
            {/* Left Sidebar */}
            <div className={`${styles.sidebar} w-2/12`}>
                <ChatHistorySidebar history={chatHistory} />
            </div>

            {/* Main Chat Interface */}
            <div className={`${styles.chatInterface} w-10/12 flex flex-col`}>
                <ChatInterface
                    userID={userID}
                    message={message}
                    messages={messages}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default Chatbot;
