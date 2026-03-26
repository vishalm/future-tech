import { useState, useEffect } from 'react';
import { Clock } from './Icons';

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="live-clock-container" style={{
      position: 'fixed',
      top: 62,
      right: 12,
      zIndex: 998,
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'column',
      gap: 2,
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        padding: '4px 10px',
        borderRadius: 8,
        border: '1px solid var(--border)',
      }}>
        <Clock size={11} color="var(--accent)" />
        <span style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 9,
          color: 'var(--accent)',
          letterSpacing: 1,
        }}>
          {time}
        </span>
      </div>
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        padding: '2px 8px',
        borderRadius: 6,
        border: '1px solid var(--border)',
      }}>
        <span style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 7,
          color: 'var(--text-muted)',
          letterSpacing: 0.5,
        }}>
          {date} · {tz.split('/').pop().replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
