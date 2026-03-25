import { useState, useEffect, useCallback, useRef } from 'react';
import { API_URL } from '../config';

const API = API_URL;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const saveProgressTimer = useRef(null);

  // On mount: validate existing token
  useEffect(() => {
    const stored = localStorage.getItem('futuretech_token');
    if (!stored) {
      setLoading(false);
      return;
    }

    setToken(stored);

    fetch(`${API}/api/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then((data) => {
        setUser(data.user || data);
      })
      .catch(() => {
        localStorage.removeItem('futuretech_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (username, password, displayName) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Registration failed');
      localStorage.setItem('futuretech_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Login failed');
      localStorage.setItem('futuretech_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('futuretech_token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    setError(null);
    try {
      const res = await fetch(`${API}/api/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.message || 'Update failed');
      setUser(result.user || result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  const saveProgress = useCallback(
    (gameState) => {
      if (saveProgressTimer.current) {
        clearTimeout(saveProgressTimer.current);
      }
      saveProgressTimer.current = setTimeout(async () => {
        try {
          await fetch(`${API}/api/me/progress`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(gameState),
          });
        } catch (err) {
          console.error('Failed to save progress:', err);
        }
      }, 2000);
    },
    [token]
  );

  const loadProgress = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/me/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load progress');
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Failed to load progress:', err);
      return null;
    }
  }, [token]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveProgressTimer.current) {
        clearTimeout(saveProgressTimer.current);
      }
    };
  }, []);

  return {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    saveProgress,
    loadProgress,
    isAuthenticated: !!user,
  };
}
