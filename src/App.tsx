import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useStore } from './store/useStore';
import { GalaxyMap } from './components/canvas/GalaxyMap';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HeroOverlay } from './components/ui/HeroOverlay';
import { Navbar } from './components/ui/Navbar';
import { WorldCard } from './components/ui/WorldCard';
import { EvolutionTracker } from './components/ui/EvolutionTracker';
import { SearchModal } from './components/ui/SearchModal';
import { HomePage } from './pages/HomePage';
import { WorldPage } from './pages/WorldPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import './index.css';

function App() {
  const isLoaded = useStore((s) => s.isLoaded);
  const currentView = useStore((s) => s.currentView);

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen />

      {/* 3D Canvas (background) — visible on home and galaxy views */}
      {currentView !== 'graph' && (
        <div className={`canvas-container ${isLoaded ? 'interactive' : ''}`}>
          <Canvas
            camera={{ position: [0, 2, 25], fov: 60 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <GalaxyMap />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Background gradient (always visible) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 40%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* UI Overlay */}
      {isLoaded && (
        <>
          <Navbar />
          <SearchModal />

          {currentView === 'home' && (
            <>
              <HeroOverlay />
              <HomePage />
              <EvolutionTracker />
              <WorldCard />
            </>
          )}

          {currentView === 'galaxy' && (
            <>
              <EvolutionTracker />
              <WorldCard />
            </>
          )}

          {currentView === 'world' && <WorldPage />}
          {currentView === 'graph' && <KnowledgeGraphPage />}
        </>
      )}
    </>
  );
}

export default App;
