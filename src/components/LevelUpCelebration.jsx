import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { DynamicIcon, Crown } from './Icons';

export default function LevelUpCelebration({ level, show, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && level) {
      setVisible(true);
      // Mega confetti
      const duration = 2500;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 3500);
    }
  }, [show, level]);

  return (
    <AnimatePresence>
      {visible && level && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [0, 1.3, 1], rotate: [-30, 10, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <DynamicIcon name={level.icon} size={80} color="var(--warning)" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(10px, 2vw, 16px)',
              color: 'var(--warning)',
              marginTop: 20,
              textShadow: '0 0 20px var(--warning)',
            }}
          >
            LEVEL UP!
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              marginTop: 8,
            }}
          >
            Level {level.level}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: 'clamp(16px, 3vw, 24px)',
              color: 'var(--accent)',
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {level.title}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
