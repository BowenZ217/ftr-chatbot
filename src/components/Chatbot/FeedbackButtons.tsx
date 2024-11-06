// src/components/Chatbot/FeedbackButtons.tsx
import React, { useState } from 'react';
import { ThumbUpIcon, ThumbDownIcon } from './Icons';
import styles from './FeedbackButtons.module.css';

interface FeedbackButtonsProps {
    onLike: () => void;
    onDislike: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ onLike, onDislike }) => {
    const [selectedFeedback, setSelectedFeedback] = useState<'like' | 'dislike' | null>(null);

    const handleLike = () => {
        setSelectedFeedback('like');
        onLike();
    };

    const handleDislike = () => {
        setSelectedFeedback('dislike');
        onDislike();
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
                <button className={`${styles.button} ${styles.dislike}`}>
                    <ThumbDownIcon size={16} />
                </button>
            )}
        </div>
    );
};

export default FeedbackButtons;
