"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { siteConfig, services } from "@/lib/constants";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:${siteConfig.email}?subject=Inquiry from ${email}`;
      setEmail("");
    }
  };

  return (
    <footer
      id="contact"
      className={cn(
        "px-6 md:px-12 lg:px-[108px] py-12 lg:py-16 border-t border-neutral-dark-gray",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {/* Column 1 — Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-body font-bold text-[14px] uppercase tracking-[2px] text-neutral-white">
            Services
          </h3>
          <ul className="flex flex-col gap-2">
            {services.slice(0, 4).map((service) => (
              <li
                key={service}
                className="font-body font-normal text-[14px] text-neutral-offwhite"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-body font-bold text-[14px] uppercase tracking-[2px] text-neutral-white">
            Contact
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-body font-normal text-[14px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="font-body font-normal text-[14px] text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="font-body font-normal text-[14px] text-neutral-offwhite">
              {siteConfig.location}
            </li>
          </ul>
        </div>

        {/* Column 3 — Quick Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-body font-bold text-[14px] uppercase tracking-[2px] text-neutral-white">
            Say Hello
          </h3>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-4 py-3 bg-surface-dark border border-neutral-dark-gray rounded-[var(--radius-sm)] font-body text-[14px] text-neutral-white placeholder:text-neutral-dark-gray focus:border-accent-red focus:outline-none transition-colors duration-200"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent-red text-neutral-white font-body font-bold text-[14px] rounded-[var(--radius-sm)] hover:bg-accent-red/90 transition-colors duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-neutral-dark-gray">
        <p className="font-body font-normal text-[13px] text-neutral-dark-gray text-center">
          {siteConfig.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
