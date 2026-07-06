"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";
import { services } from "@/lib/constants";

interface ServiceShowcaseProps {
  className?: string;
}

const ServiceShowcase = ({ className }: ServiceShowcaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  const updateStyles = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    const totalItems = services.length;

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      // Each item gets its own slice of the progress
      const itemStart = index / (totalItems + 1);
      const itemEnd = (index + 1) / (totalItems + 1);
      const itemProgress = Math.min(
        Math.max((progress - itemStart) / (itemEnd - itemStart), 0),
        1
      );

      const easeOut = 1 - Math.pow(1 - itemProgress, 3);

      el.style.opacity = `${easeOut}`;
      el.style.transform = `translate3d(${(1 - easeOut) * 40}px, 0, 0)`;
    });
  }, []);

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
    <div ref={containerRef} className={cn("relative h-[400vh] bg-[radial-gradient(circle_at_center,#1A160E_0%,#0A0A0A_70%)]", className)}>
      {/* Subtle top fade transition from Globe light gray background #E2E8F0 to dark bronze */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#E2E8F0] to-transparent pointer-events-none z-10" />
      <section
        id="about"
        className="sticky top-0 h-screen flex items-center overflow-hidden px-6 md:px-12 lg:px-[108px]"
        aria-labelledby="services-heading"
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 w-full">
          {/* Left — Accent text + heading */}
          <div className="flex flex-col gap-2 lg:w-[400px] shrink-0">
            <span className="font-body font-medium text-[14px] uppercase tracking-[2px] text-accent-gold">
              What I Do
            </span>
            <h2
              id="services-heading"
              className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-none text-neutral-white"
            >
              Services &<br />Expertise
            </h2>
          </div>

          {/* Right — Service list revealed one by one */}
          <div className="flex flex-col flex-1">
            {services.map((service, index) => (
              <div
                key={service}
                ref={(el) => { itemRefs.current[index] = el; }}
                className="flex items-center justify-between py-5 border-b border-neutral-dark-gray will-change-[transform,opacity]"
                style={{ opacity: 0, transform: "translate3d(40px, 0, 0)" }}
              >
                <span className="font-body font-medium text-[18px] md:text-[20px] text-neutral-offwhite">
                  {service}
                </span>
                <span className="font-body text-[20px] text-accent-red">
                  ➤
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceShowcase;
