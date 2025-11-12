import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_opacity;
    varying vec2 vUv;

    // CC0: F# Windows Terminal Shader
    //  A shader background for Windows Terminal featuring the F# logo

    #define TIME        u_time
    #define RESOLUTION  u_resolution


    #define PI          3.141592654
    #define TAU         (2.0*PI)

    // License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
    const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 hsv2rgb(vec3 c) {
      vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
      return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
    }
    // License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
    //  Macro version of above to enable compile-time constants
    #define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

    // License: Unknown, author: Unknown, found: don't remember
    float hash(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,58.233))) * 13758.5453);
    }

    // License: MIT, author: Inigo Quilez, found: https://www.iquilezles.org/www/articles/smin/smin.htm
    float pmin(float a, float b, float k) {
      float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
      return mix(b, a, h) - k*h*(1.0-h);
    }

    // License: MIT, author: Inigo Quilez, found: https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
    float hexagon(vec2 p, float r) {
    //  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
      const vec3 k = 0.5*vec3(-sqrt(3.0),1.0,sqrt(4.0/3.0));
      p = abs(p);
      p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
      p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
      return length(p)*sign(p.y);
    }

    // License: Unknown, author: Martijn Steinrucken, found: https://www.youtube.com/watch?v=VmrIDyYiJBA
    vec2 hextile(inout vec2 p) {
      // See Art of Code: Hexagonal Tiling Explained!
      // https://www.youtube.com/watch?v=VmrIDyYiJBA
      const vec2 sz       = vec2(1.0, sqrt(3.0));
      const vec2 hsz      = 0.5*sz;

      vec2 p1 = mod(p, sz)-hsz;
      vec2 p2 = mod(p - hsz, sz)-hsz;
      vec2 p3 = dot(p1, p1) < dot(p2, p2) ? p1 : p2;
      vec2 n = ((p3 - p + hsz)/sz);
      p = p3;

      n -= vec2(0.5);
      // Rounding to make hextile 0,0 well behaved
      return floor(n*2.0 + 0.5)*0.5;
    }

    float pmax(float a, float b, float k) {
      return -pmin(-a, -b, k);
    }

    vec2 pmin(vec2 a, vec2 b, float k) {
      vec2 h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
      return mix(b, a, h) - k*h*(1.0-h);
    }

    vec2 pabs(vec2 a, float k) {
      return -pmin(-a, a, k);
    }

    float cellf(vec2 p, vec2 n) {
      const float lw = 0.01;
      return -hexagon(p.yx, 0.5-lw);
    }

    vec2 df(vec2 p, out vec2 hn0, out vec2 hn1) {
      const float sz = 0.25;
      p /= sz;
      vec2 hp0 = p;
      vec2 hp1 = p+vec2(1.0, sqrt(1.0/3.0));

      hn0 = hextile(hp0);
      hn1 = hextile(hp1);

      float d0 = cellf(hp0, hn0);
      float d1 = cellf(hp1, hn1);
      float d2 = length(hp0);

      float d = d0;
      d = min(d0, d1);

      return vec2(d, d2)*sz;
    }

    vec3 effect(vec2 p, vec2 pp) {
      const float pa = 20.0;
      const float pf = 0.0005;
      float hoff = mod(TIME * 0.025, 1.0);
      vec3 bcol0 = HSV2RGB(vec3(hoff+0.63, 0.85, 0.5));

      float aa = 2.0/RESOLUTION.y;
      vec2 hn0;
      vec2 hn1;
      vec2 pb = p + pa*sin(TIME*pf*vec2(1.0, sqrt(0.5)));
      vec2 d2 = df(pb, hn0, hn1);

      vec3 col = vec3(0.0);

      float h0 = hash(hn1);
      float l = mix(0.25, 0.75, h0);

      if (hn0.x <= hn1.x+0.5) {
        l *= 0.5;
      }

      if (hn0.y <= hn1.y) {
        l *= 0.75;
      }
      
      col += l*bcol0;
      
      col = mix(col, vec3(0.), smoothstep(aa, -aa, d2.x));
      col *= mix(0.75, 1.0, smoothstep(0.01, 0.2, d2.y));
      col *= 1.25*smoothstep(1.5, 0.25, length(pp));
      return col;
    }


    void mainImage( out vec4 fragColor, in vec2 uv ) {
      vec2 q = uv;
      vec2 p = -1. + 2. * q;
      vec2 pp = p;
      p.x *= RESOLUTION.x/RESOLUTION.y;
      vec3 col = effect(p, pp);
      col = sqrt(col);
      fragColor = vec4(col, u_opacity);
    }

    void main() {
        mainImage(gl_FragColor, vUv);
    }
`;

const HeroShaderBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);

        // Use a lower DPI on smaller screens for performance
        const isMobileOrTablet = window.innerWidth <= 1024;
        renderer.setPixelRatio(isMobileOrTablet ? 0.75 : 1);

        currentMount.appendChild(renderer.domElement);

        // Shader Material
        const uniforms = {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
            u_opacity: { value: 0.0 },
        };
        
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
        });
        materialRef.current = material;

        // Fullscreen Quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const quad = new THREE.Mesh(geometry, material);
        scene.add(quad);

        const clock = new THREE.Clock();
        let animationFrameId: number;

        const handleResize = () => {
            if (materialRef.current && currentMount) {
              const { clientWidth, clientHeight } = currentMount;
              renderer.setSize(clientWidth, clientHeight);

              // Update DPI on resize as well
              const isMobileOrTablet = window.innerWidth <= 1024;
              renderer.setPixelRatio(isMobileOrTablet ? 0.75 : 1);

              materialRef.current.uniforms.u_resolution.value.set(clientWidth, clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (materialRef.current) {
              // Fade in opacity
              if(materialRef.current.uniforms.u_opacity.value < 1.0) {
                materialRef.current.uniforms.u_opacity.value += 0.005;
              }
              materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
            }
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (currentMount && renderer.domElement) {
                try {
                    currentMount.removeChild(renderer.domElement);
                } catch (e) {
                    // Ignore error
                }
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        />
    );
};

export default HeroShaderBackground;
