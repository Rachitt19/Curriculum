export interface Connection {
  from: number;
  to: number;
  strength: number; // 1-3, affects visual thickness
  label?: string;
}

// Inter-world prerequisite connections
export const connections: Connection[] = [
  // World I unlocks
  { from: 1, to: 2, strength: 3, label: 'Mathematical foundation' },
  { from: 1, to: 3, strength: 2, label: 'Understanding learning' },

  // World II unlocks
  { from: 2, to: 3, strength: 3, label: 'Theory requires math' },
  { from: 2, to: 4, strength: 3, label: 'ML requires math' },

  // World III unlocks
  { from: 3, to: 4, strength: 2, label: 'Theory guides practice' },
  { from: 3, to: 5, strength: 2, label: 'Representation theory' },

  // World IV unlocks
  { from: 4, to: 5, strength: 2, label: 'Advanced representations' },
  { from: 4, to: 6, strength: 3, label: 'Classical to deep' },
  { from: 4, to: 9, strength: 2, label: 'Decision foundations' },

  // World V unlocks
  { from: 5, to: 6, strength: 3, label: 'Representation → Deep' },

  // World VI unlocks (major hub)
  { from: 6, to: 7, strength: 3, label: 'Deep perception' },
  { from: 6, to: 8, strength: 3, label: 'Deep language' },
  { from: 6, to: 9, strength: 2, label: 'Deep decisions' },
  { from: 6, to: 12, strength: 2, label: 'Systems for DL' },

  // World VII unlocks
  { from: 7, to: 10, strength: 3, label: 'Embodied perception' },
  { from: 7, to: 11, strength: 2, label: 'Visual generation' },

  // World VIII unlocks
  { from: 8, to: 11, strength: 2, label: 'Language generation' },
  { from: 8, to: 13, strength: 3, label: 'Language agents' },

  // World IX unlocks
  { from: 9, to: 10, strength: 3, label: 'RL → Robotics' },
  { from: 9, to: 13, strength: 2, label: 'Agent decisions' },

  // World X unlocks
  { from: 10, to: 15, strength: 2, label: 'Physical AI frontier' },

  // World XI unlocks
  { from: 11, to: 15, strength: 2, label: 'Generative frontier' },

  // World XII unlocks
  { from: 12, to: 13, strength: 2, label: 'Agent infrastructure' },
  { from: 12, to: 15, strength: 2, label: 'Scaling frontier' },

  // World XIII unlocks
  { from: 13, to: 14, strength: 3, label: 'Agent safety' },
  { from: 13, to: 15, strength: 2, label: 'Autonomous frontier' },

  // World XIV unlocks
  { from: 14, to: 15, strength: 3, label: 'Safe frontier' },
];
