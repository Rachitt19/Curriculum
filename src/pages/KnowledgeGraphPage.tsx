import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { worlds } from '../data/worlds';
import { connections } from '../data/connections';
import { useStore } from '../store/useStore';
import { hexToRgb } from '../utils/colors';
import { CosmicBackground } from '../components/canvas/CosmicBackground';

interface GraphNode {
  id: string;
  label: string;
  type: 'world' | 'domain';
  worldId: number;
  color: string;
  x: number;
  y: number;
  z: number;
  size: number;
}

export function KnowledgeGraphPage() {
  const setCurrentView = useStore((s) => s.setCurrentView);
  const setActiveWorldId = useStore((s) => s.setActiveWorldId);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);

  // Build graph nodes
  const nodes = useMemo<GraphNode[]>(() => {
    const result: GraphNode[] = [];

    worlds.forEach((world, wi) => {
      const angle = (wi / worlds.length) * Math.PI * 2;
      const radius = 8;

      // World node
      result.push({
        id: `world-${world.id}`,
        label: world.name,
        type: 'world',
        worldId: world.id,
        color: world.color,
        x: Math.cos(angle) * radius,
        y: (Math.sin(wi * 0.8) * 3),
        z: Math.sin(angle) * radius,
        size: 0.5,
      });

      // Domain nodes around each world
      world.domains.forEach((domain, di) => {
        const domainAngle = angle + ((di / world.domains.length) * Math.PI * 0.8 - Math.PI * 0.4);
        const domainRadius = radius + 2 + Math.random() * 1.5;
        result.push({
          id: `domain-${domain.id}`,
          label: domain.name,
          type: 'domain',
          worldId: world.id,
          color: world.color,
          x: Math.cos(domainAngle) * domainRadius + (Math.random() - 0.5) * 2,
          y: (Math.sin(wi * 0.8) * 3) + (Math.random() - 0.5) * 2,
          z: Math.sin(domainAngle) * domainRadius + (Math.random() - 0.5) * 2,
          size: 0.15,
        });
      });
    });

    return result;
  }, []);

  const filteredNodes = selectedFilter
    ? nodes.filter((n) => n.worldId === selectedFilter)
    : nodes;

  return (
    <div className="graph-page content-layer" style={{ position: 'fixed', inset: 0 }}>
      {/* Back button */}
      <motion.button
        className="btn btn-ghost"
        style={{ position: 'fixed', top: '24px', left: '24px', zIndex: 30 }}
        onClick={() => {
          setCurrentView('home');
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        ← Back
      </motion.button>

      {/* Title */}
      <motion.div
        style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          textAlign: 'center',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
          <span className="text-gradient">Knowledge Graph</span>
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
          {nodes.length} nodes · {connections.length} connections
        </p>
      </motion.div>

      {/* Legend sidebar */}
      <motion.div
        className="graph-sidebar glass"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            Filter by World
          </div>
          <div
            className="graph-legend-item"
            style={{ fontWeight: selectedFilter === null ? 600 : 400 }}
            onClick={() => setSelectedFilter(null)}
          >
            <div className="graph-legend-dot" style={{ background: 'linear-gradient(135deg, #06B6D4, #7C3AED)' }} />
            All Worlds
          </div>
          {worlds.map((world) => (
            <div
              key={world.id}
              className="graph-legend-item"
              style={{
                fontWeight: selectedFilter === world.id ? 600 : 400,
                color: selectedFilter === world.id ? world.color : undefined,
              }}
              onClick={() => setSelectedFilter(selectedFilter === world.id ? null : world.id)}
            >
              <div className="graph-legend-dot" style={{ background: world.color }} />
              {world.numeral}. {world.name}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hovered node info */}
      {hoveredNode && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            background: 'rgba(3, 0, 20, 0.85)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${hoveredNode.color}40`,
            borderRadius: '12px',
            padding: '12px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: hoveredNode.color }}>
            {hoveredNode.label}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {hoveredNode.type === 'world' ? `World ${worlds.find(w => w.id === hoveredNode.worldId)?.numeral}` : `Part of ${worlds.find(w => w.id === hoveredNode.worldId)?.name}`}
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        style={{ background: '#030014' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#7C3AED" />
        <CosmicBackground />

        {/* Graph nodes */}
        {filteredNodes.map((node) => (
          <GraphNodeMesh
            key={node.id}
            node={node}
            onHover={setHoveredNode}
            onClick={() => {
              if (node.type === 'world') {
                setActiveWorldId(node.worldId);
                setCurrentView('world');
              }
            }}
          />
        ))}

        {/* Connections */}
        {!selectedFilter && connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === `world-${conn.from}`);
          const toNode = nodes.find(n => n.id === `world-${conn.to}`);
          if (!fromNode || !toNode) return null;
          return (
            <GraphEdge key={i} from={fromNode} to={toNode} />
          );
        })}

        {/* Domain-to-world connections */}
        {filteredNodes.filter(n => n.type === 'domain').map((domain) => {
          const worldNode = nodes.find(n => n.id === `world-${domain.worldId}`);
          if (!worldNode) return null;
          return (
            <GraphEdge key={domain.id} from={domain} to={worldNode} thin />
          );
        })}

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate
          autoRotateSpeed={0.3}
          maxDistance={50}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}

function GraphNodeMesh({
  node,
  onHover,
  onClick,
}: {
  node: GraphNode;
  onHover: (node: GraphNode | null) => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [r, g, b] = useMemo(() => hexToRgb(node.color), [node.color]);
  const color = useMemo(() => new THREE.Color(r, g, b), [r, g, b]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.position.y = node.y + Math.sin(time * 0.5 + node.x) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      position={[node.x, node.y, node.z]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(node); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[node.size, node.type === 'world' ? 24 : 8, node.type === 'world' ? 24 : 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={node.type === 'world' ? 0.4 : 0.2}
        roughness={0.5}
        metalness={0.3}
      />
      {/* World label */}
      {node.type === 'world' && (
        <Html center distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div style={{
            fontSize: '10px',
            fontFamily: 'Space Grotesk, sans-serif',
            color: node.color,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            textShadow: '0 0 10px rgba(0,0,0,0.8)',
            transform: 'translateY(-20px)',
          }}>
            {node.label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function GraphEdge({ from, to, thin }: { from: GraphNode; to: GraphNode; thin?: boolean }) {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(from.x, from.y, from.z),
      new THREE.Vector3(to.x, to.y, to.z),
    ];
  }, [from, to]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={from.color}
        transparent
        opacity={thin ? 0.05 : 0.12}
      />
    </line>
  );
}
