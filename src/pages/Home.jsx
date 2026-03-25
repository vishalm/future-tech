import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DynamicIcon, Book, Newspaper, Trophy, ChartBar, Podium, Bracket, Controller, Galaxy } from '../components/Icons';
import NewsFeed from '../components/NewsFeed';
import AnimatedCounter from '../components/AnimatedCounter';
import TypingText from '../components/TypingText';
import PageTransition from '../components/PageTransition';
import { levels } from '../data/content';

function FloatingIcon({ icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{
        opacity: [0, 0.5, 0.5, 0],
        y: [80, -10, -10, -80],
        x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
        rotate: [0, Math.random() * 20 - 10, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4 + 3,
      }}
      style={{
        position: 'absolute',
        left: `${Math.random() * 85 + 5}%`,
        top: `${Math.random() * 40 + 30}%`,
        pointerEvents: 'none',
      }}
    >
      <DynamicIcon name={icon} size={20 + Math.random() * 16} color={color} />
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
];

const greetings = [
  'Ready to level up?',
  'Let\'s get smarter today.',
  'Your brain is about to upgrade.',
  'The future starts now.',
  'Knowledge = power.',
  'Let\'s crush it.',
];

export default function Home({ playerName, xp, level, completedModules, tracking }) {
  const navigate = useNavigate();
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  useEffect(() => {
    tracking.trackPageView('home');
  }, []);

  const nextLevel = levels.find(l => l.minXP > xp) || null;
  const xpToNext = nextLevel ? nextLevel.minXP - xp : 0;

  const actions = [
    { label: 'Learn', Icon: Book, path: '/modules', gradient: 'var(--gradient-primary)', desc: '5 AI modules' },
    { label: 'Timeline', Icon: Galaxy, path: '/timeline', gradient: 'var(--gradient-secondary)', desc: '2025-2030' },
    { label: 'News Quiz', Icon: Newspaper, path: '/news', gradient: 'var(--gradient-success)', desc: 'Real news' },
    { label: 'Compete', Icon: Bracket, path: '/competitions', gradient: 'var(--gradient-primary)', desc: 'Battle friends' },
    { label: 'Ranks', Icon: Podium, path: '/leaderboard', gradient: 'var(--gradient-secondary)', desc: 'Who\'s #1?' },
    { label: 'Trophies', Icon: Trophy, path: '/achievements', gradient: 'var(--gradient-success)', desc: 'Collect all' },
  ];

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        padding: 'clamp(80px, 12vw, 100px) clamp(12px, 3vw, 24px) 80px',
        maxWidth: 1000,
        margin: '0 auto',
        position: 'relative',
      }}>
        {floatingIcons.map((fi, i) => (
          <FloatingIcon key={i} icon={fi.icon} color={fi.color} delay={i * 0.5} />
        ))}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 36px)' }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          >
            <Controller size={52} color="var(--accent)" style={{ margin: '0 auto' }} />
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(13px, 2.8vw, 22px)',
            lineHeight: 1.8,
            marginTop: 12,
          }}>
            <span className="gradient-text">
              HEY {playerName?.toUpperCase()}!
            </span>
          </h1>

          <div style={{
            fontSize: 'clamp(15px, 2.2vw, 20px)',
            color: 'var(--text-dim)',
            marginTop: 6,
            minHeight: 28,
          }}>
            <TypingText text={greeting} speed={40} delay={400} />
          </div>
        </motion.div>

        {/* XP Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -3, boxShadow: 'var(--glow-accent)' }}
          style={{
            background: 'var(--gradient-card)',
            border: '2px solid var(--border)',
            borderRadius: 20,
            padding: 'clamp(16px, 3vw, 28px)',
            marginBottom: 'clamp(20px, 3vw, 30px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(12px, 3vw, 24px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            transition: 'box-shadow 0.3s',
          }}
        >
          {/* Avatar */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 'clamp(56px, 10vw, 72px)',
              height: 'clamp(56px, 10vw, 72px)',
              borderRadius: 18,
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 700,
              color: '#000',
              boxShadow: 'var(--glow-accent)',
              flexShrink: 0,
            }}
          >
            {playerName?.[0]?.toUpperCase()}
          </motion.div>

          {/* Stats */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(20px, 4vw, 32px)',
                color: 'var(--xp-color)',
                textShadow: '0 0 15px var(--xp-color)',
              }}>
                <AnimatedCounter value={xp} />
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(8px, 1.5vw, 10px)',
                color: 'var(--text-muted)',
              }}>
                XP
              </span>
            </div>

            {/* Level bar */}
            <div style={{
              width: '100%',
              height: 10,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 5,
              overflow: 'hidden',
              marginBottom: 6,
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nextLevel ? ((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100 : 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                style={{
                  height: '100%',
                  background: 'var(--gradient-success)',
                  borderRadius: 5,
                  boxShadow: 'var(--glow-success)',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              color: 'var(--text-muted)',
            }}>
              <span>
                <DynamicIcon name={level.icon} size={12} color="var(--warning)" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Lvl {level.level} — {level.title}
              </span>
              {nextLevel && <span>{xpToNext} XP to next</span>}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 16px)',
          }}>
            {[
              { val: level.level, label: 'LVL', color: 'var(--warning)' },
              { val: completedModules.length, label: 'DONE', color: 'var(--accent)' },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: 'center',
                padding: 'clamp(6px, 1vw, 10px) clamp(10px, 2vw, 16px)',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
              }}>
                <div style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  color: s.color,
                }}>
                  <AnimatedCounter value={s.val} />
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* News Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <NewsFeed />
        </motion.div>

        {/* Action Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(130px, 22vw, 160px), 1fr))',
          gap: 'clamp(10px, 2vw, 14px)',
        }}>
          {actions.map((btn, i) => (
            <motion.button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.07, type: 'spring', bounce: 0.4 }}
              whileHover={{
                scale: 1.08,
                y: -6,
                boxShadow: 'var(--glow-accent)',
                rotate: Math.random() > 0.5 ? 1 : -1,
              }}
              whileTap={{ scale: 0.92, rotate: 0 }}
              style={{
                background: btn.gradient,
                border: 'none',
                borderRadius: 'clamp(14px, 2vw, 18px)',
                padding: 'clamp(16px, 3vw, 22px) clamp(8px, 2vw, 14px)',
                color: '#000',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'box-shadow 0.3s',
              }}
            >
              <btn.Icon size={26} color="#000" />
              {btn.label}
              <span style={{
                fontSize: 'clamp(9px, 1.2vw, 10px)',
                opacity: 0.6,
                fontWeight: 500,
              }}>
                {btn.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
