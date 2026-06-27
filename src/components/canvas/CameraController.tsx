import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

interface CameraControllerProps {
  worldPositions: Map<number, [number, number, number]>;
}

export function CameraController({ worldPositions }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 25));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const scrollProgress = useStore((s) => s.scrollProgress);
  const activeWorldId = useStore((s) => s.activeWorldId);

  useEffect(() => {
    if (activeWorldId !== null) {
      const pos = worldPositions.get(activeWorldId);
      if (pos) {
        targetPosition.current.set(pos[0], pos[1] + 1, pos[2] + 5);
        targetLookAt.current.set(pos[0], pos[1], pos[2]);
      }
    }
  }, [activeWorldId, worldPositions]);

  useFrame(() => {
    if (activeWorldId === null) {
      // Scroll-driven path through galaxy
      const totalWorlds = worldPositions.size;
      const worldIndex = Math.floor(scrollProgress * totalWorlds);
      const worldFraction = (scrollProgress * totalWorlds) % 1;

      const worldIds = Array.from(worldPositions.keys()).sort((a, b) => a - b);

      if (worldIndex < worldIds.length) {
        const currentId = worldIds[Math.min(worldIndex, worldIds.length - 1)];
        const nextId = worldIds[Math.min(worldIndex + 1, worldIds.length - 1)];
        const currentPos = worldPositions.get(currentId)!;
        const nextPos = worldPositions.get(nextId)!;

        // Interpolate between world positions
        const x = currentPos[0] + (nextPos[0] - currentPos[0]) * worldFraction;
        const y = currentPos[1] + (nextPos[1] - currentPos[1]) * worldFraction + 2;
        const z = currentPos[2] + (nextPos[2] - currentPos[2]) * worldFraction + 8;

        targetPosition.current.set(x, y, z);
        targetLookAt.current.set(
          currentPos[0] + (nextPos[0] - currentPos[0]) * worldFraction,
          currentPos[1] + (nextPos[1] - currentPos[1]) * worldFraction,
          currentPos[2] + (nextPos[2] - currentPos[2]) * worldFraction
        );
      }
    }

    // Smooth camera interpolation
    camera.position.lerp(targetPosition.current, 0.03);

    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    const desiredDir = targetLookAt.current.clone().sub(camera.position).normalize();
    currentLookAt.lerp(desiredDir, 0.03);
    camera.lookAt(
      camera.position.x + currentLookAt.x,
      camera.position.y + currentLookAt.y,
      camera.position.z + currentLookAt.z
    );
  });

  return null;
}
