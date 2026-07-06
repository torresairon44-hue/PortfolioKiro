"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig, navLinks } from "@/lib/constants";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-50 w-full h-24 flex items-center justify-between px-6 md:px-12 lg:px-[60px] py-6",
        className
      )}
    >
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-red focus:text-neutral-black focus:rounded-[var(--radius-full)] font-body font-bold text-sm"
      >
        Skip to content
      </a>

      {/* Logo */}
      <Link
        href="/"
        className="font-display text-[32px] leading-[1.5] tracking-[-0.32px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
      >
        {siteConfig.logo}
      </Link>

      {/* Desktop Navigation */}
      <nav aria-label="Main navigation" className="hidden lg:block">
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-nav font-medium text-[16px] leading-[1.5] tracking-[-0.48px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden flex flex-col gap-1.5 items-center justify-center size-10"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
      >
        <span
          className={cn(
            "block w-6 h-0.5 bg-neutral-offwhite transition-transform duration-200",
            mobileMenuOpen && "translate-y-2 rotate-45"
          )}
        />
        <span
          className={cn(
            "block w-6 h-0.5 bg-neutral-offwhite transition-opacity duration-200",
            mobileMenuOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "block w-6 h-0.5 bg-neutral-offwhite transition-transform duration-200",
            mobileMenuOpen && "-translate-y-2 -rotate-45"
          )}
        />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute top-24 left-0 right-0 z-50 bg-neutral-black border-b border-neutral-dark-gray px-6 py-8 lg:hidden"
        >
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-nav font-medium text-[18px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
