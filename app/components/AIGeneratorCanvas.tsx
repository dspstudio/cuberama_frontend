import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';

const LOADING_DURATION_MS = 2500;

// --- Overlay Components ---

const LoadingOverlay: React.FC = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-slate-300 animate-fade-in-slow">
        <Sparkles className="w-8 h-8 text-cyan-400 mb-3 animate-pulse" />
        <p className="font-semibold">Generating scene...</p>
    </div>
);

// --- Main Canvas Component ---

const AIGeneratorCanvas: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const animationStateRef = useRef<'loading' | 'result'>('loading');
    const [showLoading, setShowLoading] = useState(true);
    
    // Refs for three.js objects to avoid re-creation
    const sceneRef = useRef(new THREE.Scene());
    const cardRef = useRef<THREE.Mesh | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    // Animation sequence manager
    useEffect(() => {
        animationStateRef.current = 'loading';
        setShowLoading(true);
        if (cardRef.current) cardRef.current.visible = false;

        const timer = setTimeout(() => {
            animationStateRef.current = 'result';
            setShowLoading(false);
            if(cardRef.current) {
                cardRef.current.visible = true;
                cardRef.current.scale.set(0, 0, 0); // Start scale for pop-in animation
            }
        }, LOADING_DURATION_MS);

        return () => clearTimeout(timer);
    }, []);

    // Three.js setup effect
    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        
        // --- Renderer, Camera ---
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current = renderer;
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.z = 5;

        const scene = sceneRef.current;
        
        // --- Lighting ---
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(2, 2, 5);
        scene.add(dirLight);

        // --- 3D Card ---
        const createCardTexture = (): THREE.CanvasTexture => {
            const canvas = document.createElement('canvas');
            const size = 512;
            canvas.width = size;
            canvas.height = size * (9 / 16);
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Gradient background
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#1e3a8a'); // dark blue
                gradient.addColorStop(1, '#0e7490'); // dark cyan
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Abstract lines
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 10; i++) {
                    ctx.beginPath();
                    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                    ctx.stroke();
                }
            }
            return new THREE.CanvasTexture(canvas);
        };
        
        const cardGeometry = new THREE.PlaneGeometry(4, 2.25); // 16:9 ratio
        const cardMaterial = new THREE.MeshStandardMaterial({ 
            map: createCardTexture(),
            side: THREE.DoubleSide,
            roughness: 0.3,
            metalness: 0.1
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        card.visible = false;
        scene.add(card);
        cardRef.current = card;

        // --- Animation Loop ---
        let animationFrameId: number;
        const targetScale = new THREE.Vector3(1, 1, 1);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (cardRef.current && cardRef.current.visible) {
                cardRef.current.rotation.y += 0.003;
                
                // Pop-in animation
                if (cardRef.current.scale.x < 1) {
                    cardRef.current.scale.lerp(targetScale, 0.08);
                }
            }
            renderer.render(scene, camera);
        };
        animate();
        
        // --- Resize Handler ---
        const handleResize = () => {
            if (currentMount) {
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);
        
        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            try {
                currentMount.removeChild(renderer.domElement);
            } catch (e) { /* ignore */ }
            cardGeometry.dispose();
            cardMaterial.map?.dispose();
            cardMaterial.dispose();
            renderer.dispose();
        };

    }, []);

    return (
        <>
            <div ref={mountRef} className="w-full h-full" />
            {showLoading && <LoadingOverlay />}
            <style>{`
                @keyframes fade-in-slow {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-slow {
                    animation: fade-in-slow 0.5s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default AIGeneratorCanvas;