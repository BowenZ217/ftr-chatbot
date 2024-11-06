import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
    messages: { sender: 'user' | 'assistant'; text: string }[]; // Array of chat messages with sender type and text
    message: string; // Current message input by the user
    setMessage: React.Dispatch<React.SetStateAction<string>>; // Function to update the message state
    handleSendMessage: () => void; // Function to handle sending the current message
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, message, setMessage, handleSendMessage }) => {
    return (
        <div className="flex flex-col h-full">
            {/* Chat messages display area */}
            <div className="flex-grow overflow-y-auto p-4">
                <ChatMessages messages={messages} />
            </div>
            
            {/* Chat input area with border at the top */}
            <div className="border-t p-4">
                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default ChatInterface;
