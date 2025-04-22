'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
// Removed direct shader imports

// Moved type declaration inside or make it more dynamic if needed elsewhere
declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial: any // Use a generic name
    }
  }
}

// Define Props interface
interface ShaderCanvasProps {
  vertexShaderSource: string;
  fragmentShaderSource: string;
  height?: string; // Add optional height prop (e.g., "h-80", "h-96")
  // Add any other uniforms you might want to pass as props
}

// Renamed inner component and pass uniforms
function ShaderDisplay({ material }) {
  const meshRef = useRef<THREE.Mesh>();
  const { size, viewport } = useThree();

  useFrame((state) => {
    if (material?.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime;
      material.uniforms.resolution.value.set(
        size.width * viewport.dpr,
        size.height * viewport.dpr
      );
      // Update mouse uniform if needed later
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      {/* Use the passed material instance */} 
      <primitive object={material} attach="material" /> 
    </mesh>
  );
}

export function ShaderCanvas({ 
  vertexShaderSource, 
  fragmentShaderSource, 
  height = 'h-80',
}: ShaderCanvasProps) {

  // Define material inside the component using props
  const CustomShaderMaterial = useMemo(() => {
    const mat = shaderMaterial(
      {
        time: 0,
        resolution: new THREE.Vector2(),
        // mouse: new THREE.Vector2(), // Define mouse uniform if needed
        // Add other uniforms here if passed via props
      },
      vertexShaderSource,
      fragmentShaderSource
    );
    // Extend locally if needed, or manage dynamically
    extend({ CustomShaderMaterial: mat }); 
    return mat;
  }, [vertexShaderSource, fragmentShaderSource]);

  // Create the material instance
  const material = useMemo(() => new CustomShaderMaterial(), [CustomShaderMaterial]);

  return (
    <div className={`w-full ${height} bg-transparent`}>
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 2] }}
      >
        <color attach="background" args={['rgba(0,0,0,0)']} />
        {/* Pass the created material instance to the inner component */} 
        <ShaderDisplay material={material} />
      </Canvas>
    </div>
  )
} 