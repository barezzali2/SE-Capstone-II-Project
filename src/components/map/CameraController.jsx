import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef();

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
