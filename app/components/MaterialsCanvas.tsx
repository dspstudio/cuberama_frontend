import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MaterialsCanvas: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.z = 8;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25; // Slightly brighter scene
        currentMount.appendChild(renderer.domElement);
        
        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 4;
        controls.maxDistance = 15;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.75; // A bit faster rotation
        controls.enablePan = false;

        // Environment Map (Studio Lighting)
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (context) {
            // A more complex gradient to simulate studio lights
            context.fillStyle = '#111'; // Dark background
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // Main light
            let gradient = context.createRadialGradient(canvas.width * 0.25, canvas.height * 0.5, 0, canvas.width * 0.25, canvas.height * 0.5, 100);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, 'transparent');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // Secondary light
            gradient = context.createRadialGradient(canvas.width * 0.75, canvas.height * 0.5, 0, canvas.width * 0.75, canvas.height * 0.5, 60);
            gradient.addColorStop(0, '#aaa');
            gradient.addColorStop(1, 'transparent');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            const envMapTexture = new THREE.CanvasTexture(canvas);
            scene.environment = pmremGenerator.fromEquirectangular(envMapTexture).texture;
            envMapTexture.dispose();
        }
        pmremGenerator.dispose();

        // Lights
        const keyLight = new THREE.PointLight(0xffffff, 200);
        keyLight.position.set(-5, 5, 5);
        scene.add(keyLight);

        const fillLight = new THREE.PointLight(0xffddcc, 100);
        fillLight.position.set(5, -5, 5);
        scene.add(fillLight);
        
        const backLight = new THREE.PointLight(0xccddff, 150);
        backLight.position.set(0, 3, -8);
        scene.add(backLight);

        // Geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);

        // Materials
        // 1. Metallic
        const metallicMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 1.0,
            roughness: 0.2, // Slightly softer reflections
        });

        // 2. Glass (Transmission)
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            transmission: 1.0,
            thickness: 1.5,
            roughness: 0.1, // Slightly less perfect glass
            ior: 1.5,
            color: 0xffffff,
            specularIntensity: 1.0,
        });

        // 3. Iridescent
        const iridescentMaterial = new THREE.MeshPhysicalMaterial({
            metalness: 0.8,
            roughness: 0.15,
            iridescence: 1.0,
            iridescenceIOR: 1.7, // Stronger effect
            iridescenceThicknessRange: [100, 600],
            color: 0x220033, // Darker base color
        });

        // Meshes
        const metallicSphere = new THREE.Mesh(geometry, metallicMaterial);
        metallicSphere.position.x = -2.5;

        const glassSphere = new THREE.Mesh(geometry, glassMaterial);
        glassSphere.position.x = 0;

        const iridescentSphere = new THREE.Mesh(geometry, iridescentMaterial);
        iridescentSphere.position.x = 2.5;

        scene.add(metallicSphere, glassSphere, iridescentSphere);

        // Handle Resize
        const handleResize = () => {
            if (currentMount) {
                const { clientWidth, clientHeight } = currentMount;
                renderer.setSize(clientWidth, clientHeight);
                camera.aspect = clientWidth / clientHeight;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            try {
                currentMount.removeChild(renderer.domElement);
            } catch (e) { /* ignore */ }
            geometry.dispose();
            metallicMaterial.dispose();
            glassMaterial.dispose();
            iridescentMaterial.dispose();
            keyLight.dispose();
            fillLight.dispose();
            backLight.dispose();
            renderer.dispose();
            if (scene.environment) {
                scene.environment.dispose();
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
};

export default MaterialsCanvas;