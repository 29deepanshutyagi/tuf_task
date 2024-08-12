// src/components/Flashcard.tsx

import React from 'react';
import './Flashcard.css';

interface FlashcardProps {
  question: string;
  answer: string;
  onFlip: () => void;
  flipped: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer, onFlip, flipped }) => {
  return (
    <div 
      className={`flashcard ${flipped ? 'flipped' : ''}`}
      onClick={onFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{question}</p>
        </div>
        <div className="flashcard-back">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
