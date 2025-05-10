import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

export function CameraController({ activeCategory }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    camera.position.set(0, 25, 60); // x is for left and right, y is for up and down, z is for forward and backward
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    if (controlsRef.current) {
      // Restrict the camera to a certain angle to prevent flipping
      controlsRef.current.minPolarAngle = Math.PI / 6;
      controlsRef.current.maxPolarAngle = Math.PI / 2.5;
      // Prevent the camera from going too low
      if (camera.position.y < 25) camera.position.y = 25;
    }
  });

  // this does the actual camera movement
  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enableRotate={true}
      enablePan={true}
      rotateSpeed={0.5}
      panSpeed={0.8}
      dampingFactor={0.2}
      minDistance={5} // Allow zooming in closer
      maxDistance={100}
    />
  );
}

CameraController.propTypes = {
  activeCategory: PropTypes.string,
};
