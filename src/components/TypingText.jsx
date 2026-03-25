import { useState, useEffect } from 'react';

export default function TypingText({ text, speed = 50, delay = 0, style, className }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed]);

  return (
    <span style={style} className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span style={{
          display: 'inline-block',
          width: 2,
          height: '1em',
          background: 'var(--accent)',
          marginLeft: 2,
          animation: 'led-flicker 0.8s infinite',
          verticalAlign: 'text-bottom',
        }} />
      )}
    </span>
  );
}
