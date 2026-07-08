"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/constants";
import { LinkedInIcon, GitHubIcon, InstagramIcon } from "@/components/icons";

const FloatingSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Desktop: vertical sidebar (md+) ── */}
      <aside
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-5"
        aria-label="Social links"
      >
        <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200">
          <LinkedInIcon />
        </a>
        <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200">
          <GitHubIcon />
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Resume" className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-[22px]">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
          </svg>
        </a>
        <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200 hover:scale-110">
          <InstagramIcon />
        </a>
        <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-[22px]">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>
      </aside>

      {/* ── Mobile: top bar + hamburger (< md) ── */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-5 h-14 bg-neutral-black/80 backdrop-blur-md border-b border-white/5">
        <span className="font-display text-[18px] tracking-wide text-neutral-white">
          {siteConfig.logo}
        </span>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          className="flex flex-col justify-center items-end gap-[5px] w-6 h-6"
        >
          <span className={`block h-px w-full bg-white transition-all duration-300 origin-right ${open ? "rotate-[-45deg] translate-y-[3px]" : ""}`} />
          <span className={`block h-px bg-white transition-all duration-300 ${open ? "w-0 opacity-0" : "w-2/3"}`} />
          <span className={`block h-px w-full bg-white transition-all duration-300 origin-right ${open ? "rotate-[45deg] -translate-y-[3px]" : ""}`} />
        </button>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <div
        className={`fixed top-14 left-0 right-0 z-40 md:hidden bg-neutral-black/95 backdrop-blur-xl border-b border-white/5 overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-5 py-3">
          {[
            { label: "Home", href: "/" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-body text-[15px] text-neutral-offwhite hover:text-white py-3 border-b border-white/5 last:border-none transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Social row */}
          <div className="flex gap-4 pt-4 pb-2">
            <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-neutral-dark-gray hover:text-white transition-colors"><LinkedInIcon /></a>
            <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-neutral-dark-gray hover:text-white transition-colors"><GitHubIcon /></a>
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-dark-gray hover:text-white transition-colors"><InstagramIcon /></a>
            <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="text-neutral-dark-gray hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-[20px]">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default FloatingSidebar;
