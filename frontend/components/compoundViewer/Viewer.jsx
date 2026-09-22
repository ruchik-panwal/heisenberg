'use client'

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, Bounds, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// Handles loading state and placeholder
function Loader({ placeholderSrc }) {
  const { progress } = useProgress();
  return (
    <Html center>
      {placeholderSrc ? (
        <img src={placeholderSrc} alt="Loading..." style={{ width: '100px', opacity: progress / 100 }} />
      ) : (
        <div style={{ color: 'white', fontFamily: 'sans-serif' }}>
          {progress.toFixed(0)}% loaded
        </div>
      )}
    </Html>
  );
}

// Inner component for the 3D model
function Model({ url, modelXOffset, modelYOffset, autoFrame, fadeIn, onModelLoaded }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useEffect(() => {
    if (scene && onModelLoaded) {
      onModelLoaded();
    }
    
    // Initial setup for fade-in
    if (fadeIn && scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      });
    }
  }, [scene, onModelLoaded, fadeIn]);

  // Handle fade-in animation
  useFrame(() => {
    if (fadeIn && scene && modelRef.current) {
      scene.traverse((child) => {
        if (child.isMesh && child.material.opacity < 1) {
          child.material.opacity += 0.02;
        }
      });
    }
  });

  const PrimitiveModel = <primitive object={scene} ref={modelRef} />;

  return (
    <group position={[modelXOffset, modelYOffset, 0]}>
      {autoFrame ? (
        <Bounds fit clip observe margin={1.2}>
          {PrimitiveModel}
        </Bounds>
      ) : (
        PrimitiveModel
      )}
    </group>
  );
}

// Handles custom mouse parallax and hover rotation
function CameraRig({ enableMouseParallax, enableHoverRotation }) {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    if (enableMouseParallax) {
      camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, camera.position.z), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// The main viewer component
export default function ModelViewer({
  url,
  width = 400,
  height = 400,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -50,
  defaultRotationY = 20,
  defaultZoom = 0.5,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.3,
  keyLightIntensity = 1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 0.8,
  environmentPreset = 'forest',
  autoFrame = false,
  fadeIn = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  showScreenshotButton = true,
  placeholderSrc,
  onModelLoaded
}) {
  const canvasRef = useRef();

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'model-screenshot.png';
      link.href = dataURL;
      link.click();
    }
  };

  if (!url) return <div style={{ width, height, background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No model URL provided</div>;

  return (
    <div style={{ position: 'relative', width, height }}>
      <Canvas
        ref={canvasRef}
        gl={{ preserveDrawingBuffer: true }} // Required for screenshots
        camera={{ position: [0, 0, 5 / defaultZoom], fov: 50 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          {/* Lighting */}
          <ambientLight intensity={ambientIntensity} />
          <directionalLight position={[10, 10, 5]} intensity={keyLightIntensity} />
          <directionalLight position={[-10, 10, -5]} intensity={fillLightIntensity} />
          <spotLight position={[0, -10, -10]} intensity={rimLightIntensity} />

          {/* Environment Preset */}
          {environmentPreset && <Environment preset={environmentPreset} />}

          {/* The Model */}
          <group rotation={[THREE.MathUtils.degToRad(defaultRotationX), THREE.MathUtils.degToRad(defaultRotationY), 0]}>
            <Model 
              url={url} 
              modelXOffset={modelXOffset} 
              modelYOffset={modelYOffset} 
              autoFrame={autoFrame} 
              fadeIn={fadeIn}
              onModelLoaded={onModelLoaded}
            />
          </group>

          {/* Controls */}
          <OrbitControls 
            enableZoom={enableManualZoom}
            minDistance={minZoomDistance}
            maxDistance={maxZoomDistance}
            enableRotate={enableManualRotation}
            autoRotate={autoRotate || enableHoverRotation} // If hover rotation is requested, we can adapt autoRotate
            autoRotateSpeed={autoRotateSpeed}
          />
          
          <CameraRig 
            enableMouseParallax={enableMouseParallax} 
            enableHoverRotation={enableHoverRotation} 
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {showScreenshotButton && (
        <button 
          onClick={handleScreenshot}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            zIndex: 10
          }}
        >
          Screenshot
        </button>
      )}
    </div>
  );
}