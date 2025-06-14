'use client'

import React, { useRef, useMemo, useEffect } from 'react'
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
  className?: string;
  // Add any other uniforms you might want to pass as props
}

// Detect device capabilities for performance optimization
const getDevicePerformanceLevel = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'low';
  
  // Properly cast to WebGL context
  const webglContext = gl as WebGLRenderingContext;
  
  const renderer = webglContext.getParameter(webglContext.RENDERER);
  const vendor = webglContext.getParameter(webglContext.VENDOR);
  
  // Simple heuristic based on common mobile GPUs
  if (renderer && (
    renderer.includes('Mali') || 
    renderer.includes('Adreno') || 
    renderer.includes('PowerVR') ||
    /mobile|android|iphone|ipad/i.test(navigator.userAgent)
  )) {
    return 'low';
  }
  
  return 'high';
};

// Renamed inner component and pass uniforms
function ShaderDisplay({ material, performanceLevel }) {
  const meshRef = useRef<THREE.Mesh>();
  const { size, viewport } = useThree();

  useFrame((state) => {
    if (material?.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime;
      material.uniforms.resolution.value.set(
        size.width * viewport.dpr,
        size.height * viewport.dpr
      );
      material.uniforms.performanceLevel.value = performanceLevel === 'low' ? 0.5 : 1.0;
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
  height = 'h-full',
  className = '',
}: ShaderCanvasProps) {
  const [performanceLevel, setPerformanceLevel] = React.useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    setPerformanceLevel(getDevicePerformanceLevel());
  }, []);

  // Define material inside the component using props
  const CustomShaderMaterial = useMemo(() => {
    const mat = shaderMaterial(
      {
        time: 0,
        resolution: new THREE.Vector2(),
        performanceLevel: 1.0,
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (material) {
        material.dispose();
      }
    };
  }, [material]);

  return (
      <Canvas
        gl={{ 
          alpha: true,
          antialias: performanceLevel !== 'low',
          powerPreference: performanceLevel === 'low' ? "low-power" : "high-performance"
        }}
        camera={{ position: [0, 0, 2] }}
        className='w-full h-full'
        dpr={performanceLevel === 'low' ? 1 : undefined}
      >
        <color attach="background" args={['rgba(0,0,0,0)']} />
        {/* Pass the created material instance to the inner component */} 
        <ShaderDisplay material={material} performanceLevel={performanceLevel} />
      </Canvas>
  )
} 