"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { services } from "@/lib/constants";

interface ServiceShowcaseProps {
  className?: string;
}

const ServiceShowcase = ({ className }: ServiceShowcaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

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
    if (isMobile) {
      itemRefs.current.forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
      });
      return;
    }
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
  }, [isMobile, updateStyles]);

  // Mobile: plain scrollable layout
  if (isMobile) {
    return (
      <div className={cn("bg-[radial-gradient(circle_at_center,#1A160E_0%,#0A0A0A_70%)] px-6 py-16", className)}>
        <section id="about" aria-labelledby="services-heading">
          <span className="font-body font-medium text-[14px] uppercase tracking-[2px] text-accent-gold block mb-2">What I Do</span>
          <h2 id="services-heading" className="font-display text-[40px] leading-none text-neutral-white mb-8">Services &amp;<br />Expertise</h2>
          <div className="flex flex-col">
            {services.map((service, index) => (
              <div
                key={service.title}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex flex-col py-4 border-b border-neutral-dark-gray/40 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className={cn("font-body font-bold text-[15px]", expandedIndex === index ? "text-accent-gold" : "text-neutral-white")}>
                    {service.title}
                  </span>
                  <button type="button" className={cn("w-6 h-6 rounded-full border border-neutral-dark-gray/40 flex items-center justify-center text-[10px]", expandedIndex === index ? "bg-accent-gold border-accent-gold rotate-90 text-neutral-black" : "text-neutral-offwhite")} aria-expanded={expandedIndex === index}>➤</button>
                </div>
                <div className={cn("grid transition-all duration-300 ease-in-out overflow-hidden", expandedIndex === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden flex flex-col gap-2">
                    <p className="font-body font-semibold text-[11px] text-accent-red leading-relaxed">{service.subtitle}</p>
                    <p className="font-body text-[11px] text-neutral-offwhite/80 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative h-[400vh] md:h-[750vh] bg-[radial-gradient(circle_at_center,#1A160E_0%,#0A0A0A_70%)]", className)}>
      <section
        id="about"
        className="sticky top-0 min-h-screen py-16 md:py-24 flex items-center overflow-hidden px-6 md:px-12 lg:px-[108px]"
        aria-labelledby="services-heading"
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 w-full items-start">
          {/* Left — Accent text + heading */}
          <div className="flex flex-col gap-2 lg:w-[320px] shrink-0 lg:sticky lg:top-0">
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
          <div className="flex flex-col flex-1 w-full overflow-visible">
            {services.map((service, index) => (
              <div
                key={service.title}
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex flex-col py-4 border-b border-neutral-dark-gray/40 cursor-pointer group will-change-[transform,opacity] transition-all duration-300"
                style={{ opacity: 0, transform: "translate3d(40px, 0, 0)" }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={cn(
                    "font-body font-bold text-[14px] md:text-[16px] transition-colors duration-300",
                    expandedIndex === index ? "text-accent-gold" : "text-neutral-white group-hover:text-accent-gold"
                  )}>
                    {service.title}
                  </span>
                  <button
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-full border border-neutral-dark-gray/40 flex items-center justify-center transition-all duration-300 text-[10px]",
                      expandedIndex === index ? "bg-accent-gold border-accent-gold rotate-90 text-neutral-black" : "text-neutral-offwhite group-hover:border-accent-gold group-hover:text-accent-gold"
                    )}
                    aria-expanded={expandedIndex === index}
                    aria-label={`Toggle details for ${service.title}`}
                  >
                    ➤
                  </button>
                </div>

                {/* Expandable Description Details */}
                <div className={cn(
                  "grid transition-all duration-300 ease-in-out overflow-hidden",
                  expandedIndex === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden flex flex-col gap-2">
                    <p className="font-body font-semibold text-[11px] md:text-[12px] text-accent-red leading-relaxed">
                      {service.subtitle}
                    </p>
                    <p className="font-body font-normal text-[11px] md:text-[12px] text-neutral-offwhite/80 leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceShowcase;
