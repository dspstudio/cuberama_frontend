import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// --- Helper Functions ---

const createRoundedRectShape = (width: number, height: number, radius: number): THREE.Shape => {
    const shape = new THREE.Shape();
    shape.moveTo(0, radius);
    shape.lineTo(0, height - radius);
    shape.quadraticCurveTo(0, height, radius, height);
    shape.lineTo(width - radius, height);
    shape.quadraticCurveTo(width, height, width, height - radius);
    shape.lineTo(width, radius);
    shape.quadraticCurveTo(width, 0, width - radius, 0);
    shape.lineTo(radius, 0);
    shape.quadraticCurveTo(0, 0, 0, radius);
    return shape;
};

const createClipContentTexture = (
    clipInfo: {
        width: number, height: number,
        thumbColor1: string, thumbColor2: string,
        title: string, duration: string, textColor: string
    }
): THREE.CanvasTexture => {
    const { width, height, thumbColor1, thumbColor2, title, duration, textColor } = clipInfo;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const thumbSize = height * 0.8;
        const thumbX = height * 0.1;
        const thumbY = height * 0.1;

        // Thumbnail
        const gradient = ctx.createLinearGradient(0, 0, thumbSize, thumbSize);
        gradient.addColorStop(0, thumbColor1);
        gradient.addColorStop(1, thumbColor2);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, 12);
        ctx.fill();

        const textX = thumbX + thumbSize + 20;

        // Title
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = textColor;
        ctx.fillText(title, textX, height / 2 - 5);
        
        // Duration
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
        ctx.fillText(`Duration: ${duration}`, textX, height * 0.75);

    }
    return new THREE.CanvasTexture(canvas);
};


// --- Main Component ---

