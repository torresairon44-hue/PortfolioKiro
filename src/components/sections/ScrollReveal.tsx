"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Height of the scroll container in viewport heights */
  height?: string;
  /** Direction content slides in from: left, right, or up */
  direction?: "left" | "right" | "up";
}

const ScrollReveal = ({
  children,
  className,
  height = "200vh",
  direction = "up",
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const getTransform = (progress: number) => {
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const distance = 60;

    switch (direction) {
      case "left":
        return `translate3d(${(1 - easeOut) * -distance}px, 0, 0)`;
      case "right":
        return `translate3d(${(1 - easeOut) * distance}px, 0, 0)`;
      case "up":
      default:
        return `translate3d(0, ${(1 - easeOut) * distance}px, 0)`;
    }
  };

  const updateStyles = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    contentRef.current.style.opacity = `${progress}`;
    contentRef.current.style.transform = getTransform(progress);
  }, [direction]);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateStyles);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateStyles();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateStyles]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height }}
    >
      <div className={cn("sticky top-0 min-h-screen flex items-center overflow-hidden", className)}>
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
