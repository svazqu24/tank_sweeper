# Tank Game
A React-based tank navigation game built with Vite and Tailwind CSS. Navigate your tank to the flag while avoiding mines in an increasingly challenging minesweeper-style game. A small passion project of mine started back in Sophmore year of college. **Made with Claude**

## Play Online
🎮 **[svazqu24.github.io/tank_game](https://svazqu24.github.io/tank_game/)**

## Features
- Progressive difficulty with increasing mine counts up to 12
- Arrow keys, WASD, or swipe gestures to move your tank
- Mine detection showing nearby mine counts on visited/adjacent cells
- Flag spawns a minimum of 4 steps away from the tank
- Flag teleports randomly after level 5 (every 8 seconds)
- High score tracking with local storage
- Responsive layout that fills any screen size

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
1. Use **arrow keys**, **WASD**, or **swipe** on mobile to move your tank
2. Navigate to the **flag** to complete each level
3. Avoid **mines** — hitting one ends the game
4. Numbers show how many mines are nearby on visited or adjacent cells
5. After level 5, the flag randomly moves every 8 seconds
6. Each level adds 2 more mines (up to 12 total)
7. Try to reach the highest level possible!

## Game Mechanics
- **Levels 1–4**: Flag is fixed on the right side of the board
- **Level 5+**: Flag spawns randomly and moves every 8 seconds
- **Flag distance**: Always spawns at least 4 steps away from the tank's start
- **Mines**: 2 on level 1, +2 per level, capped at 12
- **Scoring**: High score is the highest level reached, saved across sessions

## Project Structure
```
src/
├── TankGame.jsx     - Main game component and all game logic
├── App.jsx          - React entry point wrapper
├── main.jsx         - React DOM entry point
└── index.css        - Tailwind CSS configuration
public/
└── tank-canon-svgrepo-com.svg  - Favicon
.github/
└── workflows/
    └── deploy.yml   - GitHub Actions auto-deploy to GitHub Pages
vite.config.js       - Vite config with GitHub Pages base path
```
