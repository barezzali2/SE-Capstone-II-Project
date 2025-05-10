/* eslint-disable react/no-unknown-property */
import PropTypes from "prop-types";
import { Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function StoreFloor() {
  const woodTexture = useTexture("/assets/stone_embedded_tiles_ao_1k.jpg");
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(20, 20);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial map={woodTexture} color="#ffffff" roughness={0.8} />
    </mesh>
  );
}

// these are the markers for the aisles in the store and they are shaped like a circle for the aisle and a ring for the highlight when the aisle is selected
export function SectionMarker({
  position,
  label,
  color,
  category,
  onActivate,
  isHighlighted,
}) {
  return (
    <group
      position={position}
      onClick={() => onActivate(category, position)}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
    >
      {/* Pin head (sphere) */}
      <mesh position={[0, 2.5, 0]} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 1 : 0.5}
          transparent
          opacity={isHighlighted ? 1 : 0.85}
        />
      </mesh>

      {/* Pin tip (cone) */}
      <mesh
        position={[0, 1.2, 0]}
        rotation={[-Math.PI / 1, 0, 0]}
        scale={[0.5, 1.2, 0.5]}
      >
        <coneGeometry args={[0.4, 1.2, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 1 : 0.5}
          transparent
          opacity={isHighlighted ? 1 : 0.85}
        />
      </mesh>

      {/* Glowing ring for highlight */}
      {isHighlighted && (
        <mesh position={[0, 2.5, 0]} scale={[1.6, 1.6, 1.6]}>
          <ringGeometry args={[0.7, 1, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Text label */}
      <Text
        position={[0, 4.2, 0]}
        fontSize={1.2}
        color={isHighlighted ? color : "#fff"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#000"
        fontWeight="bold"
      >
        {label}
      </Text>
    </group>
  );
}

export function StoreModel() {
  const { scene } = useGLTF("/assets/finalsupermarketglb2.glb");
  return (
    <primitive
      object={scene}
      scale={[1, 1, 1]}
      rotation={[0, Math.PI, 0]}
      position={[0, 0, 0]}
    />
  );
}

export function YouAreHereMarker({ position }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 2, 0]} scale={[1, 2.5, 1]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial
          color="#1976d2"
          emissive="#1976d2"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.8, 0]} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#fff176"
          emissive="#fff176"
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* "You are here" label */}
      <Text
        position={[0, 5.2, 0]}
        fontSize={1}
        color="#fff176"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#000"
        fontWeight="bold"
      >
        You are here
      </Text>
    </group>
  );
}

export function KioskMachine({ position }) {
  return (
    <group position={position}>
      {/* Kiosk base */}
      <mesh position={[0, 1, 0]} scale={[1.2, 2, 1]}>
        <boxGeometry args={[1, 2, 0.6]} />
        <meshStandardMaterial color="#424242" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Kiosk screen */}
      <mesh
        position={[0, 2, 0.36]}
        rotation={[-0.2, 0, 0]}
        scale={[0.9, 0.7, 1]}
      >
        <boxGeometry args={[0.7, 0.5, 0.05]} />
        <meshStandardMaterial
          color="#1976d2"
          emissive="#1976d2"
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Kiosk stand */}
      <mesh position={[0, 0, 0]} scale={[0.3, 1, 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
    </group>
  );
}

SectionMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

YouAreHereMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};
