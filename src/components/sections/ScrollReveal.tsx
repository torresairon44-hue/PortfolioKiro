"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/cn";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
  direction?: "left" | "right" | "up";
  mode?: "pin" | "fade";
  tall?: boolean;
}

const ScrollReveal = ({
  children,
  className,
  height = "200vh",
  direction = "up",
  mode = "pin",
  tall = false,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const getTransform = (progress: number) => {
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const distance = 40;
    switch (direction) {
      case "left":  return `translate3d(${(1 - easeOut) * -distance}px, 0, 0)`;
      case "right": return `translate3d(${(1 - easeOut) * distance}px, 0, 0)`;
      case "up":
      default:      return `translate3d(0, ${(1 - easeOut) * distance}px, 0)`;
    }
  };

  // ── PIN mode: scroll-progress drives opacity/transform (desktop only) ──
  const updatePin = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const rawProgress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
    const revealWindow = 0.2;
    const progress = Math.min(rawProgress / revealWindow, 1);
    contentRef.current.style.opacity = `${progress}`;
    contentRef.current.style.transform = getTransform(progress);
  }, [direction]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── FADE/MOBILE mode: IntersectionObserver reveal ──
  const setupFade = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.transition =
              "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
          } else {
            // Reset so it re-animates when scrolled back into view
            el.style.transition = "none";
            el.style.opacity = "0";
            el.style.transform = getTransform(0);
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [getTransform]);

  useEffect(() => {
    // On mobile always use fade/intersection — never sticky pinning
    if (mode === "fade" || isMobile) {
      return setupFade();
    }
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePin);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updatePin();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mode, isMobile, updatePin, setupFade]);

  // ── MOBILE render — no sticky, no extra height, just normal flow ──
  if (isMobile || mode === "fade") {
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        <div
          ref={contentRef}
          className="w-full will-change-[transform,opacity]"
          style={{ opacity: 0, transform: getTransform(0) }}
        >
          {children}
        </div>
      </div>
    );
  }

  // ── DESKTOP PIN mode ──
  return (
    <div ref={containerRef} className={cn("relative", className)} style={{ height }}>
      <div className={cn(
        "sticky top-0 flex items-start overflow-visible",
        tall ? "min-h-screen" : "h-screen",
        className
      )}>
        <div
          ref={contentRef}
          className="w-full will-change-[transform,opacity]"
          style={{ opacity: 0, transform: getTransform(0) }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollReveal;
