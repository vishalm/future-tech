import { motion } from 'framer-motion';
import { newsFeed } from '../data/newsFeed';
import { DynamicIcon, Newspaper } from './Icons';

export default function NewsFeed() {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
      }}>
        <Newspaper size={18} color="var(--accent2)" />
        <span className="led-text" style={{
          fontSize: 9,
          color: 'var(--accent2)',
        }}>
          LATEST TECH NEWS
        </span>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--danger)',
          animation: 'led-flicker 1.5s infinite',
        }} />
      </div>

      <div style={{
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 8,
        scrollbarWidth: 'thin',
      }}>
        {newsFeed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, boxShadow: 'var(--glow-accent)' }}
            style={{
              minWidth: 260,
              maxWidth: 260,
              background: 'var(--gradient-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 16,
              flexShrink: 0,
              cursor: 'default',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}>
              <DynamicIcon name={item.icon} size={18} color="var(--accent)" />
              <span style={{
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--accent)',
              }}>
                {item.category}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {item.date}
              </span>
            </div>

            <h4 style={{
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 6,
              color: 'var(--text)',
            }}>
              {item.headline}
            </h4>

            <p style={{
              fontSize: 12,
              lineHeight: 1.4,
              color: 'var(--text-dim)',
            }}>
              {item.summary}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
