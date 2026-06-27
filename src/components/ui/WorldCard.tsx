import { motion, AnimatePresence } from 'framer-motion';
import { worlds, type World } from '../../data/worlds';
import { useStore } from '../../store/useStore';

export function WorldCard() {
  const activeWorldId = useStore((s) => s.activeWorldId);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);
  const setCurrentView = useStore((s) => s.setCurrentView);

  const world = activeWorldId !== null ? worlds.find(w => w.id === activeWorldId) : null;

  return (
    <AnimatePresence>
      {world && (
        <motion.div
          key={world.id}
          className="overlay-layer"
          style={{
            left: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: '460px',
            width: '90%',
          }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="world-card glass"
            style={{ '--world-color': world.color } as React.CSSProperties}
          >
            <span className="world-numeral">{world.numeral}</span>

            <h2 className="world-name">{world.name}</h2>
            <p className="world-mission">{world.mission}</p>

            <div className="world-evolution">
              <span>🎖️</span>
              <span>Become: <strong>{world.evolutionLevel}</strong></span>
            </div>

            <div className="world-domains-label">Core Domains</div>
            <div className="world-domains-grid">
              {world.domains.slice(0, 8).map((domain) => (
                <span key={domain.id} className="domain-chip">
                  {domain.name}
                </span>
              ))}
              {world.domains.length > 8 && (
                <span className="domain-chip" style={{ opacity: 0.5 }}>
                  +{world.domains.length - 8} more
                </span>
              )}
            </div>

            <div className="world-meta">
              <div className="world-meta-item">
                <span className="world-meta-label">Duration</span>
                <span className="world-meta-value">{world.duration}</span>
              </div>
              <div className="world-meta-item">
                <span className="world-meta-label">Difficulty</span>
                <DifficultyBar difficulty={world.difficulty} color={world.color} />
              </div>
              <div className="world-meta-item">
                <span className="world-meta-label">Domains</span>
                <span className="world-meta-value">{world.domains.length}</span>
              </div>
              <div className="world-meta-item">
                <span className="world-meta-label">Prerequisites</span>
                <span className="world-meta-value">
                  {world.prerequisites.length === 0
                    ? 'None'
                    : world.prerequisites
                        .map((p) => worlds.find((w) => w.id === p)?.name)
                        .join(', ')}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary world-enter-btn"
              onClick={() => {
                setCurrentView('world');
              }}
            >
              Enter World {world.numeral} →
            </button>

            <button
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => setActiveWorldId(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DifficultyBar({ difficulty, color }: { difficulty: number; color: string }) {
  return (
    <div className="difficulty-bar">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`difficulty-segment ${i < difficulty ? 'active' : ''}`}
          style={i < difficulty ? { background: color } : undefined}
        />
      ))}
    </div>
  );
}
