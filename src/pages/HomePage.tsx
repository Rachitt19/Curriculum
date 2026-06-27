import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { worlds } from '../data/worlds';
import { useStore } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);
  const setCurrentView = useStore((s) => s.setCurrentView);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Track overall scroll progress
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // Animate each world section
      const sections = containerRef.current!.querySelectorAll('.world-scroll-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section.querySelector('.world-scroll-card'),
          { opacity: 0, x: -60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [setScrollProgress]);

  return (
    <div ref={containerRef} className="content-layer">
      {/* Spacer for hero */}
      <div style={{ height: '100vh' }} />

      {/* Intro section */}
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
      }}>
        <motion.div
          style={{ maxWidth: '700px', textAlign: 'center' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            marginBottom: '24px',
          }}>
            <span className="text-gradient">15 Worlds. One Universe.</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-lg)',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            The AIRIS curriculum is not linear. It is an interconnected galaxy of knowledge —
            from understanding what intelligence <em>is</em>, to building systems that push
            the frontier of what's possible. Every world connects to every other world.
            Your journey is uniquely yours.
          </p>
        </motion.div>
      </div>

      {/* Evolution path */}
      <div style={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
      }}>
        <motion.div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, staggerChildren: 0.1 }}
        >
          {[
            { name: 'Explorer', icon: '🔭', color: '#F59E0B' },
            { name: 'Thinker', icon: '🧠', color: '#818CF8' },
            { name: 'Learner', icon: '📚', color: '#10B981' },
            { name: 'Builder', icon: '🔧', color: '#3B82F6' },
            { name: 'Researcher', icon: '🔬', color: '#06B6D4' },
            { name: 'Scientist', icon: '⚗️', color: '#78716C' },
            { name: 'Innovator', icon: '💡', color: '#7C3AED' },
            { name: 'Pioneer', icon: '🚀', color: '#EC4899' },
            { name: 'AIRIS Fellow', icon: '✦', color: '#E0E7FF' },
          ].map((level, i) => (
            <motion.div
              key={level.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: `${level.color}15`,
                border: `1px solid ${level.color}40`,
                fontSize: 'var(--text-xs)',
                color: level.color,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}>
                <span>{level.icon}</span>
                <span>{level.name}</span>
              </div>
              {i < 8 && (
                <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>→</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* World sections */}
      {worlds.map((world, i) => (
        <div
          key={world.id}
          className="world-scroll-section"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end',
            justifyContent: 'center',
            padding: '64px 32px',
            paddingLeft: i % 2 === 0 ? '8%' : '35%',
            paddingRight: i % 2 === 0 ? '35%' : '8%',
          }}
        >
          <div
            className="world-scroll-card glass"
            style={{
              maxWidth: '500px',
              padding: '40px',
              '--world-color': world.color,
              position: 'relative',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {/* Top color bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${world.color}, transparent)`,
            }} />

            {/* World number */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-5xl)',
              fontWeight: 700,
              opacity: 0.1,
              color: world.color,
              lineHeight: 1,
            }}>
              {world.numeral}
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.15em',
              color: world.color,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              World {world.numeral}
            </div>

            <h3 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: world.color,
              marginBottom: '8px',
            }}>
              {world.name}
            </h3>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}>
              {world.mission}
            </p>

            <div className="world-evolution" style={{ marginBottom: '20px' }}>
              <span>🎖️</span>
              <span>Become: <strong>{world.evolutionLevel}</strong></span>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '24px',
            }}>
              {world.domains.slice(0, 6).map((domain) => (
                <span key={domain.id} className="domain-chip" style={{ fontSize: '11px' }}>
                  {domain.name}
                </span>
              ))}
              {world.domains.length > 6 && (
                <span className="domain-chip" style={{ fontSize: '11px', opacity: 0.5 }}>
                  +{world.domains.length - 6} more
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              <span>⏱️ {world.duration}</span>
              <span>📊 Difficulty {world.difficulty}/10</span>
              <span>📦 {world.domains.length} domains</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: '24px', width: '100%' }}
              onClick={() => {
                setActiveWorldId(world.id);
                setCurrentView('world');
              }}
            >
              Explore World {world.numeral} →
            </button>
          </div>
        </div>
      ))}

      {/* Ending sequence */}
      <div className="ending-section" style={{ minHeight: '120vh' }}>
        <motion.p
          className="ending-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          Humanity has only explored a fraction of intelligence.
        </motion.p>

        <motion.div
          className="agi-progress-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="agi-progress-label">Progress toward AGI</div>
          <div className="agi-progress-track">
            <div className="agi-progress-fill" />
          </div>
          <div className="agi-progress-percent">~12%</div>
        </motion.div>

        <motion.h2
          className="ending-question text-gradient"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        >
          The next breakthrough does not exist yet.
          <br />
          Will you help create it?
        </motion.h2>

        <motion.button
          className="btn btn-primary"
          style={{
            padding: '16px 48px',
            fontSize: 'var(--text-lg)',
            boxShadow: '0 0 60px rgba(124, 58, 237, 0.4)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Your Journey with AIRIS
        </motion.button>
      </div>
    </div>
  );
}
