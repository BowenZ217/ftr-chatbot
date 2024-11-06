import React, { useRef } from 'react';

interface ChatInputProps {
    message: string; // Current text in the message input
    setMessage: React.Dispatch<React.SetStateAction<string>>; // Function to update the message state
    onSendMessage: () => void; // Function to handle sending the message
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, onSendMessage }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Automatically adjusts the height of the text area based on content
    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`; // Set max height limit
        }
    };

    // Handles sending the message and resetting the input height
    const handleSendMessage = () => {
        onSendMessage();
        if (textareaRef.current) {
            textareaRef.current.style.height = '40px'; // Reset height after sending
        }
    };

    // Sends message when Enter key is pressed, prevents newline if Shift is not held
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex items-center">
            {/* Text input area */}
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                    handleInput(); // Adjust height on input
                }}
                onInput={handleInput}
                onKeyDown={handleKeyDown} // Keydown event listener
                rows={1}
                className="flex-grow border border-gray-300 rounded px-4 py-2 mr-2 resize-none overflow-y-auto"
                placeholder="Type your message..."
                style={{ minHeight: '40px', maxHeight: '100px' }}
            />
            {/* Send button */}
            <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
            </button>
        </div>
    );
};

export default ChatInput;
