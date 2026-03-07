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
  .mine-pop { animation: minePop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .screen-shake { animation: shake 1.2s cubic-bezier(.36,.07,.19,.97) both; }
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

    particlesRef.current = Array.from({ length: 30 }, spawnSmoke);

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

    particlesRef.current = Array.from({ length: 40 }, () => {
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

const TrackMark = ({ direction }) => {
  const isVertical = direction === 'up' || direction === 'down';
  return (
    <div className={`absolute ${isVertical ? 'w-3 h-4' : 'w-4 h-3'} flex justify-between opacity-30`}>
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
  <svg viewBox="0 0 16 16" width="36" height="36" fill="none" stroke="none">
    <rect x="7" y="3" width="2" height="10" fill="#2a9d8f" />
    <rect x="5" y="12" width="6" height="2" fill="#2a9d8f" />
    <path d="M9 4 L13 4 L13 8 L9 8 Z" fill="#ef4444" />
  </svg>
);

const GRID_SIZE = { width: 8, height: 8 };

const TankGame = () => {
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
  const [revealedMines, setRevealedMines] = useState(new Set());
  const [tankVisualPos, setTankVisualPos] = useState({ x: 0, y: 4 });
  const [wipePhase, setWipePhase] = useState('idle'); // idle | out | in
  const [exploding, setExploding] = useState(false);
  const [explodeKey, setExplodeKey] = useState(0);

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
    if (gameState.gameOver) { setExploding(true); setExplodeKey(k => k + 1); }
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
    const text = `🎮 Tank Sweeper 🏆 Reached Level ${gameState.level} on 📅 ${new Date().toLocaleDateString()}\nPlay at: svazqu24.github.io/tank_sweeper/ and try to beat my score!`;
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
    setHighScore(prev => {
      const next = Math.max(prev, level);
      if (next > prev) {
        const date = new Date().toLocaleDateString();
        localStorage.setItem('tankGameHighScore', next.toString());
        localStorage.setItem('tankGameHighScoreDate', date);
        setHighScoreDate(date);
      }
      return next;
    });
  }, [getRandomFlagPos]);

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

  const renderGrid = () => {
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

        // Show mine counts on visited cells; before fog kicks in also show adjacent
        const showMineCount = !isEnd && mineCount > 0 && (isVisited || (!fogActive && adjacentToTank));

        // Staggered mine reveal on game over/won
        const showMine = (gameState.gameOver || gameState.won) && isMine && revealedMines.has(mineIndex);

        const cellClasses = [
          'border', 'flex', 'items-center', 'justify-center', 'relative',
          inFog
            ? 'bg-gray-700 border-gray-600'
            : isVisited
              ? 'bg-orange-200 border-orange-400'
              : 'bg-yellow-200 border-yellow-300',
          isEnd && (!fogActive || isRevealed) ? 'bg-teal-500' : '',
        ].filter(Boolean).join(' ');
        cells.push(
          <div key={cellKey} className={cellClasses}>
            {isVisited && !isTank && trackDirection && <TrackMark direction={trackDirection} />}
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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1f2937', overflow: 'hidden' }}>
      <style>{ANIMATION_STYLES}</style>
      <Confetti active={gameState.won} />

      {/* Header — fixed height */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', borderBottom: '2px solid #2a9d8f' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#fef08a' }}>Tank Sweeper</div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>Idea by Sam</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '22px', fontWeight: '700', color: '#fef08a' }}>
          <span>Level: {gameState.level}</span>
          <span>Moves: {gameState.moves}</span>
          <span>
            Best: {highScore}
            {highScoreDate && <span style={{ fontSize: '11px', fontWeight: '400', marginLeft: '4px', opacity: 0.7 }}>({highScoreDate})</span>}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handleShare}
            className="game-btn"
            style={{ padding: '8px 18px', background: shareCopied ? '#16a34a' : '#e76f51', fontSize: '18px', transition: 'background 0.2s, transform 0.1s, box-shadow 0.1s, filter 0.1s' }}>
            {shareCopied ? '✓ Copied!' : 'Share'}
          </button>
          <button type="button" onClick={() => setShowInstructions(true)}
            className="game-btn"
            style={{ padding: '8px 18px', background: '#eab308', fontSize: '18px' }}>
            Instructions
          </button>
          <button type="button" onClick={() => initializeLevel(1)}
            className="game-btn"
            style={{ padding: '8px 18px', background: '#2a9d8f', fontSize: '18px' }}>
            New Game
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', minHeight: 0, position: 'relative' }}>
        
        {/* Grid wrapper — position:relative so tank overlay works */}
        <div
          key={gameState.gameOver ? 'shaking' : 'still'}
          className={gameState.gameOver ? 'screen-shake' : ''}
          style={{
            width: 'min(calc(100vw - 24px), calc(100vh - 80px))',
            height: 'min(calc(100vw - 24px), calc(100vh - 80px))',
            border: '4px solid #2a9d8f',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
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
            if (Math.abs(dx) > Math.abs(dy)) {
              handleMove(dx > 0 ? 'right' : 'left');
            } else {
              handleMove(dy > 0 ? 'down' : 'up');
            }
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE.width}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE.height}, 1fr)`,
            width: '100%',
            height: '100%',
          }}>
            {renderGrid()}
          </div>

          {/* Smooth tank overlay — absolutely positioned over the grid */}
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

          {/* Wipe transition overlay */}
          {wipePhase !== 'idle' && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 20,
              background: '#2a9d8f',
              transform: wipePhase === 'out' ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.5s ease-in-out',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
                Level {gameState.level + 1}
              </div>
            </div>
          )}
        </div>

        {/* Game Over overlay */}
        {gameState.gameOver && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '12px',
          }}>
            <Smoke active={gameState.gameOver} tankPos={gameState.tankPos} />
            <MineExplosion key={explodeKey} active={exploding} minePos={gameState.tankPos} />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>💥 Game Over!</div>
              <div style={{ color: '#fef08a', fontSize: '1rem' }}>You reached Level {gameState.level}</div>
              <button type="button" onClick={() => initializeLevel(1)}
                className="game-btn-lg"
                style={{ padding: '10px 24px', background: '#2a9d8f', fontSize: '1rem' }}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Level Complete overlay */}
        {gameState.won && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '12px',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2a9d8f' }}>🏁 Level {gameState.level} Complete!</div>
            <div style={{ color: '#fef08a', fontSize: '1rem' }}>Completed in {gameState.moves} moves</div>
            <button type="button" onClick={handleNextLevel}
              className="game-btn-lg"
              style={{ padding: '10px 24px', background: '#2a9d8f', fontSize: '1rem' }}>
              Next Level →
            </button>
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
              <li>• Avoid mines — numbers tell you how close they are</li>
              <li>• The map gets darker as levels increase</li>
              <li>• Watch out — the flag may start to move!</li>
              <li>• Try to reach the highest level possible!</li>
            </ul>
            <button type="button" onClick={() => setShowInstructions(false)}
              className="game-btn-lg"
              style={{ width: '100%', padding: '10px', background: '#2a9d8f', fontSize: '1rem' }}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TankGame;