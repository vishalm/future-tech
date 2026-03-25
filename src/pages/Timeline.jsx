import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { DynamicIcon, Rocket, Brain, Robot, Lightning, Globe, Satellite, Crown, Controller, Dna, Microscope, Wand, Star, Shield, Gem, Galaxy } from '../components/Icons';

const timelineData = [
  {
    year: 2025,
    color: '#4facfe',
    icon: 'Brain',
    title: 'The Dawn of Reasoning AI',
    tagline: 'AI learns to think, not just predict',
    events: [
      {
        title: 'GPT-4o & Claude 3.5 Go Mainstream',
        description: 'Multimodal AI becomes everyday — chatbots that see images, hear audio, and write code. Every student has an AI tutor in their pocket.',
        icon: 'Brain',
        impact: 'HIGH',
      },
      {
        title: 'AI Coding Assistants Hit 50% Adoption',
        description: 'Half of all professional developers now use AI to write code. GitHub Copilot, Cursor, and Claude Code change how software is built forever.',
        icon: 'Lightning',
        impact: 'HIGH',
      },
      {
        title: 'Self-Driving Taxis Expand to 20+ Cities',
        description: 'Waymo and Cruise robotaxis are no longer experimental. Kids in Phoenix, SF, and LA ride to school in cars with no driver.',
        icon: 'Globe',
        impact: 'MEDIUM',
      },
      {
        title: 'AI-Generated Video Goes Viral',
        description: 'Sora, Runway, and Kling let anyone make Hollywood-quality videos from text. A 12-year-old\'s AI short film gets 100M views.',
        icon: 'Star',
        impact: 'MEDIUM',
      },
    ],
  },
  {
    year: 2026,
    color: '#ff00e5',
    icon: 'Rocket',
    title: 'The Great Acceleration',
    tagline: 'Everything speeds up — AI, space, robots',
    events: [
      {
        title: 'GPT-5.4 Matches Human Experts',
        description: 'Scoring 83% on real-world economic tasks, AI now performs at the level of human specialists. The "will AI take jobs" debate explodes.',
        icon: 'Brain',
        impact: 'CRITICAL',
      },
      {
        title: 'Artemis 2 Flies Humans Around the Moon',
        description: 'First crewed lunar mission in 50+ years launches in April. Four astronauts orbit the Moon and return safely. The world watches live.',
        icon: 'Rocket',
        impact: 'HIGH',
      },
      {
        title: 'AMI Labs Raises $1B for "World Models"',
        description: 'Yann LeCun\'s startup builds AI that understands physics — not just text. Backed by Nvidia and Bezos. A new paradigm is born.',
        icon: 'Gem',
        impact: 'HIGH',
      },
      {
        title: '12 Major AI Models Drop in One Week',
        description: 'March 2026 is called "The Week That Changed AI." GPT-5.4, Qwen 3.5, Gemini Ultra 2 — the pace is unprecedented.',
        icon: 'Lightning',
        impact: 'HIGH',
      },
      {
        title: 'Atlas Robot Gets Gemini Brain',
        description: 'DeepMind gives Boston Dynamics\' Atlas humanoid its Gemini AI. The world\'s most athletic robot becomes the world\'s smartest too.',
        icon: 'Robot',
        impact: 'MEDIUM',
      },
    ],
  },
  {
    year: 2027,
    color: '#39ff14',
    icon: 'Robot',
    title: 'Robots Enter Daily Life',
    tagline: 'Your new coworker has metal hands',
    events: [
      {
        title: 'Humanoid Robots Work in Warehouses',
        description: 'Figure, Tesla Optimus, and 1X send thousands of humanoid robots into Amazon and Tesla factories. They learn tasks by watching humans once.',
        icon: 'Robot',
        impact: 'CRITICAL',
      },
      {
        title: 'Artemis 3 Lands Humans on the Moon',
        description: 'Two astronauts step onto the lunar south pole — the first Moon landing since 1972. They plant sensors and collect ice samples.',
        icon: 'Rocket',
        impact: 'CRITICAL',
      },
      {
        title: 'Edge AI Makes Phones Truly Smart',
        description: 'Your phone runs a full AI model locally — no internet needed. Real-time translation, photo editing, and coding all happen offline.',
        icon: 'Lightning',
        impact: 'HIGH',
      },
      {
        title: 'AI Drug Discovery Saves First Life',
        description: 'A drug designed entirely by AI completes clinical trials and treats a rare cancer. From discovery to patient: 18 months instead of 10 years.',
        icon: 'Dna',
        impact: 'CRITICAL',
      },
    ],
  },
  {
    year: 2028,
    color: '#ffe600',
    icon: 'Satellite',
    title: 'The Connected World',
    tagline: 'Everything talks to everything',
    events: [
      {
        title: 'Starlink Covers the Entire Planet',
        description: 'Every corner of Earth has fast internet. A kid in rural Kenya and a kid in Tokyo have the same access to AI tools and education.',
        icon: 'Satellite',
        impact: 'CRITICAL',
      },
      {
        title: 'AI Teachers Personalize Education',
        description: 'AI tutors adapt to each student\'s learning style in real-time. Math through music, science through games. Test scores jump 40% worldwide.',
        icon: 'Brain',
        impact: 'HIGH',
      },
      {
        title: 'Home Robots Do Your Chores',
        description: 'Affordable home robots ($2,000) can fold laundry, load dishes, and cook basic meals. Chore time drops by 60% for families.',
        icon: 'Robot',
        impact: 'HIGH',
      },
      {
        title: 'Quantum Computing Hits 10,000 Qubits',
        description: 'IBM and Google achieve stable 10K qubit processors. Problems that would take classical computers millions of years now take hours.',
        icon: 'Galaxy',
        impact: 'HIGH',
      },
    ],
  },
  {
    year: 2029,
    color: '#ff6b00',
    icon: 'Shield',
    title: 'The Reckoning',
    tagline: 'Power demands responsibility',
    events: [
      {
        title: 'Global AI Safety Treaty Signed',
        description: '140 countries sign the first binding AI safety agreement. Mandatory testing, kill switches, and transparency requirements become law.',
        icon: 'Shield',
        impact: 'CRITICAL',
      },
      {
        title: 'Deepfake Detection Becomes Mandatory',
        description: 'All social platforms must label AI-generated content. Invisible watermarks are embedded in every AI output. Trust in media begins recovering.',
        icon: 'Microscope',
        impact: 'HIGH',
      },
      {
        title: 'Permanent Moon Base Construction Begins',
        description: 'Artemis program starts building habitats on the lunar south pole. 3D-printed structures using moon dust. 6 astronauts live there full-time.',
        icon: 'Rocket',
        impact: 'CRITICAL',
      },
      {
        title: 'AI Passes the Turing Test (For Real)',
        description: 'In controlled studies, most humans can no longer distinguish AI from human conversation. The philosophical debate about consciousness intensifies.',
        icon: 'Brain',
        impact: 'CRITICAL',
      },
    ],
  },
  {
    year: 2030,
    color: '#b026ff',
    icon: 'Galaxy',
    title: 'A New Era Begins',
    tagline: 'The future you\'ll help build',
    events: [
      {
        title: 'AGI Candidates Emerge',
        description: 'Multiple AI systems demonstrate general reasoning across all domains. They can learn any new task without specific training. The AGI debate shifts from "if" to "how to manage it."',
        icon: 'Galaxy',
        impact: 'CRITICAL',
      },
      {
        title: 'Mars Sample Return Mission',
        description: 'The first rocks from Mars arrive on Earth. Analysis reveals ancient microbial signatures. We may not be alone in the universe.',
        icon: 'Rocket',
        impact: 'CRITICAL',
      },
      {
        title: 'Brain-Computer Interfaces Go Consumer',
        description: 'Neuralink and competitors offer non-invasive BCIs. Control your phone with thoughts. Type at 200 words per minute by thinking. Accessibility transformed forever.',
        icon: 'Wand',
        impact: 'HIGH',
      },
      {
        title: 'You Are 16-19 Years Old',
        description: 'The kids learning on FutureTech Academy today are the ones building tomorrow. You\'ll be the first generation to grow up WITH AI as a partner, not a novelty. What will YOU create?',
        icon: 'Crown',
        impact: 'YOU',
      },
    ],
  },
];

