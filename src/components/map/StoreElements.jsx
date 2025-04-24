/* eslint-disable react/no-unknown-property */
import PropTypes from "prop-types";
import { Text, useTexture, useGLTF } from "@react-three/drei";
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
  const { scene } = useGLTF("/assets/supermarket_shelving.glb");

  const model = scene.clone();
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.4,
        roughness: 0.6,
        emissive: isHighlighted ? color : "#000000",
        emissiveIntensity: isHighlighted ? 0.3 : 0,
      });
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

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
      <primitive
        object={model}
        scale={[2, 2, 2]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <Text
        position={[1.5, 6, -2]}
        // rotation={[0, Math.PI / 40, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
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
