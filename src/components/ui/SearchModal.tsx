import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { worlds } from '../../data/worlds';
import { useStore } from '../../store/useStore';

interface SearchResult {
  type: 'world' | 'domain';
  worldId: number;
  worldName: string;
  worldColor: string;
  name: string;
  description: string;
  domainId?: string;
}

export function SearchModal() {
  const showSearch = useStore((s) => s.showSearch);
  const setShowSearch = useStore((s) => s.setShowSearch);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build search index
  const allItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];
    worlds.forEach((world) => {
      items.push({
        type: 'world',
        worldId: world.id,
        worldName: world.name,
        worldColor: world.color,
        name: world.name,
        description: world.mission,
      });
      world.domains.forEach((domain) => {
        items.push({
          type: 'domain',
          worldId: world.id,
          worldName: world.name,
          worldColor: world.color,
          name: domain.name,
          description: domain.description,
          domainId: domain.id,
        });
      });
    });
    return items;
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 15);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.worldName.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, allItems]);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setFocusedIndex(0);
    }
  }, [showSearch]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch, setShowSearch]);

  const handleSelect = (result: SearchResult) => {
    setActiveWorldId(result.worldId);
    setShowSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[focusedIndex]) {
      handleSelect(results[focusedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          className="search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSearch(false);
          }}
        >
          <motion.div
            className="search-modal glass-strong"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,255,0.4)" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Search worlds, domains, concepts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
              <span className="search-shortcut">ESC</span>
            </div>

            <div className="search-results">
              {results.map((result, i) => (
                <div
                  key={`${result.type}-${result.worldId}-${result.domainId || ''}`}
                  className={`search-result-item ${i === focusedIndex ? 'focused' : ''}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <div
                    className="search-result-dot"
                    style={{ background: result.worldColor }}
                  />
                  <div>
                    <div className="search-result-name">{result.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(240,240,255,0.4)', marginTop: '2px' }}>
                      {result.description.slice(0, 60)}...
                    </div>
                  </div>
                  <span className="search-result-world">
                    {result.type === 'domain' ? result.worldName : `World ${worlds.find(w => w.id === result.worldId)?.numeral}`}
                  </span>
                </div>
              ))}
              {results.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(240,240,255,0.4)', fontSize: '14px' }}>
                  No results found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
