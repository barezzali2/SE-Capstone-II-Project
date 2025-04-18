/* eslint-disable react/no-unknown-property */
import PropTypes from "prop-types";
import { Text } from "@react-three/drei";

export function StoreFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#f5f5f5" />
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
    <group position={position}>
      {/* this is the circle for the aisle */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
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
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={isHighlighted ? color : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* this is the ring for the highlight when the aisle is selected */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={isHighlighted}
      >
        <ringGeometry args={[2.7, 3.0, 32]} />
        <meshStandardMaterial color="#dd5837" transparent opacity={0.8} />
      </mesh>

      {/* this is the text label for the aisle like "dairy" or "fruits" */}
      <Text
        position={[0, 0.5, 0]}
        color="black"
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
        fontWeight={isHighlighted ? "bold" : "normal"}
        outlineWidth={isHighlighted ? 0.05 : 0}
        outlineColor="#ffffff"
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
  isHighlighted: PropTypes.bool,
};

SectionMarker.defaultProps = {
  isHighlighted: false,
};
