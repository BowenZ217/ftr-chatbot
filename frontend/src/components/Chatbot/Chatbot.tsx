"use client";

import React, { useState, useEffect } from 'react';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatInterface from './ChatInterface';
import styles from './Chatbot.module.css';

type User = {
    userId: number;
    username: string;
    email: string;
    role: string;
}

interface ChatbotProps {
    user: User | null;
}

interface Message {
    sender: 'user' | 'assistant';
    text: string;
    replyID?: number;  // Optional field to store the reply ID from the server
}

const Chatbot: React.FC<ChatbotProps> = ({ user }) => {
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
    const [sessionID, setSessionID] = useState<string | null>(null);

    useEffect(() => {
        // On component mount, check if session_id exists in localStorage
        const storedSessionID = localStorage.getItem('session_id');
        if (storedSessionID) {
            setSessionID(storedSessionID);
        }
    }, []);

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
                    body: JSON.stringify({ 
                        message, 
                        session_id: sessionID
                    }),
                });
    
                const data = await response.json();

                if (!sessionID && data.session_id) {
                    setSessionID(data.session_id);
                    localStorage.setItem('session_id', data.session_id);
                }

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
                    userID={user?.userId || 2}
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
