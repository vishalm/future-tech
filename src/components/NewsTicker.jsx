import { motion } from 'framer-motion';

const headlines = [
  'GPT-5.4 DROPS WITH 1M+ TOKEN CONTEXT',
  'ARTEMIS 2 MOON MISSION LAUNCHING APRIL 2026',
  'AMI LABS RAISES $1 BILLION IN SEED ROUND',
  'DEEPMIND + ATLAS ROBOT = UNSTOPPABLE',
  'WALMART DRONE DELIVERY TO 40M AMERICANS',
  'NVIDIA PUTS AI IN ORBIT — SPACE COMPUTING IS HERE',
  'NASA PLANS PERMANENT MOON BASE',
  'META REVEALS 4 NEW AI CHIP GENERATIONS',
  '12+ AI MODELS DROPPED IN ONE WEEK',
  'GPT-5.4 SCORES 83% ON EXPERT TASKS',
  'EUROPE LAUNCHES CELESTE NAV CONSTELLATION',
  'ATLAS ROBOT GETTING GEMINI AI BRAIN UPGRADE',
];

export default function NewsTicker() {
  const doubled = [...headlines, ...headlines];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      background: 'var(--ticker-bg)',
      borderTop: '2px solid var(--ticker-border)',
      overflow: 'hidden',
      height: 34,
      display: 'flex',
      alignItems: 'center',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        background: 'var(--ticker-badge)',
        padding: '0 12px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--font-pixel)',
        fontSize: 8,
        color: '#fff',
        whiteSpace: 'nowrap',
        zIndex: 1,
        flexShrink: 0,
        gap: 6,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#ff0000',
          animation: 'led-flicker 1s infinite',
        }} />
        LIVE
      </div>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'flex',
          gap: 50,
          whiteSpace: 'nowrap',
          paddingLeft: 16,
        }}
      >
        {doubled.map((headline, i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-dim)',
              letterSpacing: 0.5,
            }}
          >
            {headline}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
