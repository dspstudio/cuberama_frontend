import React, { useState, useRef, useEffect, useCallback } from 'react';

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
];

const BLUR = 10;
const INTENSITY = 0.5;
const FADE = 20;
const SLIDER_SIZE = 30;
const PERSPECTIVE = 4000;


const VideoSlider: React.FC = () => {
    const [carouselRotation, setCarouselRotation] = useState(0);
    const [buttonsVisible, setButtonsVisible] = useState(false); // Start hidden
    const [isPlaying, setIsPlaying] = useState(true);
    const [isAutoplayActive, setAutoplayActive] = useState(true);
    const mainVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const reflectionVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const isInitialLoad = useRef(true);

    const rotationAngle = 360 / videos.length;
    const currentIndex = Math.round((-carouselRotation / rotationAngle) % videos.length + videos.length) % videos.length;

    const [loadedIndices] = useState(new Set([0, 1, videos.length - 1]));
   
    useEffect(() => {
      // Just handle the video playback logic without touching state here
      const playCurrent = (index: number) => {
        const mainVideo = mainVideoRefs.current[index];
        const reflectionVideo = reflectionVideoRefs.current[index];
        if (mainVideo && isPlaying) mainVideo.play().catch(e => console.error("Error playing main video:", e));
        if (reflectionVideo && isPlaying) reflectionVideo.play().catch(e => console.error("Error playing reflection video:", e));
      };

      const pauseOthers = (index: number) => {
        const mainVideo = mainVideoRefs.current[index];
        const reflectionVideo = reflectionVideoRefs.current[index];
        if (mainVideo) mainVideo.pause();
        if (reflectionVideo) reflectionVideo.pause();
      };

      videos.forEach((_, index) => {
        if (index === currentIndex) {
          playCurrent(index);
        } else {
          pauseOthers(index);
        }
      });
    }, [currentIndex, isPlaying]);

    useEffect(() => {
        const positionAndShowButtons = () => {
            setButtonsVisible(true);
        };

        let delay = 1050;
        if (isInitialLoad.current) {
            delay = 200; 
            isInitialLoad.current = false;
        }
        
        const timeoutId = setTimeout(positionAndShowButtons, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'p') {
                const mainVideo = mainVideoRefs.current[currentIndex];
                const reflectionVideo = reflectionVideoRefs.current[currentIndex];
                if (isPlaying) {
                    mainVideo?.pause();
                    reflectionVideo?.pause();
                    console.log("Video paused by 'p' key.");
                } else {
                    mainVideo?.play().catch(e => console.error("Error playing main video with 'p' key:", e));
                    reflectionVideo?.play().catch(e => console.error("Error playing reflection video with 'p' key:", e));
                    console.log("Video resumed by 'p' key.");
                }
                setIsPlaying(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, isPlaying]);

    const goToPrevious = useCallback(() => {
        setCarouselRotation(prevRotation => prevRotation + rotationAngle);
    }, [rotationAngle]);

    const goToNext = useCallback(() => {
        setCarouselRotation(prevRotation => prevRotation - rotationAngle);
    }, [rotationAngle]);

    useEffect(() => {
        if (isAutoplayActive) {
            const interval = setInterval(goToNext, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoplayActive, goToNext]);

    return (
        <div
            className="relative -top-60"
            onMouseEnter={() => setAutoplayActive(false)}
            onMouseLeave={() => setAutoplayActive(true)}
        >
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="video-shape-main" clipPathUnits="objectBoundingBox">
                        <path d="M0,0.1 Q0.5,0.2 1,0.1 L1,0.9 Q0.5,0.8 0,0.9 Z" />
                    </clipPath>
                    <clipPath id="video-shape-reflection" clipPathUnits="objectBoundingBox">
                        <path d="M0,0.1 Q0.5,0 1,0.1 L1,0.9 Q0.5,1.0 0,0.9 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div 

                className="absolute top-[250px] left-1/2 -translate-x-1/2 w-full max-w-5xl"

                style={{ 

                    height: `${SLIDER_SIZE}vh`,

                    perspective: `${PERSPECTIVE}px`,

                    transition: 'height 0.5s ease-in-out',

                }}>
                {/* Carousel container */}
                <div
                    className="relative w-full h-full transition-transform duration-1000 ease-in-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${carouselRotation}deg)`,
                    }}
                >
                    {videos.map((videoUrl, index) => {
                        const isActive = index === currentIndex;
                        const slideRotation = index * rotationAngle;
                        const slideTransform = `rotateY(${slideRotation}deg) translateZ(${(SLIDER_SIZE / 40) * 35}vw)`; 
                        const isLoaded = loadedIndices.has(index);

                        return (
                            <div
                                key={videoUrl}
                                className="absolute top-0 left-0 w-full h-full transition-opacity duration-700"
                                style={{
                                    transform: slideTransform,
                                    opacity: isActive ? 1 : 0.4,
                                }}
                            >
                                <div
                                    className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-gpu [transform-style:preserve-3d] ${isActive ? '[transform:rotateX(8deg)] hover:[transform:rotateX(0deg)]' : '[transform:rotateX(8deg)]'}`}
                                >
                                    <div className="relative w-full">
                                        {/* Main Video */}
                                        <div
                                            className="relative w-full aspect-video shadow-2xl shadow-cyan-500/30 border border-slate-700"
                                            style={{ clipPath: 'url(#video-shape-main)' }}
                                        >
                                            <video
                                                ref={el => { mainVideoRefs.current[index] = el; }}
                                                src={isLoaded ? videoUrl : undefined}
                                                className="w-full h-full object-cover"
                                                loop
                                                muted
                                                playsInline
                                                onCanPlay={() => {
                                                    if (isActive && isPlaying) {
                                                        mainVideoRefs.current[index]?.play().catch(() => {});
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/10"></div>
                                        </div>

                                        {/* Reflection */}
                                        <div 
                                            className="absolute top-[80%] left-0 w-full h-full [transform:scaleY(-1)]"
                                            style={{
                                                opacity: INTENSITY,
                                                WebkitMaskImage: `linear-gradient(to top, black 0%, transparent ${FADE}%)`,
                                                maskImage: `linear-gradient(to top, black 0%, transparent ${FADE}%)`,
                                            }}
                                        >
                                            <div
                                                className="relative w-full h-full aspect-video"
                                                style={{ clipPath: 'url(#video-shape-reflection)' }}
                                            >
                                                <video
                                                    ref={el => { reflectionVideoRefs.current[index] = el; }}
                                                    src={isLoaded ? videoUrl : undefined}
                                                    className="w-full h-full object-cover relative top-[4rem]"
                                                    style={{ filter: `blur(${BLUR}px)` }}
                                                    loop
                                                    muted
                                                    playsInline
                                                    onCanPlay={() => {
                                                        if (isActive && isPlaying) {
                                                            reflectionVideoRefs.current[index]?.play().catch(() => {});
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
                onClick={goToPrevious}
                aria-label="Previous slide"
                className={`fixed left-0 top-1/3 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-opacity duration-300 ${buttonsVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>            <button
                onClick={goToNext}
                aria-label="Next slide"
                className={`fixed right-0 top-1/3 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-opacity duration-300 ${buttonsVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default VideoSlider;
