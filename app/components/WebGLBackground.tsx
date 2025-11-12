import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// Reduced mouse rotation sensitivity from 0.2 to 0.1 for a more subtle effect
const fragmentShader = `
  // Star Nest by Pablo Roman Andrioli
  // License: MIT
  // Adapted from: https://www.shadertoy.com/view/XlfGRj

  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;

  #define iterations 17
  #define formuparam 0.53

  #define volsteps 20
  #define stepsize 0.1

  #define zoom   0.800
  #define tile   0.850
  #define speed  0.001

  #define brightness 0.0015
  #define darkmatter 0.300
  #define distfading 0.730
  #define saturation 0.850


  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      //get coords and direction
      vec2 uv=fragCoord.xy/iResolution.xy-.5;
      uv.y*=iResolution.y/iResolution.x;
      vec3 dir=vec3(uv*zoom,1.);
      float time=iTime*speed+.25;

      //mouse rotation
      float a1=.5+iMouse.x/iResolution.x*0.1;
      float a2=.8+iMouse.y/iResolution.y*0.1;
      mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
      mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
      dir.xz*=rot1;
      dir.xy*=rot2;
      vec3 from=vec3(1.,.5,0.5);
      from+=vec3(time*2.,time,-2.);
      from.xz*=rot1;
      from.xy*=rot2;
      
      //volumetric rendering
      float s=0.1,fade=1.;
      vec3 v=vec3(0.);
      for (int r=0; r<volsteps; r++) {
          vec3 p=from+s*dir*.5;
          p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
          float pa,a=pa=0.;
          for (int i=0; i<iterations; i++) { 
              p=abs(p)/dot(p,p)-formuparam; // the magic formula
              a+=abs(length(p)-pa); // absolute sum of average change
              pa=length(p);
          }
          float dm=max(0.,darkmatter-a*a*.001); //dark matter
          a*=a*a; // add contrast
          if (r>6) fade*=1.-dm; // dark matter, don't render near
          //v+=vec3(dm,dm*.5,0.);
          v+=fade;
          v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
          fade*=distfading; // distance fading
          s+=stepsize;
      }
      v=mix(vec3(length(v)),v,saturation); //color adjust
      fragColor = vec4(v*.01,1.);	
  }

  // Three.js requires a main function
  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;


const WebGLBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    // Use refs for mouse positions to avoid re-renders on mouse move.
    // `mouse` stores the actual cursor position.
    // `smoothedMouse` stores the interpolated position, which is passed to the shader.
    const mouse = useRef(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2));
    const smoothedMouse = useRef(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2));
    const lerpFactor = 0.001; // Smoothing factor: smaller is smoother/slower.

    // Effect for setup and teardown
    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Shader Material
        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
            // Initialize iMouse with the smoothed value.
            iMouse: { value: smoothedMouse.current },
        };
        
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        materialRef.current = material;

        // Fullscreen Quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const quad = new THREE.Mesh(geometry, material);
        scene.add(quad);

        // Clock
        const clock = new THREE.Clock();

        // Handle Resize
        const handleResize = () => {
            if (materialRef.current && currentMount) {
              const { clientWidth, clientHeight } = currentMount;
              renderer.setSize(clientWidth, clientHeight);
              materialRef.current.uniforms.iResolution.value.set(clientWidth, clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // Handle Mouse Move: Update the target mouse position.
        const handleMouseMove = (event: MouseEvent) => {
             const rect = currentMount.getBoundingClientRect();
             mouse.current.set(
                event.clientX - rect.left,
                // Shader toy's iMouse.y is from the bottom, while browser's is from the top
                rect.height - (event.clientY - rect.top) 
            );
        };
        // Listen on window to track mouse even if it leaves the component.
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (materialRef.current) {
              // Interpolate the smoothed mouse position towards the target position.
              // This creates a smooth, dampened effect.
              smoothedMouse.current.lerp(mouse.current, lerpFactor);

              // Update shader uniforms
              materialRef.current.uniforms.iMouse.value.copy(smoothedMouse.current);
              materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
            }
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            
            if (animationFrameIdRef.current) {
              cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (currentMount && renderer.domElement) {
                try {
                    currentMount.removeChild(renderer.domElement);
                } catch (e) {
                    // Ignore error if element is already gone
                }
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div 
            ref={mountRef} 
            className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden"
        />
    );
};

export default WebGLBackground;