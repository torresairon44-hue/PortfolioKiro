'use client'

import { useState, useEffect, useCallback } from 'react'
import { SpiralAnimation } from '@/components/ui/spiral-animation'

interface LoadingScreenProps {
  onEnter: () => void
}

// One full animation cycle is 15s (matches the GSAP timeline duration in spiral-animation.tsx)
const ANIMATION_DURATION_MS = 15000

const LoadingScreen = ({ onEnter }: LoadingScreenProps) => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const handleEnter = useCallback(() => {
    // Guard against double-calls
    if (exiting) return
    setExiting(true)
    setTimeout(() => {
      onEnter()
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 800)
  }, [exiting, onEnter])

  // Show the "Welcome" skip button after 2s
  useEffect(() => {
    const timer = setTimeout(() => setButtonVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-transition after one full animation cycle
  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter()
    }, ANIMATION_DURATION_MS)
    return () => clearTimeout(timer)
  }, [handleEnter])

  return (
    <div
      className={`fixed inset-0 z-[9999] w-full h-full overflow-hidden bg-black transition-opacity duration-700 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Spiral animation fills the entire screen */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      {/* Welcome skip button — fades in after 2s */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
          transition-all duration-[1500ms] ease-out
          ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <button
          onClick={handleEnter}
          className="text-white text-2xl tracking-[0.2em] uppercase font-extralight
            transition-all duration-700 hover:tracking-[0.3em] animate-pulse"
        >
          Welcome
        </button>
      </div>
    </div>
  )
}

export default LoadingScreen
