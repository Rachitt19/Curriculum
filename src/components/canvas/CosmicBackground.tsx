import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CosmicBackground() {
  const starsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const sizes = new Float32Array(2000);
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 150 + Math.random() * 200;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = 0.5 + Math.random() * 2;
    }
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={starPositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={2000}
          array={starPositions.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
