'use client';

import { useScroll, useTransform, motion, useMotionValueEvent, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// ─── Interface Segregation ────────────────────────────────────────────────────
// Split into two focused types so consumers don't have to pass irrelevant props.
// VideoImage: requires src + isVideo, mobileSrc is not applicable.
// StaticImage: requires src, mobileSrc is optional for responsive swapping.
// ZoomParallaxImage is the union — pass either shape.

export interface VideoImage {
  src: string;
  isVideo: true;
  alt?: string;
  mobileSrc?: never; // videos don't have a separate mobile source
}

export interface StaticImage {
  src: string;
  isVideo?: false;
  alt?: string;
  mobileSrc?: string; // optional portrait version for mobile
}

export type ZoomParallaxImage = VideoImage | StaticImage;

interface ZoomParallaxProps {
  images: ZoomParallaxImage[];
}

// ── Per-image layout overrides ─────────────────────────────────────────────
// Each entry maps to images[index]. Positions are expressed in vh/vw so they
// scale with the viewport. Index 0 (the center/base image) has no override.
const IMAGE_LAYOUTS: Record<number, string> = {
  1: "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]",
  2: "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]",
  3: "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]",
  4: "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]",
  5: "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]",
  6: "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]",
};

interface ScrollVideoProps {
  src: string;
  scrollYProgress: MotionValue<number>;
}

function ScrollVideo({ src, scrollYProgress }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<any>(null);

  useMotionValueEvent(scrollYProgress, "change", () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) video.play().catch(() => {});
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused) videoRef.current.pause();
      }, 150);
    }
  });

  return (
    <video
      ref={videoRef}
      src={src}
      preload="auto"
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  );
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Desktop: original scales unchanged
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Mobile gets more scroll room so zoom completes fully
  const containerHeight = isMobile ? '250vh' : '300vh';

  return (
    <div ref={container} style={{ position: 'relative', height: containerHeight }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: 10 }}>
        {images.map(({ src, mobileSrc, alt, isVideo }, index) => {
          const scale = scales[index % scales.length];
          // Use portrait image on mobile if available
          const activeSrc = (isMobile && !isVideo && mobileSrc) ? mobileSrc : src;

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${IMAGE_LAYOUTS[index] ?? ""}`}
            >
              <div className="relative h-[25vh] w-[25vw]">
                {isVideo ? (
                  <ScrollVideo src={activeSrc} scrollYProgress={scrollYProgress} />
                ) : (
                  <img
                    src={activeSrc || '/placeholder.svg'}
                    alt={alt || `Parallax image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
