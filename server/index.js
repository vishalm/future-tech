import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Data file helpers ---
const DATA_DIR = join(__dirname, 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const COMPETITIONS_FILE = join(DATA_DIR, 'competitions.json');

// Ensure data directory and files exist
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(USERS_FILE)) writeFileSync(USERS_FILE, '[]', 'utf-8');
if (!existsSync(COMPETITIONS_FILE)) writeFileSync(COMPETITIONS_FILE, '[]', 'utf-8');

function loadUsers() {
  try {
    return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function loadCompetitions() {
  try {
    return JSON.parse(readFileSync(COMPETITIONS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveCompetitions(competitions) {
  writeFileSync(COMPETITIONS_FILE, JSON.stringify(competitions, null, 2), 'utf-8');
}

// --- Auth helpers ---
function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, storedHash] = stored.split(':');
  const hash = scryptSync(password, salt, 64);
  const storedHashBuf = Buffer.from(storedHash, 'hex');
  return timingSafeEqual(hash, storedHashBuf);
}

const authTokens = new Map(); // token -> { userId, username }

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.slice(7);
  const session = authTokens.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  const users = loadUsers();
  const user = users.find(u => u.id === session.userId);
  if (!user) {
    authTokens.delete(token);
    return res.status(401).json({ error: 'User not found' });
  }
  req.user = user;
  next();
}

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Serve built frontend in production
const DIST_DIR = join(__dirname, '..', 'dist');
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// In-memory store
const sessions = new Map();
const events = [];
const startTime = Date.now();

// REST endpoints
app.get('/api/stats', (req, res) => {
  const uptimeMs = Date.now() - startTime;
  const hours = Math.floor(uptimeMs / 3600000);
  const minutes = Math.floor((uptimeMs % 3600000) / 60000);

  res.json({
    activeSessions: sessions.size,
    totalEvents: events.length,
    uptime: `${hours}h ${minutes}m`,
    recentEvents: events.slice(-20).reverse(),
    sessionList: Array.from(sessions.values()).map(s => ({
      sessionId: s.sessionId,
      playerName: s.playerName,
      startTime: s.startTime,
      eventCount: s.eventCount,
      lastActivity: s.lastActivity,
    })),
  });
});

app.post('/api/events', (req, res) => {
  const event = { ...req.body, receivedAt: new Date().toISOString() };
  events.push(event);

  if (event.sessionId && sessions.has(event.sessionId)) {
    const session = sessions.get(event.sessionId);
    session.eventCount++;
    session.lastActivity = new Date().toISOString();
  }

  logEvent(event);
  res.json({ ok: true });
});

app.get('/api/events', (req, res) => {
  const { type, limit = 50 } = req.query;
  let filtered = events;
  if (type) filtered = events.filter(e => e.eventType === type);
  res.json(filtered.slice(-Number(limit)).reverse());
});

app.get('/api/sessions', (req, res) => {
  res.json(Array.from(sessions.values()));
});

// Monitoring dashboard page
app.get('/dashboard', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>FutureTech Monitor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: #0a0a1a;
      color: #00f0ff;
      padding: 20px;
    }
    h1 {
      text-align: center;
      font-size: 24px;
      margin-bottom: 20px;
      text-shadow: 0 0 10px #00f0ff;
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .card {
      background: rgba(18, 18, 42, 0.9);
      border: 1px solid #00f0ff33;
      border-radius: 12px;
      padding: 20px;
    }
    .card h2 { font-size: 14px; color: #ffe600; margin-bottom: 12px; }
    .stat { font-size: 36px; font-weight: bold; }
    .event {
      padding: 8px;
      border-bottom: 1px solid #ffffff11;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
    }
    .event-type { color: #39ff14; }
    .event-time { color: #ffffff55; }
    .live { color: #39ff14; animation: pulse 1s infinite; }
    @keyframes pulse { 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <h1>🖥️ FUTURETECH MONITOR <span class="live">● LIVE</span></h1>
  <div class="grid">
    <div class="card">
      <h2>ACTIVE SESSIONS</h2>
      <div class="stat" id="sessions">0</div>
    </div>
    <div class="card">
      <h2>TOTAL EVENTS</h2>
      <div class="stat" id="events">0</div>
    </div>
    <div class="card">
      <h2>UPTIME</h2>
      <div class="stat" id="uptime">0h 0m</div>
    </div>
    <div class="card" style="grid-column: span 3;">
      <h2>LIVE EVENT FEED</h2>
      <div id="feed"></div>
    </div>
  </div>
  <script>
    async function update() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('sessions').textContent = data.activeSessions;
        document.getElementById('events').textContent = data.totalEvents;
        document.getElementById('uptime').textContent = data.uptime;

        const feed = document.getElementById('feed');
        feed.innerHTML = data.recentEvents.map(e =>
          '<div class="event"><span class="event-type">' + (e.eventType || e.type) + '</span>' +
          '<span>' + (e.playerName || '') + '</span>' +
          '<span class="event-time">' + new Date(e.timestamp).toLocaleTimeString() + '</span></div>'
        ).join('');
      } catch (e) {}
    }
    update();
    setInterval(update, 2000);
  </script>
</body>
</html>
  `);
});

// Create HTTP server
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === 'session_start') {
        sessions.set(msg.sessionId, {
          sessionId: msg.sessionId,
          playerName: msg.playerName,
          startTime: msg.timestamp,
          lastActivity: msg.timestamp,
          eventCount: 0,
          ws,
        });
        console.log(`🎮 Session started: ${msg.playerName} (${msg.sessionId})`);
      } else if (msg.type === 'session_end') {
        sessions.delete(msg.sessionId);
        console.log(`👋 Session ended: ${msg.sessionId}`);
      } else {
        events.push({ ...msg, receivedAt: new Date().toISOString() });
        if (msg.sessionId && sessions.has(msg.sessionId)) {
          const session = sessions.get(msg.sessionId);
          session.eventCount++;
          session.lastActivity = new Date().toISOString();
        }
        logEvent(msg);
      }
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  });

  ws.on('close', () => {
    // Remove session associated with this ws
    for (const [id, session] of sessions) {
      if (session.ws === ws) {
        sessions.delete(id);
        console.log(`👋 Session disconnected: ${id}`);
        break;
      }
    }
  });
});

function logEvent(event) {
  const icons = {
    page_view: '📄',
    module_start: '📖',
    module_complete: '✅',
    quiz_answer: '❓',
    quiz_complete: '🏆',
    achievement_unlocked: '🎖️',
    level_up: '⬆️',
  };

  const icon = icons[event.eventType] || '📡';
  const player = event.playerName ? `[${event.playerName}]` : '';
  const details = event.moduleId ? `module=${event.moduleId}` : event.page ? `page=${event.page}` : '';

  console.log(`${icon} ${player} ${event.eventType || event.type} ${details}`);
}

// ============================================================
// User Management & Auth Endpoints
// ============================================================

// --- Register ---
app.post('/api/register', (req, res) => {
  const { username, password, displayName } = req.body;

  // Validate username: 3-20 chars, alphanumeric
  if (!username || !/^[a-zA-Z0-9]{3,20}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 alphanumeric characters' });
  }
  // Validate password: 4+ chars
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }
  // Validate displayName: 2-20 chars
  if (!displayName || displayName.length < 2 || displayName.length > 20) {
    return res.status(400).json({ error: 'Display name must be 2-20 characters' });
  }

  const users = loadUsers();

  // Check uniqueness
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const user = {
    id: randomBytes(8).toString('hex'),
    username,
    passwordHash: hashPassword(password),
    displayName,
    role: users.length === 0 ? 'admin' : 'player', // First user is admin!
    theme: 'neonCyber',
    createdAt: new Date().toISOString(),
    gameState: null,
  };

  users.push(user);
  saveUsers(users);

  // Generate token
  const token = randomBytes(32).toString('hex');
  authTokens.set(token, { userId: user.id, username: user.username });

  res.status(201).json({
    token,
    user: { id: user.id, username: user.username, displayName: user.displayName, theme: user.theme, role: user.role },
  });
});

// --- Login ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = loadUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = randomBytes(32).toString('hex');
  authTokens.set(token, { userId: user.id, username: user.username });

  res.json({
    token,
    user: { id: user.id, username: user.username, displayName: user.displayName, theme: user.theme, role: user.role || 'player' },
  });
});

// --- Get current user profile ---
app.get('/api/me', authMiddleware, (req, res) => {
  const { passwordHash, ...profile } = req.user;
  res.json(profile);
});

// --- Update current user profile ---
app.put('/api/me', authMiddleware, (req, res) => {
  const { displayName, theme } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (displayName !== undefined) {
    if (displayName.length < 2 || displayName.length > 20) {
      return res.status(400).json({ error: 'Display name must be 2-20 characters' });
    }
    user.displayName = displayName;
  }

  if (theme !== undefined) {
    user.theme = theme;
  }

  saveUsers(users);

  const { passwordHash, ...profile } = user;
  res.json(profile);
});

// --- Save game progress ---
app.put('/api/me/progress', authMiddleware, (req, res) => {
  const { gameState } = req.body;

  if (gameState === undefined) {
    return res.status(400).json({ error: 'gameState is required' });
  }

  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.gameState = gameState;
  saveUsers(users);

  res.json({ ok: true, gameState: user.gameState });
});

// --- Get game progress ---
app.get('/api/me/progress', authMiddleware, (req, res) => {
  res.json({ gameState: req.user.gameState });
});

// ============================================================
// Leaderboard
// ============================================================

app.get('/api/leaderboard', (req, res) => {
  const users = loadUsers();

  const leaderboard = users
    .map(user => {
      const gs = user.gameState;
      let xp = 0;
      let level = 1;
      let modulesCompleted = 0;
      let totalQuizQuestions = 0;
      let correctQuizAnswers = 0;

      if (gs) {
        xp = gs.xp || 0;
        level = gs.level || 1;

        if (gs.completedModules && Array.isArray(gs.completedModules)) {
          modulesCompleted = gs.completedModules.length;
        }

        if (gs.quizResults && Array.isArray(gs.quizResults)) {
          for (const quiz of gs.quizResults) {
            totalQuizQuestions += quiz.totalQuestions || 0;
            correctQuizAnswers += quiz.correctAnswers || 0;
          }
        }
      }

      const accuracy = totalQuizQuestions > 0
        ? Math.round((correctQuizAnswers / totalQuizQuestions) * 100)
        : 0;

      return {
        displayName: user.displayName,
        xp,
        level,
        modulesCompleted,
        accuracy,
      };
    })
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 50)
    .map((entry, index) => ({ rank: index + 1, ...entry }));

  res.json(leaderboard);
});

// ============================================================
// Competition Endpoints
// ============================================================

// --- Create competition ---
app.post('/api/competitions', authMiddleware, (req, res) => {
  const { name, category, questionCount, timeLimit } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const competitions = loadCompetitions();

  const competition = {
    id: randomBytes(8).toString('hex'),
    name,
    category,
    questionCount: questionCount || 10,
    timeLimit: timeLimit || 300,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    status: 'open',
    participants: [],
  };

  competitions.push(competition);
  saveCompetitions(competitions);

  res.status(201).json(competition);
});

// --- List competitions (newest first) ---
app.get('/api/competitions', (req, res) => {
  const competitions = loadCompetitions();
  const sorted = [...competitions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// --- Get single competition ---
app.get('/api/competitions/:id', (req, res) => {
  const competitions = loadCompetitions();
  const competition = competitions.find(c => c.id === req.params.id);

  if (!competition) {
    return res.status(404).json({ error: 'Competition not found' });
  }

  res.json(competition);
});

// --- Join competition ---
app.post('/api/competitions/:id/join', authMiddleware, (req, res) => {
  const competitions = loadCompetitions();
  const competition = competitions.find(c => c.id === req.params.id);

  if (!competition) {
    return res.status(404).json({ error: 'Competition not found' });
  }

  if (competition.status === 'completed') {
    return res.status(400).json({ error: 'Competition is already completed' });
  }

  const alreadyJoined = competition.participants.find(p => p.userId === req.user.id);
  if (alreadyJoined) {
    return res.status(409).json({ error: 'Already joined this competition' });
  }

  competition.participants.push({
    userId: req.user.id,
    displayName: req.user.displayName,
    joinedAt: new Date().toISOString(),
    score: null,
    timeTaken: null,
    submittedAt: null,
  });

  saveCompetitions(competitions);
  res.json(competition);
});

// --- Submit competition score ---
app.post('/api/competitions/:id/submit', authMiddleware, (req, res) => {
  const { score, timeTaken } = req.body;

  if (score === undefined || timeTaken === undefined) {
    return res.status(400).json({ error: 'Score and timeTaken are required' });
  }

  const competitions = loadCompetitions();
  const competition = competitions.find(c => c.id === req.params.id);

  if (!competition) {
    return res.status(404).json({ error: 'Competition not found' });
  }

  const participant = competition.participants.find(p => p.userId === req.user.id);
  if (!participant) {
    return res.status(400).json({ error: 'You have not joined this competition' });
  }

  if (participant.submittedAt) {
    return res.status(409).json({ error: 'Score already submitted' });
  }

  participant.score = score;
  participant.timeTaken = timeTaken;
  participant.submittedAt = new Date().toISOString();

  // Check if all participants have submitted
  const allSubmitted = competition.participants.every(p => p.submittedAt !== null);
  if (allSubmitted) {
    competition.status = 'completed';
  }

  saveCompetitions(competitions);
  res.json(competition);
});

// ============================================================
// Admin Endpoints
// ============================================================

function adminMiddleware(req, res, next) {
  if (!req.user || (req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Get all users (admin only)
app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  const users = loadUsers().map(({ passwordHash, ...u }) => u);
  res.json(users);
});

// Update user role (admin only)
app.put('/api/admin/users/:id/role', authMiddleware, adminMiddleware, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'player'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or player' });
  }
  const users = loadUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.role = role;
  saveUsers(users);
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  let users = loadUsers();
  users = users.filter(u => u.id !== req.params.id);
  saveUsers(users);
  res.json({ ok: true });
});

// Delete competition (admin only)
app.delete('/api/admin/competitions/:id', authMiddleware, adminMiddleware, (req, res) => {
  let competitions = loadCompetitions();
  competitions = competitions.filter(c => c.id !== req.params.id);
  saveCompetitions(competitions);
  res.json({ ok: true });
});

// Get server stats (admin only)
app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
  const users = loadUsers();
  const competitions = loadCompetitions();
  const uptimeMs = Date.now() - startTime;
  const hours = Math.floor(uptimeMs / 3600000);
  const minutes = Math.floor((uptimeMs % 3600000) / 60000);
  res.json({
    totalUsers: users.length,
    totalCompetitions: competitions.length,
    activeCompetitions: competitions.filter(c => c.status === 'active').length,
    activeSessions: sessions.size,
    totalEvents: events.length,
    uptime: `${hours}h ${minutes}m`,
  });
});

// ============================================================

// SPA catch-all: serve index.html for client-side routes (must be after all API routes)
if (existsSync(DIST_DIR)) {
  app.get('/{*path}', (req, res) => {
    res.sendFile(join(DIST_DIR, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log('');
  console.log('  🚀 ══════════════════════════════════════════ 🚀');
  console.log('  ║                                              ║');
  console.log('  ║   FUTURETECH MONITORING SERVER               ║');
  console.log('  ║                                              ║');
  console.log(`  ║   HTTP:      http://localhost:${PORT}            ║`);
  console.log(`  ║   WebSocket: ws://localhost:${PORT}              ║`);
  console.log(`  ║   Dashboard: http://localhost:${PORT}/dashboard  ║`);
  console.log('  ║                                              ║');
  console.log('  🚀 ══════════════════════════════════════════ 🚀');
  console.log('');
});
