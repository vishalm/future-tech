import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { modules } from '../data/content';
import { useEffect } from 'react';

export default function Modules({ completedModules, completedQuizzes, tracking }) {
  const navigate = useNavigate();

  useEffect(() => {
    tracking.trackPageView('modules');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 20px 40px',
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 50 }}
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 50, display: 'inline-block' }}
        >
          📚
        </motion.span>
        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(90deg, #00f0ff, #ff00e5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: 10,
          lineHeight: 1.6,
        }}>
          LEARNING MODULES
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
          Choose your adventure! Each module earns you XP and gets you closer to AI mastery.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24,
      }}>
        {modules.map((mod, i) => {
          const isCompleted = completedModules.includes(mod.id);
          const quizResult = completedQuizzes[mod.id];

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.03,
                y: -8,
                boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${mod.color}33`,
              }}
              onClick={() => navigate(`/module/${mod.id}`)}
              style={{
                background: 'rgba(18, 18, 42, 0.8)',
                border: `2px solid ${isCompleted ? '#39ff14' : mod.color + '44'}`,
                borderRadius: 24,
                padding: 28,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.3s',
              }}
            >
              {/* Background gradient orb */}
              <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: mod.gradient,
                opacity: 0.15,
                filter: 'blur(30px)',
              }} />

              {/* Completed badge */}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#39ff14',
                    color: '#000',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'var(--font-pixel)',
                  }}
                >
                  DONE ✓
                </motion.div>
              )}

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                style={{ fontSize: 48, marginBottom: 16 }}
              >
                {mod.emoji}
              </motion.div>

              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: mod.color }}>
                {mod.title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 16 }}>
                {mod.subtitle}
              </p>

              <div style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  background: 'rgba(57, 255, 20, 0.15)',
                  color: '#39ff14',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  +{mod.xpReward} XP
                </span>
                <span style={{
                  background: mod.difficulty === 'Easy'
                    ? 'rgba(57, 255, 20, 0.15)'
                    : mod.difficulty === 'Medium'
                    ? 'rgba(255, 230, 0, 0.15)'
                    : 'rgba(255, 0, 229, 0.15)',
                  color: mod.difficulty === 'Easy'
                    ? '#39ff14'
                    : mod.difficulty === 'Medium'
                    ? '#ffe600'
                    : '#ff00e5',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {mod.difficulty}
                </span>
                {quizResult && (
                  <span style={{
                    background: 'rgba(0, 240, 255, 0.15)',
                    color: '#00f0ff',
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    Quiz: {quizResult.score}/{quizResult.total}
                  </span>
                )}
              </div>

              {/* Section count */}
              <div style={{
                marginTop: 16,
                display: 'flex',
                gap: 6,
              }}>
                {mod.sections.map((_, j) => (
                  <div
                    key={j}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      background: isCompleted ? '#39ff14' : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
