import { useState, useCallback, useEffect } from 'react';
import { levels, achievements as allAchievements } from '../data/content';

const STORAGE_KEY = 'futuretech_gamestate';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

const defaultState = {
  xp: 0,
  completedModules: [],
  completedQuizzes: {},
  achievements: ['first-login'],
  streakCount: 0,
  totalQuizzesPerfect: 0,
  playerName: '',
};

export function useGameState() {
  const [state, setState] = useState(() => {
    const loaded = loadState();
    return loaded || { ...defaultState };
  });
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getCurrentLevel = useCallback(() => {
    let current = levels[0];
    for (const l of levels) {
      if (state.xp >= l.minXP) current = l;
    }
    return current;
  }, [state.xp]);

  const getNextLevel = useCallback(() => {
    const current = getCurrentLevel();
    const idx = levels.findIndex(l => l.level === current.level);
    return idx < levels.length - 1 ? levels[idx + 1] : null;
  }, [getCurrentLevel]);

  const getXPProgress = useCallback(() => {
    const current = getCurrentLevel();
    const next = getNextLevel();
    if (!next) return 100;
    const xpInLevel = state.xp - current.minXP;
    const xpNeeded = next.minXP - current.minXP;
    return Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  }, [state.xp, getCurrentLevel, getNextLevel]);

  const unlockAchievement = useCallback((id) => {
    if (state.achievements.includes(id)) return false;
    const achievement = allAchievements.find(a => a.id === id);
    if (!achievement) return false;

    setState(prev => ({
      ...prev,
      achievements: [...prev.achievements, id],
      xp: prev.xp + achievement.xp,
    }));
    setNewAchievement(achievement);
    setTimeout(() => setNewAchievement(null), 4000);
    return true;
  }, [state.achievements]);

  const addXP = useCallback((amount) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      return { ...prev, xp: newXP };
    });
    // Check XP achievement
    if (state.xp + amount >= 1000) {
      setTimeout(() => unlockAchievement('xp-1000'), 500);
    }
  }, [state.xp, unlockAchievement]);

  const completeModule = useCallback((moduleId) => {
    setState(prev => {
      const mods = prev.completedModules.includes(moduleId)
        ? prev.completedModules
        : [...prev.completedModules, moduleId];

      const newStreak = mods.length;

      return {
        ...prev,
        completedModules: mods,
        streakCount: newStreak,
      };
    });

    if (!state.completedModules.includes(moduleId) && state.completedModules.length === 0) {
      setTimeout(() => unlockAchievement('first-module'), 500);
    }
    if (state.completedModules.length + 1 >= 5) {
      setTimeout(() => unlockAchievement('all-modules'), 800);
    }
    if (state.completedModules.length + 1 >= 3) {
      setTimeout(() => unlockAchievement('streak-3'), 600);
    }
  }, [state.completedModules, unlockAchievement]);

  const completeQuiz = useCallback((moduleId, score, total, timeTaken) => {
    setState(prev => ({
      ...prev,
      completedQuizzes: { ...prev.completedQuizzes, [moduleId]: { score, total, timeTaken } },
    }));

    if (score === total) {
      setTimeout(() => unlockAchievement('quiz-master'), 500);
    }
    if (timeTaken < 30) {
      setTimeout(() => unlockAchievement('speed-demon'), 700);
    }
  }, [unlockAchievement]);

  const setPlayerName = useCallback((name) => {
    setState(prev => ({ ...prev, playerName: name }));
  }, []);

  const resetProgress = useCallback(() => {
    setState({ ...defaultState });
  }, []);

  return {
    ...state,
    getCurrentLevel,
    getNextLevel,
    getXPProgress,
    addXP,
    completeModule,
    completeQuiz,
    unlockAchievement,
    setPlayerName,
    resetProgress,
    newAchievement,
  };
}
