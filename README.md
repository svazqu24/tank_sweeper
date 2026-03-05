# Tank Game

A React-based tank navigation game built with Vite and Tailwind CSS. Navigate your tank to the flag while avoiding mines in an increasingly challenging minesweeper-style game.

## Features

- Progressive difficulty levels with increasing mine counts
- Tank movement using arrow keys
- Mine detection showing nearby mine counts
- Flag teleportation after level 5 (every 8 seconds)
- High score tracking with local storage
- Clean, responsive UI with Tailwind CSS

## Quick Start

### Development
```bash
npm install
npm run dev
```
The game will be available at `http://localhost:5173/`

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## How to Play

1. Use **arrow keys** to move your tank
2. Navigate to the **flag** (red square) to complete each level
3. Avoid **mines** (orange squares)
4. Numbers on unvisited adjacent cells show nearby mine counts
5. After level 5, the flag will randomly move every 8 seconds
6. Each level adds more mines (up to 12 total)
7. Try to reach the highest level possible!

## Game Mechanics

- **Levels**: 1-5 have the flag in a fixed position; level 5+ have a moving flag
- **Mines**: Start with 2 mines on level 1, increasing by 2 per level (max 12)
- **Scoring**: Your high score is the highest level you've reached
- **Detection**: Nearby mine counts only show on visited cells or adjacent to your current position

## Project Structure

```
src/
├── App.jsx          - Main game component and all game logic
├── main.jsx         - React entry point
└── index.css        - Tailwind CSS configuration

tailwind.config.js   - Tailwind CSS configuration
```
