import React, { useState, useEffect, useCallback, useRef } from 'react';

const ANIMATION_STYLES = `
  @keyframes minePop {
    0% { transform: scale(0) rotate(-30deg); opacity: 0; }
    60% { transform: scale(1.3) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes shake {
    10%, 90% { transform: translate3d(-4px, 0, 0); }
    20%, 80% { transform: translate3d(8px, 2px, 0); }
    30%, 50%, 70% { transform: translate3d(-8px, -2px, 0); }
    40%, 60% { transform: translate3d(8px, 2px, 0); }
  }
  @keyframes flagPulse {
    0%, 100% { filter: drop-shadow(0 0 2px #2a9d8f); }
    50% { filter: drop-shadow(0 0 6px #2a9d8f) drop-shadow(0 0 10px #2a9d8f); }
  }
  @keyframes dangerPulse {
    0%, 100% { box-shadow: inset 0 0 0px rgba(239,68,68,0); }
    50% { box-shadow: inset 0 0 14px rgba(239,68,68,0.5); }
  }
  .flag-pulse { animation: flagPulse 1.8s ease-in-out infinite; }
  .danger-pulse { animation: dangerPulse 1.2s ease-in-out infinite; }
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 0.3; transform: scale(1); }
  }
  @keyframes titleGlow {
    0%, 100% { text-shadow: 0 0 8px #2a9d8f, 0 0 20px #2a9d8f; }
    50% { text-shadow: 0 0 20px #2a9d8f, 0 0 40px #2a9d8f, 0 0 60px #2a9d8f; }
  }
  @keyframes titleFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0; }
  }
  .track-fade { animation: trackFadeIn 0.25s ease-out forwards; }
  .title-glow { animation: titleGlow 2.5s ease-in-out infinite; }
  .title-fadein { animation: titleFadeUp 0.7s ease-out forwards; }
  .title-fadein-delay { animation: titleFadeUp 0.7s ease-out 0.3s both; }
  .title-fadein-delay2 { animation: titleFadeUp 0.7s ease-out 0.6s both; }
  .title-fadein-delay3 { animation: titleFadeUp 0.7s ease-out 0.9s both; }
  .blink { animation: blink 1.1s step-end infinite; }
  .game-btn {
    cursor: pointer;
    border: none;
    font-weight: 700;
    border-radius: 6px;
    color: white;
    transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.1s ease;
    box-shadow: 0 4px 0 rgba(0,0,0,0.35), 0 6px 12px rgba(0,0,0,0.3);
    position: relative;
    top: 0;
  }
  .game-btn:hover {
    filter: brightness(1.1);
    box-shadow: 0 6px 0 rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.35);
    top: -2px;
  }
  .game-btn:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2);
    filter: brightness(0.95);
    top: 3px;
  }
  .game-btn-lg {
    cursor: pointer;
    border: none;
    font-weight: 700;
    border-radius: 8px;
    color: white;
    transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.1s ease;
    box-shadow: 0 5px 0 rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.35);
    position: relative;
    top: 0;
  }
  .game-btn-lg:hover {
    filter: brightness(1.1);
    box-shadow: 0 7px 0 rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.4);
    top: -2px;
  }
  .game-btn-lg:active {
    transform: translateY(4px);
    box-shadow: 0 1px 0 rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25);
    filter: brightness(0.95);
    top: 4px;
  }
`;

// Confetti canvas component
const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#2a9d8f', '#eab308', '#ef4444', '#fef08a', '#264653', '#e76f51'];
    particlesRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2,
      drift: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotSpeed;
        // Respawn at top when it falls off bottom
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40,
    }} />
  );
};

