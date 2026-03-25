import { useEffect, useRef, Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;

    let animId;
    let running = true;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const colors = ['#00f0ff', '#ff00e5', '#39ff14', '#b026ff', '#ffe600', '#ff6b00'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      if (!running || !ctx || !canvas) return;

      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.pulse += 0.02;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          const glowSize = Math.max(0.5, p.size + Math.sin(p.pulse) * 1.5);

          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity * (0.5 + Math.sin(p.pulse) * 0.3));
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.05;
          ctx.fill();
        }

        ctx.globalAlpha = 0.06;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 22500) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        ctx.globalAlpha = 1;
      } catch {
        running = false;
        return;
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default function ParticleField() {
  return (
    <ErrorBoundary>
      <ParticleCanvas />
    </ErrorBoundary>
  );
}
