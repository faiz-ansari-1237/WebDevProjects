// src/components/hero/ParticleBackground.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

// Styled container for the Canvas element
const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Ensures it stays behind other content */
  pointer-events: none; /* Allows mouse events to pass through to elements behind the canvas */
  overflow: hidden; /* Prevent scrollbars if canvas slightly overflows */

  canvas {
    display: block; /* Remove extra space below canvas */
  }
`;

/**
 * ParticleBackground Component
 * Renders an interactive 3D particle system using Three.js within an HTML canvas.
 * Particles subtly rotate and react to mouse movement.
 */
export const ParticleBackground = () => {
  // Ref to hold the DOM element where our Three.js scene will be mounted
  const mountRef = useRef(null);
  // Refs to store Three.js objects so they persist across renders
  const sceneRef = useRef(null);
  const cameraRef = useRef(null); // Correctly declared with 'const'
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // --- Scene Setup ---
    // Get the current DOM element to mount the Three.js scene
    const currentMount = mountRef.current;
    if (!currentMount) return; // Exit if the mount point is not available

    // Create a new Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene; // Store scene in ref

    // Create a perspective camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      currentMount.clientWidth / currentMount.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    // Adjusted camera position further back to ensure particles fill the entire viewport
    camera.position.z = 45; // Increased from 35 to 45 for even wider spread
    cameraRef.current = camera; // Store camera in ref

    // Create a WebGL renderer
    // antialias: true for smoother edges, alpha: true for transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight); // Set renderer size to container size
    renderer.setPixelRatio(window.devicePixelRatio); // Use device pixel ratio for sharper rendering
    currentMount.appendChild(renderer.domElement); // Add the renderer's canvas to the DOM
    rendererRef.current = renderer; // Store renderer in ref

    // --- Particle Geometry and Material ---
    const particleCount = 5000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle

    // Populate positions with random values within a spherical volume
    // Increased radius significantly for a wider spread of particles
    const particleSpreadRadius = 40; // Increased from 30 to 40 for a much wider spread
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * particleSpreadRadius * 2;
      const y = (Math.random() - 0.5) * particleSpreadRadius * 2;
      const z = (Math.random() - 0.5) * particleSpreadRadius * 2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    // Set the positions attribute for the geometry
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a PointsMaterial for the particles
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x58A6FF, // Vibrant blue accent color
      size: 0.05, // Increased particle size from 0.02 to 0.05
      sizeAttenuation: true, // Particles further away appear smaller
      transparent: true, // Enable transparency
      opacity: 0.8, // Set opacity
      blending: THREE.AdditiveBlending, // For glowing effect (particles add their color to background)
      depthWrite: false, // Prevents particles from obscuring each other incorrectly
    });

    // Create the Points object (a collection of points) and add to scene
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles; // Store particles in ref

    // --- Animation Loop ---
    let animationFrameId; // To store the ID returned by requestAnimationFrame

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // Request the next frame

      // Rotate particles subtly
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0005;
        particlesRef.current.rotation.y += 0.0008;
      }

      // Update camera position based on mouse movement
      if (cameraRef.current) {
        // Increased sensitivity for camera movement to make it more pronounced
        const mouseSensitivity = 0.05; // Increased from 0.015 to 0.05
        cameraRef.current.position.x += (mouseX - cameraRef.current.position.x) * mouseSensitivity;
        cameraRef.current.position.y += (-mouseY - cameraRef.current.position.y) * mouseSensitivity;
        cameraRef.current.lookAt(scene.position); // Always look at the center of the scene
      }

      // Render the scene with the camera
      renderer.render(scene, camera);
    };

    // --- Mouse Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event) => {
      // Normalize mouse coordinates to a range of -1 to 1, then scale for camera movement
      mouseX = (event.clientX - windowHalfX) * 0.001; // This value is then used with mouseSensitivity in animate loop
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    window.addEventListener('mousemove', onMouseMove);

    // --- Handle Window Resizing ---
    const onWindowResize = () => {
      if (currentMount && cameraRef.current && rendererRef.current) {
        // Update camera aspect ratio to match new container size
        cameraRef.current.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix(); // Recalculate projection matrix
        // Update renderer size
        rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };

    window.addEventListener('resize', onWindowResize);

    // Start the animation loop
    animate();

    // --- Cleanup Function ---
    // This runs when the component unmounts or before the effect re-runs
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId); // Cancel the animation loop
      if (currentMount && rendererRef.current) {
        currentMount.removeChild(rendererRef.current.domElement); // Remove canvas from DOM
        rendererRef.current.dispose(); // Dispose of renderer resources
        // Dispose of geometries and materials to free up GPU memory
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <CanvasContainer ref={mountRef} />
  );
};
