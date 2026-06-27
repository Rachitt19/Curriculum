import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { World } from '../../data/worlds';
import { hexToRgb } from '../../utils/colors';

interface WorldPlanetProps {
  world: World;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}

export function WorldPlanet({ world, position, isActive, onClick }: WorldPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const [r, g, b] = useMemo(() => hexToRgb(world.color), [world.color]);
  const color = useMemo(() => new THREE.Color(r, g, b), [r, g, b]);

  const planetSize = 0.8 + (world.domains.length / 23) * 0.7;

  // Domain orbit nodes
  const domainPositions = useMemo(() => {
    const count = Math.min(world.domains.length, 12);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const orbitRadius = planetSize + 0.8 + Math.random() * 0.3;
      return {
        angle,
        orbitRadius,
        speed: 0.2 + Math.random() * 0.3,
        size: 0.05 + Math.random() * 0.05,
        yOffset: (Math.random() - 0.5) * 0.5,
      };
    });
  }, [world.domains.length, planetSize]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    }

    // Glow pulse
    if (glowRef.current) {
      const scale = isActive || hovered ? 1.8 : 1.4;
      const pulse = scale + Math.sin(time * 1.5) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.15;
    }

    // Float up/down
    groupRef.current.position.y = position[1] + Math.sin(time * 0.3 + world.id) * 0.2;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planetSize, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive || hovered ? 0.4 : 0.15}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Glow sphere (additive) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planetSize, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive || hovered ? 0.15 : 0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3 + world.id * 0.2, 0, 0]}>
        <torusGeometry args={[planetSize + 0.5, 0.015, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive || hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Domain orbit nodes */}
      {domainPositions.map((dp, i) => (
        <DomainNode
          key={i}
          angle={dp.angle}
          orbitRadius={dp.orbitRadius}
          speed={dp.speed}
          size={dp.size}
          yOffset={dp.yOffset}
          color={color}
          worldId={world.id}
        />
      ))}

      {/* Hover tooltip */}
      {(hovered || isActive) && (
        <Html
          center
          distanceFactor={15}
          style={{
            pointerEvents: 'none',
            transform: 'translateY(-80px)',
          }}
        >
          <div
            style={{
              background: 'rgba(3, 0, 20, 0.85)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${world.color}40`,
              borderRadius: '12px',
              padding: '12px 18px',
              minWidth: '180px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: world.color,
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              World {world.numeral}
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#F0F0FF',
              marginBottom: '4px',
            }}>
              {world.name}
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: 'rgba(240,240,255,0.6)',
            }}>
              {world.domains.length} domains · {world.evolutionLevel}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Small orbiting domain node
function DomainNode({
  angle, orbitRadius, speed, size, yOffset, color, worldId,
}: {
  angle: number;
  orbitRadius: number;
  speed: number;
  size: number;
  yOffset: number;
  color: THREE.Color;
  worldId: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const currentAngle = angle + time * speed;
    ref.current.position.x = Math.cos(currentAngle) * orbitRadius;
    ref.current.position.z = Math.sin(currentAngle) * orbitRadius;
    ref.current.position.y = yOffset + Math.sin(time * 0.5 + worldId + angle) * 0.15;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}
