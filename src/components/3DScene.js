import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeDScene = () => {
  const containerRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Load your regular image as a texture
    const regularTexture = new THREE.TextureLoader().load('./assets/sajdklsjldkj_FB-3D.jpg');

    // Load the depth mapping image as a displacement map
    const depthTexture = new THREE.TextureLoader().load('./assets/sajdklsjldkj_FB-3D_depth.jpg');

    // Create a mesh using the regular image and apply the displacement map for the 3D effect
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshStandardMaterial({ map: regularTexture });
    material.displacementMap = depthTexture;
    material.displacementScale = 0.1; // Adjust the scale for the desired 3D effect
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up resources
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeDScene;