const impactColors = {
  CRITICAL: '#ff0064',
  HIGH: '#ffe600',
  MEDIUM: '#39ff14',
  YOU: '#b026ff',
};

function EventCard({ event, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.7, y: 40 }}
        transition={{ type: 'spring', bounce: 0.35 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card)',
          border: `2px solid ${impactColors[event.impact] || 'var(--accent)'}`,
          borderRadius: 24,
          padding: 'clamp(24px, 5vw, 40px)',
          maxWidth: 500,
          width: '100%',
          position: 'relative',
          boxShadow: `0 0 40px ${impactColors[event.impact] || 'var(--accent)'}33`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 8,
            width: 32,
            height: 32,
            color: 'var(--text-dim)',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          x
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${impactColors[event.impact] || 'var(--accent)'}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DynamicIcon name={event.icon} size={26} color={impactColors[event.impact] || 'var(--accent)'} />
          </div>
          <span style={{
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: 9,
            fontFamily: 'var(--font-pixel)',
            background: `${impactColors[event.impact]}22`,
            color: impactColors[event.impact],
          }}>
            {event.impact === 'YOU' ? 'THIS IS YOU' : `${event.impact} IMPACT`}
          </span>
        </div>

        <h3 style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 700,
          marginBottom: 12,
          lineHeight: 1.3,
        }}>
          {event.title}
        </h3>

        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          lineHeight: 1.6,
          color: 'var(--text-dim)',
        }}>
          {event.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Timeline({ tracking }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    tracking.trackPageView('timeline');
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        padding: 'clamp(80px, 12vw, 100px) clamp(12px, 3vw, 24px) 80px',
        maxWidth: 900,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vw, 50px)' }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-block', marginBottom: 12 }}
        >
          <Galaxy size={52} color="var(--accent)" />
        </motion.div>
        <h1 className="led-text" style={{
          fontSize: 'clamp(14px, 3vw, 22px)',
          lineHeight: 1.8,
        }}>
          <span className="gradient-text">THE FUTURE TIMELINE</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: 6, fontSize: 'clamp(13px, 2vw, 16px)' }}>
          2025 - 2030: The most transformative years in human history.
          <br />
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Click any event to explore.</span>
        </p>
      </motion.div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 'clamp(20px, 4vw, 40px)',
          top: 0,
          bottom: 0,
          width: 3,
          background: 'linear-gradient(180deg, #4facfe, #ff00e5, #39ff14, #ffe600, #ff6b00, #b026ff)',
          borderRadius: 2,
          opacity: 0.4,
        }} />

        {timelineData.map((year, yi) => (
          <motion.div
            key={year.year}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: yi * 0.1 }}
            style={{ marginBottom: 'clamp(30px, 5vw, 50px)', position: 'relative' }}
          >
            {/* Year marker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(12px, 2vw, 20px)',
              marginBottom: 16,
            }}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                style={{
                  width: 'clamp(42px, 8vw, 56px)',
                  height: 'clamp(42px, 8vw, 56px)',
                  borderRadius: '50%',
                  background: `${year.color}22`,
                  border: `3px solid ${year.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${year.color}33`,
                  zIndex: 1,
                }}
              >
                <DynamicIcon name={year.icon} size={24} color={year.color} />
              </motion.div>

              <div>
                <h2 style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 'clamp(16px, 3vw, 28px)',
                  color: year.color,
                  textShadow: `0 0 15px ${year.color}44`,
                  margin: 0,
                }}>
                  {year.year}
                </h2>
                <div style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginTop: 2,
                }}>
                  {year.title}
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 1.5vw, 13px)',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                }}>
                  {year.tagline}
                </div>
              </div>
            </div>

            {/* Events grid */}
            <div style={{
              marginLeft: 'clamp(54px, 10vw, 76px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 35vw, 280px), 1fr))',
              gap: 10,
            }}>
              {year.events.map((event, ei) => (
                <motion.button
                  key={ei}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: yi * 0.05 + ei * 0.08 }}
                  whileHover={{
                    scale: 1.03,
                    y: -3,
                    boxShadow: `0 8px 25px ${year.color}22`,
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    background: 'var(--gradient-card)',
                    border: `1px solid ${year.color}33`,
                    borderRadius: 14,
                    padding: 'clamp(12px, 2vw, 16px)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-main)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    transition: 'border-color 0.3s',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${year.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <DynamicIcon name={event.icon} size={16} color={year.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'clamp(12px, 1.5vw, 14px)',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}>
                      {event.title}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: impactColors[event.impact],
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 9,
                        fontFamily: 'var(--font-pixel)',
                        color: impactColors[event.impact],
                      }}>
                        {event.impact === 'YOU' ? 'YOUR FUTURE' : event.impact}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    TAP
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            padding: '30px 0',
            marginLeft: 'clamp(54px, 10vw, 76px)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 11,
            color: 'var(--accent2)',
            marginBottom: 8,
          }}>
            THE FUTURE IS UNWRITTEN
          </div>
          <div style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'var(--text-dim)',
          }}>
            What happens next is up to your generation.
          </div>
        </motion.div>
      </div>

      {/* Event Detail Popup */}
      <AnimatePresence>
        {selectedEvent && (
          <EventCard
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
