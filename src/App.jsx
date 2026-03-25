import { Routes, Route, Navigate } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import { useMonitoring } from './hooks/useMonitoring';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './theme/ThemeContext';
import ParticleField from './components/ParticleField';
import Navbar from './components/Navbar';
import AchievementPopup from './components/AchievementPopup';
import NewsTicker from './components/NewsTicker';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Achievements from './pages/Achievements';
import Dashboard from './pages/Dashboard';
import NewsChallenge from './pages/NewsChallenge';
import Leaderboard from './pages/Leaderboard';
import Competitions from './pages/Competitions';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Timeline from './pages/Timeline';
import CursorGlow from './components/CursorGlow';
import LiveClock from './components/LiveClock';
import LevelUpCelebration from './components/LevelUpCelebration';
import { useEffect, useState, useRef } from 'react';

function AppContent() {
  const auth = useAuth();
  const game = useGameState();
  const tracking = useMonitoring(auth.user?.displayName || game.playerName);

  // Sync game state to server when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.saveProgress) {
      const { xp, completedModules, completedQuizzes, achievements, streakCount, playerName } = game;
      auth.saveProgress({ xp, completedModules, completedQuizzes, achievements, streakCount, playerName });
    }
  }, [game.xp, game.completedModules.length, Object.keys(game.completedQuizzes).length, game.achievements.length]);

  // Load progress from server on login
  useEffect(() => {
    if (auth.isAuthenticated && auth.loadProgress) {
      auth.loadProgress().then(serverState => {
        if (serverState && serverState.xp > game.xp) {
          // Server has newer state — could merge here
        }
      }).catch(() => {});
    }
  }, [auth.isAuthenticated]);

  // Set player name from auth
  useEffect(() => {
    if (auth.user?.displayName && auth.user.displayName !== game.playerName) {
      game.setPlayerName(auth.user.displayName);
    }
  }, [auth.user?.displayName]);

  const level = game.getCurrentLevel();
  const xpProgress = game.getXPProgress();

  // Level-up detection
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevelRef = useRef(level.level);
  useEffect(() => {
    if (level.level > prevLevelRef.current) {
      setShowLevelUp(true);
    }
    prevLevelRef.current = level.level;
  }, [level.level]);

  // Not authenticated — show login
  if (!auth.isAuthenticated && !auth.loading) {
    return (
      <>
        <ParticleField />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Auth login={auth.login} register={auth.register} error={auth.error} loading={auth.loading} />
        </div>
      </>
    );
  }

  // Loading
  if (auth.loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div className="led-text" style={{ color: 'var(--accent)', fontSize: 12 }}>
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <>
      <ParticleField />
      <CursorGlow />
      <LiveClock />
      <AchievementPopup achievement={game.newAchievement} />
      <LevelUpCelebration level={level} show={showLevelUp} onDone={() => setShowLevelUp(false)} />
      <NewsTicker />

      <Navbar
        xp={game.xp}
        level={level}
        xpProgress={xpProgress}
        playerName={auth.user?.displayName || game.playerName}
        isAdmin={auth.user?.role === 'admin'}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={
            <Home
              playerName={auth.user?.displayName || game.playerName}
              xp={game.xp}
              level={level}
              completedModules={game.completedModules}
              tracking={tracking}
            />
          } />
          <Route path="/modules" element={
            <Modules
              completedModules={game.completedModules}
              completedQuizzes={game.completedQuizzes}
              tracking={tracking}
            />
          } />
          <Route path="/module/:id" element={
            <ModuleDetail
              completeModule={game.completeModule}
              addXP={game.addXP}
              completeQuiz={game.completeQuiz}
              tracking={tracking}
            />
          } />
          <Route path="/achievements" element={
            <Achievements
              unlockedAchievements={game.achievements}
              tracking={tracking}
            />
          } />
          <Route path="/news" element={
            <NewsChallenge addXP={game.addXP} tracking={tracking} />
          } />
          <Route path="/timeline" element={
            <Timeline tracking={tracking} />
          } />
          <Route path="/leaderboard" element={
            <Leaderboard user={auth.user} tracking={tracking} />
          } />
          <Route path="/competitions" element={
            <Competitions
              user={auth.user}
              token={auth.token}
              addXP={game.addXP}
              tracking={tracking}
            />
          } />
          <Route path="/dashboard" element={
            <Dashboard
              xp={game.xp}
              completedModules={game.completedModules}
              completedQuizzes={game.completedQuizzes}
              achievements={game.achievements}
              getCurrentLevel={game.getCurrentLevel}
              getNextLevel={game.getNextLevel}
              getXPProgress={game.getXPProgress}
              tracking={tracking}
              user={auth.user}
            />
          } />
          {auth.user?.role === 'admin' && (
            <Route path="/admin" element={
              <Admin user={auth.user} token={auth.token} tracking={tracking} />
            } />
          )}
          <Route path="/settings" element={
            <Settings
              user={auth.user}
              logout={auth.logout}
              resetProgress={game.resetProgress}
              updateProfile={auth.updateProfile}
            />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
