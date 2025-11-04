'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface PawLoaderProps {
  isLoading?: boolean;
  isInitialLoad?: boolean;
}

export const PawLoader = ({ isLoading = true, isInitialLoad = true }: PawLoaderProps) => {
  const pathRef = useRef<(SVGPathElement | null)[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) return;

    const paths = pathRef.current.filter(Boolean);
    if (paths.length === 0) return;

    // Reset all paths
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length.toString();
      path.style.strokeDashoffset = length.toString();
    });

    // Create animation timeline
    const tl = anime.timeline({
      easing: 'easeInOutSine',
      duration: 800,
      loop: !isInitialLoad,
      autoplay: true,
    });

    // Animate each path with a slight delay
    paths.forEach((path, i) => {
      const length = path.getTotalLength();

      tl.add({
        targets: path,
        strokeDashoffset: [anime.setDashoffset, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: i * 200,
        easing: 'easeInOutSine',
      });
    });

    // Add pulsing effect after drawing
    if (isInitialLoad) {
      tl.add({
        targets: '.paw-print',
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        duration: 1500,
        easing: 'easeInOutQuad',
        complete: () => {
          if (loaderRef.current) {
            anime({
              targets: loaderRef.current,
              opacity: 0,
              duration: 500,
              easing: 'easeInOutQuad',
              complete: () => {
                if (loaderRef.current) {
                  loaderRef.current.style.display = 'none';
                }
              },
            });
          }
        },
      });
    }

    return () => {
      tl.pause();
    };
  }, [isLoading, isInitialLoad]);

  if (!isLoading) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="relative w-32 h-32">
        <svg
          className="paw-print w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Paw Pad */}
          <path
            ref={el => pathRef.current[0] = el}
            d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />

          {/* Toe Pads */}
          <path
            ref={el => pathRef.current[1] = el}
            d="M60 70C60 70 45 55 30 65C15 75 25 95 25 95"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary"
          />
          <path
            ref={el => pathRef.current[2] = el}
            d="M80 50C80 50 90 30 110 30C130 30 140 45 140 45"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary"
          />
          <path
            ref={el => pathRef.current[3] = el}
            d="M140 70C140 70 155 55 170 65C185 75 175 95 175 95"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary"
          />
          <path
            ref={el => pathRef.current[4] = el}
            d="M100 60C100 60 95 30 75 30C55 30 55 50 55 50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary"
          />
          <path
            ref={el => pathRef.current[5] = el}
            d="M100 60C100 60 105 30 125 30C145 30 145 50 145 50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>

        {!isInitialLoad && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};
