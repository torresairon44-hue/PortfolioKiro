"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface ContactSectionProps {
  className?: string;
}

const ContactSection = ({ className }: ContactSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className={cn(
          "px-6 md:px-12 lg:px-[108px] py-16 lg:py-20",
          className
        )}
      >
        {/* Section Label */}
        <p className="font-body font-medium text-[14px] uppercase tracking-[2px] text-accent-purple mb-4">
          Contact
        </p>

        {/* Section Title */}
        <h2
          id="contact-heading"
          className="font-display text-[40px] md:text-[56px] lg:text-[76px] leading-none text-neutral-white mb-12"
        >
          Get In Touch
        </h2>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left — Contact Details */}
          <div className="flex flex-col gap-8 flex-1">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="font-body font-medium text-[14px] uppercase tracking-[1px] text-neutral-dark-gray">
                Email
              </span>
              <a
                href="mailto:torresairon44@gmail.com"
                className="font-body font-normal text-[18px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
              >
                torresairon44@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <span className="font-body font-medium text-[14px] uppercase tracking-[1px] text-neutral-dark-gray">
                Phone
              </span>
              <a
                href="tel:+639300092838"
                className="font-body font-normal text-[18px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
              >
                +63 930 009 2838
              </a>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <span className="font-body font-medium text-[14px] uppercase tracking-[1px] text-neutral-dark-gray">
                Location
              </span>
              <p className="font-body font-normal text-[18px] text-neutral-offwhite">
                Manila, Philippines
              </p>
            </div>
          </div>

          {/* Right — CTA Card */}
          <div className="flex-1 bg-surface-dark rounded-[var(--radius-md)] p-8 md:p-10 flex flex-col gap-6">
            <h3 className="font-display text-[32px] md:text-[40px] leading-none text-neutral-white">
              Ready to Build
            </h3>
            <p className="font-body font-normal text-[16px] md:text-[18px] leading-[1.5] text-neutral-offwhite">
              Available for web development, software projects, UI/UX work, or
              technical collaboration.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="self-start px-8 py-4 bg-accent-purple text-neutral-black font-body font-bold text-[16px] rounded-[var(--radius-full)] hover:opacity-90 transition-opacity duration-200"
            >
              Email Me
            </button>
          </div>
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
            {/* Close button */}
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

            {/* Visme iframe */}
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

export default ContactSection;
