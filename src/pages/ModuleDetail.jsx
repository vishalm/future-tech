import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { modules } from '../data/content';

export default function ModuleDetail({ completeModule, addXP, completeQuiz, tracking }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const mod = modules.find(m => m.id === id);

  const [currentSection, setCurrentSection] = useState(0);
  const [showFunFact, setShowFunFact] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStartTime] = useState(Date.now());

  useEffect(() => {
    tracking.trackModuleStart(id);
  }, [id]);

  if (!mod) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h1>Module not found! 🤔</h1>
        <button onClick={() => navigate('/modules')}>Go Back</button>
      </div>
    );
  }

  const section = mod.sections[currentSection];
  const quiz = mod.quiz;
  const currentQuestion = quiz?.[quizIndex];

  const handleNext = () => {
    if (currentSection < mod.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setShowFunFact(false);
    } else {
      // Module reading complete, start quiz
      setQuizMode(true);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setShowFunFact(false);
    }
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    const correct = index === currentQuestion.correct;
    if (correct) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#39ff14', '#00f0ff'],
      });
    }

    tracking.trackQuizAnswer(id, quizIndex, correct, (Date.now() - quizStartTime) / 1000);
  };

  const handleNextQuestion = () => {
    if (quizIndex < quiz.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete!
      const timeTaken = (Date.now() - quizStartTime) / 1000;
      const finalScore = score + (selectedAnswer === currentQuestion.correct ? 0 : 0); // already counted
      setQuizComplete(true);
      completeModule(mod.id);
      addXP(mod.xpReward);
      completeQuiz(mod.id, score, quiz.length, timeTaken);
      tracking.trackModuleComplete(mod.id, mod.xpReward);
      tracking.trackQuizComplete(mod.id, score, quiz.length, timeTaken);

      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#00f0ff', '#ff00e5', '#39ff14', '#ffe600', '#b026ff'],
      });
    }
  };

  // Quiz Complete Screen
  if (quizComplete) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 40px',
      }}>
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          style={{
            background: 'rgba(18, 18, 42, 0.9)',
            border: '2px solid #39ff14',
            borderRadius: 30,
            padding: 48,
            textAlign: 'center',
            maxWidth: 500,
            width: '100%',
            boxShadow: '0 0 40px rgba(57, 255, 20, 0.2)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: 80 }}
          >
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '⭐' : '💪'}
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 16,
            color: '#ffe600',
            margin: '20px 0 10px',
          }}>
            MODULE COMPLETE!
          </h1>

          <h2 style={{ fontSize: 24, marginBottom: 20 }}>
            {mod.emoji} {mod.title}
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            marginBottom: 30,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: percentage >= 80 ? '#39ff14' : percentage >= 50 ? '#ffe600' : '#ff00e5',
              }}>
                {score}/{quiz.length}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Correct</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#00f0ff' }}>
                +{mod.xpReward}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>XP Earned</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <motion.button
              onClick={() => navigate('/modules')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                fontSize: 16,
                fontFamily: 'var(--font-main)',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                border: 'none',
                borderRadius: 12,
                color: '#000',
                cursor: 'pointer',
              }}
            >
              📚 More Modules
            </motion.button>
            <motion.button
              onClick={() => navigate('/achievements')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                fontSize: 16,
                fontFamily: 'var(--font-main)',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #f6d365, #fda085)',
                border: 'none',
                borderRadius: 12,
                color: '#000',
                cursor: 'pointer',
              }}
            >
              🏆 Trophies
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz Mode
  if (quizMode) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 40px',
      }}>
        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'rgba(18, 18, 42, 0.9)',
            border: `2px solid ${mod.color}44`,
            borderRadius: 30,
            padding: 40,
            maxWidth: 600,
            width: '100%',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Quiz Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 30,
          }}>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 10,
              color: mod.color,
            }}>
              QUIZ TIME! ⚡
            </span>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
            }}>
              {quizIndex + 1} / {quiz.length}
            </span>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {quiz.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: i < quizIndex ? '#39ff14'
                    : i === quizIndex ? mod.color
                    : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Question */}
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentQuestion.options.map((option, i) => {
              let bg = 'rgba(255,255,255,0.05)';
              let borderColor = 'rgba(255,255,255,0.1)';

              if (selectedAnswer !== null) {
                if (i === currentQuestion.correct) {
                  bg = 'rgba(57, 255, 20, 0.2)';
                  borderColor = '#39ff14';
                } else if (i === selectedAnswer && i !== currentQuestion.correct) {
                  bg = 'rgba(255, 0, 100, 0.2)';
                  borderColor = '#ff0064';
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  whileHover={selectedAnswer === null ? { scale: 1.02, x: 5 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  style={{
                    padding: '14px 20px',
                    background: bg,
                    border: `2px solid ${borderColor}`,
                    borderRadius: 14,
                    color: '#fff',
                    cursor: selectedAnswer === null ? 'pointer' : 'default',
                    fontFamily: 'var(--font-main)',
                    fontSize: 16,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'all 0.3s',
                  }}
                >
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                  💡 {currentQuestion.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selectedAnswer !== null && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNextQuestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '14px',
                fontSize: 16,
                fontFamily: 'var(--font-main)',
                fontWeight: 700,
                background: mod.gradient,
                border: 'none',
                borderRadius: 12,
                color: '#000',
                cursor: 'pointer',
              }}
            >
              {quizIndex < quiz.length - 1 ? 'Next Question →' : '🏆 Finish Quiz!'}
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // Reading Mode
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 40px',
    }}>
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'rgba(18, 18, 42, 0.9)',
          border: `2px solid ${mod.color}44`,
          borderRadius: 30,
          padding: 40,
          maxWidth: 700,
          width: '100%',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orb */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: mod.gradient,
          opacity: 0.1,
          filter: 'blur(40px)',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 10,
            color: mod.color,
          }}>
            {mod.emoji} {mod.title.toUpperCase()}
          </span>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 10,
            color: 'rgba(255,255,255,0.4)',
          }}>
            {currentSection + 1} / {mod.sections.length}
          </span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 30 }}>
          {mod.sections.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= currentSection ? mod.color : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, color: mod.color }}>
          {section.title}
        </h2>

        <p style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.85)',
          marginBottom: 24,
        }}>
          {section.content}
        </p>

        {/* Fun Fact Toggle */}
        <motion.button
          onClick={() => setShowFunFact(!showFunFact)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: showFunFact
              ? 'rgba(255, 230, 0, 0.15)'
              : 'rgba(255, 230, 0, 0.08)',
            border: `1px solid ${showFunFact ? '#ffe600' : 'rgba(255, 230, 0, 0.2)'}`,
            borderRadius: 14,
            color: '#ffe600',
            cursor: 'pointer',
            fontFamily: 'var(--font-main)',
            fontSize: 15,
            fontWeight: 600,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <motion.span
            animate={{ rotate: showFunFact ? 180 : 0 }}
            style={{ fontSize: 20 }}
          >
            {showFunFact ? '🤯' : '💡'}
          </motion.span>
          {showFunFact ? 'Hide Fun Fact' : 'Show Fun Fact!'}
        </motion.button>

        <AnimatePresence>
          {showFunFact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: 16,
                background: 'rgba(255, 230, 0, 0.1)',
                border: '1px solid rgba(255, 230, 0, 0.2)',
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <p style={{ fontSize: 15, color: '#ffe600', lineHeight: 1.5 }}>
                {section.funFact}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12 }}>
          {currentSection > 0 && (
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 24px',
                fontSize: 15,
                fontFamily: 'var(--font-main)',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 12,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              ← Back
            </motion.button>
          )}
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${mod.color}44` }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              padding: '12px 24px',
              fontSize: 15,
              fontFamily: 'var(--font-main)',
              fontWeight: 700,
              background: mod.gradient,
              border: 'none',
              borderRadius: 12,
              color: '#000',
              cursor: 'pointer',
            }}
          >
            {currentSection < mod.sections.length - 1 ? 'Next →' : '⚡ Take the Quiz!'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
