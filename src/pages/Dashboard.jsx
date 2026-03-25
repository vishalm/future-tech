import { motion } from 'framer-motion';
import { modules, levels } from '../data/content';
import { API_URL } from '../config';
import { useEffect, useState } from 'react';

export default function Dashboard({ xp, completedModules, completedQuizzes, achievements, getCurrentLevel, getNextLevel, getXPProgress, tracking }) {
  const [serverStats, setServerStats] = useState(null);
  const level = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progress = getXPProgress();

  useEffect(() => {
    tracking.trackPageView('dashboard');
    // Try to fetch server stats
    fetch(`${API_URL}/api/stats`)
      .then(res => res.json())
      .then(setServerStats)
      .catch(() => {});
  }, []);

  const totalQuizScore = Object.values(completedQuizzes).reduce((acc, q) => acc + q.score, 0);
  const totalQuestions = Object.values(completedQuizzes).reduce((acc, q) => acc + q.total, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalQuizScore / totalQuestions) * 100) : 0;

  const statCards = [
    { label: 'Total XP', value: xp, emoji: '⚡', color: '#39ff14', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { label: 'Level', value: `${level.level} - ${level.title}`, emoji: level.emoji, color: '#ffe600', gradient: 'linear-gradient(135deg, #f6d365, #fda085)' },
    { label: 'Modules Done', value: `${completedModules.length}/${modules.length}`, emoji: '📚', color: '#00f0ff', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { label: 'Quiz Accuracy', value: `${accuracy}%`, emoji: '🎯', color: '#ff00e5', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { label: 'Achievements', value: achievements.length, emoji: '🏆', color: '#b026ff', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { label: 'Quizzes Taken', value: Object.keys(completedQuizzes).length, emoji: '📝', color: '#ff6b00', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 20px 40px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: 50, display: 'inline-block' }}
        >
          📊
        </motion.span>
        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: 10,
          lineHeight: 1.6,
        }}>
          COMMAND CENTER
        </h1>
      </motion.div>

      {/* Level Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(18, 18, 42, 0.9)',
          border: '2px solid rgba(255, 230, 0, 0.3)',
          borderRadius: 24,
          padding: 32,
          marginBottom: 30,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffe600, #ff6b00)',
          opacity: 0.1,
          filter: 'blur(40px)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 60 }}
          >
            {level.emoji}
          </motion.span>
          <div>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 10,
              color: '#ffe600',
              marginBottom: 4,
            }}>
              LEVEL {level.level}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{level.title}</div>
          </div>
        </div>

        <div style={{
          width: '100%',
          height: 16,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ffe600, #ff6b00)',
              borderRadius: 8,
              boxShadow: '0 0 20px rgba(255, 230, 0, 0.5)',
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
        }}>
          <span>{xp} XP</span>
          {nextLevel && <span>{nextLevel.minXP} XP for {nextLevel.emoji} {nextLevel.title}</span>}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 30,
      }}>
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              background: 'rgba(18, 18, 42, 0.8)',
              border: `1px solid ${stat.color}33`,
              borderRadius: 18,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.emoji}</div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: stat.color,
              marginBottom: 4,
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Level Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(18, 18, 42, 0.8)',
          border: '1px solid rgba(176, 38, 255, 0.2)',
          borderRadius: 24,
          padding: 32,
          marginBottom: 30,
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 12,
          color: '#b026ff',
          marginBottom: 24,
        }}>
          LEVEL ROADMAP
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {levels.map((lvl) => {
            const isReached = xp >= lvl.minXP;
            const isCurrent = lvl.level === level.level;

            return (
              <div
                key={lvl.level}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: isCurrent ? 'rgba(255, 230, 0, 0.1)' : 'transparent',
                  border: isCurrent ? '1px solid rgba(255, 230, 0, 0.3)' : '1px solid transparent',
                  opacity: isReached ? 1 : 0.4,
                }}
              >
                <span style={{ fontSize: 24 }}>{lvl.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isCurrent ? '#ffe600' : '#fff',
                  }}>
                    Level {lvl.level}: {lvl.title}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 9,
                  color: isReached ? '#39ff14' : 'rgba(255,255,255,0.3)',
                }}>
                  {lvl.minXP} XP
                </span>
                {isReached && <span>✓</span>}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Server Stats */}
      {serverStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(18, 18, 42, 0.8)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 24,
            padding: 32,
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 12,
            color: '#00f0ff',
            marginBottom: 24,
          }}>
            🖥️ SERVER MONITORING
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#00f0ff' }}>
                {serverStats.activeSessions}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Active Sessions</div>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#39ff14' }}>
                {serverStats.totalEvents}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Total Events</div>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#ff00e5' }}>
                {serverStats.uptime}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Uptime</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