// Smoke rising component for game over
const Smoke = ({ active, tankPos }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const spawnSmoke = () => {
      const cellW = canvas.width / 8;
      const cellH = canvas.height / 8;
      const originX = tankPos ? (tankPos.x + 0.5) * cellW : canvas.width / 2;
      const originY = tankPos ? (tankPos.y + 0.5) * cellH : canvas.height / 2;
      return {
        x: originX + (Math.random() - 0.5) * 20,
        y: originY + (Math.random() - 0.5) * 10,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 1.5 + 0.5,
        drift: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.25 + 0.1,
        life: 1,
        decay: Math.random() * 0.003 + 0.001,
        blur: Math.random() * 4 + 2,
      };
    };

    particlesRef.current = Array.from({ length: 20 }, spawnSmoke);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p, i) => {
        ctx.save();
        ctx.shadowBlur = p.blur * p.life * 6;
        ctx.shadowColor = `hsl(0, 0%, ${30 + (1 - p.life) * 40}%)`;
        ctx.globalAlpha = p.opacity * p.life;
        ctx.fillStyle = `hsl(0, 0%, ${30 + (1 - p.life) * 40}%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        p.y -= p.speed;
        p.x += p.drift;
        p.size += 0.3;
        p.life -= p.decay;
        if (p.life <= 0) particlesRef.current[i] = spawnSmoke();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1,
    }} />
  );
};

// Mine explosion pixel burst
const MineExplosion = ({ active, minePos }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cellW = canvas.width / GRID_SIZE.width;
    const cellH = canvas.height / GRID_SIZE.height;
    const cx = minePos ? (minePos.x + 0.5) * cellW : canvas.width / 2;
    const cy = minePos ? (minePos.y + 0.5) * cellH : canvas.height / 2;
    const colors = ['#ef4444', '#f97316', '#eab308', '#fef08a', '#e76f51', '#fff'];

    particlesRef.current = Array.from({ length: 25 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        decay: Math.random() * 0.01 + 0.005,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allFaded = true;
      particlesRef.current.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.vx *= 0.97;
        p.size *= 0.96;
        p.opacity -= p.decay;
        if (p.opacity > 0) allFaded = false;
      });
      if (!allFaded) animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }} />;
};

const TankIcon = ({ direction = 'right' }) => {
  const rotationDegrees = { up: 270, right: 0, down: 90, left: 180 };
  return (
    <svg viewBox="0 0 16 16" width="40" height="40" fill="none" stroke="none"
      style={{ transform: `rotate(${rotationDegrees[direction]}deg)`, transition: 'transform 150ms ease' }}>
      <rect x="2" y="4" width="12" height="8" fill="#264653" />
      <rect x="1" y="11" width="14" height="2" fill="#2a9d8f" />
      <rect x="1" y="3" width="14" height="2" fill="#2a9d8f" />
      <rect x="6" y="5" width="4" height="4" fill="#2a9d8f" />
      <rect x="9" y="6" width="6" height="2" fill="#2a9d8f" />
    </svg>
  );
};

const TrackMark = ({ direction, fresh }) => {
  const isVertical = direction === 'up' || direction === 'down';
  return (
    <div className={`absolute ${isVertical ? 'w-3 h-4' : 'w-4 h-3'} flex justify-between ${fresh ? 'track-fade' : 'opacity-30'}`}>
      <div className="bg-gray-700 w-1 h-full" />
      <div className="bg-gray-700 w-1 h-full" />
    </div>
  );
};

const MineIcon = () => (
  <svg viewBox="0 0 16 16" width="36" height="36" fill="none" stroke="none">
    <rect x="4" y="4" width="8" height="8" fill="#e76f51" />
    <rect x="7" y="2" width="2" height="2" fill="#e76f51" />
    <rect x="7" y="12" width="2" height="2" fill="#e76f51" />
    <rect x="2" y="7" width="2" height="2" fill="#e76f51" />
    <rect x="12" y="7" width="2" height="2" fill="#e76f51" />
    <rect x="3" y="3" width="2" height="2" fill="#e76f51" />
    <rect x="11" y="3" width="2" height="2" fill="#e76f51" />
    <rect x="3" y="11" width="2" height="2" fill="#e76f51" />
    <rect x="11" y="11" width="2" height="2" fill="#e76f51" />
  </svg>
);

const FlagIcon = () => (
  <svg viewBox="0 0 16 16" width="46" height="46" fill="none" stroke="none">
    <rect x="7" y="3" width="2" height="10" fill="#2a9d8f" />
    <rect x="5" y="12" width="6" height="2" fill="#2a9d8f" />
    <path d="M9 4 L13 4 L13 8 L9 8 Z" fill="#ef4444" />
  </svg>
);

const COLOR_SCHEMES = [
  { id: 'classic',    name: 'Classic',     unvisitedBg: '#fef08a', unvisitedBorder: '#fde047', visitedBg: '#fed7aa', visitedBorder: '#fb923c', fogBg: '#374151', fogBorder: '#4b5563', boardBg: '#1f2937', gridBorder: '#2a9d8f', unlockLevel: 1 },
  { id: 'military',   name: 'Military',    unvisitedBg: '#d9f99d', unvisitedBorder: '#a3e635', visitedBg: '#a1a1aa', visitedBorder: '#71717a', fogBg: '#1c1917', fogBorder: '#292524', boardBg: '#14532d', gridBorder: '#4ade80', unlockLevel: 5 },
  { id: 'desert',     name: 'Desert',      unvisitedBg: '#fde68a', unvisitedBorder: '#f59e0b', visitedBg: '#d97706', visitedBorder: '#b45309', fogBg: '#44403c', fogBorder: '#57534e', boardBg: '#78350f', gridBorder: '#f97316', unlockLevel: 10 },
  { id: 'arctic',     name: 'Arctic',      unvisitedBg: '#e0f2fe', unvisitedBorder: '#bae6fd', visitedBg: '#93c5fd', visitedBorder: '#60a5fa', fogBg: '#1e3a5f', fogBorder: '#1e40af', boardBg: '#0f172a', gridBorder: '#38bdf8', unlockLevel: 15 },
  { id: 'volcanic',   name: 'Volcanic',    unvisitedBg: '#fecaca', unvisitedBorder: '#f87171', visitedBg: '#7f1d1d', visitedBorder: '#991b1b', fogBg: '#1c1917', fogBorder: '#292524', boardBg: '#0c0a09', gridBorder: '#ef4444', unlockLevel: 20 },
  { id: 'nightops',   name: 'Night Ops',   unvisitedBg: '#334155', unvisitedBorder: '#475569', visitedBg: '#1e293b', visitedBorder: '#334155', fogBg: '#0f172a', fogBorder: '#1e293b', boardBg: '#020617', gridBorder: '#2a9d8f', unlockLevel: 25 },
  { id: 'jungle',     name: 'Jungle',      unvisitedBg: '#bbf7d0', unvisitedBorder: '#86efac', visitedBg: '#166534', visitedBorder: '#15803d', fogBg: '#14532d', fogBorder: '#166534', boardBg: '#052e16', gridBorder: '#22c55e', unlockLevel: 30 },
  { id: 'sandstorm',  name: 'Sand Storm',  unvisitedBg: '#fef3c7', unvisitedBorder: '#fde68a', visitedBg: '#92400e', visitedBorder: '#78350f', fogBg: '#451a03', fogBorder: '#78350f', boardBg: '#1c1917', gridBorder: '#d97706', unlockLevel: 35 },
  { id: 'bubblegum',  name: 'Bubblegum',   unvisitedBg: '#fce7f3', unvisitedBorder: '#f9a8d4', visitedBg: '#db2777', visitedBorder: '#be185d', fogBg: '#4a0020', fogBorder: '#831843', boardBg: '#1a0010', gridBorder: '#f472b6', unlockLevel: 40 },
  { id: 'toxic',      name: 'Toxic',       unvisitedBg: '#d9f99d', unvisitedBorder: '#bef264', visitedBg: '#365314', visitedBorder: '#3f6212', fogBg: '#0a0f00', fogBorder: '#1a2e05', boardBg: '#050800', gridBorder: '#a3e635', unlockLevel: 45 },
  { id: 'golden',     name: 'Golden',      unvisitedBg: '#fffbeb', unvisitedBorder: '#fde68a', visitedBg: '#92400e', visitedBorder: '#78350f', fogBg: '#1c1400', fogBorder: '#3d2b00', boardBg: '#0d0a00', gridBorder: '#fbbf24', unlockLevel: 50 },
  { id: 'deep_sea',   name: 'Deep Sea',    unvisitedBg: '#cffafe', unvisitedBorder: '#a5f3fc', visitedBg: '#164e63', visitedBorder: '#155e75', fogBg: '#020d12', fogBorder: '#0c2633', boardBg: '#010708', gridBorder: '#06b6d4', unlockLevel: 60 },
  { id: 'blood_moon', name: 'Blood Moon',  unvisitedBg: '#fee2e2', unvisitedBorder: '#fca5a5', visitedBg: '#450a0a', visitedBorder: '#7f1d1d', fogBg: '#0a0000', fogBorder: '#200000', boardBg: '#050000', gridBorder: '#dc2626', unlockLevel: 70 },
  { id: 'amethyst',   name: 'Amethyst',    unvisitedBg: '#f3e8ff', unvisitedBorder: '#d8b4fe', visitedBg: '#4c1d95', visitedBorder: '#5b21b6', fogBg: '#0d0020', fogBorder: '#1e0040', boardBg: '#07001a', gridBorder: '#a855f7', unlockLevel: 80 },
  { id: 'obsidian',   name: 'Obsidian',    unvisitedBg: '#e2e8f0', unvisitedBorder: '#94a3b8', visitedBg: '#0f0f0f', visitedBorder: '#1a1a1a', fogBg: '#000000', fogBorder: '#0a0a0a', boardBg: '#000000', gridBorder: '#64748b', unlockLevel: 90 },
  { id: 'prismatic',  name: 'Prismatic',   unvisitedBg: '#fef9c3', unvisitedBorder: '#fde68a', visitedBg: '#6d28d9', visitedBorder: '#7c3aed', fogBg: '#1e0040', fogBorder: '#2d0060', boardBg: '#0d0020', gridBorder: '#f0abfc', unlockLevel: 100 },
];

const GRID_SIZE = { width: 8, height: 8 };

const PRESS_TEXT = "Press any key to start";

const TitleScreen = ({ onStart, highScore, highScoreDate, hardHighScore, hardHighScoreDate }) => {
  const [typedText, setTypedText] = useState('');
  const [doneTyping, setDoneTyping] = useState(false);
  const [mode, setMode] = useState('easy');

  useEffect(() => {
    let i = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTypedText(PRESS_TEXT.slice(0, i));
        if (i >= PRESS_TEXT.length) { clearInterval(interval); setDoneTyping(true); }
      }, 55);
      return () => clearInterval(interval);
    }, 900);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'BUTTON') return;
      onStart(mode);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onStart, mode]);

  return (
    <div onClick={(e) => { if (e.target.tagName === 'BUTTON') return; onStart(mode); }} style={{
      width: '100vw', height: '100vh', background: '#0f172a',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 14, position: 'relative', overflow: 'hidden', cursor: 'pointer', fontFamily: 'monospace',
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
      }} />
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(42,157,143,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(42,157,143,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Tank icon */}
      <div className="title-fadein" style={{ zIndex: 2 }}>
        <svg viewBox="0 0 16 16" width="72" height="72" fill="none"
          style={{ filter: 'drop-shadow(0 0 8px #2a9d8f)' }}>
          <rect x="2" y="4" width="12" height="8" fill="#264653" />
          <rect x="1" y="11" width="14" height="2" fill="#2a9d8f" />
          <rect x="1" y="3" width="14" height="2" fill="#2a9d8f" />
          <rect x="6" y="5" width="4" height="4" fill="#2a9d8f" />
          <rect x="9" y="6" width="6" height="2" fill="#2a9d8f" />
        </svg>
      </div>

      {/* Title */}
      <div className="title-fadein-delay title-glow" style={{
        zIndex: 2, fontSize: 42, fontWeight: 900, color: '#fef08a', letterSpacing: 4,
      }}>
        TANK SWEEPER
      </div>

      {/* Subtitle */}
      <div className="title-fadein-delay2" style={{
        zIndex: 2, fontSize: 13, color: '#2a9d8f', letterSpacing: 4, textTransform: 'uppercase',
      }}>
        Idea by Sam
      </div>

      {/* Mode selector */}
      <div className="title-fadein-delay2" style={{ zIndex: 2, display: 'flex', gap: 10, marginTop: 8 }}>
        {['easy', 'hard'].map(m => (
          <button key={m} onClick={(e) => { e.stopPropagation(); setMode(m); }}
            style={{
              padding: '10px 32px', fontWeight: 800, fontSize: 15, fontFamily: 'monospace',
              borderRadius: 8,
              border: m === 'hard'
                ? `2px solid ${mode === m ? '#ef4444' : '#7f1d1d'}`
                : `2px solid ${mode === m ? '#2a9d8f' : '#374151'}`,
              background: m === 'hard'
                ? (mode === m ? '#7f1d1d' : '#1f2937')
                : (mode === m ? '#2a9d8f' : '#1f2937'),
              color: mode === m ? 'white' : '#6b7280',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 2,
              boxShadow: mode === m
                ? m === 'hard'
                  ? '0 0 18px #ef444488, 0 0 36px #ef444433'
                  : '0 0 12px #2a9d8f88'
                : 'none',
              transition: 'all 0.2s',
            }}>
            {m === 'easy' ? '🟢 Easy' : '🔴 Hard'}
          </button>
        ))}
      </div>
      <div className="title-fadein-delay2" style={{ zIndex: 2, fontSize: 11, color: '#4b5563', textAlign: 'center' }}>
        {mode === 'easy' ? 'Mine counts shown' : 'No counts — feel the pulse'}
      </div>

      {/* Per-mode best scores */}
      <div className="title-fadein-delay3" style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4, alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: mode === 'easy' ? '#2a9d8f' : '#4b5563', textAlign: 'center', transition: 'color 0.2s', fontFamily: 'monospace' }}>
          🟢 Easy best: Lvl {highScore}{highScoreDate ? ` · ${highScoreDate}` : ' · —'}
        </div>
        <div style={{ fontSize: 12, color: mode === 'hard' ? '#ef4444' : '#4b5563', textAlign: 'center', transition: 'color 0.2s', fontFamily: 'monospace' }}>
          🔴 Hard best: Lvl {hardHighScore}{hardHighScoreDate ? ` · ${hardHighScoreDate}` : ' · —'}
        </div>
      </div>
      <div className="title-fadein-delay3" style={{
        zIndex: 2, marginTop: 12, fontSize: 14, color: '#9ca3af',
        display: 'flex', alignItems: 'center', gap: 2, minHeight: 20,
      }}>
        {typedText}<span className={doneTyping ? 'blink' : ''}>_</span>
      </div>

    </div>
  );
};

const TankGame = () => {
  const [showTitle, setShowTitle] = useState(true);
  const [gameMode, setGameMode] = useState('easy');
  const [currentSchemeId, setCurrentSchemeId] = useState(() => localStorage.getItem('tankScheme') || 'classic');
  const [unlockedSchemes, setUnlockedSchemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tankUnlockedSchemes')) || ['classic']; }
    catch { return ['classic']; }
  });
  const [unlockNotif, setUnlockNotif] = useState(null);
  const [showSchemePanel, setShowSchemePanel] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [seenInstructions, setSeenInstructions] = useState(() => {
    return !!localStorage.getItem('tankGameSeenInstructions');
  });
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tankGameHighScore');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [highScoreDate, setHighScoreDate] = useState(() => {
    return localStorage.getItem('tankGameHighScoreDate') || null;
  });
  const [hardHighScore, setHardHighScore] = useState(() => {
    const saved = localStorage.getItem('tankGameHighScoreHard');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [hardHighScoreDate, setHardHighScoreDate] = useState(() => {
    return localStorage.getItem('tankGameHighScoreDateHard') || null;
  });
  const [revealedMines, setRevealedMines] = useState(new Set());
  const [tankVisualPos, setTankVisualPos] = useState({ x: 0, y: 4 });
  const [wipePhase, setWipePhase] = useState('idle');
  const [exploding, setExploding] = useState(false);
  const [explodeKey, setExplodeKey] = useState(0);
  const [lastTrackCell, setLastTrackCell] = useState(null);

  const getRandomFlagPos = useCallback((mines) => {
    let pos;
    do {
      const x = Math.floor(Math.random() * GRID_SIZE.width);
      const y = Math.floor(Math.random() * GRID_SIZE.height);
      pos = { x, y };
    } while (
      (pos.x === 0 && pos.y === 4) ||
      (Math.abs(pos.x - 0) + Math.abs(pos.y - 4) < 4) ||
      mines.some((m) => m.x === pos.x && m.y === pos.y)
    );
    return pos;
  }, []);

  const [gameState, setGameState] = useState({
    tankPos: { x: 0, y: 4 },
    tankDirection: 'right',
    mines: [],
    level: 1,
    flagPos: { x: GRID_SIZE.width - 1, y: 4 },
    gameOver: false,
    won: false,
    moves: 0,
    visitedCells: new Set(),
    trackMarks: new Map(),
  });

  // Staggered mine reveal on game over or level complete
  useEffect(() => {
    if (!gameState.gameOver && !gameState.won) { setRevealedMines(new Set()); setExploding(false); return; }
    if (gameState.gameOver) { setTimeout(() => { setExploding(true); setExplodeKey(k => k + 1); }, 16); }
    const timers = gameState.mines.map((_, i) =>
      setTimeout(() => {
        setRevealedMines(prev => new Set([...prev, i]));
      }, i * 120)
    );
    return () => timers.forEach(clearTimeout);
  }, [gameState.gameOver, gameState.won]);

  // Wipe transition on level complete
  useEffect(() => {
    if (!gameState.won) return;
    setWipePhase('idle');
  }, [gameState.won]);

  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    const modeLabel = gameMode === 'hard' ? '🔴 Hard Mode' : '🟢 Easy Mode';
    const text = `🎮 Tank Sweeper ${modeLabel} 🏆 Reached Level ${gameState.level} on 📅 ${new Date().toLocaleDateString()}\nPlay at: svazqu24.github.io/tank_sweeper/ and try to beat my score!`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }).catch(() => {
        // fallback
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleNextLevel = () => {
    setWipePhase('out');
    setTimeout(() => {
      initializeLevel(gameState.level + 1);
      setWipePhase('in');
      setTimeout(() => setWipePhase('idle'), 500);
    }, 500);
  };
  useEffect(() => {
    setTankVisualPos(gameState.tankPos);
  }, [gameState.tankPos]);

  useEffect(() => {
    if (!seenInstructions) {
      setShowInstructions(true);
      setSeenInstructions(true);
      localStorage.setItem('tankGameSeenInstructions', 'true');
    }
  }, []);

  const countNearbyMines = (x, y, mines) => {
    let count = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];
    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 && newX < GRID_SIZE.width &&
        newY >= 0 && newY < GRID_SIZE.height &&
        mines.some((mine) => mine.x === newX && mine.y === newY)
      ) count++;
    });
    return count;
  };

  const generateMines = (level, flagPos) => {
    const mines = [];
    const mineCount = Math.min(2 + (level - 1) * 2, 12);
    while (mines.length < mineCount) {
      const x = Math.floor(Math.random() * (GRID_SIZE.width - 2)) + 1;
      const y = Math.floor(Math.random() * GRID_SIZE.height);
      if (
        (x === 0 && y === 4) ||  // tank start
        (x === 1 && y === 4) ||  // cell directly in front of tank
        (x === flagPos.x && y === flagPos.y) ||
        mines.some((m) => m.x === x && m.y === y)
      ) continue;
      mines.push({ x, y });
    }
    return mines;
  };

  const initializeLevel = useCallback((level) => {
    const flagPos = level < 5
      ? { x: GRID_SIZE.width - 1, y: 4 }
      : getRandomFlagPos([]);
    const mines = generateMines(level, flagPos);
    setGameState({
      tankPos: { x: 0, y: 4 },
      tankDirection: 'right',
      mines,
      level,
      flagPos,
      gameOver: false,
      won: false,
      moves: 0,
      visitedCells: new Set(['0,4']),
      trackMarks: new Map(),
    });
    const isHard = gameMode === 'hard';
    const setScore = isHard ? setHardHighScore : setHighScore;
    const setDate = isHard ? setHardHighScoreDate : setHighScoreDate;
    const lsKey = isHard ? 'tankGameHighScoreHard' : 'tankGameHighScore';
    const lsDateKey = isHard ? 'tankGameHighScoreDateHard' : 'tankGameHighScoreDate';
    setScore(prev => {
      const next = Math.max(prev, level);
      if (next > prev) {
        const date = new Date().toLocaleDateString();
        localStorage.setItem(lsKey, next.toString());
        localStorage.setItem(lsDateKey, date);
        setDate(date);
        // Check for scheme unlocks at every 5 levels
        const newUnlock = COLOR_SCHEMES.find(s => s.unlockLevel === next);
        if (newUnlock) {
          setUnlockedSchemes(prev => {
            const updated = prev.includes(newUnlock.id) ? prev : [...prev, newUnlock.id];
            localStorage.setItem('tankUnlockedSchemes', JSON.stringify(updated));
            return updated;
          });
          setUnlockNotif(newUnlock.name);
          setTimeout(() => setUnlockNotif(null), 3500);
        }
      }
      return next;
    });
  }, [getRandomFlagPos, gameMode]);

  useEffect(() => { initializeLevel(1); }, []);

  useEffect(() => {
    let intervalId;
    if (gameState.level >= 10 && !gameState.gameOver && !gameState.won) {
      intervalId = setInterval(() => {
        setGameState((prev) => ({ ...prev, flagPos: getRandomFlagPos(prev.mines) }));
      }, 8000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [gameState.level, gameState.gameOver, gameState.won, getRandomFlagPos]);

  const handleMove = useCallback((direction) => {
    setGameState((prev) => {
      if (prev.gameOver || prev.won) return prev;
      const newPos = { ...prev.tankPos };
      let moved = false;
      if (direction === 'up' && newPos.y > 0) { newPos.y -= 1; moved = true; }
      else if (direction === 'down' && newPos.y < GRID_SIZE.height - 1) { newPos.y += 1; moved = true; }
      else if (direction === 'left' && newPos.x > 0) { newPos.x -= 1; moved = true; }
      else if (direction === 'right' && newPos.x < GRID_SIZE.width - 1) { newPos.x += 1; moved = true; }
      if (!moved) return prev;
      const oldCellKey = `${prev.tankPos.x},${prev.tankPos.y}`;
      setLastTrackCell(oldCellKey);
      const newTrackMarks = new Map(prev.trackMarks);
      newTrackMarks.set(oldCellKey, direction);
      const newVisitedCells = new Set(prev.visitedCells);
      const newCellKey = `${newPos.x},${newPos.y}`;
      newVisitedCells.add(newCellKey);
      if (prev.mines.some((mine) => mine.x === newPos.x && mine.y === newPos.y)) {
        return { ...prev, gameOver: true, visitedCells: newVisitedCells, trackMarks: newTrackMarks };
      }
      if (newPos.x === prev.flagPos.x && newPos.y === prev.flagPos.y) {
        return { ...prev, won: true, visitedCells: newVisitedCells, trackMarks: newTrackMarks };
      }
      return {
        ...prev,
        tankPos: newPos,
        tankDirection: direction,
        moves: prev.moves + 1,
        visitedCells: newVisitedCells,
        trackMarks: newTrackMarks,
      };
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyMap = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
      };
      const direction = keyMap[e.key];
      if (!direction) return;
      e.preventDefault();
      handleMove(direction);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const renderGrid = (scheme, mode) => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE.height; y++) {
      for (let x = 0; x < GRID_SIZE.width; x++) {
        const cellKey = `${x},${y}`;
        const isTank = gameState.tankPos.x === x && gameState.tankPos.y === y;
        const isMine = gameState.mines.some((mine) => mine.x === x && mine.y === y);
        const isEnd = x === gameState.flagPos.x && y === gameState.flagPos.y;
        const isVisited = gameState.visitedCells.has(cellKey);
        const trackDirection = gameState.trackMarks.get(cellKey);
        const mineCount = countNearbyMines(x, y, gameState.mines);
        const mineIndex = gameState.mines.findIndex(m => m.x === x && m.y === y);
        const adjacentToTank =
          Math.abs(gameState.tankPos.x - x) <= 1 &&
          Math.abs(gameState.tankPos.y - y) <= 1;

        // Fog of war: only active from level 5+
        const fogActive = gameState.level >= 5;
        const isRevealed = isVisited || adjacentToTank || isTank;
        const inFog = fogActive && !isRevealed;

        // Show mine counts only in easy mode
        const showMineCount = mode !== 'hard' && !isEnd && mineCount > 0 && (isVisited || (!fogActive && adjacentToTank));

        // Staggered mine reveal on game over/won
        const showMine = (gameState.gameOver || gameState.won) && isMine && revealedMines.has(mineIndex);

        // Pulse red only when tank is standing on this cell and it's near a mine
        const isDangerCell = isTank && !gameState.gameOver && !gameState.won &&
          gameState.mines.some(m => Math.abs(m.x - x) <= 1 && Math.abs(m.y - y) <= 1);

        const cellBg = inFog ? scheme.fogBg : isVisited ? scheme.visitedBg : scheme.unvisitedBg;
        const cellBorderColor = inFog ? scheme.fogBorder : isVisited ? scheme.visitedBorder : scheme.unvisitedBorder;

        cells.push(
          <div key={cellKey}
            className={['border', 'flex', 'items-center', 'justify-center', 'relative', isDangerCell ? 'danger-pulse' : ''].filter(Boolean).join(' ')}
            style={{ background: cellBg, borderColor: cellBorderColor }}
          >
            {isVisited && !isTank && trackDirection && (
              <TrackMark
                key={lastTrackCell === cellKey ? `${cellKey}-fresh` : cellKey}
                direction={trackDirection}
                fresh={lastTrackCell === cellKey}
              />
            )}
            <div className="relative w-full h-full flex items-center justify-center">
              {showMine && <div className="mine-pop"><MineIcon /></div>}
              {isEnd && (!fogActive || isRevealed) && <FlagIcon />}
            </div>
            {showMineCount && (
              <div className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold text-xs">
                {mineCount}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const scheme = COLOR_SCHEMES.find(s => s.id === currentSchemeId) || COLOR_SCHEMES[0];

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: scheme.boardBg, overflow: 'hidden' }}>
      <style>{ANIMATION_STYLES}</style>

      {showTitle && (
        <TitleScreen
          onStart={(mode) => { setShowTitle(false); setGameMode(mode); initializeLevel(1); }}
          highScore={highScore}
          highScoreDate={highScoreDate}
          hardHighScore={hardHighScore}
          hardHighScoreDate={hardHighScoreDate}
        />
      )}

      {!showTitle && <>
        <Confetti active={gameState.won} />

        {/* Unlock notification */}
        {unlockNotif && (
          <div style={{
            position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
            background: '#2a9d8f', color: 'white', fontWeight: 800, fontSize: 14,
            padding: '10px 24px', borderRadius: 8, zIndex: 100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)', fontFamily: 'monospace',
            animation: 'titleFadeUp 0.4s ease-out forwards',
          }}>
            🎨 New theme unlocked: {unlockNotif}!
          </div>
        )}

        {/* Header */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', borderBottom: `2px solid ${scheme.gridBorder}` }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#fef08a' }}>Tank Sweeper</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>Idea by Sam · {gameMode === 'hard' ? '🔴 Hard' : '🟢 Easy'}</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '22px', fontWeight: '700', color: '#fef08a' }}>
            <span>Level: {gameState.level}</span>
            <span>Moves: {gameState.moves}</span>
            <span>Best: Lvl {gameMode === 'hard' ? hardHighScore : highScore}</span>
          </div>
          {/* Hamburger menu */}
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowSchemePanel(p => !p)}
              className="game-btn"
              style={{ padding: '8px 16px', background: '#374151', fontSize: '22px', lineHeight: 1 }}>
              ☰
            </button>
            {showSchemePanel && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 60,
                background: '#1e293b', border: `2px solid ${scheme.gridBorder}`,
                borderRadius: 12, padding: 12,
                display: 'flex', flexDirection: 'column', gap: 4,
                minWidth: 200, boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                fontFamily: 'monospace',
              }}>
                {/* Actions */}
                <button type="button" onClick={() => { handleShare(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: '#374151', color: '#fef08a', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                  📤 {shareCopied ? '✓ Copied!' : 'Share Score'}
                </button>
                <button type="button" onClick={() => { setShowInstructions(true); setShowSchemePanel(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: '#374151', color: '#fef08a', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                  ❓ Instructions
                </button>
                <button type="button" onClick={() => { setShowTitle(true); setShowSchemePanel(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: '#374151', color: '#9ca3af', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                  ← Main Menu
                </button>

                {/* Divider */}
                <div style={{ height: 1, background: '#374151', margin: '4px 0' }} />

                {/* Theme label */}
                <div style={{ fontSize: 11, color: '#6b7280', padding: '2px 4px', letterSpacing: 1, textTransform: 'uppercase' }}>🎨 Themes</div>

                {/* Schemes */}
                {COLOR_SCHEMES.map(s => {
                  const isUnlocked = unlockedSchemes.includes(s.id);
                  const isActive = s.id === currentSchemeId;
                  return (
                    <button key={s.id} onClick={() => { if (isUnlocked) { setCurrentSchemeId(s.id); localStorage.setItem('tankScheme', s.id); setShowSchemePanel(false); } }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 6,
                        border: `2px solid ${isActive ? s.gridBorder : 'transparent'}`,
                        background: isActive ? s.boardBg : 'transparent',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.4,
                        color: isUnlocked ? 'white' : '#6b7280',
                        fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                      }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 2, background: s.unvisitedBg, border: `1px solid ${s.unvisitedBorder}` }} />
                        <div style={{ width: 12, height: 12, borderRadius: 2, background: s.visitedBg, border: `1px solid ${s.visitedBorder}` }} />
                        <div style={{ width: 12, height: 12, borderRadius: 2, background: s.fogBg, border: `1px solid ${s.fogBorder}` }} />
                      </div>
                      {s.name}
                      {!isUnlocked && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6b7280' }}>Lvl {s.unlockLevel}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', minHeight: 0, position: 'relative' }}>
          <div
            ref={(el) => {
              if (!el) return;
              if (gameState.gameOver) {
                el.classList.add('screen-shake');
                const clear = () => el.classList.remove('screen-shake');
                el.addEventListener('animationend', clear, { once: true });
              }
            }}
            style={{
              width: 'min(calc(100vw - 24px), calc(100vh - 80px))',
              height: 'min(calc(100vw - 24px), calc(100vh - 80px))',
              border: `4px solid ${scheme.gridBorder}`,
              borderRadius: '8px', overflow: 'hidden',
              boxShadow: `0 10px 25px rgba(0,0,0,0.5)`,
              position: 'relative',
            }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              e.currentTarget._touchStart = { x: t.clientX, y: t.clientY };
            }}
            onTouchEnd={(e) => {
              const start = e.currentTarget._touchStart;
              if (!start) return;
              const dx = e.changedTouches[0].clientX - start.x;
              const dy = e.changedTouches[0].clientY - start.y;
              if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
              if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
              else handleMove(dy > 0 ? 'down' : 'up');
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE.width}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE.height}, 1fr)`,
              width: '100%', height: '100%',
            }}>
              {renderGrid(scheme, gameMode)}
            </div>

            {/* Tank overlay */}
            <div style={{
              position: 'absolute',
              width: `${100 / GRID_SIZE.width}%`,
              height: `${100 / GRID_SIZE.height}%`,
              left: `${(tankVisualPos.x / GRID_SIZE.width) * 100}%`,
              top: `${(tankVisualPos.y / GRID_SIZE.height) * 100}%`,
              transition: 'left 120ms ease, top 120ms ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <TankIcon direction={gameState.tankDirection} />
            </div>

            {/* Wipe transition */}
            {wipePhase !== 'idle' && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 20,
                background: scheme.gridBorder,
                transform: wipePhase === 'out' ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.5s ease-in-out',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>Level {gameState.level + 1}</div>
              </div>
            )}
          </div>

          {/* Game Over overlay */}
          {gameState.gameOver && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Smoke active={gameState.gameOver} tankPos={gameState.tankPos} />
              <MineExplosion key={explodeKey} active={exploding} minePos={gameState.tankPos} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>💥 Game Over!</div>
                <div style={{ color: '#fef08a', fontSize: '1rem' }}>You reached Level {gameState.level}</div>
                <button type="button" onClick={() => initializeLevel(1)} className="game-btn-lg" style={{ padding: '10px 24px', background: '#2a9d8f', fontSize: '1rem' }}>Try Again</button>
              </div>
            </div>
          )}

          {/* Level Complete overlay */}
          {gameState.won && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2a9d8f' }}>🏁 Level {gameState.level} Complete!</div>
              <div style={{ color: '#fef08a', fontSize: '1rem' }}>Completed in {gameState.moves} moves</div>
              <button type="button" onClick={handleNextLevel} className="game-btn-lg" style={{ padding: '10px 24px', background: '#2a9d8f', fontSize: '1rem' }}>Next Level →</button>
            </div>
          )}
        </div>

        {/* Instructions modal */}
        {showInstructions && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ background: '#374151', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '100%', color: '#fef08a' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>How to Play Tank Sweeper</h2>
              <ul style={{ lineHeight: '2', marginBottom: '16px', paddingLeft: '4px', listStyle: 'none' }}>
                <li>• Use arrow keys or WASD to move your tank</li>
                <li>• Reach the flag to complete each level</li>
                <li>• {gameMode === 'easy' ? 'Numbers show how many mines are nearby' : 'No numbers — trust the red pulse warning'}</li>
                <li>• The map gets darker as levels increase</li>
                <li>• Watch out — the flag may start to move!</li>
                <li>• Every 5 levels unlocks a new color theme!</li>
              </ul>
              <button type="button" onClick={() => setShowInstructions(false)} className="game-btn-lg" style={{ width: '100%', padding: '10px', background: '#2a9d8f', fontSize: '1rem' }}>Got it!</button>
            </div>
          </div>
        )}
      </>}
    </div>
  );
};

export default TankGame;