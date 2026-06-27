import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const PARTICLE_COUNT = 3000;

export function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const qualitySetting = useStore((s) => s.qualitySetting);
  const count = qualitySetting === 'high' ? PARTICLE_COUNT : qualitySetting === 'medium' ? 1500 : 600;

  const { positions, speeds, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      [0.48, 0.23, 0.93], // purple
      [0.02, 0.71, 0.83], // cyan
      [0.23, 0.51, 0.96], // blue
      [0.93, 0.29, 0.60], // pink
      [0.06, 0.73, 0.50], // green
    ];

    for (let i = 0; i < count; i++) {
      // Spread particles in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 20 + Math.random() * 80;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      speeds[i] = 0.1 + Math.random() * 0.5;
      sizes[i] = 0.02 + Math.random() * 0.06;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }

    return { positions, speeds, sizes, colors };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    arr.set(colors);
    return arr;
  }, [colors, count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const speed = speeds[i];
      const size = sizes[i];

      dummy.position.set(
        x + Math.sin(time * speed * 0.3 + i) * 0.5,
        y + Math.cos(time * speed * 0.2 + i * 0.5) * 0.5,
        z + Math.sin(time * speed * 0.1 + i * 0.7) * 0.3
      );

      const pulse = 1 + Math.sin(time * speed + i) * 0.3;
      dummy.scale.setScalar(size * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial transparent opacity={0.7} toneMapped={false}>
        <instancedBufferAttribute
          attach="geometry-attributes-color"
          args={[colorArray, 3]}
        />
      </meshBasicMaterial>
    </instancedMesh>
  );
}
