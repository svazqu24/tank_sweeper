import React, { useState, useEffect } from 'react';

// [Previous icon components remain the same]
const TankIcon = ({ direction = 'right' }) => {
  const rotationDegrees = {
    up: 270,
    right: 0,
    down: 90,
    left: 180,
  };

  return (
    <svg
      viewBox="0 0 16 16"
      width="40"
      height="40"
      fill="none"
      stroke="none"
      style={{ transform: `rotate(${rotationDegrees[direction]}deg)` }}
    >
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
    <div
      className={`absolute ${isVertical ? 'w-3 h-4' : 'w-4 h-3'} flex justify-between opacity-30`}
    >
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

const TankGame = () => {
  const GRID_SIZE = { width: 8, height: 8 };
  const [showInstructions, setShowInstructions] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tankGameHighScore');
    return saved ? parseInt(saved, 10) : 1;
  });

  const getRandomFlagPos = (mines) => {
    let pos;
    do {
      const x = Math.floor(Math.random() * GRID_SIZE.width);
      const y = Math.floor(Math.random() * GRID_SIZE.height);
      pos = { x, y };
    } while (pos.x === 0 && pos.y === 4);
    return pos;
  };

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

  const countNearbyMines = (x, y) => {
    let count = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0], [1, 1],
    ];
    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 &&
        newX < GRID_SIZE.width &&
        newY >= 0 &&
        newY < GRID_SIZE.height &&
        gameState.mines.some((mine) => mine.x === newX && mine.y === newY)
      ) {
        count++;
      }
    });
    return count;
  };

  const generateMines = (level, flagPos) => {
    const mines = [];
    const mineCount = Math.min(2 + (level - 1) * 2, 12); // Increased max mines to 12
    while (mines.length < mineCount) {
      const x = Math.floor(Math.random() * (GRID_SIZE.width - 2)) + 1;
      const y = Math.floor(Math.random() * GRID_SIZE.height);
      if (
        (x === 0 && y === 4) || // Don't spawn on start
        (x === flagPos.x && y === flagPos.y) || // Don't spawn on flag
        mines.some((m) => m.x === x && m.y === y) // Don't spawn on other mines
      ) {
        continue;
      }
      mines.push({ x, y });
    }
    return mines;
  };

  const initializeLevel = (level) => {
    const flagPos =
      level < 5
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

    // Update high score if current level is higher
    if (level > highScore) {
      setHighScore(level);
      localStorage.setItem('tankGameHighScore', level.toString());
    }
  };

  // [Previous useEffect hooks remain the same]
  useEffect(() => {
    initializeLevel(1);
  }, []);

  useEffect(() => {
    let intervalId;
    if (gameState.level >= 5 && !gameState.gameOver && !gameState.won) {
      intervalId = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          flagPos: getRandomFlagPos(prev.mines),
        }));
      }, 8000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState.level, gameState.gameOver, gameState.won]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      setGameState((prev) => {
        if (prev.gameOver || prev.won) return prev;

        const newPos = { ...prev.tankPos };
        let newDirection = prev.tankDirection;
        let moved = false;

        switch (e.key) {
          case 'ArrowUp':
            if (newPos.y > 0) {
              newPos.y -= 1;
              newDirection = 'up';
              moved = true;
            }
            break;
          case 'ArrowDown':
            if (newPos.y < GRID_SIZE.height - 1) {
              newPos.y += 1;
              newDirection = 'down';
              moved = true;
            }
            break;
          case 'ArrowLeft':
            if (newPos.x > 0) {
              newPos.x -= 1;
              newDirection = 'left';
              moved = true;
            }
            break;
          case 'ArrowRight':
            if (newPos.x < GRID_SIZE.width - 1) {
              newPos.x += 1;
              newDirection = 'right';
              moved = true;
            }
            break;
          default:
            return prev;
        }

        if (!moved) return prev;

        const oldCellKey = `${prev.tankPos.x},${prev.tankPos.y}`;
        const newTrackMarks = new Map(prev.trackMarks);
        newTrackMarks.set(oldCellKey, newDirection);

        const newVisitedCells = new Set(prev.visitedCells);
        const newCellKey = `${newPos.x},${newPos.y}`;
        newVisitedCells.add(newCellKey);

        if (prev.mines.some((mine) => mine.x === newPos.x && mine.y === newPos.y)) {
          return {
            ...prev,
            gameOver: true,
            visitedCells: newVisitedCells,
            trackMarks: newTrackMarks,
          };
        }

        if (newPos.x === prev.flagPos.x && newPos.y === prev.flagPos.y) {
          return {
            ...prev,
            won: true,
            visitedCells: newVisitedCells,
            trackMarks: newTrackMarks,
          };
        }

        return {
          ...prev,
          tankPos: newPos,
          tankDirection: newDirection,
          moves: prev.moves + 1,
          visitedCells: newVisitedCells,
          trackMarks: newTrackMarks,
        };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE.height; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE.width; x++) {
        const cellKey = `${x},${y}`;
        const isTank = gameState.tankPos.x === x && gameState.tankPos.y === y;
        const isMine = gameState.mines.some((mine) => mine.x === x && mine.y === y);
        const isEnd = x === gameState.flagPos.x && y === gameState.flagPos.y;
        const isVisited = gameState.visitedCells.has(cellKey);
        const trackDirection = gameState.trackMarks.get(cellKey);
        const mineCount = countNearbyMines(x, y);

        const showMine = (gameState.gameOver || gameState.won) && isMine;

        const adjacentToTank =
          Math.abs(gameState.tankPos.x - x) <= 1 &&
          Math.abs(gameState.tankPos.y - y) <= 1;
        const showMineCount =
          !showMine &&
          !isEnd &&
          mineCount > 0 &&
          (isVisited || adjacentToTank);

        const cellClasses = [
          'w-20',
          'h-20',
          'border',
          'flex',
          'items-center',
          'justify-center',
          'relative',
          isVisited ? 'bg-orange-200 border-orange-400' : 'bg-yellow-200 border-yellow-300',
          isTank ? 'bg-yellow-200' : '',
          isEnd ? 'bg-teal-500' : '',
        ]
          .filter(Boolean)
          .join(' ');

        row.push(
          <div key={cellKey} className={cellClasses}>
            {isVisited && !isTank && trackDirection && (
              <TrackMark direction={trackDirection} />
            )}
            <div className="relative w-full h-full flex items-center justify-center">
              {isTank && <TankIcon direction={gameState.tankDirection} />}
              {showMine && <MineIcon />}
              {isEnd && <FlagIcon />}
            </div>
            {showMineCount && (
              <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold text-lg">
                {mineCount}
              </div>
            )}
          </div>
        );
      }
      grid.push(
        <div key={y} className="flex">
          {row}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-800">
      <div className="absolute top-0 left-0 p-4 text-sm font-semibold text-yellow-200">
        idea by Sam
      </div>

      <div className="absolute top-0 right-0 p-4 flex gap-2">
        <button
          type="button"
          onClick={() => setShowInstructions(true)}
          className="px-3 py-1 bg-yellow-500 text-white font-bold rounded hover:bg-gray-800 transition-colors"
        >
          Instructions
        </button>
        <button
          type="button"
          onClick={() => initializeLevel(1)}
          className="px-3 py-1 bg-teal-500 text-white font-bold rounded hover:bg-gray-800 transition-colors"
        >
          New Game
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-6 p-8 rounded-lg w-full">
        <div className="flex gap-4 text-lg font-bold text-yellow-200">
          <div>Level: {gameState.level}</div>
          <div>Moves: {gameState.moves}</div>
          <div>High Score: Level {highScore}</div>
        </div>

        <div className="border-4 border-teal-500 p-4 bg-teal-500 rounded-lg shadow-xl">
          {renderGrid()}
        </div>

        {gameState.gameOver && (
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">Game Over!</div>
            <button
              type="button"
              onClick={() => initializeLevel(1)}
              className="mt-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {gameState.won && (
          <div className="text-center">
            <div className="text-lg font-bold text-teal-500">
              Level {gameState.level} Complete!
            </div>
            <button
              type="button"
              onClick={() => initializeLevel(gameState.level + 1)}
              className="mt-2 px-4 py-2 bg-teal-500 text-white font-bold rounded hover:bg-gray-800 transition-colors"
            >
              Next Level →
            </button>
          </div>
        )}

        <div className="text-sm text-yellow-200">
          Use arrow keys to move the tank
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md text-yellow-200">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <ul className="space-y-2 mb-4">
              <li>• Use arrow keys to move your tank</li>
              <li>• Reach the flag to complete each level</li>
              <li>• Numbers show how many mines are nearby</li>
              <li>• After level 5, the flag will move every 8 seconds</li>
              <li>• Each level adds more mines (up to 12)</li>
              <li>• Try to reach the highest level possible!</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full px-4 py-2 bg-teal-500 text-white font-bold rounded hover:bg-gray-800 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TankGame;
