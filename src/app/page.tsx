'use client'

import { useState, useEffect } from 'react'
import {
  Hero,
  FloatingSidebar,
  AboutSection,
  GlobeDemo,
  ServiceShowcase,
  PortfolioGrid,
  ContactFooter,
  ScrollReveal,
  HeroScrollDemo,
  GithubSection,
} from "@/components/sections";
import LoadingScreen from "@/components/sections/LoadingScreen";

function MainContent() {
  const [visible, setVisible] = useState(false)

  // Trigger fade-in on next frame so the transition actually plays
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
        <ScrollReveal height="150vh" direction="up" className="bg-gradient-to-b from-[#E2E8F0] via-[#F1F5F9] to-[#F8FAFC]">
          <GlobeDemo />
        </ScrollReveal>
        <ServiceShowcase />
        <PortfolioGrid />
        <ScrollReveal height="200vh" direction="up">
          <GithubSection />
        </ScrollReveal>
      </main>
      <ScrollReveal height="320vh" direction="up">
        <ContactFooter />
      </ScrollReveal>
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
