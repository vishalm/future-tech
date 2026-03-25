import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { newsCategories, getNewsQuestions } from '../data/newsQuestions';

const reactions = {
  correct: ['YESSS! 🔥', 'BIG BRAIN! 🧠', 'NAILED IT! 💅', 'NO WAY! 😱', 'GOATED! 🐐', 'TOO EASY! 😎', 'W ANSWER! 🏆'],
  wrong: ['BRUH 💀', 'NOT QUITE 😅', 'SO CLOSE! 😤', 'OOF 😵', 'NEXT TIME! 💪', 'PLOT TWIST! 🔄', 'RIP 🪦'],
  streak: ['ON FIRE! 🔥🔥🔥', 'UNSTOPPABLE! ⚡', 'COMBO x', 'LEGENDARY! 🌟', 'MEGA STREAK! 💫'],
};

function getRandomReaction(type) {
  const arr = reactions[type];
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function NewsChallenge({ addXP, tracking }) {
  const [phase, setPhase] = useState('menu'); // menu | playing | results
  const [category, setCategory] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reaction, setReaction] = useState('');
  const [lastCorrect, setLastCorrect] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    tracking.trackPageView('news-challenge');
  }, []);

  // Countdown timer
  const selectedRef = useRef(null);
  selectedRef.current = selected;

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timerActive && timer === 0 && selectedRef.current === null) {
      // Time's up — auto wrong (only if not already answered)
      handleAnswer(-1);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, timerActive]);

  const startGame = (cat) => {
    setCategory(cat);
    const qs = getNewsQuestions(cat, 7);
    setQuestions(qs);
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelected(null);
    setShowExplanation(false);
    setTotalXP(0);
    setTimer(15);
    setTimerActive(true);
    setPhase('playing');
  };

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setTimerActive(false);
    setSelected(index);
    setShowExplanation(true);

    const q = questions[currentQ];
    const correct = index === q.correct;
    setLastCorrect(correct);

    if (correct) {
      const timeBonus = Math.max(0, timer * 2);
      const streakBonus = streak >= 2 ? 10 * streak : 0;
      const earned = q.xp + timeBonus + streakBonus;
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setMaxStreak(ms => Math.max(ms, streak + 1));
      setTotalXP(t => t + earned);

      const streakNow = streak + 1;
      if (streakNow >= 3) {
        setReaction(`${reactions.streak[Math.min(streakNow - 3, reactions.streak.length - 1)]}${streakNow >= 4 ? streakNow : ''}`);
      } else {
        setReaction(getRandomReaction('correct'));
      }

      confetti({
        particleCount: 40 + streak * 15,
        spread: 60 + streak * 10,
        origin: { y: 0.7 },
        colors: ['#39ff14', '#00f0ff', '#ffe600'],
      });
    } else {
      setStreak(0);
      setReaction(getRandomReaction('wrong'));
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
      setReaction('');
      setLastCorrect(false);
      setTimer(15);
      setTimerActive(true);
    } else {
      // Game over
      setPhase('results');
      addXP(totalXP);
      tracking.trackEvent?.('news_challenge_complete', { score, total: questions.length, xp: totalXP });

      if (score === questions.length) {
        confetti({
          particleCount: 300,
          spread: 160,
          origin: { y: 0.4 },
          colors: ['#00f0ff', '#ff00e5', '#39ff14', '#ffe600', '#b026ff', '#ff6b00'],
        });
      }
    }
  };

  // ═══════ MENU ═══════
  if (phase === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '100px 20px 40px',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 70 }}
          >
            📰
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(14px, 3vw, 22px)',
            background: 'linear-gradient(90deg, #ff00e5, #00f0ff, #39ff14)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: 12,
            lineHeight: 1.8,
          }}>
            NEWS CHALLENGE
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 18,
            marginTop: 8,
            maxWidth: 500,
            margin: '8px auto 0',
          }}>
            Think you know what's happening in tech RIGHT NOW?
            Real questions from REAL news. No cap. 🧢
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            marginBottom: 40,
            flexWrap: 'wrap',
          }}
        >
          {[
            { emoji: '⏱️', text: '15 sec timer', sub: 'Speed matters!' },
            { emoji: '🔥', text: 'Streak bonuses', sub: 'Keep the combo!' },
            { emoji: '⚡', text: 'Earn XP', sub: 'Level up fast!' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              style={{
                background: 'rgba(18, 18, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '16px 24px',
                textAlign: 'center',
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 28 }}>{item.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{item.text}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 style={{
            textAlign: 'center',
            fontFamily: 'var(--font-pixel)',
            fontSize: 11,
            color: '#ffe600',
            marginBottom: 20,
          }}>
            PICK YOUR VIBE
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 14,
            marginBottom: 20,
          }}>
            {newsCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => startGame(cat.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{ scale: 1.06, y: -4, boxShadow: `0 10px 30px ${cat.color}33` }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(18, 18, 42, 0.9)',
                  border: `2px solid ${cat.color}44`,
                  borderRadius: 18,
                  padding: '20px 16px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontFamily: 'var(--font-main)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: cat.color }}>{cat.label}</div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => startGame('all')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(255, 0, 229, 0.3)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: 18,
              fontFamily: 'var(--font-main)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ff00e5, #00f0ff)',
              border: 'none',
              borderRadius: 16,
              color: '#000',
              cursor: 'pointer',
            }}
          >
            🎲 RANDOM MIX — Surprise Me!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ═══════ PLAYING ═══════
  if (phase === 'playing') {
    const q = questions[currentQ];
    const timerColor = timer > 10 ? '#39ff14' : timer > 5 ? '#ffe600' : '#ff0064';
    const timerPercent = (timer / 15) * 100;

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 40px',
      }}>
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            background: 'rgba(18, 18, 42, 0.95)',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: 28,
            padding: 'clamp(24px, 4vw, 40px)',
            maxWidth: 650,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Timer bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: 'rgba(255,255,255,0.05)',
          }}>
            <motion.div
              animate={{ width: `${timerPercent}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: timerColor,
                borderRadius: '0 4px 4px 0',
                boxShadow: `0 0 10px ${timerColor}`,
              }}
            />
          </div>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            marginTop: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 10,
                color: '#ff00e5',
              }}>
                📰 NEWS CHALLENGE
              </span>
              {streak >= 2 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b00, #ffe600)',
                    color: '#000',
                    padding: '2px 8px',
                    borderRadius: 8,
                    fontSize: 10,
                    fontFamily: 'var(--font-pixel)',
                    fontWeight: 700,
                  }}
                >
                  🔥 x{streak}
                </motion.span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 18,
                color: timerColor,
                textShadow: `0 0 10px ${timerColor}`,
              }}>
                {timer}
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 10,
                color: 'rgba(255,255,255,0.4)',
              }}>
                {currentQ + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {questions.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 3,
                  background: i < currentQ ? '#39ff14' : i === currentQ ? '#ff00e5' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Category tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 12px',
            borderRadius: 20,
            marginBottom: 16,
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
          }}>
            {newsCategories.find(c => c.id === q.category)?.emoji} {q.source}
          </div>

          {/* Question */}
          <h2 style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            fontWeight: 600,
            marginBottom: 24,
            lineHeight: 1.4,
          }}>
            {q.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.04)';
              let borderColor = 'rgba(255,255,255,0.08)';
              let shadow = 'none';

              if (selected !== null) {
                if (i === q.correct) {
                  bg = 'rgba(57, 255, 20, 0.2)';
                  borderColor = '#39ff14';
                  shadow = '0 0 15px rgba(57, 255, 20, 0.2)';
                } else if (i === selected && i !== q.correct) {
                  bg = 'rgba(255, 0, 100, 0.2)';
                  borderColor = '#ff0064';
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  whileHover={selected === null ? { scale: 1.02, x: 6 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  style={{
                    padding: '14px 18px',
                    background: bg,
                    border: `2px solid ${borderColor}`,
                    borderRadius: 14,
                    color: '#fff',
                    cursor: selected === null ? 'pointer' : 'default',
                    fontFamily: 'var(--font-main)',
                    fontSize: 'clamp(14px, 2vw, 16px)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: shadow,
                    transition: 'all 0.3s',
                  }}
                >
                  <span style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Reaction */}
          <AnimatePresence>
            {reaction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                style={{
                  textAlign: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  marginTop: 16,
                  color: lastCorrect ? '#39ff14' : '#ff0064',
                  textShadow: lastCorrect
                    ? '0 0 20px rgba(57, 255, 20, 0.5)'
                    : '0 0 20px rgba(255, 0, 100, 0.5)',
                }}
              >
                {reaction}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.15)',
                  borderRadius: 14,
                }}
              >
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                  💡 {q.explanation}
                </p>
                {selected === q.correct && (
                  <div style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: '#39ff14',
                    fontFamily: 'var(--font-pixel)',
                  }}>
                    +{q.xp} XP {timer > 0 && `+ ${timer * 2} speed bonus`} {streak >= 2 && `+ ${10 * streak} streak!`}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selected !== null && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={nextQuestion}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                marginTop: 16,
                width: '100%',
                padding: '14px',
                fontSize: 16,
                fontFamily: 'var(--font-main)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff00e5, #00f0ff)',
                border: 'none',
                borderRadius: 14,
                color: '#000',
                cursor: 'pointer',
              }}
            >
              {currentQ < questions.length - 1 ? 'Next Question →' : '🏆 See Results!'}
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // ═══════ RESULTS ═══════
  const percentage = Math.round((score / questions.length) * 100);
  const grade = percentage === 100 ? 'S' : percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';
  const gradeColors = { S: '#ffe600', A: '#39ff14', B: '#00f0ff', C: '#ff6b00', F: '#ff0064' };
  const gradeEmojis = { S: '👑', A: '🔥', B: '⭐', C: '💪', F: '📚' };
  const gradeMessages = {
    S: 'PERFECT! You\'re literally cracked.',
    A: 'AMAZING! You def stay updated!',
    B: 'Not bad! You know your stuff!',
    C: 'Getting there! Keep reading the news!',
    F: 'Study up bestie! Check the news more often!',
  };

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
          background: 'rgba(18, 18, 42, 0.95)',
          border: `3px solid ${gradeColors[grade]}`,
          borderRadius: 30,
          padding: 'clamp(28px, 5vw, 48px)',
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
          boxShadow: `0 0 40px ${gradeColors[grade]}33`,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: 60 }}
        >
          {gradeEmojis[grade]}
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          style={{
            fontSize: 80,
            fontFamily: 'var(--font-pixel)',
            color: gradeColors[grade],
            textShadow: `0 0 30px ${gradeColors[grade]}66`,
            margin: '8px 0',
          }}
        >
          {grade}
        </motion.div>

        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 12,
          color: '#ffe600',
          marginBottom: 8,
        }}>
          CHALLENGE COMPLETE!
        </h1>

        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
          {gradeMessages[grade]}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          marginBottom: 24,
        }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#39ff14' }}>{score}/{questions.length}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Correct</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#00f0ff' }}>+{totalXP}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>XP Earned</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#ff6b00' }}>🔥{maxStreak}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Best Streak</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            onClick={() => setPhase('menu')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 28px',
              fontSize: 16,
              fontFamily: 'var(--font-main)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ff00e5, #b026ff)',
              border: 'none',
              borderRadius: 14,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            🔄 Play Again
          </motion.button>
          <motion.button
            onClick={() => startGame(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 28px',
              fontSize: 16,
              fontFamily: 'var(--font-main)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #39ff14, #00f0ff)',
              border: 'none',
              borderRadius: 14,
              color: '#000',
              cursor: 'pointer',
            }}
          >
            ⚡ Rematch!
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
