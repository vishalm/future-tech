import { useEffect, useRef, useCallback } from 'react';
import { API_URL, WS_URL } from '../config';

const SERVER_URL = API_URL;

export function useMonitoring(playerName) {
  const sessionId = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    sessionId.current = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Try WebSocket connection
    try {
      const ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'session_start',
          sessionId: sessionId.current,
          playerName,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }));
      };
      wsRef.current = ws;
    } catch (e) {
      // Server not running, that's fine
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'session_end',
          sessionId: sessionId.current,
          timestamp: new Date().toISOString(),
        }));
        wsRef.current.close();
      }
    };
  }, [playerName]);

  const trackEvent = useCallback((eventType, data) => {
    const event = {
      type: 'event',
      eventType,
      sessionId: sessionId.current,
      playerName,
      timestamp: new Date().toISOString(),
      ...data,
    };

    // Try WebSocket first
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
      return;
    }

    // Fallback to HTTP
    fetch(`${SERVER_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {/* server not running */});
  }, [playerName]);

  const trackPageView = useCallback((page) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);

  const trackModuleStart = useCallback((moduleId) => {
    trackEvent('module_start', { moduleId });
  }, [trackEvent]);

  const trackModuleComplete = useCallback((moduleId, xpEarned) => {
    trackEvent('module_complete', { moduleId, xpEarned });
  }, [trackEvent]);

  const trackQuizAnswer = useCallback((moduleId, questionIndex, correct, timeTaken) => {
    trackEvent('quiz_answer', { moduleId, questionIndex, correct, timeTaken });
  }, [trackEvent]);

  const trackQuizComplete = useCallback((moduleId, score, total, timeTaken) => {
    trackEvent('quiz_complete', { moduleId, score, total, timeTaken });
  }, [trackEvent]);

  const trackAchievement = useCallback((achievementId) => {
    trackEvent('achievement_unlocked', { achievementId });
  }, [trackEvent]);

  const trackLevelUp = useCallback((newLevel) => {
    trackEvent('level_up', { newLevel });
  }, [trackEvent]);

  return {
    trackPageView,
    trackModuleStart,
    trackModuleComplete,
    trackQuizAnswer,
    trackQuizComplete,
    trackAchievement,
    trackLevelUp,
  };
}
