'use client'

import React, { useEffect, useState, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  emoji: string
}

const PIKACHU_CLICK_PROMPTS = [
  'Pika pika! Click me! ⚡',
  'Pikachu says view this! 💛',
  'Thunder shock! Open this~ ⚡',
  'Pika! So cool! ✨',
  'Click to see, pika! 🐾',
  'Pikachu is excited! 😻',
  'Sparkling choice! ⚡',
  'Chuuu! Tap here! 💛',
]

const PIKACHU_FRAMES = [
  '/images/cursor/pikachu_frame_1.png',
  '/images/cursor/pikachu_frame_2.png',
  '/images/cursor/pikachu_frame_3.png',
]

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [speechText, setSpeechText] = useState('')
  const [particles, setParticles] = useState<Particle[]>([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)

  const mousePos = useRef({ x: -100, y: -100 })
  const pikaPos = useRef({ x: -100, y: -100 })
  const prevMouseX = useRef(0)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const animFrameId = useRef<number | null>(null)
  const particleId = useRef(0)

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

      // Check hovered elements for interactive feedback
      const target = e.target as HTMLElement | null
      if (!target) return

      const interactiveEl = target.closest<HTMLElement>(
        'a, button, input, textarea, select, summary, [role="button"], .cursor-pointer, [data-cursor-text], [data-cursor]'
      )

      if (interactiveEl) {
        if (!isHovered) {
          setIsHovered(true)
          const customPrompt = interactiveEl.getAttribute('data-cursor-text')
          if (customPrompt) {
            setSpeechText(customPrompt)
          } else {
            const randomPrompt = PIKACHU_CLICK_PROMPTS[Math.floor(Math.random() * PIKACHU_CLICK_PROMPTS.length)]
            setSpeechText(randomPrompt)
          }
        }
      } else {
        setIsHovered(false)
        setSpeechText('')
      }
    }

    const onMouseDown = (e: MouseEvent) => {
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
  }, [isVisible, isHovered])

  if (!isVisible) return null

  // Determine Pikachu active sprite
  const activeSprite = isHovered
    ? '/images/cursor/pikachu_pointer.png'
    : PIKACHU_FRAMES[currentFrameIndex]

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
        className="fixed top-0 left-0 flex flex-col items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        {/* Speech Bubble on Hover / Click / Idle */}
        {(isHovered || isClicked || isIdle) && (
          <div
            className={`absolute -top-11 px-3.5 py-1.5 rounded-2xl bg-amber-950/90 border border-amber-400/80 text-amber-300 text-xs font-bold font-mono shadow-[0_0_15px_rgba(251,191,36,0.3)] backdrop-blur-md transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 animate-bounce-short z-20 ${
              direction === 'left' ? '-translate-x-4' : 'translate-x-4'
            }`}
          >
            {isIdle ? (
              <span className="text-amber-200">zZZ Pika... 💤</span>
            ) : isClicked ? (
              <span className="text-amber-300 font-extrabold">Thunder Pounce! ⚡</span>
            ) : (
              <span>{speechText}</span>
            )}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-950 border-r border-b border-amber-400/80 rotate-45" />
          </div>
        )}

        {/* Animated Pokemon Smile Pikachu Image */}
        <div className="relative flex items-center justify-center">
          {/* Electric Aura Glow */}
          <div
            className={`absolute inset-0 rounded-full bg-amber-400/25 blur-md transition-opacity duration-300 ${
              isHovered ? 'opacity-100 scale-125' : 'opacity-40 scale-100'
            }`}
          />

          <img
            src={activeSprite}
            alt="Pokemon Smile Pikachu Cursor"
            style={{
              width: '52px',
              height: '52px',
              transform: `scaleX(${direction === 'left' ? -1 : 1}) scale(${
                isHovered ? 1.2 : isClicked ? 0.9 : 1
              })`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative z-10 object-contain drop-shadow-[0_4px_12px_rgba(234,179,8,0.6)] select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  )
}
