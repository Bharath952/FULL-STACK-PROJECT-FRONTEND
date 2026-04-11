import React from 'react';
import './QuizCard.css';

const QuizCard = ({
  questionIndex,
  totalQuestions,
  question,
  options,
  selectedIndex,
  onSelect,
  disabled
}) => {
  return (
    <section className={`quiz-card shadow-card fade-in ${disabled ? 'disabled' : ''}`}>
      <header className="quiz-card-header">
        <div className="quiz-progress">
          Question {questionIndex + 1} of {totalQuestions}
        </div>
        <h3 className="quiz-question">{question}</h3>
      </header>

      <div className="quiz-options" role="list">
        {options.map((opt, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={opt}
              type="button"
              className={`quiz-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(idx)}
              disabled={disabled}
              aria-pressed={isSelected}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuizCard;

