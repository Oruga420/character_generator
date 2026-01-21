'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();

  const particleCount = 5000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff00ff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function FloatingOrbs() {
  const orbsRef = useRef([]);

  const orbPositions = useMemo(() => [
    { pos: [-8, 4, -10], color: '#ff00ff', scale: 2 },
    { pos: [10, -3, -15], color: '#00ffff', scale: 3 },
    { pos: [-5, -5, -8], color: '#8b5cf6', scale: 1.5 },
    { pos: [7, 6, -12], color: '#ff6b6b', scale: 2.5 },
    { pos: [0, 0, -20], color: '#4ecdc4', scale: 4 },
  ], []);

  useFrame((state) => {
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        orb.position.y = orbPositions[i].pos[1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 2;
        orb.position.x = orbPositions[i].pos[0] + Math.cos(state.clock.elapsedTime * 0.3 + i) * 1.5;
      }
    });
  });

  return (
    <>
      {orbPositions.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => (orbsRef.current[i] = el)}
          position={orb.pos}
        >
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </>
  );
}

function WaveGrid() {
  const meshRef = useRef();

  const { positions, indices } = useMemo(() => {
    const size = 40;
    const segments = 40;
    const positions = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size;
        const z = (j / segments - 0.5) * size;
        positions.push(x, 0, z);

        if (i < segments && j < segments) {
          const a = i * (segments + 1) + j;
          const b = a + segments + 1;
          indices.push(a, b, a + 1);
          indices.push(a + 1, b, b + 1);
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      indices: new Uint16Array(indices),
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 0.5 + time) * 0.5 + Math.cos(z * 0.5 + time) * 0.5;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          count={indices.length}
          array={indices}
          itemSize={1}
        />
      </bufferGeometry>
      <meshBasicMaterial
        color="#8b5cf6"
        wireframe
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0d001a 100%)' }}
      >
        <fog attach="fog" args={['#0a0015', 10, 50]} />
        <ambientLight intensity={0.5} />
        <ParticleField />
        <FloatingOrbs />
        <WaveGrid />
      </Canvas>
    </div>
  );
}
