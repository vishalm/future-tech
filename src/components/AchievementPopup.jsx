import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { DynamicIcon, Trophy } from './Icons';

export default function AchievementPopup({ achievement }) {
  useEffect(() => {
    if (achievement) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
      });
    }
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.5 }}
          style={{
            position: 'fixed',
            top: 74,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'var(--gradient-secondary)',
            border: '2px solid var(--warning)',
            borderRadius: 18,
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 0 30px rgba(255,230,0,0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <DynamicIcon name={achievement.icon || 'Trophy'} size={36} color="var(--warning)" />
          </motion.div>
          <div>
            <div className="led-text" style={{ fontSize: 9, color: 'var(--warning)', marginBottom: 3 }}>
              ACHIEVEMENT UNLOCKED!
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {achievement.title}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              +{achievement.xp} XP
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
