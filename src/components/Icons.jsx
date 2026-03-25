// SVG Icon System — Esports/Gaming Arena Style
// Bold strokes, energetic, slightly rounded

const Icon = ({ children, size = 24, color = 'currentColor', style, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}
    {...props}
  >
    {children}
  </svg>
);

// ═══════ MODULE ICONS ═══════

export const Brain = (p) => (
  <Icon {...p}>
    <path d="M12 2a5 5 0 0 1 4.9 4 5 5 0 0 1-1.2 9.8A4.5 4.5 0 0 1 12 22a4.5 4.5 0 0 1-3.7-6.2A5 5 0 0 1 7.1 6 5 5 0 0 1 12 2z" />
    <path d="M12 2v20" />
    <path d="M8 8c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5" />
    <path d="M8 14c1.5-1 3-1.5 4-1.5s2.5.5 4 1.5" />
  </Icon>
);

export const Target = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill={p.color || 'currentColor'} />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </Icon>
);

export const Robot = (p) => (
  <Icon {...p}>
    <rect x="5" y="8" width="14" height="12" rx="2" />
    <rect x="8" y="2" width="8" height="6" rx="1" />
    <circle cx="10" cy="13" r="1.5" fill={p.color || 'currentColor'} />
    <circle cx="14" cy="13" r="1.5" fill={p.color || 'currentColor'} />
    <line x1="9" y1="17" x2="15" y2="17" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="0" />
  </Icon>
);

export const Lightning = (p) => (
  <Icon {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={p.color || 'currentColor'} stroke={p.color || 'currentColor'} />
  </Icon>
);

export const Scales = (p) => (
  <Icon {...p}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="4" y1="7" x2="20" y2="7" />
    <path d="M4 7l-2 8h8L8 7" />
    <path d="M20 7l-2 8h-4l2-8" />
    <line x1="10" y1="21" x2="14" y2="21" />
  </Icon>
);

// ═══════ ACHIEVEMENT / REWARD ICONS ═══════

export const Trophy = (p) => (
  <Icon {...p}>
    <path d="M6 9H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
    <path d="M18 9h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3" />
    <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
    <path d="M10 16v2h4v-2" />
    <rect x="8" y="18" width="8" height="2" rx="1" />
  </Icon>
);

export const Fire = (p) => (
  <Icon {...p}>
    <path d="M12 2c.5 4-2 6-2 10a4 4 0 0 0 8 0c0-4-3-6-2-10" fill={p.color || 'currentColor'} opacity="0.2" />
    <path d="M12 2c.5 4-2 6-2 10a4 4 0 0 0 8 0c0-4-3-6-2-10" />
    <path d="M12 18a2 2 0 0 0 2-2c0-2-1.5-3-1-5-1 2-3 3-3 5a2 2 0 0 0 2 2z" fill={p.color || 'currentColor'} />
  </Icon>
);

export const Gem = (p) => (
  <Icon {...p}>
    <polygon points="12 2 2 9 7 22 17 22 22 9" />
    <line x1="2" y1="9" x2="22" y2="9" />
    <line x1="12" y1="2" x2="7" y2="9" />
    <line x1="12" y1="2" x2="17" y2="9" />
    <line x1="7" y1="9" x2="12" y2="22" />
    <line x1="17" y1="9" x2="12" y2="22" />
  </Icon>
);

export const Medal = (p) => (
  <Icon {...p}>
    <path d="M7 2l3 6h4l3-6" />
    <circle cx="12" cy="14" r="6" />
    <path d="M12 10v4l2 2" />
  </Icon>
);

export const GradCap = (p) => (
  <Icon {...p}>
    <polygon points="12 3 1 9 12 15 23 9" />
    <path d="M5 11v5c0 2 3 4 7 4s7-2 7-4v-5" />
    <line x1="23" y1="9" x2="23" y2="17" />
  </Icon>
);

export const Bolt = (p) => (
  <Icon {...p}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Icon>
);

// ═══════ LEVEL ICONS ═══════

export const Seedling = (p) => (
  <Icon {...p}>
    <path d="M12 22V12" />
    <path d="M12 12C12 7 17 5 20 4c-1 4-2 8-8 8" />
    <path d="M12 15C12 10 7 8 4 7c1 4 2 8 8 8" />
  </Icon>
);

export const ChartBar = (p) => (
  <Icon {...p}>
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="8" width="4" height="13" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </Icon>
);

export const Compass = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16 8 14 16 8 16 10 8" fill={p.color || 'currentColor'} opacity="0.3" />
    <polygon points="16 8 14 16 8 16 10 8" />
  </Icon>
);

