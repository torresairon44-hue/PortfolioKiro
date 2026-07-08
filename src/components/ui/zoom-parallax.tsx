'use client';

import { useScroll, useTransform, motion, useMotionValueEvent, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Image {
  src: string;
  mobileSrc?: string;
  alt?: string;
  isVideo?: boolean;
}

interface ZoomParallaxProps {
  images: Image[];
}

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
              className={`absolute top-0 flex h-full w-full items-center justify-center
                ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''}
                ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''}
                ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''}
                ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''}
                ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''}
                ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''}
              `}
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
