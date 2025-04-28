import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

export function CameraController({ activeCategory }) {
  const { camera } = useThree();
  const controlsRef = useRef();


  const aisleCameraPositions = {
    fruits: { x: -40, y: 1, z: 20 },
    drinks: { x: -35, y: 1, z: 20 },
    grains: { x: 1, y: 10, z: 15 },
    dairy: { x: 20, y: 20, z: 10 }, 
    snacks: { x: 40, y: 2, z: 12 }, 
    bakery: { x: 60, y: -12, z: 7 },
  };

  useEffect(() => {
    if (activeCategory && aisleCameraPositions[activeCategory]) {
      const { x, y, z } = aisleCameraPositions[activeCategory];
      // Smoothly move the camera to the selected aisle
      camera.position.set(x, y, z);
      camera.lookAt(x, 0, 0); // Adjust the look-at position if needed
    }
  }, [activeCategory, camera]);




  useEffect(() => {
    // this is the initial camera position
    camera.position.set(0, 50, 50);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    if (controlsRef.current) {
      // I restrict the camera to a certain angle to prevent flipping
      controlsRef.current.minPolarAngle = Math.PI / 6;
      controlsRef.current.maxPolarAngle = Math.PI / 2.5;
      // this is to prevent the camera from going too low
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
      minDistance={30} // this is to prevent the camera from going too close
      maxDistance={100} // this is to prevent the camera from going too far
    />
  );
}


CameraController.propTypes = {
  activeCategory: PropTypes.string,
};