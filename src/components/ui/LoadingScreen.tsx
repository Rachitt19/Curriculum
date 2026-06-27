import { useEffect, useState, useRef } from 'react';
import { useStore } from '../../store/useStore';

const quotes = [
  '"The question of whether a computer can think is no more interesting than the question of whether a submarine can swim." — Edsger Dijkstra',
  '"A year spent in artificial intelligence is enough to make one believe in God." — Alan Perlis',
  '"The development of full artificial intelligence could spell the end of the human race, or it could be the best thing ever to happen to us." — Stephen Hawking',
  '"We can only see a short distance ahead, but we can see plenty there that needs to be done." — Alan Turing',
  '"The real problem is not whether machines think but whether men do." — B.F. Skinner',
];

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const setIsLoaded = useStore((s) => s.setIsLoaded);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    // Simulate loading progress
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setTimeout(() => {
            setVisible(false);
            setTimeout(() => setIsLoaded(true), 500);
          }, 400);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 100);

    // Cycle quotes
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(quoteInterval);
    };
  }, [setIsLoaded]);

  if (!visible) return null;

  // Neural network node positions
  const nodes = [
    { x: 60, y: 40 }, { x: 140, y: 60 }, { x: 100, y: 100 },
    { x: 50, y: 130 }, { x: 150, y: 140 }, { x: 100, y: 170 },
  ];

  return (
    <div
      className="loading-screen"
      style={{
        opacity: progress >= 100 ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <div className="loading-neural-container">
        {/* Neural connections SVG */}
        <svg
          width="200"
          height="200"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {nodes.map((from, i) =>
            nodes.slice(i + 1).map((to, j) => (
              <line
                key={`${i}-${j}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(6, 182, 212, 0.15)"
                strokeWidth="1"
              />
            ))
          )}
        </svg>
        {nodes.map((node, i) => (
          <div
            key={i}
            className="loading-node"
            style={{ left: node.x - 4, top: node.y - 4 }}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          className="loading-text"
          style={{ marginBottom: '12px' }}
        >
          Initializing AI Universe — {Math.min(100, Math.round(progress))}%
        </div>
        <div className="loading-bar-track">
          <div
            className="loading-bar-fill"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      <div className="loading-quote" key={quoteIndex}>
        {quotes[quoteIndex]}
      </div>
    </div>
  );
}
