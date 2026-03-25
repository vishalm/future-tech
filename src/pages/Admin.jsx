import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Shield, UserIcon, Bracket, ChartBar, Crown, Logout } from '../components/Icons';

import { API_URL } from '../config';
const API = API_URL;

export default function Admin({ user, token, tracking }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    tracking.trackPageView('admin');
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = () => {
    fetch(`${API}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(r => r.json()).then(setUsers).catch(() => {});
  };

  const fetchStats = () => {
    fetch(`${API}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(r => r.json()).then(setStats).catch(() => {});
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'player' : 'admin';
    await fetch(`${API}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await fetch(`${API}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchUsers();
  };

  if (user?.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={48} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
          <h2>Access Denied</h2>
          <p style={{ color: 'var(--text-dim)' }}>You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'clamp(80px, 12vw, 100px) clamp(12px, 3vw, 24px) 80px',
      maxWidth: 1000,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 30 }}
      >
        <Shield size={48} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
        <h1 className="led-text" style={{
          fontSize: 'clamp(12px, 2vw, 18px)',
          color: 'var(--danger)',
          lineHeight: 1.8,
        }}>
          ADMIN PANEL
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
          Platform owner controls
        </p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 20vw, 160px), 1fr))',
          gap: 12,
          marginBottom: 24,
        }}>
          {[
            { label: 'Users', value: stats.totalUsers, color: 'var(--accent)' },
            { label: 'Competitions', value: stats.totalCompetitions, color: 'var(--accent2)' },
            { label: 'Active', value: stats.activeCompetitions, color: 'var(--success)' },
            { label: 'Sessions', value: stats.activeSessions, color: 'var(--warning)' },
            { label: 'Events', value: stats.totalEvents, color: 'var(--accent3)' },
            { label: 'Uptime', value: stats.uptime, color: 'var(--text-dim)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--gradient-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['users', 'activity'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: tab === t ? 'var(--accent)' : 'var(--card)',
              color: tab === t ? '#000' : 'var(--text-dim)',
              cursor: 'pointer',
              fontFamily: 'var(--font-main)',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {t === 'users' ? 'User Management' : 'Activity Log'}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 80px 60px 60px',
            padding: '10px 16px',
            fontSize: 10,
            fontFamily: 'var(--font-pixel)',
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border)',
            gap: 8,
          }}>
            <span>USER</span>
            <span>ROLE</span>
            <span>XP</span>
            <span>ROLE</span>
            <span>DEL</span>
          </div>

          {users.map(u => (
            <div key={u.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px 60px 60px',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
              gap: 8,
              background: u.id === user.id ? 'rgba(57,255,20,0.03)' : 'transparent',
              fontSize: 'clamp(12px, 1.5vw, 14px)',
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {u.displayName} {u.id === user.id && '(You)'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{u.username}</div>
              </div>
              <span style={{
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 9,
                fontFamily: 'var(--font-pixel)',
                background: u.role === 'admin' ? 'rgba(255,0,100,0.15)' : 'rgba(255,255,255,0.05)',
                color: u.role === 'admin' ? 'var(--danger)' : 'var(--text-muted)',
                textAlign: 'center',
              }}>
                {u.role?.toUpperCase() || 'PLAYER'}
              </span>
              <span style={{ color: 'var(--xp-color)', fontWeight: 600 }}>
                {u.gameState?.xp || 0}
              </span>
              <button
                onClick={() => toggleRole(u.id, u.role || 'player')}
                disabled={u.id === user.id}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--text-dim)',
                  cursor: u.id === user.id ? 'not-allowed' : 'pointer',
                  fontSize: 10,
                  opacity: u.id === user.id ? 0.3 : 1,
                  fontFamily: 'var(--font-main)',
                }}
              >
                {u.role === 'admin' ? 'Demote' : 'Promote'}
              </button>
              <button
                onClick={() => deleteUser(u.id)}
                disabled={u.id === user.id}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--danger)',
                  background: 'rgba(255,0,100,0.1)',
                  color: 'var(--danger)',
                  cursor: u.id === user.id ? 'not-allowed' : 'pointer',
                  fontSize: 10,
                  opacity: u.id === user.id ? 0.3 : 1,
                  fontFamily: 'var(--font-main)',
                }}
              >
                Del
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {tab === 'activity' && (
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 20,
          color: 'var(--text-dim)',
          textAlign: 'center',
        }}>
          <ChartBar size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p>Real-time activity is tracked via WebSocket monitoring.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Visit the server dashboard at <code style={{ color: 'var(--accent)' }}>localhost:3002/dashboard</code>
          </p>
        </div>
      )}
    </div>
  );
}
