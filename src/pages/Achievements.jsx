import { motion } from 'framer-motion';
import { achievements as allAchievements } from '../data/content';
import { useEffect } from 'react';

export default function Achievements({ unlockedAchievements, tracking }) {
  useEffect(() => {
    tracking.trackPageView('achievements');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 20px 40px',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 50 }}
      >
        <motion.span
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 60, display: 'inline-block' }}
        >
          🏆
        </motion.span>
        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(90deg, #ffe600, #ff6b00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: 10,
          lineHeight: 1.6,
        }}>
          TROPHY ROOM
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
          {unlockedAchievements.length} / {allAchievements.length} achievements unlocked
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {allAchievements.map((achievement, i) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
              style={{
                background: isUnlocked
                  ? 'rgba(18, 18, 42, 0.9)'
                  : 'rgba(18, 18, 42, 0.4)',
                border: `2px solid ${isUnlocked ? '#ffe600' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 20,
                padding: 24,
                position: 'relative',
                overflow: 'hidden',
                opacity: isUnlocked ? 1 : 0.4,
                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                transition: 'all 0.3s',
              }}
            >
              {isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#ffe600',
                  opacity: 0.1,
                  filter: 'blur(20px)',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <motion.span
                  animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 40 }}
                >
                  {achievement.emoji}
                </motion.span>
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: isUnlocked ? '#ffe600' : 'rgba(255,255,255,0.3)',
                    marginBottom: 4,
                  }}>
                    {achievement.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 4,
                  }}>
                    {achievement.description}
                  </p>
                  <span style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: 9,
                    color: isUnlocked ? '#39ff14' : 'rgba(255,255,255,0.2)',
                  }}>
                    +{achievement.xp} XP
                  </span>
                </div>
              </div>

              {!isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontSize: 20,
                }}>
                  🔒
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
