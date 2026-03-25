// Real news-based quiz questions — updated March 2026
// These rotate randomly each time you play!

export const newsCategories = [
  { id: 'ai', label: 'AI & Tech', icon: 'Robot', color: '#00f0ff' },
  { id: 'space', label: 'Space', icon: 'Rocket', color: '#b026ff' },
  { id: 'robots', label: 'Robotics', icon: 'Controller', color: '#39ff14' },
  { id: 'wild', label: 'Wild Cards', icon: 'WildCard', color: '#ff00e5' },
];

export const newsQuestions = [
  // AI & TECH
  {
    category: 'ai',
    question: 'OpenAI just dropped GPT-5.4 in March 2026. How big is its context window?',
    options: ['100,000 tokens', '500,000 tokens', 'Over 1 MILLION tokens', '10 million tokens'],
    correct: 2,
    explanation: 'GPT-5.4 supports context windows up to 1.05 million tokens — the largest OpenAI has ever offered! That\'s like reading a whole book series at once.',
    source: 'OpenAI March 2026 Release',
    difficulty: 'medium',
    xp: 30,
  },
  {
    category: 'ai',
    question: 'Yann LeCun (Meta\'s AI chief) started a new company called AMI Labs. How much money did they raise in their FIRST round?',
    options: ['$10 million', '$100 million', 'Over $1 BILLION', '$50 billion'],
    correct: 2,
    explanation: 'AMI Labs raised $1.03 BILLION in seed funding from Nvidia and Jeff Bezos! They\'re building "world models" that understand physics instead of just text.',
    source: 'AMI Labs Funding Round 2026',
    difficulty: 'hard',
    xp: 50,
  },
  {
    category: 'ai',
    question: 'Alibaba released Qwen 3.5 Small. What makes these AI models special?',
    options: [
      'They only work in Chinese',
      'They\'re natively multimodal — text, images AND video in one model',
      'They run on quantum computers only',
      'They can only generate code',
    ],
    correct: 1,
    explanation: 'Qwen 3.5 Small models handle text, images, AND video through the same set of weights — one brain for everything!',
    source: 'Alibaba Qwen 3.5 Release',
    difficulty: 'medium',
    xp: 30,
  },
  {
    category: 'ai',
    question: 'Morgan Stanley issued a warning in March 2026. What did they say?',
    options: [
      'AI is getting too expensive',
      'A massive AI breakthrough is coming and most of the world isn\'t ready',
      'They\'re shutting down their AI department',
      'AI stocks will crash',
    ],
    correct: 1,
    explanation: 'Morgan Stanley warned that unprecedented compute power at top AI labs will lead to a massive breakthrough — and most people aren\'t prepared for it!',
    source: 'Morgan Stanley AI Report 2026',
    difficulty: 'easy',
    xp: 20,
  },
  {
    category: 'ai',
    question: 'Meta announced new custom AI chips. How many generations did they reveal at once?',
    options: ['1 chip', '2 chips', '4 generations of chips!', '10 chips'],
    correct: 2,
    explanation: 'Meta revealed FOUR new chip generations — MTIA 300, 400, 450, and 500 — to reduce their dependence on Nvidia! That\'s like announcing 4 new iPhones at once.',
    source: 'Meta MTIA Chip Announcement',
    difficulty: 'medium',
    xp: 30,
  },
  {
    category: 'ai',
    question: 'Atlassian (makers of Jira and Trello) laid off 1,600 people in March 2026. Why?',
    options: [
      'They went bankrupt',
      'To redirect resources toward AI development',
      'Their products failed',
      'They\'re moving to Mars',
    ],
    correct: 1,
    explanation: 'Atlassian cut 10% of their workforce to go ALL IN on AI. Companies are making big bets on artificial intelligence!',
    source: 'Atlassian Restructuring 2026',
    difficulty: 'easy',
    xp: 20,
  },

  // SPACE
  {
    category: 'space',
    question: 'NASA\'s Artemis 2 mission is about to launch. What will it do?',
    options: [
      'Land on Mars',
      'Send a crewed test flight around the Moon',
      'Build a space station on Venus',
      'Deploy satellites around Jupiter',
    ],
    correct: 1,
    explanation: 'Artemis 2 will send astronauts around the Moon — the first crewed lunar mission in over 50 years! Target launch: April 2026.',
    source: 'NASA Artemis Program 2026',
    difficulty: 'easy',
    xp: 20,
  },
  {
    category: 'space',
    question: 'NVIDIA just announced something wild for space. What is it?',
    options: [
      'A gaming console for astronauts',
      'AI computing platforms for orbital data centers and space operations',
      'A rocket powered by GPUs',
      'VR headsets for Mars explorers',
    ],
    correct: 1,
    explanation: 'NVIDIA is putting AI compute IN ORBIT — bringing accelerated computing to space stations and satellites. AI in SPACE!',
    source: 'NVIDIA Space Computing 2026',
    difficulty: 'medium',
    xp: 30,
  },
  {
    category: 'space',
    question: 'What is NASA planning to build on the Moon?',
    options: [
      'A theme park',
      'A permanent Moon base',
      'A giant telescope',
      'Nothing, they cancelled Moon plans',
    ],
    correct: 1,
    explanation: 'NASA announced they want to build an actual Moon BASE and establish an enduring human presence there. Moon houses!',
    source: 'NASA Ignition Event March 2026',
    difficulty: 'easy',
    xp: 20,
  },
  {
    category: 'space',
    question: 'Europe is launching a new satellite navigation system called Celeste. Who\'s launching the first satellites?',
    options: ['SpaceX', 'Rocket Lab', 'Blue Origin', 'NASA'],
    correct: 1,
    explanation: 'Rocket Lab launched the first two Celeste navigation satellites on March 25, 2026! Europe is building its own GPS alternative.',
    source: 'Rocket Lab Celeste Launch 2026',
    difficulty: 'hard',
    xp: 50,
  },

  // ROBOTICS
  {
    category: 'robots',
    question: 'Google DeepMind announced a partnership to make which famous robot smarter?',
    options: ['WALL-E', 'Boston Dynamics Atlas', 'R2-D2', 'Optimus Prime'],
    correct: 1,
    explanation: 'DeepMind is using its Gemini AI to make Boston Dynamics\' Atlas humanoid robot smarter! Think about that — the world\'s most athletic robot getting a genius brain upgrade.',
    source: 'DeepMind x Boston Dynamics 2026',
    difficulty: 'medium',
    xp: 30,
  },
  {
    category: 'robots',
    question: 'Walmart is expanding drone deliveries to 150 more stores. How many Americans will have access to drone delivery?',
    options: ['1 million', '10 million', 'Over 40 million', '300 million'],
    correct: 2,
    explanation: 'Over 40 MILLION Americans will be able to get stuff delivered by DRONE from 270+ Walmart locations. The future is now!',
    source: 'Wing Aviation x Walmart 2026',
    difficulty: 'medium',
    xp: 30,
  },
  {
    category: 'robots',
    question: 'Singapore is hosting RoboFest 2026 for families and students. What cool thing can you do there?',
    options: [
      'Fight robot battles',
      'Talk to Ameca (a humanoid AI robot) and code drones',
      'Build a spaceship',
      'Nothing fun, just lectures',
    ],
    correct: 1,
    explanation: 'At RoboFest 2026 you can interact with Ameca the humanoid robot, learn drone coding, and build LEGO AI kits! How cool is that?',
    source: 'Science Centre Singapore RoboFest 2026',
    difficulty: 'easy',
    xp: 20,
  },
  {
    category: 'robots',
    question: 'What\'s the biggest trend in robotics in 2026?',
    options: [
      'Robots are getting smaller',
      'Robots powered by AI are becoming more autonomous',
      'Robots are learning to swim',
      'Robots are replacing all teachers',
    ],
    correct: 1,
    explanation: 'AI-powered autonomy is THE trend — robots that can figure things out on their own without being programmed for every single task!',
    source: 'International Federation of Robotics 2026',
    difficulty: 'easy',
    xp: 20,
  },

  // WILD CARDS
  {
    category: 'wild',
    question: 'How many AI models were released in just ONE WEEK in March 2026?',
    options: ['3', '5', 'More than 12!', '100'],
    correct: 2,
    explanation: 'Over 12 major AI models dropped in a single week in March 2026! It was called "The Week That Changed AI." The pace is INSANE.',
    source: 'BuildFastWithAI March 2026',
    difficulty: 'hard',
    xp: 50,
  },
  {
    category: 'wild',
    question: 'What scores did GPT-5.4 "Thinking" get on a benchmark that tests real-world economic tasks?',
    options: ['25% — worse than random', '50% — average', '83% — at human expert level!', '100% — perfect'],
    correct: 2,
    explanation: 'GPT-5.4 Thinking scored 83% on GDPVal — performing at or ABOVE the level of human experts on economically valuable tasks!',
    source: 'OpenAI GPT-5.4 Benchmarks',
    difficulty: 'hard',
    xp: 50,
  },
  {
    category: 'wild',
    question: 'True or False: A robot that can do backflips exists right now in 2026.',
    options: ['TRUE — Boston Dynamics Atlas can!', 'FALSE — that\'s science fiction', 'Only in movies', 'Only in Japan'],
    correct: 0,
    explanation: 'TRUE! Boston Dynamics Atlas has been doing parkour and backflips for years now. And with DeepMind\'s Gemini AI, it\'s about to get even more impressive!',
    source: 'Boston Dynamics Atlas',
    difficulty: 'easy',
    xp: 20,
  },
  {
    category: 'wild',
    question: 'What does AMI Labs (Yann LeCun\'s new company) build instead of large language models?',
    options: [
      'Video games',
      '"World models" that understand physical laws',
      'Social media apps',
      'Just bigger language models',
    ],
    correct: 1,
    explanation: 'AMI Labs builds "world models" — AI that understands how the physical world ACTUALLY works, not just text patterns. Think: AI that understands gravity and physics!',
    source: 'AMI Labs 2026',
    difficulty: 'hard',
    xp: 50,
  },
];

// Shuffle helper
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get questions by category or random mix
export function getNewsQuestions(category = 'all', count = 5) {
  let pool = category === 'all'
    ? newsQuestions
    : newsQuestions.filter(q => q.category === category);
  return shuffleArray(pool).slice(0, count);
}
