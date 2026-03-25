import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DynamicIcon, Book, Newspaper, Trophy, ChartBar, Podium, Bracket, Controller, Rocket, Settings } from '../components/Icons';
import NewsFeed from '../components/NewsFeed';
import { levels } from '../data/content';

function FloatingIcon({ icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        y: [80, -10, -10, -80],
        x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4 + 2,
      }}
      style={{
        position: 'absolute',
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 50 + 25}%`,
        pointerEvents: 'none',
      }}
    >
      <DynamicIcon name={icon} size={24 + Math.random() * 16} color={color} />
    </motion.div>
  );
}

const floatingIcons = [
  { icon: 'Robot', color: 'var(--accent)' },
  { icon: 'Brain', color: 'var(--accent2)' },
  { icon: 'Lightning', color: 'var(--warning)' },
  { icon: 'Rocket', color: 'var(--accent)' },
  { icon: 'Gem', color: 'var(--accent2)' },
  { icon: 'Galaxy', color: 'var(--accent3)' },
  { icon: 'Controller', color: 'var(--accent)' },
  { icon: 'Satellite', color: 'var(--accent2)' },
  { icon: 'Dna', color: 'var(--accent3)' },
  { icon: 'Globe', color: 'var(--accent)' },
];

export default function Home({ playerName, xp, level, completedModules, tracking }) {
  const navigate = useNavigate();

  useEffect(() => {
    tracking.trackPageView('home');
  }, []);

  const currentLevel = level;
  const nextLevel = levels.find(l => l.minXP > xp) || null;

  const quickStats = [
    { label: 'XP', value: xp, color: 'var(--xp-color)' },
    { label: 'Level', value: currentLevel.level, color: 'var(--warning)' },
    { label: 'Modules', value: completedModules.length, color: 'var(--accent)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'clamp(80px, 12vw, 100px) clamp(12px, 3vw, 24px) 80px',
      maxWidth: 1100,
      margin: '0 auto',
      position: 'relative',
    }}>
      {floatingIcons.map((fi, i) => (
        <FloatingIcon key={i} icon={fi.icon} color={fi.color} delay={i * 0.4} />
      ))}

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 30px)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <Controller size={56} color="var(--accent)" style={{ margin: '0 auto' }} />
        </motion.div>
        <h1 className="led-text" style={{
          fontSize: 'clamp(12px, 2.5vw, 20px)',
          lineHeight: 1.8,
          marginTop: 10,
        }}>
          <span className="gradient-text">WELCOME BACK, {playerName?.toUpperCase()}!</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: 4, fontSize: 'clamp(14px, 2vw, 18px)' }}>
          Ready to level up? Let's go.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 16px)',
          marginBottom: 'clamp(20px, 3vw, 30px)',
          flexWrap: 'wrap',
        }}
      >
        {quickStats.map(s => (
          <div key={s.label} style={{
            background: 'var(--gradient-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 'clamp(10px, 2vw, 16px) clamp(16px, 3vw, 28px)',
            textAlign: 'center',
            minWidth: 80,
          }}>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(16px, 3vw, 24px)',
              color: s.color,
              fontWeight: 700,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* News Feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <NewsFeed />
      </motion.div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 25vw, 200px), 1fr))',
        gap: 'clamp(10px, 2vw, 16px)',
      }}>
        {[
          { label: 'Learn', Icon: Book, path: '/modules', gradient: 'var(--gradient-primary)' },
          { label: 'News Quiz', Icon: Newspaper, path: '/news', gradient: 'var(--gradient-secondary)' },
          { label: 'Leaderboard', Icon: Podium, path: '/leaderboard', gradient: 'var(--gradient-success)' },
          { label: 'Competitions', Icon: Bracket, path: '/competitions', gradient: 'var(--gradient-primary)' },
          { label: 'Trophies', Icon: Trophy, path: '/achievements', gradient: 'var(--gradient-secondary)' },
          { label: 'Stats', Icon: ChartBar, path: '/dashboard', gradient: 'var(--gradient-success)' },
        ].map((btn, i) => (
          <motion.button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            whileHover={{ scale: 1.05, y: -4, boxShadow: 'var(--glow-accent)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: btn.gradient,
              border: 'none',
              borderRadius: 'clamp(14px, 2vw, 20px)',
              padding: 'clamp(16px, 3vw, 24px)',
              color: '#000',
              cursor: 'pointer',
              fontFamily: 'var(--font-main)',
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <btn.Icon size={28} color="#000" />
            {btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
