import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedLogoProps {
    size?: number;
    interactive?: boolean;
    continuousSpin?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
    size = 40,
    interactive = true,
    continuousSpin = false,
}) => {
    const mountRef = useRef<HTMLCanvasElement>(null);
    const spinVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const isSpinningRef = useRef(false);
    const isHoveredRef = useRef(false);
    const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
    const hueRef = useRef(0);
    const initialColorRef = useRef(new THREE.Color(0x60A5FA)); // blue-400
    const hoverColorRef = useRef<THREE.Color>(new THREE.Color());
    
    const handleClick = () => {
        if (!interactive || isSpinningRef.current) return;
        isSpinningRef.current = true;
        spinVelocityRef.current.set(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        );
        if (materialRef.current) {
            const hsl = { h: 0, s: 0, l: 0 };
            materialRef.current.color.getHSL(hsl);
            hueRef.current = hsl.h;
        }

        if (mountRef.current) {
            (mountRef.current as any).createParticleBurst();
        }
    };

    const handleMouseEnter = () => {
        if (!interactive) return;
        isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
        if (!interactive) return;
        isHoveredRef.current = false;
    };

    useEffect(() => {
        const canvas = mountRef.current;
        if (!canvas) return;

        const particleSystems: any[] = [];

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const aspect = 1;
        const frustumSize = 3;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, 
            frustumSize * aspect / 2, 
            frustumSize / 2, 
            frustumSize / -2, 
            0.1, 
            10
        );
        camera.position.z = 2;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(size, size);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Morphable Cube Geometry
        const boxSize = 1.2;
        const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 2, 2, 2);
        
        const spherePositions = [];
        const tempVertex = new THREE.Vector3();
        const boxPositions = geometry.attributes.position;
        const radius = boxSize / Math.sqrt(2); 

        for (let i = 0; i < boxPositions.count; i++) {
            tempVertex.fromBufferAttribute(boxPositions, i);
            tempVertex.normalize().multiplyScalar(radius);
            spherePositions.push(tempVertex.x, tempVertex.y, tempVertex.z);
        }

        geometry.morphAttributes.position = [new THREE.Float32BufferAttribute(spherePositions, 3)];

        const material = new THREE.MeshBasicMaterial({ color: initialColorRef.current.clone(), wireframe: true });
        materialRef.current = material;
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        if (!cube.morphTargetInfluences) {
            cube.morphTargetInfluences = [];
        }
        cube.morphTargetInfluences[0] = 0;

        const initialHsl = { h: 0, s: 0, l: 0 };
        initialColorRef.current.getHSL(initialHsl);
        hueRef.current = initialHsl.h;

        hoverColorRef.current.setHSL(
            (initialHsl.h + 0.05) % 1.0, 
            initialHsl.s, 
            Math.min(1.0, initialHsl.l * 1.1)
        );

        (canvas as any).createParticleBurst = () => {
            const PARTICLE_COUNT = 60;
            const positions = new Float32Array(PARTICLE_COUNT * 3);
            const velocities = [];

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const vel = new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                );
                vel.normalize().multiplyScalar(Math.random() * 0.12 + 0.02);
                velocities.push(vel);
            }

            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const particleMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.08,
                transparent: true,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
                depthWrite: false,
            });

            const points = new THREE.Points(particleGeometry, particleMaterial);
            points.userData.velocities = velocities;

            scene.add(points);
            particleSystems.push({
                points,
                startTime: performance.now(),
            });
        };

        // Animation loop
        let animationFrameId: number;
        const clock = new THREE.Clock();
        const animate = () => {
            const delta = clock.getDelta();

            if (continuousSpin) {
                // Continuous spin and morph for loading state
                cube.rotation.x += 0.03;
                cube.rotation.y += 0.04;

                if (cube.morphTargetInfluences) {
                    cube.morphTargetInfluences[0] = THREE.MathUtils.lerp(cube.morphTargetInfluences[0], 1, 0.05);
                }

                hueRef.current = (hueRef.current + 0.01) % 1.0;
                material.color.setHSL(hueRef.current, initialHsl.s, initialHsl.l);
            } else {
                // Interactive logic
                cube.rotation.x += 0.005;
                cube.rotation.y += 0.007;
                if (isSpinningRef.current) {
                    cube.rotation.x += spinVelocityRef.current.x;
                    cube.rotation.y += spinVelocityRef.current.y;
                    cube.rotation.z += spinVelocityRef.current.z;
                    spinVelocityRef.current.multiplyScalar(0.95);
                    if (spinVelocityRef.current.lengthSq() < 0.0001) {
                        spinVelocityRef.current.set(0, 0, 0);
                        isSpinningRef.current = false;
                    }
                }
                if (cube.morphTargetInfluences) {
                    const morphInfluence = cube.morphTargetInfluences[0];
                    let targetInfluence = 0;
                    if (isSpinningRef.current) targetInfluence = 1;
                    else if (isHoveredRef.current) targetInfluence = 0.4;
                    cube.morphTargetInfluences[0] = THREE.MathUtils.lerp(morphInfluence, targetInfluence, 0.08);
                }
                if (isSpinningRef.current) {
                    hueRef.current = (hueRef.current + 0.015) % 1.0;
                    material.color.setHSL(hueRef.current, initialHsl.s, initialHsl.l);
                } else if (isHoveredRef.current) {
                    material.color.lerp(hoverColorRef.current, 0.1);
                } else {
                    material.color.lerp(initialColorRef.current, 0.08);
                }
            }

            // Particle animation (only for interactive mode)
            if (interactive) {
                const now = performance.now();
                for (let i = particleSystems.length - 1; i >= 0; i--) {
                    const system = particleSystems[i];
                    const elapsedTime = now - system.startTime;
                    const life = 1200;
                    if (elapsedTime > life) {
                        scene.remove(system.points);
                        system.points.geometry.dispose();
                        (system.points.material as THREE.Material).dispose();
                        particleSystems.splice(i, 1);
                        continue;
                    }
                    const progress = elapsedTime / life;
                    (system.points.material as THREE.PointsMaterial).opacity = 1.0 - progress;
                    const positions = system.points.geometry.attributes.position;
                    const velocities = system.points.userData.velocities;
                    for (let j = 0; j < velocities.length; j++) {
                        positions.setX(j, positions.getX(j) + velocities[j].x * delta * 60);
                        positions.setY(j, positions.getY(j) + velocities[j].y * delta * 60);
                        positions.setZ(j, positions.getZ(j) + velocities[j].z * delta * 60);
                        velocities[j].y -= 0.002 * delta * 60; // gravity
                    }
                    positions.needsUpdate = true;
                }
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            if (canvas) {
                canvas.style.visibility = 'hidden';
            }
            cancelAnimationFrame(animationFrameId);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            materialRef.current = null;
            for (const system of particleSystems) {
                scene.remove(system.points);
                system.points.geometry.dispose();
                (system.points.material as THREE.Material).dispose();
            }
            if (canvas) {
                delete (canvas as any).createParticleBurst;
            }
        };
    }, [size, continuousSpin, interactive]); // Rerun effect if size or mode changes

    return (
        <canvas 
            ref={mountRef} 
            style={{ width: size, height: size }}
            className={interactive ? 'cursor-pointer' : ''}
            onClick={handleClick} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
        />
    );
};

export default AnimatedLogo;
