import { useMemo } from 'react';
import { worlds } from '../../data/worlds';
import { useStore } from '../../store/useStore';
import { WorldPlanet } from './WorldPlanet';
import { NeuralConnections } from './NeuralConnections';
import { CameraController } from './CameraController';
import { ParticleField } from './ParticleField';
import { CosmicBackground } from './CosmicBackground';

export function GalaxyMap() {
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);
  const activeWorldId = useStore((s) => s.activeWorldId);

  // Position worlds in a spiral galaxy pattern
  const worldPositions = useMemo(() => {
    const positions = new Map<number, [number, number, number]>();
    worlds.forEach((world, i) => {
      const angle = (i / worlds.length) * Math.PI * 3.5; // spiral
      const radius = 5 + i * 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.sin(i * 0.8) * 2) + (i * 0.3);
      positions.set(world.id, [x, y, z]);
    });
    return positions;
  }, []);

  return (
    <>
      <CameraController worldPositions={worldPositions} />
      <CosmicBackground />
      <ParticleField />

      {/* Ambient light */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#7C3AED" />
      <pointLight position={[20, -10, -20]} intensity={0.3} color="#06B6D4" />

      {/* World planets */}
      {worlds.map((world) => {
        const pos = worldPositions.get(world.id)!;
        return (
          <WorldPlanet
            key={world.id}
            world={world}
            position={pos}
            isActive={activeWorldId === world.id}
            onClick={() =>
              setActiveWorldId(activeWorldId === world.id ? null : world.id)
            }
          />
        );
      })}

      {/* Neural connections between worlds */}
      <NeuralConnections worldPositions={worldPositions} />
    </>
  );
}
