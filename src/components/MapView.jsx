/* eslint-disable react/no-unknown-property */
import styles from "./MapView.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function IsometricPlane() {
  const planeRef = useRef();

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2.5, 0, Math.PI / 4]} position={[0, 0, 0]}>
      <planeGeometry args={[11.5, 11.5]} />
      <meshStandardMaterial color="#ea8269" />
    </mesh>
  );
}

function MapView() {
  return (
    <div style={{ width: "100vw", height: "120vh" }}>
      <Canvas orthographic camera={{ zoom: 50, position: [10, 10, 10] }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Isometric Plane */}
        <IsometricPlane />

        {/* Orbit Controls - Enable Rotation and Dragging */}
        <OrbitControls 
          enableZoom={true} // Disable zooming
          enableRotate={true} // Allow rotating around the plane
          enablePan={true} // Allow dragging
          rotateSpeed={0.7} // Adjust rotation sensitivity
          panSpeed={0.5} // Adjust dragging speed
          dampingFactor={0.1} // Smooth movement
        />
      </Canvas>
    </div>
  );
}

export default MapView;
