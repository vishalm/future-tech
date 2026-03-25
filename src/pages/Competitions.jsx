import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Bracket, Plus, Trophy, Clock, Lightning, Check, ArrowRight, Controller } from '../components/Icons';
import { newsCategories, getNewsQuestions } from '../data/newsQuestions';

import { API_URL } from '../config';
const API = API_URL;

export default function Competitions({ user, token, addXP, tracking }) {
  const navigate = useNavigate();
  const [comps, setComps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', category: 'all', questionCount: 5, timeLimit: 15 });
  const [activeComp, setActiveComp] = useState(null);
  const [playState, setPlayState] = useState(null); // { questions, currentQ, score, selected, showExplanation, timer }

  const fetchComps = () => {
    fetch(`${API}/api/competitions`)
      .then(r => r.json())
      .then(data => { setComps(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    tracking.trackPageView('competitions');
    fetchComps();
  }, []);

  const createCompetition = async () => {
    if (!createForm.name.trim()) return;
    const res = await fetch(`${API}/api/competitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(createForm),
    });
    if (res.ok) {
      setShowCreate(false);
      setCreateForm({ name: '', category: 'all', questionCount: 5, timeLimit: 15 });
      fetchComps();
    }
  };

  const joinCompetition = async (compId) => {
    await fetch(`${API}/api/competitions/${compId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    fetchComps();
  };

  const startPlaying = (comp) => {
    const questions = getNewsQuestions(comp.category, comp.questionCount);
    setActiveComp(comp);
    setPlayState({
      questions,
      currentQ: 0,
      score: 0,
      selected: null,
      showExplanation: false,
      timer: comp.timeLimit,
      startTime: Date.now(),
    });
  };

  const handleAnswer = (index) => {
    if (playState.selected !== null) return;
    const q = playState.questions[playState.currentQ];
    const correct = index === q.correct;
    setPlayState(prev => ({
      ...prev,
      selected: index,
      showExplanation: true,
      score: correct ? prev.score + 1 : prev.score,
    }));
    if (correct) confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const nextQuestion = async () => {
    if (playState.currentQ < playState.questions.length - 1) {
      setPlayState(prev => ({
        ...prev,
        currentQ: prev.currentQ + 1,
        selected: null,
        showExplanation: false,
        timer: activeComp.timeLimit,
      }));
    } else {
      // Submit score
      const timeTaken = Math.round((Date.now() - playState.startTime) / 1000);
      await fetch(`${API}/api/competitions/${activeComp.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ score: playState.score, timeTaken }),
      });
      addXP(playState.score * 30);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setActiveComp(null);
      setPlayState(null);
      fetchComps();
    }
  };

  // ═══════ PLAYING VIEW ═══════
  if (playState && activeComp) {
    const q = playState.questions[playState.currentQ];
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 80px',
      }}>
        <motion.div
          key={playState.currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'var(--gradient-card)',
            border: '2px solid var(--border)',
            borderRadius: 24,
            padding: 'clamp(24px, 4vw, 40px)',
            maxWidth: 650,
            width: '100%',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <span className="led-text" style={{ fontSize: 10, color: 'var(--accent2)' }}>
              <Bracket size={14} color="var(--accent2)" style={{ verticalAlign: 'middle', marginRight: 6 }} />
              {activeComp.name}
            </span>
            <span className="led-text" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {playState.currentQ + 1}/{playState.questions.length}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {playState.questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 5, borderRadius: 3,
                background: i < playState.currentQ ? 'var(--success)' : i === playState.currentQ ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
              }} />
            ))}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>
            {q.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.04)';
              let borderColor = 'rgba(255,255,255,0.08)';
              if (playState.selected !== null) {
                if (i === q.correct) { bg = 'rgba(57,255,20,0.15)'; borderColor = 'var(--success)'; }
                else if (i === playState.selected) { bg = 'rgba(255,0,100,0.15)'; borderColor = 'var(--danger)'; }
              }
              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  whileHover={playState.selected === null ? { scale: 1.02 } : {}}
                  style={{
                    padding: '12px 16px', background: bg,
                    border: `2px solid ${borderColor}`, borderRadius: 12,
                    color: 'var(--text)', cursor: playState.selected === null ? 'pointer' : 'default',
                    fontFamily: 'var(--font-main)', fontSize: 15, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {playState.selected !== null && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={nextQuestion}
              style={{
                marginTop: 16, width: '100%', padding: 14, fontSize: 16,
                fontFamily: 'var(--font-main)', fontWeight: 700,
                background: 'var(--gradient-primary)', border: 'none', borderRadius: 14,
                color: '#000', cursor: 'pointer',
              }}
            >
              {playState.currentQ < playState.questions.length - 1 ? 'Next' : 'Submit Results'}
              <ArrowRight size={16} color="#000" style={{ verticalAlign: 'middle', marginLeft: 8 }} />
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // ═══════ COMPETITIONS LIST ═══════
  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 20px 80px',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 30 }}
      >
        <Bracket size={56} color="var(--accent)" style={{ margin: '0 auto 12px' }} />
        <h1 className="led-text" style={{
          fontSize: 'clamp(14px, 2.5vw, 20px)',
          color: 'var(--accent)',
          lineHeight: 1.8,
        }}>
          COMPETITIONS
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>
          Challenge your friends! Create or join a quiz battle.
        </p>
      </motion.div>

      {/* Create button */}
      <motion.button
        onClick={() => setShowCreate(!showCreate)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', padding: 16, marginBottom: 20,
          background: 'var(--gradient-secondary)', border: 'none', borderRadius: 16,
          color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-main)',
          fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
        }}
      >
        <Plus size={20} color="#fff" /> CREATE COMPETITION
      </motion.button>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--gradient-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 24, marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Competition name..."
                value={createForm.name}
                onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                style={{
                  padding: '12px 16px', fontSize: 16, fontFamily: 'var(--font-main)',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['all', 'ai', 'space', 'robots', 'wild'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCreateForm(f => ({ ...f, category: cat }))}
                    style={{
                      padding: '8px 14px', fontSize: 13, fontFamily: 'var(--font-main)',
                      background: createForm.category === cat ? 'var(--accent)' : 'var(--card)',
                      color: createForm.category === cat ? '#000' : 'var(--text-dim)',
                      border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {cat === 'all' ? 'All' : cat.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <select
                  value={createForm.questionCount}
                  onChange={e => setCreateForm(f => ({ ...f, questionCount: Number(e.target.value) }))}
                  style={{
                    flex: 1, padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-main)',
                    background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text)',
                  }}
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={7}>7 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
                <select
                  value={createForm.timeLimit}
                  onChange={e => setCreateForm(f => ({ ...f, timeLimit: Number(e.target.value) }))}
                  style={{
                    flex: 1, padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-main)',
                    background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text)',
                  }}
                >
                  <option value={10}>10s per Q</option>
                  <option value={15}>15s per Q</option>
                  <option value={20}>20s per Q</option>
                  <option value={30}>30s per Q</option>
                </select>
              </div>
              <motion.button
                onClick={createCompetition}
                whileHover={{ scale: 1.03 }}
                style={{
                  padding: 14, fontSize: 16, fontFamily: 'var(--font-main)', fontWeight: 700,
                  background: 'var(--gradient-success)', border: 'none', borderRadius: 12,
                  color: '#000', cursor: 'pointer',
                }}
              >
                <Lightning size={18} color="#000" style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Launch Competition
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Competition list */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>Loading...</div>
      ) : comps.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>
          <Controller size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p>No competitions yet. Create the first one!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comps.map((comp, i) => {
            const hasJoined = comp.participants?.some(p => p.userId === user?.id);
            const hasSubmitted = comp.participants?.some(p => p.userId === user?.id && p.score !== undefined && p.score !== null);
            const isActive = comp.status === 'active';

            return (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: 'var(--gradient-card)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 16, padding: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Bracket size={16} color="var(--accent)" />
                      <h3 style={{ fontSize: 17, fontWeight: 700 }}>{comp.name}</h3>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6,
                        fontSize: 10, fontFamily: 'var(--font-pixel)',
                        background: isActive ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.05)',
                        color: isActive ? 'var(--success)' : 'var(--text-muted)',
                      }}>
                        {isActive ? 'ACTIVE' : 'DONE'}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-dim)', display: 'flex', gap: 12 }}>
                      <span>{comp.questionCount} Q's</span>
                      <span>{comp.timeLimit}s/Q</span>
                      <span>{comp.participants?.length || 0} players</span>
                    </div>
                  </div>

                  {isActive && !hasJoined && (
                    <motion.button
                      onClick={() => joinCompetition(comp.id)}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        padding: '8px 16px', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-main)',
                        background: 'var(--gradient-primary)', border: 'none', borderRadius: 10,
                        color: '#000', cursor: 'pointer',
                      }}
                    >
                      JOIN
                    </motion.button>
                  )}
                  {isActive && hasJoined && !hasSubmitted && (
                    <motion.button
                      onClick={() => startPlaying(comp)}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        padding: '8px 16px', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-main)',
                        background: 'var(--gradient-success)', border: 'none', borderRadius: 10,
                        color: '#000', cursor: 'pointer',
                      }}
                    >
                      PLAY
                    </motion.button>
                  )}
                  {hasSubmitted && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      color: 'var(--success)', fontSize: 12, fontWeight: 600,
                    }}>
                      <Check size={14} color="var(--success)" /> Done
                    </span>
                  )}
                </div>

                {/* Participants */}
                {comp.participants?.length > 0 && (
                  <div style={{
                    marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap',
                  }}>
                    {comp.participants.sort((a, b) => (b.score ?? -1) - (a.score ?? -1)).map((p, j) => (
                      <div key={j} style={{
                        padding: '4px 10px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        fontSize: 12, color: 'var(--text-dim)',
                        border: p.userId === user?.id ? '1px solid var(--success)' : 'none',
                      }}>
                        {p.displayName}
                        {p.score !== undefined && p.score !== null && (
                          <span style={{ color: 'var(--xp-color)', marginLeft: 6, fontWeight: 700 }}>
                            {p.score}pts
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