const TimelineCanvas: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        // --- Scene & Camera ---
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const viewWidth = 20;
        const viewHeight = viewWidth / aspect;
        const camera = new THREE.OrthographicCamera(-viewWidth / 2, viewWidth / 2, viewHeight / 2, -viewHeight / 2, 1, 1000);
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);

        // --- Timeline Elements ---
        const timelineWidth = 18;
        const rulerHeight = 1;
        const shotTrackHeight = 1.5;
        const mediaTrackHeight = 2.5;

        // --- Centering Logic ---
        const totalTimelineHeight = rulerHeight + shotTrackHeight + mediaTrackHeight;
        const yStart = totalTimelineHeight / 2; // Top of the timeline group, with center at y=0

        // 1. Ruler
        const rulerMat = new THREE.MeshBasicMaterial({ color: 0x1F2430 });
        const rulerGeo = new THREE.PlaneGeometry(timelineWidth, rulerHeight);
        const ruler = new THREE.Mesh(rulerGeo, rulerMat);
        ruler.position.y = yStart - (rulerHeight / 2);
        scene.add(ruler);
        
        const rulerBottomY = yStart - rulerHeight;

        // 2. Shot Track
        const shotTrackMat = new THREE.MeshBasicMaterial({ color: 0x284B8B });
        const shotTrackGeo = new THREE.PlaneGeometry(timelineWidth, shotTrackHeight);
        const shotTrack = new THREE.Mesh(shotTrackGeo, shotTrackMat);
        shotTrack.position.y = rulerBottomY - (shotTrackHeight / 2);
        scene.add(shotTrack);

        // Time markers & Keyframes
        const keyframePositions = [0.1, 0.35, 0.65, 0.85];
        const keyframeGroups: THREE.Group[] = [];
        keyframePositions.forEach((pos) => {
            const x = -timelineWidth / 2 + timelineWidth * pos;

            const keyframeGroup = new THREE.Group();
            scene.add(keyframeGroup);
            keyframeGroup.position.set(x, rulerBottomY, 0.1);
            keyframeGroups.push(keyframeGroup);

            // Diamond
            const kfGeo = new THREE.PlaneGeometry(0.3, 0.3);
            const kfMat = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, transparent: true });
            const kf = new THREE.Mesh(kfGeo, kfMat);
            kf.rotation.z = Math.PI / 4;
            keyframeGroup.add(kf);

            // Line
            const lineHeight = shotTrackHeight;
            const lineMat = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
            const lineGeo = new THREE.PlaneGeometry(0.02, lineHeight);
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.position.y = -lineHeight / 2;
            keyframeGroup.add(line);
        });

        // 3. Media Track
        const mediaTrackMat = new THREE.MeshBasicMaterial({ color: 0x2E3340 });
        const mediaTrackGeo = new THREE.PlaneGeometry(timelineWidth, mediaTrackHeight);
        const mediaTrack = new THREE.Mesh(mediaTrackGeo, mediaTrackMat);
        mediaTrack.position.y = shotTrack.position.y - (shotTrackHeight / 2) - (mediaTrackHeight / 2);
        scene.add(mediaTrack);
        
        // Media Clips
        const clipHeight = mediaTrackHeight * 0.8;
        const clipRadius = 0.2;

        const clip1Shape = createRoundedRectShape(4, clipHeight, clipRadius);
        const clip1Geo = new THREE.ShapeGeometry(clip1Shape);
        const clip1Mat = new THREE.MeshBasicMaterial({ color: 0xF8D468 });
        const clip1 = new THREE.Mesh(clip1Geo, clip1Mat);
        clip1.position.set(-timelineWidth/2 + 0.2, mediaTrack.position.y - clipHeight/2, 0.1);
        scene.add(clip1);
        
        const clip1ContentTex = createClipContentTexture({
            width: 512, height: 256, thumbColor1: '#8A2BE2', thumbColor2: '#40E0D0',
            title: 'crazy-iridescent...', duration: '00:05.00', textColor: '#222'
        });
        const clip1ContentMat = new THREE.MeshBasicMaterial({ map: clip1ContentTex, transparent: true });
        const clip1ContentGeo = new THREE.PlaneGeometry(3.8, clipHeight * 0.95);
        const clip1Content = new THREE.Mesh(clip1ContentGeo, clip1ContentMat);
        clip1Content.position.set(2, clipHeight/2, 0.1);
        clip1.add(clip1Content);
        
        const clip2Shape = createRoundedRectShape(6, clipHeight, clipRadius);
        const clip2Geo = new THREE.ShapeGeometry(clip2Shape);
        const clip2Mat = new THREE.MeshBasicMaterial({ color: 0x333948 });
        const clip2 = new THREE.Mesh(clip2Geo, clip2Mat);
        clip2.position.set(-timelineWidth/2 + 4.4, mediaTrack.position.y - clipHeight/2, 0.1);
        scene.add(clip2);
        
        const clip2ContentTex = createClipContentTexture({
            width: 768, height: 256, thumbColor1: '#CCCCCC', thumbColor2: '#777777',
            title: '5532762-uhd_4096...', duration: '00:13.20', textColor: '#DDD'
        });
        const clip2ContentMat = new THREE.MeshBasicMaterial({ map: clip2ContentTex, transparent: true });
        const clip2ContentGeo = new THREE.PlaneGeometry(5.8, clipHeight * 0.95);
        const clip2Content = new THREE.Mesh(clip2ContentGeo, clip2ContentMat);
        clip2Content.position.set(3, clipHeight/2, 0.1);
        clip2.add(clip2Content);

        // 4. Playhead
        const playheadGroup = new THREE.Group();
        const playheadLineHeight = totalTimelineHeight + 0.2;
        const playheadLine = new THREE.Mesh(new THREE.PlaneGeometry(0.05, playheadLineHeight), new THREE.MeshBasicMaterial({ color: 0xE53E3E }));
        playheadLine.position.y = 0; // Center of the timeline group
        playheadGroup.add(playheadLine);
        
        const playheadHandle = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshBasicMaterial({ color: 0xE53E3E }));
        playheadHandle.position.y = yStart; // Top of the entire timeline
        playheadGroup.add(playheadHandle);
        playheadGroup.position.z = 0.5;
        scene.add(playheadGroup);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            const loopDuration = 8;
            const progress = (elapsedTime % loopDuration) / loopDuration;
            playheadGroup.position.x = -timelineWidth / 2 + timelineWidth * progress;

            keyframeGroups.forEach(group => {
                const kf = group.children[0] as THREE.Mesh;
                const dist = Math.abs(group.position.x - playheadGroup.position.x);
                const pulse = Math.max(0, 1 - dist * 2);
                const scale = 1 + pulse * 0.2;
                kf.scale.set(scale, scale, 1);
                (kf.material as THREE.MeshBasicMaterial).opacity = 0.8 + pulse * 0.2;
            });

            renderer.render(scene, camera);
        };
        animate();
        
        // --- Resize Handler ---
        const handleResize = () => {
            if (currentMount) {
                const newAspect = currentMount.clientWidth / currentMount.clientHeight;
                const newViewHeight = viewWidth / newAspect;
                camera.left = -viewWidth / 2; camera.right = viewWidth / 2;
                camera.top = newViewHeight / 2; camera.bottom = -newViewHeight / 2;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', handleResize);
            try { currentMount.removeChild(renderer.domElement); } catch (e) { /* ignore */ }
            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(mat => { if (mat.map) mat.map.dispose(); mat.dispose(); });
                    } else {
                        if (object.material.map) object.material.map.dispose();
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden" />;
};

export default TimelineCanvas;