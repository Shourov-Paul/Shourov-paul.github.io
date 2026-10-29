'use client'

import React, { useEffect, useState, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  emoji: string
}

const PIKACHU_FRAMES = [
  '/images/cursor/pikachu_frame_1.webp',
  '/images/cursor/pikachu_frame_2.webp',
  '/images/cursor/pikachu_frame_3.webp',
]

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClickableHovered, setIsClickableHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [particles, setParticles] = useState<Particle[]>([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)

  const mousePos = useRef({ x: -100, y: -100 })
  const pikaPos = useRef({ x: -100, y: -100 })
  const prevMouseX = useRef(0)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const animFrameId = useRef<number | null>(null)
  const particleId = useRef(0)
  const isClickableRef = useRef(false)

  // Cycle animation frames for electric wiggling Pikachu
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % PIKACHU_FRAMES.length)
    }, 180)

    return () => clearInterval(frameInterval)
  }, [])

  useEffect(() => {
    // Hide cursor companion on touch devices / coarse pointers
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const resetIdleTimer = () => {
      setIsIdle(false)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setIsIdle(true)
      }, 3500)
    }

    const checkIsClickable = (el: HTMLElement | null): boolean => {
      if (!el) return false
      if (
        el.closest(
          'a, button, input, textarea, select, summary, label, [role="button"], [role="link"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], .cursor-pointer, [onclick], [data-cursor-clickable]'
        )
      ) {
        return true
      }
      let curr: HTMLElement | null = el
      let depth = 0
      while (curr && curr !== document.body && depth < 3) {
        try {
          if (window.getComputedStyle(curr).cursor === 'pointer') {
            return true
          }
        } catch {
          break
        }
        curr = curr.parentElement
        depth++
      }
      return false
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Direction flip check
      if (e.clientX > prevMouseX.current + 3) {
        setDirection('right')
        prevMouseX.current = e.clientX
      } else if (e.clientX < prevMouseX.current - 3) {
        setDirection('left')
        prevMouseX.current = e.clientX
      }

      resetIdleTimer()

      // Check if hovering over any clickable element
      const target = e.target as HTMLElement | null
      const clickable = checkIsClickable(target)
      isClickableRef.current = clickable
      setIsClickableHovered((prev) => (prev !== clickable ? clickable : prev))
    }

    const onMouseDown = (e: MouseEvent) => {
      if (isClickableRef.current) return

      setIsClicked(true)

      const emojis = ['⚡', '💛', '✨', '🐾', '🔴', '⭐']
      const emoji = emojis[Math.floor(Math.random() * emojis.length)]
      const newParticle: Particle = {
        id: particleId.current++,
        x: e.clientX,
        y: e.clientY - 15,
        emoji,
      }

      setParticles((prev) => [...prev.slice(-10), newParticle])

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
      }, 1000)
    }

    const onMouseUp = () => setIsClicked(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.body.addEventListener('mouseleave', onMouseLeave)
    document.body.addEventListener('mouseenter', onMouseEnter)

    // Smooth lerp physics loop for Pikachu following cursor
    const render = () => {
      const ease = 0.2
      pikaPos.current.x += (mousePos.current.x - pikaPos.current.x) * ease
      pikaPos.current.y += (mousePos.current.y - pikaPos.current.y) * ease

      const pikaEl = document.getElementById('pikachu-cursor-container')
      if (pikaEl) {
        pikaEl.style.transform = `translate3d(${pikaPos.current.x}px, ${pikaPos.current.y}px, 0) translate(-50%, -50%)`
      }

      animFrameId.current = requestAnimationFrame(render)
    }

    animFrameId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.removeEventListener('mouseleave', onMouseLeave)
      document.body.removeEventListener('mouseenter', onMouseEnter)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Electric Sparkle Particles on Click */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed text-xl animate-float-fade font-bold select-none drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Pikachu Cursor Companion Container */}
      <div
        id="pikachu-cursor-container"
        className="fixed top-0 left-0 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        {/* Inner wrapper that slowly fades/shrinks away when hovering clickable elements */}
        <div
          className={`flex flex-col items-center justify-center transition-all duration-500 ease-out ${
            isClickableHovered
              ? 'opacity-0 scale-75 blur-[1px] pointer-events-none'
              : 'opacity-100 scale-100 blur-0'
          }`}
        >
          {/* Speech Bubble on Idle */}
          {!isClickableHovered && isIdle && (
            <div
              className={`absolute -top-11 px-3.5 py-1.5 rounded-2xl bg-amber-950/90 border border-amber-400/80 text-amber-300 text-xs font-bold font-mono shadow-[0_0_15px_rgba(251,191,36,0.3)] backdrop-blur-md transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 animate-bounce-short z-20 ${
                direction === 'left' ? '-translate-x-4' : 'translate-x-4'
              }`}
            >
              <span className="text-amber-200">zZZ Pika... 💤</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-950 border-r border-b border-amber-400/80 rotate-45" />
            </div>
          )}

          {/* Animated Pokemon Smile Pikachu Image */}
          <div className="relative flex items-center justify-center">
            {/* Electric Aura Glow */}
            <div
              className={`absolute inset-0 rounded-full bg-amber-400/25 blur-md transition-all duration-500 ${
                isClickableHovered ? 'opacity-0 scale-50' : 'opacity-40 scale-100'
              }`}
            />

            <img
              src={PIKACHU_FRAMES[currentFrameIndex]}
              alt="Pokemon Smile Pikachu Cursor"
              style={{
                width: '52px',
                height: '52px',
                transform: `scaleX(${direction === 'left' ? -1 : 1}) scale(${
                  isClicked ? 0.9 : 1
                })`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative z-10 object-contain drop-shadow-[0_4px_12px_rgba(234,179,8,0.6)] select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
