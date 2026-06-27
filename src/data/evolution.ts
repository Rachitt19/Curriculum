export interface EvolutionLevel {
  id: string;
  name: string;
  order: number;
  worldRequired: number;
  icon: string;
  description: string;
  color: string;
}

export const evolutionLevels: EvolutionLevel[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    order: 1,
    worldRequired: 1,
    icon: '🔭',
    description: 'You have begun your journey into the universe of intelligence.',
    color: '#F59E0B',
  },
  {
    id: 'thinker',
    name: 'Thinker',
    order: 2,
    worldRequired: 2,
    icon: '🧠',
    description: 'You can now think in the language of mathematics and logic.',
    color: '#818CF8',
  },
  {
    id: 'learner',
    name: 'Learner',
    order: 3,
    worldRequired: 3,
    icon: '📚',
    description: 'You understand why and how machines can learn.',
    color: '#10B981',
  },
  {
    id: 'builder',
    name: 'Builder',
    order: 4,
    worldRequired: 4,
    icon: '🔧',
    description: 'You can build intelligent systems from classical algorithms.',
    color: '#3B82F6',
  },
  {
    id: 'researcher',
    name: 'Researcher',
    order: 5,
    worldRequired: 6,
    icon: '🔬',
    description: 'You understand modern deep learning and can push boundaries.',
    color: '#06B6D4',
  },
  {
    id: 'scientist',
    name: 'Scientist',
    order: 6,
    worldRequired: 10,
    icon: '⚗️',
    description: 'You build physical and generative intelligence systems.',
    color: '#78716C',
  },
  {
    id: 'innovator',
    name: 'Innovator',
    order: 7,
    worldRequired: 13,
    icon: '💡',
    description: 'You create autonomous AI systems and ensure their safety.',
    color: '#7C3AED',
  },
  {
    id: 'pioneer',
    name: 'Pioneer',
    order: 8,
    worldRequired: 14,
    icon: '🚀',
    description: 'You stand at the edge of known AI research.',
    color: '#EC4899',
  },
  {
    id: 'fellow',
    name: 'AIRIS Fellow',
    order: 9,
    worldRequired: 15,
    icon: '✦',
    description: 'You have traversed the entire known universe of AI. Now create the unknown.',
    color: '#E0E7FF',
  },
];
