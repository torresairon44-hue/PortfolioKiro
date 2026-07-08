'use client'

import { useState, useEffect } from 'react'
import {
  Hero,
  FloatingSidebar,
  AboutSection,
  GlobeDemo,
  ServiceShowcase,
  PortfolioGrid,
  CertificatesSection,
  GithubSection,
  ContactFooter,
  ScrollReveal,
  HeroScrollDemo,
} from "@/components/sections";
import LoadingScreen from "@/components/sections/LoadingScreen";

function MainContent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="transition-opacity duration-1000 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <FloatingSidebar />
      <main id="main-content">
        <HeroScrollDemo />
        <Hero />
        <AboutSection />
        <GlobeDemo />
        <ServiceShowcase />
        <PortfolioGrid />
        <ScrollReveal height="200vh" direction="up" className="bg-[#0A0A0A]">
          <CertificatesSection className="bg-transparent" />
        </ScrollReveal>
        <ScrollReveal height="200vh" direction="up" className="bg-[#0A0A0A]">
          <GithubSection className="bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]" />
        </ScrollReveal>
        <ScrollReveal height="200vh" direction="up" className="bg-[#0A0A0A]" tall>
          <ContactFooter className="bg-gradient-to-b from-[#0A0A0A] via-[#140406] to-[#2B090C]" />
        </ScrollReveal>
      </main>
    </div>
  )
}

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return <LoadingScreen onEnter={() => setLoaded(true)} />
  }

  return <MainContent />
}
