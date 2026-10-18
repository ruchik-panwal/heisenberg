"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

// Standard Scientific CPK Colors
const getElementColor = (element) => {
  switch (element) {
    case "C": return "#808080"; // Standard Grey
    case "O": return "#FF0D0D"; // Standard Red
    case "N": return "#2244FF"; // Standard Blue
    case "H": return "#FFFFFF"; // Standard White
    default: return "#CCCCCC";
  }
};

const getElementSize = (element) => {
  return element === "H" ? 0.25 : 0.4;
};

// Helper component to render atoms
function Atom({ position, element }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[getElementSize(element), 32, 32]} />
      {/* Standard balanced material (slight shine, mostly smooth) */}
      <meshStandardMaterial color={getElementColor(element)} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

// Helper component to render bonds (connecting cylinders)
function Bond({ start, end, order }) {
  const { position, quaternion, scale } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    const distance = startVec.distanceTo(endVec);
    const midPoint = startVec.clone().lerp(endVec, 0.5);
    
    const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return { position: midPoint, quaternion, scale: [1, distance, 1] };
  }, [start, end]);

  const thickness = order > 1 ? 0.15 : 0.08;

  return (
    <mesh position={position} quaternion={quaternion} scale={scale}>
      <cylinderGeometry args={[thickness, thickness, 1, 16]} />
      {/* Standard light grey for bonds */}
      <meshStandardMaterial color="#A0A0A0" roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

export default function Viewer({ moleculeData }) {
  const atomMap = useMemo(() => {
    if (!moleculeData?.atoms) return {};
    const map = {};
    moleculeData.atoms.forEach((atom) => {
      map[atom.id] = atom.position;
    });
    return map;
  }, [moleculeData]);

  if (!moleculeData || !moleculeData.atoms) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center text-white font-vend">
        Loading 3D model...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Standard balanced lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <Environment preset="city" />
        
        <group scale={0.7}>
          {/* Render Atoms */}
          {moleculeData.atoms.map((atom) => (
            <Atom key={`atom-${atom.id}`} position={atom.position} element={atom.element} />
          ))}

          {/* Render Bonds */}
          {moleculeData.bonds.map((bond, idx) => {
            const startNode = atomMap[bond.source];
            const endNode = atomMap[bond.target];
            
            if (!startNode || !endNode) return null;

            return (
              <Bond 
                key={`bond-${idx}`} 
                start={startNode} 
                end={endNode} 
                order={bond.order}
              />
            );
          })}
        </group>

        <OrbitControls autoRotate autoRotateSpeed={1.0} enablePan={true} enableZoom={true} />
      </Canvas>
    </div>
  );
}