'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Cpu, Zap, BarChart, Loader2, CheckCircle2, AlertTriangle, Box, Sparkles as SparklesIcon, Lightbulb, Eclipse } from 'lucide-react';

// --- Test Configuration ---
const TEST_DURATION_MS = 3000; // 3 seconds per test
const SCORE_MULTIPLIER = 20; // Scales the final score to a more meaningful range

interface TestCategory {
  name: 'Geometry' | 'Materials & Shaders' | 'Dynamic Lighting' | 'Shadows' | 'Particles';
  weight: number;
  Icon: React.ElementType;
  setup: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => { update: (delta: number) => void };
}

interface TestResult {
  category: string;
  avgFps: number;
  score: number;
  weight: number;
}

interface FinalResults {
  renderer: string;
  unmaskedRenderer: string;
  totalScore: number;
  tier: 'Low' | 'Medium' | 'High' | 'Ultra';
  tierColor: string;
  compatibilityStatus: 'Basic' | 'Good' | 'Excellent';
  compatibilityMessage: string;
  compatibilityIcon: React.ElementType;
  details: TestResult[];
}

// --- Test Scene Setups ---

const testCategories: TestCategory[] = [
  {
    name: 'Geometry',
    weight: 1.5,
    Icon: Box,
    setup: (scene, camera) => {
      camera.position.set(0, 0, 200);
      const count = 5000;
      const geometry = new THREE.BoxGeometry(5, 5, 5);
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      scene.add(mesh);

      const dummy = new THREE.Object3D();
      // Store initial random positions
      const initialPositions: THREE.Vector3[] = [];
      for (let i = 0; i < count; i++) {
        const pos = new THREE.Vector3(
          (Math.random() - 0.5) * 250,
          (Math.random() - 0.5) * 250,
          (Math.random() - 0.5) * 250
        );
        initialPositions.push(pos);
        dummy.position.copy(pos);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      
      const clock = new THREE.Clock();

      return { 
        update: () => { 
          const time = clock.getElapsedTime();
          for (let i = 0; i < count; i++) {
            const pos = initialPositions[i];
            // Create a wave-like swarm motion
            dummy.position.set(
              pos.x + Math.sin(time + i * 0.1) * 5,
              pos.y + Math.cos(time + i * 0.05) * 5,
              pos.z + Math.sin(time + i * 0.02) * 5
            );
            dummy.rotation.y = time * 0.5;
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          }
          mesh.instanceMatrix.needsUpdate = true;
        } 
      };
    },
  },
  {
    name: 'Materials & Shaders',
    weight: 1.2,
    Icon: SparklesIcon,
    setup: (scene, camera, renderer) => {
      camera.position.set(0, 0, 5);
      
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const canvas = document.createElement('canvas');
      canvas.width = 1024; // Higher res for better quality
      canvas.height = 512;
      const context = canvas.getContext('2d');
      let envMap: THREE.Texture | null = null;
      if (context) {
        // Pro studio lighting simulation
        context.fillStyle = '#101010'; // Dark grey background
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Key light (large, soft, from top-left)
        let gradient = context.createRadialGradient(canvas.width * 0.2, canvas.height * 0.3, 0, canvas.width * 0.2, canvas.height * 0.3, 200);
        gradient.addColorStop(0, 'rgba(255, 255, 240, 1.0)'); // Soft white
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Fill light (smaller, dimmer, from right)
        gradient = context.createRadialGradient(canvas.width * 0.8, canvas.height * 0.5, 0, canvas.width * 0.8, canvas.height * 0.5, 150);
        gradient.addColorStop(0, 'rgba(220, 220, 255, 0.5)'); // Cool white
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        const renderTarget = pmremGenerator.fromEquirectangular(texture);
        envMap = renderTarget.texture;
        scene.environment = envMap;
        texture.dispose();
      }
      pmremGenerator.dispose();
      
      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 256, 32); // Increased detail
      const material = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0, // Silver color
        metalness: 1.0,
        roughness: 0.05, // Highly reflective
        envMap: envMap,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      return { update: (delta) => { 
        mesh.rotation.y += 0.3 * delta; 
        mesh.rotation.x += 0.2 * delta;
      } };
    },
  },
  {
    name: 'Dynamic Lighting',
    weight: 1.3,
    Icon: Lightbulb,
    setup: (scene, camera) => {
      camera.position.set(0, 0, 10);
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.1, 
        metalness: 0.9 
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
      const starVertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starVertices.push(x, y, z);
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0x555555, size: 0.2 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      const lights: THREE.PointLight[] = [];
      const colors = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00, 0x00ffff, 0xff00ff];
      for (let i = 0; i < 6; i++) {
        const light = new THREE.PointLight(colors[i], 300, 15);
        scene.add(light);
        lights.push(light);
      }
      
      const clock = new THREE.Clock();
      return { update: () => {
        const time = clock.getElapsedTime();
        lights.forEach((light, i) => {
          const angle = time * (0.6 + i * 0.2);
          const radius = 5;
          light.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * (i % 3 === 0 ? 1.5 : -1.2)) * radius * 0.7,
            Math.sin(angle) * radius
          );
        });
      }};
    },
  },
  {
    name: 'Shadows',
    weight: 1.4,
    Icon: Eclipse,
    setup: (scene, camera, renderer) => {
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 0, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        scene.fog = new THREE.Fog(0x101421, 20, 50);
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));

        const light = new THREE.DirectionalLight(0xffffff, 4);
        light.position.set(8, 12, 10);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        scene.add(light);
        
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 }));
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);
        
        const meshes: THREE.Mesh[] = [];
        const geoms = [new THREE.BoxGeometry(2,2,2), new THREE.SphereGeometry(1.2, 32, 32), new THREE.TorusKnotGeometry(1, 0.4, 100, 16)];
        const material = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.3, metalness: 0.1 });
        geoms.forEach((geom, i) => {
            const mesh = new THREE.Mesh(geom, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.set((i - 1) * 5, 2, 0);
            scene.add(mesh);
            meshes.push(mesh);
        });
        
        const clock = new THREE.Clock();
        return { 
          update: (delta) => { 
            const time = clock.getElapsedTime();
            meshes.forEach((m, i) => { 
              m.rotation.y += 0.4 * delta * (i + 1) * 0.5; 
              m.position.y = 2 + Math.sin(time + i) * 0.5;
            }); 
          } 
        };
    },
  },
  {
    name: 'Particles',
    weight: 1.0,
    Icon: BarChart,
    setup: (scene, camera) => {
      camera.position.z = 100;
      const count = 20000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const color = new THREE.Color();

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 100;
        const angle = Math.pow(Math.random(), 2) * Math.PI * 4 + (radius * 0.1);
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = Math.sin(angle) * radius;

        color.setHSL(radius / 100, 0.7, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({ 
          size: 1.5,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
    
      const clock = new THREE.Clock();
      return { 
        update: () => { 
          const time = clock.getElapsedTime() * 0.5;
          points.rotation.y = time * 0.2;
    
          const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            (posAttr.array as Float32Array)[i3 + 1] += Math.sin(time + (posAttr.array as Float32Array)[i3]) * 0.05;
          }
          posAttr.needsUpdate = true;
        } 
      };
    }
  }
];

// --- React Component ---

const PerformanceBar: React.FC<{ score: number }> = ({ score }) => {
  const MAX_SCORE_DISPLAY = 10000; // The bar visually represents scores up to 10k for positioning
  const percentage = Math.min((score / MAX_SCORE_DISPLAY) * 100, 100);

  return (
      <div className="bg-[#0A0E1A] p-6 rounded-lg border border-white/5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Performance Spectrum</h3>
          <div className="relative w-full pt-10">
              {/* Score marker */}
              <div
                  className="absolute top-0 transition-all duration-500 ease-out"
                  style={{ left: `clamp(18px, ${percentage}%, calc(100% - 18px))` }}
              >
                  <div className="relative -translate-x-1/2">
                      <div className="bg-white text-black px-2 py-1 rounded-md text-sm font-bold shadow-lg whitespace-nowrap">
                          Your Score: {Math.round(score).toLocaleString()}
                      </div>
                      <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white mx-auto"></div>
                  </div>
              </div>

              {/* Bar */}
              <div className="h-4 w-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-cyan-400 rounded-full shadow-inner"></div>

              {/* Labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Low</span>
                  <span className="hidden sm:inline">Medium</span>
                  <span className="hidden sm:inline">High</span>
                  <span>Ultra</span>
              </div>
          </div>
      </div>
  );
};

const GPUTestPage: React.FC = () => {
  const [testState, setTestState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [webglSupport, setWebglSupport] = useState<'checking' | 'supported' | 'unsupported'>(() => {
    if (typeof window === 'undefined') {
      return 'checking';
    }
    const canvas = document.createElement('canvas');
    try {
        const gl = canvas.getContext('webgl2');
        if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            loseContext?.loseContext();
            return 'supported';
        } else {
            return 'unsupported';
        }
    } catch (e) {
        console.error("Error checking WebGL 2.0 support:", e);
        return 'unsupported';
    }
  });
  const [currentTestInfo, setCurrentTestInfo] = useState<{ name: string; index: number } | null>(null);
  const [results, setResults] = useState<FinalResults | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const testAnimationRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);



  const getPerformanceTier = useCallback((score: number): Omit<FinalResults, 'renderer' | 'unmaskedRenderer' | 'totalScore' | 'details'> => {
    if (score >= 8000) return { 
        tier: 'Ultra', 
        tierColor: 'text-cyan-400',
        compatibilityStatus: 'Excellent',
        compatibilityMessage: 'Ideal for complex projects and advanced features.',
        compatibilityIcon: CheckCircle2,
    };
    if (score >= 5000) return { 
        tier: 'High', 
        tierColor: 'text-green-400',
        compatibilityStatus: 'Excellent',
        compatibilityMessage: 'Your system will handle Cuberama with ease.',
        compatibilityIcon: CheckCircle2,
    };
    if (score >= 2500) return { 
        tier: 'Medium', 
        tierColor: 'text-yellow-400',
        compatibilityStatus: 'Good',
        compatibilityMessage: 'Recommended for a smooth experience.',
        compatibilityIcon: CheckCircle2,
    };
    return { 
        tier: 'Low', 
        tierColor: 'text-red-400',
        compatibilityStatus: 'Basic',
        compatibilityMessage: 'May experience slowdowns on complex scenes.',
        compatibilityIcon: AlertTriangle,
    };
  }, []);

  const cleanupScene = (scene: THREE.Scene) => {
    while(scene.children.length > 0){ 
        const object = scene.children[0];
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
            if (object.geometry) object.geometry.dispose();
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else if (object.material) {
                object.material.dispose();
            }
        }
        scene.remove(object);
    }
    scene.environment = null;
    scene.fog = null;
    if (rendererRef.current) {
        rendererRef.current.shadowMap.enabled = false;
    }
  };

  const runSingleTest = useCallback((test: TestCategory, renderer: THREE.WebGLRenderer): Promise<number> => {
    return new Promise((resolve) => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x101421);
        const camera = new THREE.PerspectiveCamera(75, canvasRef.current!.clientWidth / canvasRef.current!.clientHeight, 0.1, 1000);
        
        const { update } = test.setup(scene, camera, renderer);
        
        const fpsData: number[] = [];
        let lastTime = performance.now();
        const startTime = performance.now();

        const animate = () => {
          const now = performance.now();
          const delta = (now - lastTime) / 1000;
          lastTime = now;

          if (now - startTime > TEST_DURATION_MS) {
            const avgFps = fpsData.length > 10 ? fpsData.slice(10).reduce((a, b) => a + b, 0) / (fpsData.length - 10) : 0;
            cleanupScene(scene);
            resolve(avgFps);
            return;
          }

          if (delta > 0) {
            fpsData.push(1 / delta);
          }
          
          update(delta);
          renderer.render(scene, camera);
          testAnimationRef.current = requestAnimationFrame(animate);
        };
        animate();
    });
  }, []);

  const runBenchmark = async () => {
    if (webglSupport !== 'supported' || !canvasRef.current) return;
    setTestState('running');
    setResults(null);

    const canvas = canvasRef.current;
    if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    }
    const renderer = rendererRef.current;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const rendererName = renderer.domElement.getContext('webgl2')?.getParameter(WebGLRenderingContext.RENDERER) || 'N/A';
    
    let unmaskedRendererName = 'N/A';
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      unmaskedRendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    const detailedResults: TestResult[] = [];
    for (let i = 0; i < testCategories.length; i++) {
        const test = testCategories[i];
        setCurrentTestInfo({ name: test.name, index: i });
        const avgFps = await runSingleTest(test, renderer);
        detailedResults.push({
            category: test.name,
            avgFps,
            score: avgFps * test.weight * SCORE_MULTIPLIER,
            weight: test.weight
        });
    }

    const totalScore = detailedResults.reduce((sum, result) => sum + result.score, 0);
    const tierInfo = getPerformanceTier(totalScore);
    
    setResults({
        renderer: rendererName,
        unmaskedRenderer: unmaskedRendererName,
        totalScore,
        ...tierInfo,
        details: detailedResults
    });
    setTestState('finished');
    setCurrentTestInfo(null);
  };
  
  useEffect(() => {
    return () => {
      if (testAnimationRef.current) cancelAnimationFrame(testAnimationRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">GPU Performance Test</h1>
      
      <div className="bg-[#161A25] border border-white/5 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-white mb-2">Benchmark Your Browser&apos;s 3D Capabilities</h2>
            <p className="text-gray-400 max-w-2xl">
              This test runs five benchmarks to measure your system&apos;s performance across key 3D rendering tasks. The result is a weighted score that helps determine how smoothly Cuberama will run on your device.
            </p>
            <div className="mt-6">
                {webglSupport === 'checking' && (
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600/50 rounded-lg">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Checking Compatibility...</span>
                    </div>
                )}
                {webglSupport === 'supported' && (
                  <button 
                    onClick={runBenchmark}
                    disabled={testState === 'running'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testState === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    <span>{testState === 'running' ? 'Testing...' : (results ? 'Run Test Again' : 'Start GPU Test')}</span>
                  </button>
                )}
            </div>
            {webglSupport === 'unsupported' && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-300">WebGL 2.0 Not Supported</h3>
                        <p className="text-sm text-red-400 mt-1">
                            Your browser or device does not support WebGL 2.0, which is required for this benchmark and for Cuberama to function correctly. Please try a different browser (like Chrome or Firefox) or update your current one.
                        </p>
                    </div>
                </div>
            )}
          </div>
          <div className="w-full lg:w-96 h-64 bg-black/30 border border-white/10 rounded-lg relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
            {testState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-[#101421]">
                  <Cpu className="w-12 h-12 mb-2" />
                  <p>Ready to test</p>
              </div>
            )}
             {testState === 'running' && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 text-white">
                 <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                    <p className="text-sm font-semibold truncate">Testing: {currentTestInfo?.name}</p>
                 </div>
                 <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${currentTestInfo ? ((currentTestInfo.index + 1) / testCategories.length) * 100 : 0}%` }}></div>
                 </div>
              </div>
            )}
             {testState === 'finished' && results && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 bg-[#101421] p-4 text-center">
                  <results.compatibilityIcon className={`w-12 h-12 mb-2 ${results.tierColor}`} />
                  <p className={`text-lg font-semibold ${results.tierColor}`}>{results.compatibilityStatus} Compatibility</p>
                  <p className="text-sm text-gray-400 mt-1">{results.compatibilityMessage}</p>
              </div>
             )}
          </div>
        </div>
      </div>
      
      {results && testState === 'finished' && (
        <div className="bg-[#161A25] border border-white/5 rounded-2xl p-8 space-y-8">
            <h2 className="text-xl font-semibold text-white mb-2">Benchmark Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0E1A] p-6 rounded-lg border border-white/5">
                    <Cpu className="w-8 h-8 text-amber-400 mb-3" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">GPU Details</h3>
                    <p className="text-lg font-semibold text-white mt-1 break-words">{results.unmaskedRenderer}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate" title={results.renderer}>Renderer: {results.renderer}</p>
                </div>
                <div className="bg-[#0A0E1A] p-6 rounded-lg border border-white/5">
                    <BarChart className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Overall Score</h3>
                    <p className="text-4xl font-bold text-white mt-1">{Math.round(results.totalScore).toLocaleString()}</p>
                </div>
                <div className="bg-[#0A0E1A] p-6 rounded-lg border border-white/5">
                    <Zap className="w-8 h-8 text-sky-400 mb-3" />
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Performance Tier</h3>
                    <p className={`text-4xl font-bold mt-1 ${results.tierColor}`}>{results.tier}</p>
                </div>
            </div>
            
            <PerformanceBar score={results.totalScore} />

        </div>
      )}
    </div>
  );
};

export default GPUTestPage;
