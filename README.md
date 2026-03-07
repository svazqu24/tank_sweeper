# 🎮 Tank Sweeper

A minesweeper-meets-tank-game where you navigate a battlefield, avoid hidden mines, and reach the flag to advance. Levels get harder, the fog rolls in, and the flag starts moving — how far can you go?

A small passion project of mine started back in Sophmore year of college. **Co-created with Claude**

## Play Online
🕹️ **[svazqu24.github.io/tank_sweeper](https://svazqu24.github.io/tank_sweeper/)**

---

## Features

### Gameplay
- Move your tank with **arrow keys**, **WASD**, or **swipe** gestures on mobile
- Reach the **flag** to complete each level — avoid all mines along the way
- Mine count starts at 2 and increases by 2 each level, capped at 12
- **Levels 1–4**: Flag is fixed on the right side of the board
- **Level 5+**: Fog of war kicks in — only visited and adjacent cells are visible
- **Level 10+**: The flag relocates every 8 seconds, keeping you on your toes

### Difficulty Modes
- 🟢 **Easy** — Mine count badges show how many mines are adjacent to visited cells
- 🔴 **Hard** — No numbers. Only a red pulse warning when you're standing near a mine

### Progression & Unlocks
- Separate **high score tracking** for Easy and Hard modes, saved across sessions
- Every **5 levels** (up to 50) and every **10 levels** (50–100) unlocks a new color theme
- 16 themes total — from Classic and Military to Amethyst, Obsidian, and the legendary **Prismatic** at level 100

### Polish
- Smooth tank movement with animated transitions
- Tank track marks fade in behind you as you move
- Screen shake on game over, mine explosion particles, and smoke effects
- Confetti on level complete
- Level wipe transition between stages
- Share your score (including mode) directly from the game

---

## Color Theme Unlock Progression

| Level | Theme       |   | Level | Theme       |
|-------|-------------|---|-------|-------------|
| 1     | Classic     |   | 50    | Golden      |
| 5     | Military    |   | 60    | Deep Sea    |
| 10    | Desert      |   | 70    | Blood Moon  |
| 15    | Arctic      |   | 80    | Amethyst    |
| 20    | Volcanic    |   | 90    | Obsidian    |
| 25    | Night Ops   |   | 100   | Prismatic ✨ |
| 30    | Jungle      |   |       |             |
| 35    | Sand Storm  |   |       |             |
| 40    | Bubblegum   |   |       |             |
| 45    | Toxic       |   |       |             |

---

## How to Play
1. Select **Easy** or **Hard** on the title screen
2. Use **arrow keys**, **WASD**, or **swipe** to move your tank
3. Navigate to the **flag** 🚩 to complete the level
4. In Easy mode, numbers on visited cells show nearby mine counts
5. In Hard mode, watch for the **red pulse** — it means danger is close
6. After level 5, unvisited cells go dark
7. After level 10, the flag starts moving every 8 seconds
8. Hit a mine and it's game over — try to reach the highest level possible!

---

## Quick Start

```bash
npm install
npm run dev
```

Available at `http://localhost:5173/`

```bash
npm run build   # production build
npm run preview # preview build locally
```

---

## Project Structure

```
src/
├── App.jsx        - Main game component (all logic, state, rendering)
├── main.jsx       - React DOM entry point
└── index.css      - Tailwind CSS configuration
public/
└── tank-canon-svgrepo-com.svg  - Favicon
.github/
└── workflows/
    └── deploy.yml - GitHub Actions auto-deploy to GitHub Pages
vite.config.js     - Vite config with GitHub Pages base path
```

---

## Tech Stack
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- GitHub Pages via GitHub Actions