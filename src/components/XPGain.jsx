import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

export function XPGainProvider({ children }) {
  return children;
}

export default function XPGain({ amount, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -60, scale: 1.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9998,
            fontFamily: 'var(--font-pixel)',
            fontSize: 24,
            color: '#39ff14',
            textShadow: '0 0 20px #39ff14, 0 0 40px #39ff14',
            pointerEvents: 'none',
          }}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
