import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Palette, UserIcon, Logout, Check } from '../components/Icons';
import { themeList } from '../theme/themes';
import { useTheme } from '../theme/ThemeContext';

export default function Settings({ user, logout, resetProgress, updateProfile }) {
  const { themeId, switchTheme } = useTheme();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled by hook
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 },
    }),
  };

  return (
    <div style={styles.container}>
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        style={styles.titleRow}
      >
        <SettingsIcon size={32} color="var(--accent)" />
        <h1 style={styles.pageTitle}>SETTINGS</h1>
      </motion.div>

      {/* Section 1: Profile */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={styles.section}
      >
        <div style={styles.sectionHeader}>
          <UserIcon size={20} color="var(--accent)" />
          <h2 style={styles.sectionTitle}>PROFILE</h2>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>USERNAME</label>
          <div style={styles.readonlyField}>
            {user?.username || 'N/A'}
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>DISPLAY NAME</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={styles.input}
            placeholder="Your arena name..."
          />
        </div>

        <motion.button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{
            ...styles.saveBtn,
            opacity: saving ? 0.6 : 1,
            background: saved ? 'var(--gradient-success)' : 'var(--gradient-primary)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saved ? (
            <>
              <Check size={16} /> SAVED
            </>
          ) : saving ? (
            'SAVING...'
          ) : (
            'SAVE CHANGES'
          )}
        </motion.button>
      </motion.div>

      {/* Section 2: Theme Selector */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={styles.section}
      >
        <div style={styles.sectionHeader}>
          <Palette size={20} color="var(--accent2)" />
          <h2 style={styles.sectionTitle}>THEME</h2>
        </div>

        <div style={styles.themeGrid}>
          {themeList.map((theme) => {
            const isActive = themeId === theme.id;
            return (
              <motion.button
                key={theme.id}
                onClick={() => switchTheme(theme.id)}
                style={{
                  ...styles.themeCard,
                  border: isActive
                    ? '2px solid var(--accent)'
                    : '1px solid var(--border)',
                  boxShadow: isActive ? 'var(--glow-accent)' : 'none',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  style={{
                    ...styles.themePreview,
                    background: theme.preview || theme.vars['--bg'],
                    border: `2px solid ${theme.vars['--accent']}`,
                    boxShadow: `0 0 10px ${theme.vars['--accent']}40`,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: theme.vars['--accent'],
                    }}
                  />
                </div>

                <span style={styles.themeName}>{theme.name}</span>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      style={styles.activeBadge}
                    >
                      ACTIVE
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Section 3: Danger Zone */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={{
          ...styles.section,
          border: '1px solid rgba(255, 0, 100, 0.2)',
        }}
      >
        <div style={styles.sectionHeader}>
          <h2 style={{ ...styles.sectionTitle, color: 'var(--danger, #ff0064)' }}>
            DANGER ZONE
          </h2>
        </div>

        <div style={styles.dangerActions}>
          <motion.button
            onClick={logout}
            style={styles.logoutBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logout size={16} />
            LOG OUT
          </motion.button>

          <motion.button
            onClick={handleReset}
            style={{
              ...styles.resetBtn,
              background: confirmReset
                ? 'var(--danger, #ff0064)'
                : 'transparent',
              color: confirmReset ? '#fff' : 'var(--danger, #ff0064)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {confirmReset ? 'CONFIRM RESET' : 'RESET PROGRESS'}
          </motion.button>

          <AnimatePresence>
            {confirmReset && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => setConfirmReset(false)}
                style={styles.cancelBtn}
              >
                CANCEL
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px 20px 80px',
    maxWidth: 600,
    margin: '0 auto',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  pageTitle: {
    fontFamily: 'var(--font-pixel, var(--font-main))',
    fontSize: 28,
    fontWeight: 900,
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: 2,
  },
  section: {
    background: 'var(--card)',
    borderRadius: 14,
    border: '1px solid var(--border)',
    padding: '24px',
    marginBottom: 20,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'var(--font-main)',
    fontSize: 14,
    fontWeight: 800,
    color: 'var(--text)',
    margin: 0,
    letterSpacing: 2,
  },
  fieldGroup: {
    marginBottom: 16,
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
  readonlyField: {
    padding: '12px 14px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-dim)',
    fontSize: 14,
    fontFamily: 'var(--font-main)',
    opacity: 0.7,
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
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '12px',
    background: 'var(--gradient-primary)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 12,
    fontWeight: 800,
    fontFamily: 'var(--font-main)',
    letterSpacing: 1.5,
    cursor: 'pointer',
    marginTop: 4,
  },
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  themeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '16px 8px',
    background: 'var(--bg)',
    borderRadius: 12,
    cursor: 'pointer',
    position: 'relative',
    fontFamily: 'var(--font-main)',
  },
  themePreview: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  activeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: 8,
    fontWeight: 800,
    color: '#fff',
    background: 'var(--accent)',
    padding: '2px 6px',
    borderRadius: 4,
    letterSpacing: 1,
  },
  dangerActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '1px solid var(--danger, #ff0064)',
    borderRadius: 8,
    color: 'var(--danger, #ff0064)',
    fontSize: 12,
    fontWeight: 800,
    fontFamily: 'var(--font-main)',
    letterSpacing: 1.5,
    cursor: 'pointer',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '12px',
    border: '1px solid var(--danger, #ff0064)',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 800,
    fontFamily: 'var(--font-main)',
    letterSpacing: 1.5,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
  cancelBtn: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-dim)',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'var(--font-main)',
    letterSpacing: 1.5,
    cursor: 'pointer',
  },
};
