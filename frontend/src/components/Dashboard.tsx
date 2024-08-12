// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Popup component
const Popup: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [flashcards, setFlashcards] = useState<{ id: number; question: string; answer: string; isEditing?: boolean }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('https://tuf-task-43ao.onrender.com/flashcards');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleAdd = async () => {
    console.log('Question:', question);
    console.log('Answer:', answer);
    if (!question.trim() || !answer.trim()) {
      console.log('Setting popup message');
      setPopupMessage('Please fill out both the question and answer fields.');
      return;
    }

    try {
      await axios.post('https://tuf-task-43ao.onrender.com/flashcards', { question, answer });
      setQuestion('');
      setAnswer('');
      fetchFlashcards();
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://tuf-task-43ao.onrender.com/flashcards/${id}`);
      fetchFlashcards();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const toggleEditMode = (id: number) => {
    setFlashcards(flashcards.map(fc =>
      fc.id === id ? { ...fc, isEditing: !fc.isEditing } : fc
    ));
  };

  const handleEditChange = (id: number, field: 'question' | 'answer', value: string) => {
    setFlashcards(flashcards.map(fc =>
      fc.id === id ? { ...fc, [field]: value } : fc
    ));
  };

  const handleSaveEdit = async (id: number) => {
    const flashcard = flashcards.find(fc => fc.id === id);
    if (flashcard) {
      try {
        await axios.put(`https://tuf-task-43ao.onrender.com/flashcards/${id}`, { question: flashcard.question, answer: flashcard.answer });
        toggleEditMode(id);
        fetchFlashcards();
      } catch (error) {
        console.error('Error editing flashcard:', error);
      }
    }
  };

  // Filter flashcards based on search term
  const filteredFlashcards = flashcards.filter(fc =>
    fc.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Flashcard Dashboard</h2>
      <div className="add-flashcard-form">
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={!question.trim() || !answer.trim()}
        >
          Add Flashcard
        </button>
      </div>
      <div className="flashcards-section">
        <div className="flashcards-header">
          <h3>Existing Flashcards</h3>
          <input
            type="text"
            placeholder="Search by question"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul>
          {filteredFlashcards.length > 0 ? (
            filteredFlashcards.map((fc) => (
              <li key={fc.id}>
                {fc.isEditing ? (
                  <>
                    <input
                      type="text"
                      value={fc.question}
                      onChange={(e) => handleEditChange(fc.id, 'question', e.target.value)}
                    />
                    <input
                      type="text"
                      value={fc.answer}
                      onChange={(e) => handleEditChange(fc.id, 'answer', e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(fc.id)}>Save</button>
                    <button onClick={() => toggleEditMode(fc.id)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p><strong>Question:</strong> {fc.question}</p>
                    <p><strong>Answer:</strong> {fc.answer}</p>
                    <button onClick={() => toggleEditMode(fc.id)}>Edit</button>
                    <button onClick={() => handleDelete(fc.id)}>Delete</button>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>No flashcards found.</p>
          )}
        </ul>
      </div>

      {/* Render Popup if there is a message */}
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </div>
  );
};

export default Dashboard;
