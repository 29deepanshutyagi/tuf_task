// src/components/FlashcardsView.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import './FlashcardView.css';


const FlashcardsView: React.FC = () => {
  const [flashcards, setFlashcards] = useState<{ id: number; question: string; answer: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/flashcards');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="container">
      <h1>Flashcard Learning Tool</h1>
      {flashcards.length > 0 ? (
        <>
          <Flashcard
            question={currentFlashcard.question}
            answer={currentFlashcard.answer}
            onFlip={handleFlip}
            flipped={flipped}
          />
          <div className="buttons-container">
            <button onClick={handlePrevious} disabled={flashcards.length <= 1}>Previous</button>
            <button onClick={handleNext} disabled={flashcards.length <= 1}>Next</button>
          </div>
        </>
      ) : (
        <p>Loading flashcards...</p>
      )}
    </div>
  );
};

export default FlashcardsView;
