import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Book, Newspaper, Trophy, ChartBar, Podium, Bracket, Rocket, Settings, Controller, Shield, Galaxy } from './Icons';

const baseNavItems = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/modules', label: 'Learn', Icon: Book },
  { path: '/timeline', label: 'Timeline', Icon: Galaxy },
  { path: '/news', label: 'News', Icon: Newspaper },
  { path: '/leaderboard', label: 'Ranks', Icon: Podium },
  { path: '/competitions', label: 'Battle', Icon: Bracket },
  { path: '/achievements', label: 'Awards', Icon: Trophy },
  { path: '/dashboard', label: 'Stats', Icon: ChartBar },
];

export default function Navbar({ xp, level, xpProgress, playerName, isAdmin }) {
  const navItems = isAdmin
    ? [...baseNavItems, { path: '/admin', label: 'Admin', Icon: Shield }]
    : baseNavItems;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid var(--nav-border)',
        padding: '0 16px',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <motion.div
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Controller size={26} color="var(--accent)" />
          </motion.div>
          <span className="led-text gradient-text" style={{ fontSize: 10, letterSpacing: 1 }}>
            FUTURETECH
          </span>
        </motion.div>

        {/* Nav Items */}
        <div style={{ display: 'flex', gap: 4 }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(var(--accent-rgb, 0,240,255), 0.15), rgba(var(--accent2-rgb, 255,0,229), 0.15))'
                    : 'transparent',
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  borderRadius: 10,
                  padding: '6px 10px',
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s',
                }}
                title={item.label}
              >
                <item.Icon size={18} color={isActive ? 'var(--accent)' : 'var(--text-dim)'} />
              </motion.button>
            );
          })}
        </div>

        {/* XP + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="led-text" style={{
              fontSize: 8,
              color: 'var(--warning)',
              marginBottom: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              justifyContent: 'flex-end',
            }}>
              LVL {level.level}
            </div>
            <div style={{
              width: 100,
              height: 6,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: 'var(--gradient-success)',
                  borderRadius: 3,
                  boxShadow: 'var(--glow-success)',
                }}
              />
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/settings')}
            style={{
              background: 'var(--gradient-primary)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: 'var(--glow-accent)',
              color: '#000',
            }}
          >
            {playerName ? playerName[0].toUpperCase() : '?'}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
