import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { connections } from '../../data/connections';
import { worlds } from '../../data/worlds';
import { hexToRgb } from '../../utils/colors';

interface NeuralConnectionsProps {
  worldPositions: Map<number, [number, number, number]>;
}

export function NeuralConnections({ worldPositions }: NeuralConnectionsProps) {
  return (
    <group>
      {connections.map((conn, i) => {
        const fromPos = worldPositions.get(conn.from);
        const toPos = worldPositions.get(conn.to);
        if (!fromPos || !toPos) return null;

        const fromWorld = worlds.find(w => w.id === conn.from);
        const color = fromWorld?.color || '#06B6D4';

        return (
          <NeuralLine
            key={i}
            from={fromPos}
            to={toPos}
            color={color}
            strength={conn.strength}
            index={i}
          />
        );
      })}
    </group>
  );
}

function NeuralLine({
  from,
  to,
  color,
  strength,
  index,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  strength: number;
  index: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const [r, g, b] = useMemo(() => hexToRgb(color), [color]);
  const threeColor = useMemo(() => new THREE.Color(r, g, b), [r, g, b]);

  // Create curved path
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    // Add curvature perpendicular to the line
    const dir = new THREE.Vector3().subVectors(end, start);
    const up = new THREE.Vector3(0, 1, 0);
    const perp = new THREE.Vector3().crossVectors(dir, up).normalize();
    mid.add(perp.multiplyScalar(dir.length() * 0.15));
    mid.y += dir.length() * 0.1;

    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(30), [curve]);
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const time = state.clock.elapsedTime;
    const t = ((time * 0.3 + index * 0.5) % 1);
    const pos = curve.getPoint(t);
    pulseRef.current.position.copy(pos);
  });

  return (
    <group>
      {/* @ts-ignore */}
      <line ref={lineRef} geometry={lineGeometry}>
        {/* @ts-ignore */}
        <lineBasicMaterial
          color={threeColor}
          transparent
          opacity={0.1 + strength * 0.05}
          linewidth={1}
        />
      </line>

      {/* Traveling pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial
          color={threeColor}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
