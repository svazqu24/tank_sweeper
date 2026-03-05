# Tank Game - Development Instructions

This project is a React-based tank game built with Vite and Tailwind CSS.

## Project Overview
- **Type**: React Application
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Game**: A minesweeper-style tank navigation game with progressive difficulty levels

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The game will be available at `http://localhost:5173/`

### Build
```bash
npm run build
```

### Preview Built Project
```bash
npm run preview
```

## Game Features
- Navigate your tank to the flag while avoiding mines
- Progressive difficulty with more mines added at each level
- After level 5, the flag moves every 8 seconds
- Track your high score locally
- Visual mine detection showing nearby mine counts

## Project Structure
- `src/App.jsx` - Main game component with all game logic and UI
- `src/main.jsx` - React entry point
- `src/index.css` - Tailwind CSS imports
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
