// src/components/Chatbot/ChatHistorySidebar.tsx
import React from 'react';

interface ChatHistorySidebarProps {
    history: string[];
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ history }) => {
    return (
        <div className="p-4 h-full">
            <h2 className="text-xl font-semibold mb-4">Chat History</h2>
            <ul className="space-y-2">
                {history.map((conversation, index) => (
                    <li key={index} className="p-2 bg-gray-200 rounded cursor-pointer">
                        {conversation}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHistorySidebar;
