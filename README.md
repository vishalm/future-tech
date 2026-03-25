# FutureTech Academy

**The coolest way to learn about AI, robots, and the future of tech.**

Built for kids aged 11-14 who want to understand the tech that's shaping their world — through games, quizzes, competitions, and real news.

---

## What Is This?

FutureTech Academy is a gamified learning platform where you:

- **Learn** about AI, robotics, edge computing, and tech ethics through bite-sized modules
- **Take quizzes** and earn XP to level up from "AI Newbie" to "Singularity Master"
- **Challenge friends** in timed quiz competitions
- **Climb the leaderboard** and flex your rank
- **Stay updated** with real tech news written so anyone can understand it
- **Unlock achievements** like "Quiz Master" and "Speed Demon"
- **Pick your theme** — Neon Cyber, Ocean Blue, or Lava Red

---

## Quick Start

### What You Need

- [Node.js](https://nodejs.org/) (v18 or newer)

### Run It Locally

```bash
# Install everything
npm install

# Start the backend server (handles auth, scores, leaderboards)
npm run server

# In a second terminal, start the frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. That's it!

The **first person to register** automatically becomes the **admin** (platform owner).

---

## How It Works

### For Players

1. **Register** — pick a username, password, and display name
2. **Learn** — read through 5 modules about AI topics
3. **Quiz** — answer questions at the end of each module to earn XP
4. **News Challenge** — test your knowledge of real-world tech news (timed!)
5. **Compete** — join or create quiz competitions against other players
6. **Level Up** — earn XP to climb through 10 levels
7. **Leaderboard** — see how you rank against everyone else

### For Admins (Platform Owner)

The admin can do everything a player can, PLUS:

- **Admin Panel** — view platform stats (users, competitions, events, uptime)
- **User Management** — see all users, promote/demote admins, remove users
- **Activity Monitoring** — real-time event tracking via WebSocket

---

## Learning Modules

| Module | What You'll Learn |
|--------|-------------------|
| The Shadow of AGI | What is Artificial General Intelligence and why it matters |
| Hyper-Personalization | How AI predicts what you need before you know it |
| Robotics Revolution | Cobots, home robots, and the rise of physical intelligence |
| Edge AI | Why your phone is becoming a supercomputer |
| AI Ethics & Challenges | Deepfakes, the digital divide, and the black box problem |

Each module has 3 sections with fun facts and a 3-question quiz.

---

## Features at a Glance

| Feature | Description |
|---------|-------------|
| XP & Levels | Earn XP from quizzes and challenges, level up through 10 ranks |
| Achievements | 8 unlockable badges with bonus XP |
| News Challenge | 18 real news questions from March 2026 with timer and streak bonuses |
| Competitions | Create or join timed quiz battles against other players |
| Leaderboard | Global ranking with podium for top 3 |
| 3 Themes | Neon Cyber, Ocean Blue, Lava Red — switch anytime in Settings |
| SVG Icons | 40+ custom hand-drawn icons (no emoji!) |
| Live News Ticker | Scrolling real tech headlines at the bottom of every page |
| Server Monitoring | WebSocket-based real-time event tracking |
| Admin Panel | Full user management for the platform owner |

---

## Deploy on Railway

This app is ready to deploy as a single service:

```bash
# Build the frontend
npm run build

# The Express server serves both the API and the built frontend
npm run start
```

On Railway:
- **Build command:** `npm install && npm run build`
- **Start command:** `npm run start`
- The server reads the `PORT` environment variable automatically

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, Framer Motion, Canvas Confetti |
| Backend | Express 5, WebSocket (ws) |
| Auth | Password hashing with Node.js crypto (scrypt) |
| Storage | JSON files on disk (no database needed) |
| Icons | Custom inline SVG components |
| Styling | CSS variables + inline styles, 3 switchable themes |

---

## Project Structure

```
src/
  components/    UI components (Icons, Navbar, NewsFeed, ParticleField, etc.)
  pages/         All page components (Home, Modules, Quiz, Leaderboard, Admin, etc.)
  hooks/         React hooks (useAuth, useGameState, useMonitoring)
  theme/         Theme system (3 themes, ThemeContext)
  data/          Learning content, news questions, curated news feed

server/
  index.js       Express API + WebSocket server + static file serving
  data/          User accounts and competition data (JSON files)
```

---

## Default Admin

The first account registered on a fresh install automatically gets the **admin** role. If you need to reset:

1. Delete `server/data/users.json`
2. Restart the server
3. Register again — you're the new admin

---

Built with React + Vite + Express. Designed for curious minds.
