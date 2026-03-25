import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Podium, Trophy, Crown, Medal, ChartBar } from '../components/Icons';
import { API_URL } from '../config';

export default function Leaderboard({ user, tracking }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tracking.trackPageView('leaderboard');
    fetch(`${API_URL}/api/leaderboard`)
      .then(r => r.json())
      .then(data => { setLeaders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const myRank = leaders.findIndex(l => l.displayName === user?.displayName) + 1;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 20px 80px',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <Podium size={56} color="var(--accent)" style={{ margin: '0 auto 12px' }} />
        <h1 className="led-text" style={{
          fontSize: 'clamp(14px, 2.5vw, 20px)',
          color: 'var(--accent)',
          lineHeight: 1.8,
        }}>
          LEADERBOARD
        </h1>
        {myRank > 0 && (
          <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>
            Your rank: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>#{myRank}</span> of {leaders.length} players
          </p>
        )}
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Loading rankings...</div>
      ) : leaders.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>
          <Trophy size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p>No players yet! Be the first to earn XP.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 16,
            marginBottom: 40,
          }}>
            {[1, 0, 2].map((idx) => {
              const p = top3[idx];
              if (!p) return null;
              const rank = idx + 1;
              const heights = { 1: 160, 2: 120, 3: 100 };
              const colors = { 1: 'var(--warning)', 2: 'var(--accent)', 3: 'var(--accent2)' };
              const isMe = p.displayName === user?.displayName;

              return (
                <motion.div
                  key={rank}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rank * 0.15 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: rank === 1 ? 140 : 120,
                  }}
                >
                  {rank === 1 && <Crown size={28} color={colors[1]} style={{ marginBottom: 8 }} />}
                  <div style={{
                    width: rank === 1 ? 56 : 44,
                    height: rank === 1 ? 56 : 44,
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: rank === 1 ? 20 : 16,
                    border: isMe ? '3px solid var(--success)' : '2px solid transparent',
                    marginBottom: 8,
                  }}>
                    {p.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isMe ? 'var(--success)' : 'var(--text)',
                    marginBottom: 4,
                    textAlign: 'center',
                  }}>
                    {p.displayName} {isMe && '(YOU)'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>
                    {p.xp} XP
                  </div>
                  <div style={{
                    width: '100%',
                    height: heights[rank],
                    background: `linear-gradient(180deg, ${colors[rank]}33, ${colors[rank]}11)`,
                    border: `2px solid ${colors[rank]}44`,
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: rank === 1 ? 24 : 18,
                    color: colors[rank],
                  }}>
                    #{rank}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rest of leaderboard */}
          <div style={{
            background: 'var(--gradient-card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {rest.map((p, i) => {
              const rank = i + 4;
              const isMe = p.displayName === user?.displayName;
              return (
                <motion.div
                  key={rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--border)',
                    background: isMe ? 'rgba(57,255,20,0.05)' : 'transparent',
                  }}
                >
                  <span style={{
                    width: 40,
                    fontFamily: 'var(--font-pixel)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                  }}>
                    #{rank}
                  </span>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--card-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    marginRight: 12,
                    border: isMe ? '2px solid var(--success)' : 'none',
                  }}>
                    {p.displayName?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isMe ? 'var(--success)' : 'var(--text)',
                    }}>
                      {p.displayName} {isMe && '(YOU)'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Lvl {p.level} · {p.modulesCompleted} modules
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: 10,
                    color: 'var(--xp-color)',
                  }}>
                    {p.xp} XP
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
