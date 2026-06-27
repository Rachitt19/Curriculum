import { motion } from 'framer-motion';
import { worlds } from '../data/worlds';
import { useStore } from '../store/useStore';

export function WorldPage() {
  const activeWorldId = useStore((s) => s.activeWorldId);
  const setCurrentView = useStore((s) => s.setCurrentView);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);

  const world = activeWorldId !== null ? worlds.find((w) => w.id === activeWorldId) : null;

  if (!world) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      className="world-page content-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <motion.button
        className="btn btn-ghost"
        style={{ position: 'fixed', top: '24px', left: '24px', zIndex: 30 }}
        onClick={() => {
          setCurrentView('galaxy');
          setActiveWorldId(null);
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        ← Back to Galaxy
      </motion.button>

      {/* Hero */}
      <div
        className="world-page-hero"
        style={{
          background: `radial-gradient(ellipse at center, ${world.color}15 0%, transparent 70%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.2em',
            color: world.color,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            World {world.numeral}
          </div>
          <h1 style={{
            fontSize: 'var(--text-5xl)',
            fontWeight: 700,
            color: world.color,
            marginBottom: '16px',
          }}>
            {world.name}
          </h1>
          <p style={{
            fontSize: 'var(--text-xl)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            fontWeight: 300,
          }}>
            {world.mission}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'center' }}>
            <div className="world-evolution">
              <span>🎖️</span>
              <span>Become: <strong>{world.evolutionLevel}</strong></span>
            </div>
            <div className="world-evolution">
              <span>⏱️</span>
              <span>{world.duration}</span>
            </div>
            <div className="world-evolution">
              <span>📊</span>
              <span>Difficulty: {world.difficulty}/10</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="world-page-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Domains Grid */}
        <motion.section className="world-page-section" variants={itemVariants}>
          <h2 className="world-page-section-title" style={{ '--world-color': world.color } as React.CSSProperties}>
            Core Domains ({world.domains.length})
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {world.domains.map((domain, i) => (
              <motion.div
                key={domain.id}
                className="domain-card glass"
                variants={itemVariants}
                custom={i}
                style={{ '--world-color': world.color } as React.CSSProperties}
              >
                <div className="domain-card-name" style={{ color: world.color }}>
                  {domain.name}
                </div>
                <div className="domain-card-desc">{domain.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Research & Industry */}
        <motion.section className="world-page-section" variants={itemVariants}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '12px', color: world.color }}>
                🔬 Research Relevance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                {world.researchRelevance}
              </p>
            </div>
            <div className="glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '12px', color: world.color }}>
                🏢 Industry Relevance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                {world.industryRelevance}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Books */}
        <motion.section className="world-page-section" variants={itemVariants}>
          <h2 className="world-page-section-title" style={{ '--world-color': world.color } as React.CSSProperties}>
            Recommended Books
          </h2>
          <div className="books-list">
            {world.books.map((book, i) => (
              <div key={i} className="resource-item">
                <span className="resource-icon">📖</span>
                <span className="resource-text">{book}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Papers */}
        <motion.section className="world-page-section" variants={itemVariants}>
          <h2 className="world-page-section-title" style={{ '--world-color': world.color } as React.CSSProperties}>
            Research Papers
          </h2>
          <div className="papers-list">
            {world.papers.map((paper, i) => (
              <div key={i} className="resource-item">
                <span className="resource-icon">📄</span>
                <span className="resource-text">{paper}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section className="world-page-section" variants={itemVariants}>
          <h2 className="world-page-section-title" style={{ '--world-color': world.color } as React.CSSProperties}>
            Projects
          </h2>
          <div className="projects-list">
            {world.projects.map((project, i) => (
              <div key={i} className="resource-item">
                <span className="resource-icon">🛠️</span>
                <span className="resource-text">{project}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Prerequisites & Unlocks */}
        <motion.section className="world-page-section" variants={itemVariants}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '16px' }}>Prerequisites</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {world.prerequisites.length === 0 ? (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>None — start here!</span>
                ) : (
                  world.prerequisites.map((prereq) => {
                    const prereqWorld = worlds.find((w) => w.id === prereq);
                    if (!prereqWorld) return null;
                    return (
                      <button
                        key={prereq}
                        className="domain-chip"
                        style={{ borderColor: prereqWorld.color, color: prereqWorld.color }}
                        onClick={() => setActiveWorldId(prereq)}
                      >
                        World {prereqWorld.numeral}: {prereqWorld.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '16px' }}>Unlocks</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {world.unlocks.length === 0 ? (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>You have reached the frontier.</span>
                ) : (
                  world.unlocks.map((unlockId) => {
                    const unlockWorld = worlds.find((w) => w.id === unlockId);
                    if (!unlockWorld) return null;
                    return (
                      <button
                        key={unlockId}
                        className="domain-chip"
                        style={{ borderColor: unlockWorld.color, color: unlockWorld.color }}
                        onClick={() => setActiveWorldId(unlockId)}
                      >
                        World {unlockWorld.numeral}: {unlockWorld.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
