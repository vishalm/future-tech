import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Controller, Shield, UserIcon, Rocket, ArrowRight } from '../components/Icons';

export default function Auth({ login, register, error: authError, loading }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState(null);

  const error = authError || localError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('All fields are required');
      return;
    }

    if (mode === 'register' && !displayName.trim()) {
      setLocalError('Display name is required');
      return;
    }

    try {
      if (mode === 'login') {
        await login(username.trim(), password.trim());
      } else {
        await register(username.trim(), password.trim(), displayName.trim());
      }
    } catch {
      // Error is already set in the hook
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError(null);
  };

  return (
    <div style={styles.container}>
      {/* Background glow effects */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 0.8, bounce: 0.3 }}
        style={styles.card}
      >
        {/* Header */}
        <div style={styles.header}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, bounce: 0.5 }}
          >
            <Shield size={40} color="var(--accent)" />
          </motion.div>

          <h1 style={styles.title}>ENTER THE ARENA</h1>

          <div style={styles.subtitle}>
            <Controller size={18} color="var(--accent2)" />
            <span>FutureTech Academy</span>
          </div>
        </div>

        {/* Mode tabs */}
        <div style={styles.tabs}>
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                ...styles.tab,
                ...(mode === m ? styles.tabActive : {}),
              }}
            >
              {m === 'login' ? (
                <>
                  <ArrowRight size={14} /> LOGIN
                </>
              ) : (
                <>
                  <UserIcon size={14} /> REGISTER
                </>
              )}
              {mode === m && (
                <motion.div
                  layoutId="activeTab"
                  style={styles.tabIndicator}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              style={styles.fields}
            >
              {mode === 'register' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>DISPLAY NAME</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your arena name..."
                    style={styles.input}
                    autoComplete="name"
                  />
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  style={styles.input}
                  autoComplete="username"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  style={styles.input}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: [0, -5, 5, -3, 3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={styles.error}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            whileHover={loading ? {} : { scale: 1.02, boxShadow: 'var(--glow-accent)' }}
            whileTap={loading ? {} : { scale: 0.98 }}
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ...
              </motion.span>
            ) : (
              <>
                <Rocket size={18} />
                <span>ENTER</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Bottom decoration */}
        <div style={styles.bottomBar} />
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  bgGlow1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'var(--accent)',
    opacity: 0.05,
    filter: 'blur(100px)',
    top: '10%',
    left: '20%',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'var(--accent2)',
    opacity: 0.05,
    filter: 'blur(80px)',
    bottom: '15%',
    right: '15%',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--card)',
    borderRadius: 16,
    border: '1px solid var(--border)',
    padding: '40px 32px 32px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 28,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'var(--font-pixel, var(--font-main))',
    fontSize: 28,
    fontWeight: 900,
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '8px 0 0',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--text-dim)',
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: 'var(--font-main)',
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 24,
    background: 'var(--bg)',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-main)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
    cursor: 'pointer',
    position: 'relative',
    transition: 'color 0.2s',
  },
  tabActive: {
    color: 'var(--text)',
    background: 'var(--card)',
    boxShadow: 'var(--glow-accent)',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    background: 'var(--accent)',
    borderRadius: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-dim)',
    letterSpacing: 1.5,
    fontFamily: 'var(--font-main)',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    fontSize: 14,
    fontFamily: 'var(--font-main)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  error: {
    background: 'rgba(255, 0, 100, 0.1)',
    border: '1px solid rgba(255, 0, 100, 0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--danger, #ff0064)',
    fontSize: 13,
    fontFamily: 'var(--font-main)',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 24px',
    background: 'var(--gradient-primary)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 800,
    fontFamily: 'var(--font-main)',
    letterSpacing: 2,
    cursor: 'pointer',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    background: 'var(--gradient-primary)',
  },
};
