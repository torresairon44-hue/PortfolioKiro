"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface CTABannerProps {
  className?: string;
}

const CTABanner = ({ className }: CTABannerProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        className={cn(
          "px-6 md:px-12 lg:px-[108px] py-12 lg:py-16",
          className
        )}
        aria-label="Call to action"
      >
        <div className="rounded-[var(--radius-md)] bg-surface-dark p-8 md:p-12 lg:p-16 flex flex-col items-center text-center gap-6">
          <h2 className="font-display text-[36px] md:text-[48px] lg:text-[56px] leading-none text-neutral-white">
            Let&apos;s Work Together
          </h2>
          <p className="font-body font-normal italic text-[16px] md:text-[18px] leading-[1.5] text-neutral-offwhite max-w-[600px]">
            Available for web development, software projects, UI/UX work, and
            technical collaboration.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 px-10 py-4 bg-accent-red text-neutral-white font-body font-bold text-[16px] rounded-[var(--radius-full)] hover:bg-accent-red/90 transition-colors duration-200"
          >
            Get In Touch
          </button>
        </div>
      </section>

      {/* Modal with Visme contact form */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-black/85 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Contact form"
        >
          <div
            className="relative w-[95vw] h-[95vh] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-neutral-black/60 text-neutral-white hover:bg-neutral-black transition-colors duration-200"
              aria-label="Close contact form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <iframe
              src="https://forms.visme.co/fv/p9nm70vw-q007qvd"
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              allowFullScreen
              title="Contact form"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CTABanner;