export const Spade = (p) => (
  <Icon {...p}>
    <path d="M12 2C8 6 2 10 2 14a5 5 0 0 0 5 5c2 0 4-1 5-3 1 2 3 3 5 3a5 5 0 0 0 5-5c0-4-6-8-10-12z" />
    <line x1="12" y1="16" x2="12" y2="22" />
    <line x1="9" y1="22" x2="15" y2="22" />
  </Icon>
);

export const Lasso = (p) => (
  <Icon {...p}>
    <ellipse cx="12" cy="10" rx="9" ry="7" />
    <path d="M20 13c1.5 1.5 1 4-1 5s-4 .5-5-1" />
    <circle cx="14" cy="17" r="1" fill={p.color || 'currentColor'} />
  </Icon>
);

export const Wand = (p) => (
  <Icon {...p}>
    <line x1="3" y1="21" x2="17" y2="7" />
    <path d="M17 7l4-4" />
    <path d="M14 4l1.5 1.5" />
    <path d="M20 10l-1.5-1.5" />
    <path d="M9 2v3" />
    <path d="M3 8h3" />
    <path d="M21 14v3" />
  </Icon>
);

export const Belt = (p) => (
  <Icon {...p}>
    <rect x="2" y="8" width="20" height="8" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v-3M12 15v3" />
    <rect x="9" y="9" width="6" height="6" rx="1" fill={p.color || 'currentColor'} opacity="0.15" />
  </Icon>
);

export const Crown = (p) => (
  <Icon {...p}>
    <path d="M2 18L5 8l4 4 3-8 3 8 4-4 3 10z" fill={p.color || 'currentColor'} opacity="0.2" />
    <path d="M2 18L5 8l4 4 3-8 3 8 4-4 3 10z" />
    <rect x="2" y="18" width="20" height="3" rx="1" />
  </Icon>
);

export const Galaxy = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" fill={p.color || 'currentColor'} opacity="0.4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
  </Icon>
);

export const Sword = (p) => (
  <Icon {...p}>
    <line x1="18" y1="2" x2="8" y2="12" />
    <path d="M18 2l4 0 0 4" />
    <path d="M10 14l-6 6" />
    <path d="M7 11l-3 3 6 6 3-3" />
  </Icon>
);

// ═══════ NAVIGATION ICONS ═══════

export const Home = (p) => (
  <Icon {...p}>
    <path d="M3 12l9-9 9 9" />
    <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
  </Icon>
);

export const Book = (p) => (
  <Icon {...p}>
    <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
    <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
    <line x1="12" y1="7" x2="16" y2="7" />
    <line x1="12" y1="11" x2="16" y2="11" />
    <rect x="8" y="7" width="2" height="6" rx="0.5" fill={p.color || 'currentColor'} opacity="0.3" />
  </Icon>
);

export const Newspaper = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="7" x2="13" y2="7" />
    <line x1="7" y1="11" x2="17" y2="11" />
    <line x1="7" y1="15" x2="17" y2="15" />
    <rect x="15" y="5" width="2" height="4" fill={p.color || 'currentColor'} opacity="0.3" />
  </Icon>
);

// ═══════ UI ICONS ═══════

export const Lock = (p) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1" fill={p.color || 'currentColor'} />
  </Icon>
);

export const Lightbulb = (p) => (
  <Icon {...p}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" />
  </Icon>
);

