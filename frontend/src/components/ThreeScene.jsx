import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion-3d";

function Bike() {
  return (
    <motion.group
      position={[0, -0.5, 0]}
      scale={[0.2, 0.2, 0.2]}
      animate={{ rotateY: Math.PI * 2 }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
    >
      <mesh position={[-1.2, 0, 0]}>
        <torusGeometry args={[0.6, 0.1, 16, 100]} />
        <meshStandardMaterial color="#6366F1" />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <torusGeometry args={[0.6, 0.1, 16, 100]} />
        <meshStandardMaterial color="#6366F1" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshStandardMaterial color="#1E1B4B" />
      </mesh>
    </motion.group>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls enableZoom={false} />
        <Bike />
      </Canvas>
    </div>
  );
}
