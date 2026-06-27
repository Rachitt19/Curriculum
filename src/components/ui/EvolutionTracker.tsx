import { worlds } from '../../data/worlds';
import { useStore } from '../../store/useStore';

export function EvolutionTracker() {
  const activeWorldId = useStore((s) => s.activeWorldId);
  const scrollProgress = useStore((s) => s.scrollProgress);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);

  const currentIndex = activeWorldId
    ? worlds.findIndex((w) => w.id === activeWorldId)
    : Math.floor(scrollProgress * worlds.length);

  return (
    <div className="evolution-tracker">
      {worlds.map((world, i) => (
        <div key={world.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            className={`evolution-node ${i <= currentIndex ? 'active' : ''} ${i === currentIndex ? 'current' : ''}`}
            style={{ '--node-color': world.color } as React.CSSProperties}
            onClick={() => setActiveWorldId(world.id)}
            title={`World ${world.numeral}: ${world.name}`}
          />
          {i < worlds.length - 1 && (
            <div
              className={`evolution-connector ${i < currentIndex ? 'active' : ''}`}
              style={{
                '--connector-from': world.color,
                '--connector-to': worlds[i + 1].color,
              } as React.CSSProperties}
            />
          )}
        </div>
      ))}
    </div>
  );
}