export const Star = (p) => (
  <Icon {...p}>
    <polygon points="12 2 15 9 22 9 17 14 18.5 21 12 17 5.5 21 7 14 2 9 9 9" fill={p.color || 'currentColor'} opacity="0.2" />
    <polygon points="12 2 15 9 22 9 17 14 18.5 21 12 17 5.5 21 7 14 2 9 9 9" />
  </Icon>
);

export const Check = (p) => (
  <Icon {...p}>
    <polyline points="20 6 9 17 4 12" strokeWidth="3" />
  </Icon>
);

export const Clock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

export const ArrowRight = (p) => (
  <Icon {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

export const Plus = (p) => (
  <Icon {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

export const UserIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="5" />
    <path d="M3 21v-2a7 7 0 0 1 14 0v2" />
  </Icon>
);

export const Settings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </Icon>
);

export const Shield = (p) => (
  <Icon {...p}>
    <path d="M12 2l8 4v5c0 5.5-3.8 10-8 11.5C7.8 21 4 16.5 4 11V6l8-4z" />
    <polyline points="9 12 11 14 15 10" />
  </Icon>
);

export const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

export const Rocket = (p) => (
  <Icon {...p}>
    <path d="M12 2C8 6 6 10 6 14l3 3c4 0 8-2 12-6-2-4-6-6-9-9z" />
    <circle cx="12" cy="11" r="2" />
    <path d="M6 14l-3 3 2 2 3-3" />
    <path d="M18 8l3-3-2-2-3 3" />
  </Icon>
);

// ═══════ ESPORTS / GAMING ICONS ═══════

export const Controller = (p) => (
  <Icon {...p}>
    <rect x="2" y="6" width="20" height="12" rx="6" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="6" y1="12" x2="10" y2="12" />
    <circle cx="15" cy="10" r="1" fill={p.color || 'currentColor'} />
    <circle cx="17" cy="12" r="1" fill={p.color || 'currentColor'} />
  </Icon>
);

export const Headset = (p) => (
  <Icon {...p}>
    <path d="M4 14V9a8 8 0 0 1 16 0v5" />
    <rect x="2" y="12" width="4" height="7" rx="1" />
    <rect x="18" y="12" width="4" height="7" rx="1" />
    <path d="M18 19a2 2 0 0 1-2 2h-3" />
  </Icon>
);

export const Monitor = (p) => (
  <Icon {...p}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </Icon>
);

export const Scoreboard = (p) => (
  <Icon {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <text x="7" y="8" fontSize="5" fill={p.color || 'currentColor'} textAnchor="middle" stroke="none" fontWeight="bold">1</text>
    <text x="17" y="8" fontSize="5" fill={p.color || 'currentColor'} textAnchor="middle" stroke="none" fontWeight="bold">2</text>
  </Icon>
);

export const Bracket = (p) => (
  <Icon {...p}>
    <line x1="3" y1="4" x2="8" y2="4" />
    <line x1="3" y1="10" x2="8" y2="10" />
    <line x1="8" y1="4" x2="8" y2="10" />
    <line x1="8" y1="7" x2="13" y2="7" />
    <line x1="3" y1="14" x2="8" y2="14" />
    <line x1="3" y1="20" x2="8" y2="20" />
    <line x1="8" y1="14" x2="8" y2="20" />
    <line x1="8" y1="17" x2="13" y2="17" />
    <line x1="13" y1="7" x2="13" y2="17" />
    <line x1="13" y1="12" x2="21" y2="12" />
  </Icon>
);

export const Podium = (p) => (
  <Icon {...p}>
    <rect x="2" y="14" width="6" height="8" fill={p.color || 'currentColor'} opacity="0.15" />
    <rect x="9" y="8" width="6" height="14" fill={p.color || 'currentColor'} opacity="0.25" />
    <rect x="16" y="11" width="6" height="11" fill={p.color || 'currentColor'} opacity="0.15" />
    <rect x="2" y="14" width="6" height="8" />
    <rect x="9" y="8" width="6" height="14" />
    <rect x="16" y="11" width="6" height="11" />
    <text x="5" y="19" fontSize="5" fill={p.color || 'currentColor'} textAnchor="middle" stroke="none" fontWeight="bold">3</text>
    <text x="12" y="14" fontSize="5" fill={p.color || 'currentColor'} textAnchor="middle" stroke="none" fontWeight="bold">1</text>
    <text x="19" y="17" fontSize="5" fill={p.color || 'currentColor'} textAnchor="middle" stroke="none" fontWeight="bold">2</text>
  </Icon>
);

export const Crosshair = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <circle cx="12" cy="12" r="1" fill={p.color || 'currentColor'} />
  </Icon>
);

export const WildCard = (p) => (
  <Icon {...p}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <text x="12" y="15" fontSize="10" fill={p.color || 'currentColor'} textAnchor="middle" stroke="none" fontWeight="bold">?</text>
  </Icon>
);

export const Satellite = (p) => (
  <Icon {...p}>
    <path d="M12 12l-8 8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M17 7l2-2" />
    <path d="M15 3l4 4" />
    <path d="M5 19l2 2" />
    <path d="M3 17l4 4" />
    <path d="M8.5 8.5A5 5 0 0 1 16 10" />
    <path d="M14 15.5A5 5 0 0 1 8.5 8.5" />
  </Icon>
);

export const Dna = (p) => (
  <Icon {...p}>
    <path d="M8 2s4 4 4 10-4 10-4 10" />
    <path d="M16 2s-4 4-4 10 4 10 4 10" />
    <line x1="7" y1="7" x2="17" y2="7" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="7" y1="17" x2="17" y2="17" />
  </Icon>
);

export const Globe = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="4" ry="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M4.5 7h15M4.5 17h15" />
  </Icon>
);

export const Microscope = (p) => (
  <Icon {...p}>
    <path d="M14 4l-4 12" />
    <circle cx="13" cy="6" r="2" />
    <path d="M10 16h8" />
    <path d="M6 20h12" />
    <line x1="12" y1="16" x2="12" y2="20" />
    <path d="M16 10a4 4 0 0 1-1.5 3.1" />
  </Icon>
);

export const Drone = (p) => (
  <Icon {...p}>
    <rect x="8" y="10" width="8" height="6" rx="1" />
    <line x1="4" y1="8" x2="8" y2="10" />
    <line x1="20" y1="8" x2="16" y2="10" />
    <circle cx="4" cy="7" r="2" />
    <circle cx="20" cy="7" r="2" />
    <line x1="4" y1="18" x2="8" y2="16" />
    <line x1="20" y1="18" x2="16" y2="16" />
    <circle cx="4" cy="19" r="2" />
    <circle cx="20" cy="19" r="2" />
  </Icon>
);

export const Logout = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

export const Refresh = (p) => (
  <Icon {...p}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.36-3.36L23 10M1 14l5.64 5.64A9 9 0 0 0 20.49 15" />
  </Icon>
);

export const Palette = (p) => (
  <Icon {...p}>
    <circle cx="13.5" cy="6.5" r="1.5" fill={p.color || 'currentColor'} />
    <circle cx="17.5" cy="10.5" r="1.5" fill={p.color || 'currentColor'} />
    <circle cx="8.5" cy="7.5" r="1.5" fill={p.color || 'currentColor'} />
    <circle cx="6.5" cy="12.5" r="1.5" fill={p.color || 'currentColor'} />
    <path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2 10 10 0 0 0-7-13z" />
  </Icon>
);

// ═══════ ICON MAP (for dynamic rendering by name) ═══════

export const iconMap = {
  Brain, Target, Robot, Lightning, Scales,
  Trophy, Fire, Gem, Medal, GradCap, Bolt, Search,
  Seedling, ChartBar, Compass, Spade, Lasso, Wand, Belt, Crown, Galaxy, Sword,
  Home, Book, Newspaper,
  Lock, Lightbulb, Star, Check, Clock, ArrowRight, Plus, UserIcon, Settings, Shield,
  Controller, Headset, Monitor, Scoreboard, Bracket, Podium, Crosshair, WildCard,
  Rocket, Satellite, Dna, Globe, Microscope, Drone, Logout, Refresh, Palette,
};

// Render icon by name string
export function DynamicIcon({ name, ...props }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}
