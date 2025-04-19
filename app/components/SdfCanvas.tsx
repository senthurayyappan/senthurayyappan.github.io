'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  vec3 palette( in float t )
  {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.263, 0.416, 0.557);
      
      return a + b * cos(6.283185*(c*t+d));
  }

  float sphere( in vec3 p, in vec3 o, in float r)
  {
      return length(p - o) - r;
  }

  float opSmoothUnion( float d1, float d2, float k )
  {
      float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
      return mix( d2, d1, h ) - k*h*(1.0-h);
  }

  mat2 rot2D(float angle)
  {
      return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  float sdf (in vec3 p, float time)
  {
      vec3 s2_pos = vec3(sin(time)*1.5, cos(time)*0.6, 0.0);
      vec3 s3_pos = vec3(cos(time)*1.25, sin(time)*1.0, 0.0);
      vec3 s4_pos = vec3(sin(time)*cos(time)*0.8, cos(time), 0.0);
      float s1 = sphere(p, vec3(0.0, 0.2, 0.0), 0.8);
      float s2 = sphere(p, s2_pos, 0.8);
      float s3 = sphere(p, s3_pos, 0.8);
      float s4 = sphere(p, s4_pos, 0.8);
     
      return opSmoothUnion(opSmoothUnion(s3, opSmoothUnion(s1, s2, 0.5), 0.5), s4, 0.5);
  }

  void main() {
      vec2 fragCoord = vUv * u_resolution;
      
      float orthoScale = 2.0;
      vec2 uv = ((fragCoord * 2.0 - u_resolution) / u_resolution.y) * orthoScale;
      
      vec2 m = u_mouse;
      if (length(m) < 0.01) { 
          m = vec2(cos(u_time*0.5) * 0.5, sin(u_time*0.3) * 0.5);
      }
      
      vec3 ray_origin = vec3(uv, -2.0);
      vec3 ray_direction = vec3(0.0, 0.0, 1.0);
      
      float t = 0.0;
        
      ray_origin.yz *= rot2D(-m.y * 3.14159);
      ray_direction.yz *= rot2D(-m.y * 3.14159);
      ray_origin.xz *= rot2D(-m.x * 3.14159);
      ray_direction.xz *= rot2D(-m.x * 3.14159);
      
      for (int i=0; i < 80; i++)
      {
          vec3 p = ray_origin + ray_direction * t;
          float d = sdf(p, u_time);
          
          if (d < 0.001 || t > 1000.0) break;
          t += d * 0.7;
      }
      
      vec3 color = palette(t * 0.1);
      
      gl_FragColor = vec4(color, 1.0);
  }
`

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const { size } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    mousePos.current = { x, y };
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      materialRef.current.uniforms.u_resolution.value.set(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio);
      materialRef.current.uniforms.u_mouse.value.set(mousePos.current.x, mousePos.current.y);
    }
  })

  const uniforms = useRef({
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2(0, 0) },
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} /> 
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export function SdfCanvas() {
  return (
    <Canvas 
      dpr={[1, 2]} 
      gl={{ alpha: true }}
      style={{ width: '800px', height: '800px', marginBottom: '2rem' }}
    >
      <ShaderPlane />
    </Canvas>
  )
}

export default SdfCanvas; 