import React, { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heritageData from '../data/heritageData.json';
import QuizCard from '../components/QuizCard';
import { getStoredUser } from '../utils/authStorage';
import './Quiz.css';

const getQuizAttemptsKey = (user) => {
  const suffix = user?.id ? String(user.id) : 'anon';
  return `heritage_quiz_attempts_${suffix}`;
};

const parseAttempts = (raw) => {
  try {
    const val = raw ? JSON.parse(raw) : [];
    if (Array.isArray(val)) return val;
    return [];
  } catch {
    return [];
  }
};

const Quiz = () => {
  const user = getStoredUser();
  const quizQuestions = heritageData.quizQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(() => Array(quizQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [attemptError, setAttemptError] = useState('');

  const [attempts, setAttempts] = useState(() => {
    const key = getQuizAttemptsKey(user);
    return parseAttempts(localStorage.getItem(key));
  });

  const currentQuestion = quizQuestions[currentIndex];
  const score = useMemo(() => {
    return quizQuestions.reduce((acc, q, i) => {
      const picked = selectedAnswers[i];
      if (picked === q.correctIndex) return acc + 1;
      return acc;
    }, 0);
  }, [quizQuestions, selectedAnswers]);

  const canSubmit = selectedAnswers.every((a) => typeof a === 'number');

  const handleSelect = (optionIndex) => {
    if (submitted) return;
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
    setAttemptError('');
  };

  const handleNext = () => {
    if (submitted) return;
    setAttemptError('');
    setCurrentIndex((i) => Math.min(i + 1, quizQuestions.length - 1));
  };

  const handlePrev = () => {
    if (submitted) return;
    setAttemptError('');
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleSubmit = () => {
    setAttemptError('');
    if (!canSubmit) {
      setAttemptError('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);

    const payload = {
      id: Date.now(),
      userId: user?.id || 'anon',
      score,
      total: quizQuestions.length,
      date: new Date().toISOString(),
      answers: selectedAnswers
    };

    const key = getQuizAttemptsKey(user);
    const nextAttempts = [...attempts, payload];
    setAttempts(nextAttempts);
    localStorage.setItem(key, JSON.stringify(nextAttempts));
  };

  const handleRetake = () => {
    setSubmitted(false);
    setAttemptError('');
    setCurrentIndex(0);
    setSelectedAnswers(Array(quizQuestions.length).fill(null));
  };

  return (
    <div className="page-wrapper bg-gradient-main">
      <Navbar />

      <main className="main-content quiz-main fade-in">
        <div className="container">
          <header className="quiz-header">
            <h1 className="page-title">Heritage Quiz</h1>
            <p className="text-secondary">
              Choose the correct answer. Submit to see your score and explanations.
            </p>
          </header>

          {!submitted ? (
            <>
              <QuizCard
                questionIndex={currentIndex}
                totalQuestions={quizQuestions.length}
                question={currentQuestion.question}
                options={currentQuestion.options}
                selectedIndex={selectedAnswers[currentIndex]}
                onSelect={handleSelect}
                disabled={submitted}
              />

              {attemptError ? <div className="field-error">{attemptError}</div> : null}

              <div className="quiz-nav">
                <button type="button" className="btn btn-light" onClick={handlePrev} disabled={currentIndex === 0}>
                  Previous
                </button>

                {currentIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-gradient"
                    onClick={handleNext}
                    disabled={typeof selectedAnswers[currentIndex] !== 'number'}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-gradient"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </>
          ) : (
            <section className="quiz-result">
              <div className="quiz-result-card glass-card">
                <h2 className="quiz-result-title">Your Score</h2>
                <div className="score-big">
                  {score} / {quizQuestions.length}
                </div>
                <p className="text-secondary">Review explanations below.</p>

                <div className="quiz-review-grid">
                  {quizQuestions.map((q, i) => {
                    const picked = selectedAnswers[i];
                    const correct = picked === q.correctIndex;
                    return (
                      <article key={q.id} className={`review-item ${correct ? 'correct' : 'wrong'}`}>
                        <div className="review-q">{i + 1}. {q.question}</div>
                        <div className="review-ans">
                          Your answer: <b>{typeof picked === 'number' ? q.options[picked] : '—'}</b>
                        </div>
                        <div className="review-ans">
                          Correct: <b>{q.options[q.correctIndex]}</b>
                        </div>
                        <div className="review-expl text-secondary">{q.explanation}</div>
                      </article>
                    );
                  })}
                </div>

                <div className="quiz-actions">
                  <button type="button" className="btn btn-light" onClick={handleRetake}>
                    Retake Quiz
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Back to Top
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;

