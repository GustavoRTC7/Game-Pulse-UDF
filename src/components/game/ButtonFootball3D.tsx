import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

function Field() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[100, 60]} />
      <meshStandardMaterial color="#2c8a3d" />
    </mesh>
  );
}

function Player({ position, team, selected }: { position: [number, number, number], team: 'home' | 'away', selected: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={mesh} position={position}>
      <cylinderGeometry args={[1, 1, 0.5, 32]} />
      <meshStandardMaterial 
        color={team === 'home' ? '#ff0000' : '#0000ff'} 
        emissive={selected ? '#ffff00' : '#000000'}
        emissiveIntensity={selected ? 0.5 : 0}
      />
    </mesh>
  );
}

function Ball({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

function Scene() {
  const { buttonPlayers, ball } = useGameStore();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Field />
      {buttonPlayers.map((player) => (
        <Player
          key={player.id}
          position={[player.position.x / 10 - 5, 0, player.position.y / 10 - 3]}
          team={player.team}
          selected={player.selected}
        />
      ))}
      <Ball position={[ball.position.x / 10 - 5, 0.5, ball.position.y / 10 - 3]} />
      <OrbitControls />
    </>
  );
}

const ButtonFootball3D: React.FC = () => {
  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 15, 0], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default ButtonFootball3D;