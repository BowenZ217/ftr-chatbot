// src/components/Chatbot/FeedbackButtons.tsx
import React, { useState } from 'react';
import { ThumbUpIcon, ThumbDownIcon } from './Icons';
import styles from './FeedbackButtons.module.css';

interface FeedbackButtonsProps {
    onLike: () => void;
    onDislike: (message: string) => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ onLike, onDislike }) => {
    const [selectedFeedback, setSelectedFeedback] = useState<'like' | 'dislike' | null>(null);
    const [showInput, setShowInput] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [thankYouMessage, setThankYouMessage] = useState(false);

    const handleLike = () => {
        setSelectedFeedback('like');
        onLike();
    };

    const handleDislike = () => {
        setSelectedFeedback('dislike');
        setShowInput(true);
    };

    const handleFeedbackSubmit = () => {
        setShowInput(false);
        setFeedbackText('');

        // Send feedback to the server
        onDislike(feedbackText);

        // Show thank you message
        setThankYouMessage(true);
        setTimeout(() => {
            setThankYouMessage(false);
        }, 3000);
    };

    return (
        <div className="flex space-x-2 mt-2">
            {selectedFeedback === null ? (
                <>
                    <button onClick={handleLike} className={styles.button}>
                        <ThumbUpIcon size={16} />
                    </button>
                    <button onClick={handleDislike} className={styles.button}>
                        <ThumbDownIcon size={16} />
                    </button>
                </>
            ) : selectedFeedback === 'like' ? (
                <button className={`${styles.button} ${styles.like}`}>
                    <ThumbUpIcon size={16} />
                </button>
            ) : (
                <>
                    <button className={`${styles.button} ${styles.dislike}`}>
                        <ThumbDownIcon size={16} />
                    </button>
                    {showInput ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                className={styles.input}
                                placeholder="Enter your feedback"
                            />
                            <button onClick={handleFeedbackSubmit} className={styles.button}>
                                Enter
                            </button>
                        </div>
                    ) : thankYouMessage && (
                        <span className={styles.thankYouMessage}>Thank you for your feedback</span>
                    )}
                </>
            )}
        </div>
    );
};

export default FeedbackButtons;
