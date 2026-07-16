"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig, navLinks, services, contactFormUrl } from "@/lib/constants";
import { Mail, Phone, MapPin, X, Code2 } from "lucide-react";

/* ── Inline brand SVGs (lucide-react removed these in v0.400+) ── */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface ContactFooterProps {
  className?: string;
}

const socialLinks = [
  {
    icon: <GithubIcon className="w-5 h-5" />,
    href: siteConfig.socials.github,
    label: "GitHub",
  },
  {
    icon: <LinkedinIcon className="w-5 h-5" />,
    href: siteConfig.socials.linkedin,
    label: "LinkedIn",
  },
  {
    icon: <InstagramIcon className="w-5 h-5" />,
    href: siteConfig.socials.instagram,
    label: "Instagram",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    href: `mailto:${siteConfig.email}`,
    label: "Email",
  },
];


const ContactFooter = ({ className }: ContactFooterProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* ── CONTACT + FOOTER SECTION ── */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className={cn("relative w-full overflow-hidden bg-transparent", className)}
      >

        {/* ─── CONTACT HERO ─── */}
        <div className="relative">
          <div className="px-6 md:px-12 lg:px-[108px] pt-20 md:pt-28 pb-16 lg:pt-36 lg:pb-20">
            {/* Label */}
            <p className="font-body font-medium text-[13px] uppercase tracking-[3px] text-accent-red mb-5">
              Get In Touch
            </p>

            {/* Heading + CTA row */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
              <h2
                id="contact-heading"
                className="font-display text-[52px] md:text-[72px] lg:text-[96px] leading-none text-neutral-white max-w-3xl"
              >
                Let&apos;s Build
                <br />
                <span className="text-accent-red">Something.</span>
              </h2>

              {/* CTA card */}
              <div className="flex-shrink-0 bg-surface-dark border border-neutral-dark-gray/40 rounded-[var(--radius-md)] p-8 md:p-10 flex flex-col gap-4 max-w-sm w-full lg:w-auto">
                <p className="font-body text-[15px] leading-[1.6] text-neutral-offwhite">
                  Available for web development, software projects, UI/UX work,
                  and technical collaboration.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group relative overflow-hidden self-start px-8 py-3.5 bg-accent-red text-neutral-white font-body font-bold text-[14px] rounded-[var(--radius-full)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(158,31,38,0.5)]"
                >
                  <span className="relative z-10">Send a Message →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-red to-[#c0282f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>

            {/* Contact details row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-16 border-b border-neutral-dark-gray/30">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent-red mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-body font-medium text-[11px] uppercase tracking-[1.5px] text-neutral-dark-gray">
                    Email
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="font-body text-[14px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200 text-left bg-transparent border-none p-0 focus:outline-none"
                  >
                    {siteConfig.email}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent-red mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-body font-medium text-[11px] uppercase tracking-[1.5px] text-neutral-dark-gray">
                    Phone
                  </span>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="font-body text-[14px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-red mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-body font-medium text-[11px] uppercase tracking-[1.5px] text-neutral-dark-gray">
                    Location
                  </span>
                  <p className="font-body text-[14px] text-neutral-offwhite">
                    {siteConfig.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── FOOTER BODY ─── */}
          <div className="px-6 md:px-12 lg:px-[108px] py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Col 1 — Brand */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-neutral-white" />
                  </div>
                  <span className="font-display text-[22px] text-neutral-white tracking-wide">
                    {siteConfig.logo}
                  </span>
                </div>
                <p className="font-body text-[13px] leading-[1.7] text-neutral-dark-gray max-w-[220px]">
                  Full-stack developer & UI/UX enthusiast based in Manila,
                  building modern web experiences.
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {socialLinks.map((link) => {
                    const isEmail = link.label === "Email";
                    return isEmail ? (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => setModalOpen(true)}
                        aria-label={link.label}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-dark-gray/40 text-neutral-dark-gray hover:border-accent-red hover:text-accent-red transition-all duration-200 hover:scale-110 bg-transparent focus:outline-none"
                      >
                        {link.icon}
                      </button>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-dark-gray/40 text-neutral-dark-gray hover:border-accent-red hover:text-accent-red transition-all duration-200 hover:scale-110"
                      >
                        {link.icon}
                      </Link>
                    );
                  })}
                </div>
              </div>


              {/* Col 2 — Services */}
              <div className="flex flex-col gap-4">
                <h3 className="font-body font-bold text-[11px] uppercase tracking-[2px] text-neutral-white">
                  Services
                </h3>
                <ul className="flex flex-col gap-2">
                  {services.map((s) => (
                    <li
                      key={s.title}
                      className="font-body text-[13px] text-neutral-dark-gray hover:text-neutral-offwhite transition-colors duration-200 cursor-default"
                    >
                      {s.title}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 — Navigation */}
              <div className="flex flex-col gap-4">
                <h3 className="font-body font-bold text-[11px] uppercase tracking-[2px] text-neutral-white">
                  Navigation
                </h3>
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-body text-[13px] text-neutral-dark-gray hover:text-neutral-offwhite transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ─── BIG BACKGROUND NAME ─── */}
          <div
            className="select-none pointer-events-none text-center leading-none font-display tracking-tighter overflow-hidden px-4"
            style={{
              fontSize: "clamp(4rem, 14vw, 11rem)",
              background:
                "linear-gradient(180deg, rgba(72,72,72,0.18) 0%, rgba(72,72,72,0.05) 60%, transparent 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {siteConfig.logo}
          </div>

          {/* ─── Logo badge ─── */}
          <div className="flex justify-center pb-8 -mt-4 relative z-10">
            <div className="relative group">
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-accent-red/20 blur-xl group-hover:bg-accent-red/35 transition-all duration-500 scale-110" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-neutral-black border-2 border-neutral-dark-gray/50 group-hover:border-accent-red/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300">
                <Code2 className="w-8 h-8 md:w-10 md:h-10 text-accent-red drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* ─── Divider line ─── */}
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-dark-gray/40 to-transparent mx-6 md:mx-12 lg:mx-[108px]" />

          {/* ─── Copyright bar ─── */}
          <div className="px-6 md:px-12 lg:px-[108px] py-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-body text-[12px] text-neutral-dark-gray text-center md:text-left">
              {siteConfig.copyright}. All rights reserved.
            </p>
            <p className="font-body text-[12px] text-neutral-dark-gray text-center md:text-right">
              Designed & built by{" "}
              <span className="text-neutral-offwhite hover:text-accent-red transition-colors duration-200 cursor-default">
                {siteConfig.shortName}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Visme Form Modal — rendered via portal to escape sticky/transform context ─── */}
      {modalOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Contact form"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="fixed top-4 right-4 z-[200] size-11 flex items-center justify-center rounded-full bg-black text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-200"
            aria-label="Close contact form"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Privacy notice */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] bg-neutral-black/90 border border-neutral-dark-gray/50 rounded-xl px-4 py-2.5 text-center max-w-sm w-[90%]">
            <p className="font-body text-[11px] text-neutral-dark-gray leading-snug">
              This form is hosted by{" "}
              <a
                href="https://www.visme.co/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-offwhite underline underline-offset-2 hover:text-accent-red transition-colors"
              >
                Visme
              </a>
              . Submissions are processed on their servers under their privacy policy.
            </p>
          </div>

          <div className="animate-slide-up w-full h-full" onClick={() => setModalOpen(false)}>
            <iframe
              src={contactFormUrl}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              title="Contact form"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ContactFooter;
