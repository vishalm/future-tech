import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Book, Newspaper, Trophy, ChartBar, Podium, Bracket, Controller, Shield, Galaxy, Menu, XClose, Settings, DynamicIcon } from './Icons';

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
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* ═══════ Top Bar ═══════ */}
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
          padding: '0 clamp(10px, 3vw, 20px)',
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
        }}>
          {/* Logo */}
          <motion.div
            onClick={() => handleNav('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Controller size={22} color="var(--accent)" />
            </motion.div>
            <span className="led-text gradient-text" style={{ fontSize: 9, letterSpacing: 1 }}>
              FUTURETECH
            </span>
          </motion.div>

          {/* Desktop Nav Items — hidden on mobile */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 2 }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: isActive
                      ? 'rgba(0, 240, 255, 0.1)'
                      : 'transparent',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    borderRadius: 10,
                    padding: '5px 8px',
                    color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.2s',
                    fontSize: 11,
                    fontFamily: 'var(--font-main)',
                    fontWeight: 600,
                  }}
                  title={item.label}
                >
                  <item.Icon size={16} color={isActive ? 'var(--accent)' : 'var(--text-dim)'} />
                  <span className="nav-label">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right side: XP + Avatar + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* XP bar — always visible */}
            <div style={{ textAlign: 'right' }}>
              <div className="led-text" style={{
                fontSize: 7,
                color: 'var(--warning)',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                justifyContent: 'flex-end',
              }}>
                {level.icon && <DynamicIcon name={level.icon} size={10} color="var(--warning)" />}
                LVL {level.level}
              </div>
              <div style={{
                width: 'clamp(50px, 10vw, 90px)',
                height: 5,
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

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => handleNav('/settings')}
              style={{
                background: 'var(--gradient-primary)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: 'var(--glow-accent)',
                color: '#000',
                flexShrink: 0,
              }}
            >
              {playerName ? playerName[0].toUpperCase() : '?'}
            </motion.div>

            {/* Hamburger — mobile only */}
            <motion.button
              className="nav-burger"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.85 }}
              style={{
                display: 'none', // overridden by CSS media query
                background: menuOpen ? 'rgba(0,240,255,0.1)' : 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 6,
                cursor: 'pointer',
                color: 'var(--accent)',
                flexShrink: 0,
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <XClose size={20} color="var(--accent)" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} color="var(--accent)" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════ Mobile Drawer ═══════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 998,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(280px, 80vw)',
                zIndex: 999,
                background: 'var(--bg)',
                borderLeft: '2px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Drawer Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#000',
                    boxShadow: 'var(--glow-accent)',
                  }}>
                    {playerName ? playerName[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{playerName}</div>
                    <div className="led-text" style={{ fontSize: 7, color: 'var(--warning)' }}>
                      LVL {level.level} · {level.title}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => setMenuOpen(false)}
                  whileTap={{ scale: 0.85 }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-dim)',
                    padding: 4,
                  }}
                >
                  <XClose size={20} />
                </motion.button>
              </div>

              {/* XP Card in drawer */}
              <div style={{
                margin: '12px 16px',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 14,
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>XP Progress</span>
                  <span className="led-text" style={{ fontSize: 8, color: 'var(--xp-color)' }}>{xp} XP</span>
                </div>
                <div style={{
                  width: '100%',
                  height: 8,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                      height: '100%',
                      background: 'var(--gradient-success)',
                      borderRadius: 4,
                      boxShadow: 'var(--glow-success)',
                    }}
                  />
                </div>
              </div>

              {/* Nav Items */}
              <div style={{ flex: 1, padding: '4px 12px' }}>
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, type: 'spring', stiffness: 300 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        marginBottom: 2,
                        background: isActive ? 'rgba(0,240,255,0.08)' : 'transparent',
                        border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                        borderRadius: 12,
                        color: isActive ? 'var(--accent)' : 'var(--text)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-main)',
                        fontSize: 15,
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <item.Icon size={20} color={isActive ? 'var(--accent)' : 'var(--text-dim)'} />
                      {item.label}
                      {isActive && (
                        <div style={{
                          marginLeft: 'auto',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          boxShadow: '0 0 8px var(--accent)',
                        }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
              }}>
                <motion.button
                  onClick={() => handleNav('/settings')}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-main)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <Settings size={18} color="var(--text-dim)" />
                  Settings
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
