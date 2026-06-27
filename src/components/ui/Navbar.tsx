import { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export function Navbar() {
  const showNavbar = useStore((s) => s.showNavbar);
  const setShowNavbar = useStore((s) => s.setShowNavbar);
  const setShowSearch = useStore((s) => s.setShowSearch);
  const setCurrentView = useStore((s) => s.setCurrentView);
  const currentView = useStore((s) => s.currentView);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setShowNavbar]);

  const navigate = (view: 'home' | 'galaxy' | 'graph') => {
    setCurrentView(view);
    setActiveWorldId(null);
    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar glass-strong ${showNavbar ? 'visible' : ''}`}>
      <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
        AIRIS
      </div>
      <ul className="navbar-links">
        <li
          className={`navbar-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => navigate('home')}
        >
          Home
        </li>
        <li
          className={`navbar-link ${currentView === 'galaxy' ? 'active' : ''}`}
          onClick={() => navigate('galaxy')}
        >
          Galaxy
        </li>
        <li
          className={`navbar-link ${currentView === 'graph' ? 'active' : ''}`}
          onClick={() => navigate('graph')}
        >
          Knowledge Graph
        </li>
        <li
          className="navbar-link"
          onClick={() => setShowSearch(true)}
        >
          Search
        </li>
      </ul>
    </nav>
  );
}
