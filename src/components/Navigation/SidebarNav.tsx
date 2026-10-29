'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  FolderKanban,
  Building2,
  GraduationCap,
  BookOpen,
  Trophy,
  Video,
  Cpu,
  Mail,
  ArrowUp,
  PanelRightClose,
  PanelRightOpen,
  Compass,
  X,
  Newspaper,
  Sparkles,
} from 'lucide-react'

interface NavSection {
  id: string
  label: string
  shortLabel: string
  number: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Introduction', shortLabel: 'Intro', number: '01', icon: Home },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', number: '02', icon: FolderKanban, badge: 'Code' },
  { id: 'experience', label: 'Experience', shortLabel: 'Experience', number: '03', icon: Building2 },
  { id: 'education', label: 'Education', shortLabel: 'Education', number: '04', icon: GraduationCap },
  { id: 'publications', label: 'Publications', shortLabel: 'Papers', number: '05', icon: BookOpen, badge: 'Research' },
  { id: 'achievements', label: 'Achievements', shortLabel: 'Awards', number: '06', icon: Trophy },
  { id: 'videos', label: 'Videos', shortLabel: 'Videos', number: '07', icon: Video },
  { id: 'skills', label: 'Skills & Services', shortLabel: 'Skills', number: '08', icon: Cpu },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact', number: '09', icon: Mail },
]

export default function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)

  // Load user expanded preference from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar_expanded')
      if (saved !== null) {
        setIsExpanded(saved === 'true')
      }
    } catch {
      // ignore
    }
  }, [])

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      const next = !prev
      try {
        localStorage.setItem('sidebar_expanded', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Track overall scroll progress & back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) return
      const currentScroll = window.scrollY
      const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100))
      setScrollProgress(progress)
      setShowBackToTop(currentScroll > 400)

      // Edge case: near top or bottom
      if (pathname === '/') {
        if (currentScroll < 120) {
          setActiveSection('hero')
        } else if (currentScroll + window.innerHeight >= document.documentElement.scrollHeight - 80) {
          setActiveSection('contact')
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Active section tracking using IntersectionObserver
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75],
      }
    )

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [pathname])

  const scrollToSection = (id: string) => {
    if (pathname === '/') {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', `#${id}`)
        setActiveSection(id)
      }
    } else {
      router.push(`/#${id}`)
    }
    setIsMobileOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (pathname === '/') {
      window.history.pushState(null, '', '/')
      setActiveSection('hero')
    }
  }

  // Circumference for circular progress indicator (r = 14)
  const circleRadius = 14
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP & TABLET FLOATING ELEGANT SIDEBAR DOCK               */}
      {/* ============================================================== */}
      <aside
        aria-label="Sidebar Quick Navigation"
        className="hidden md:block fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto select-none"
      >
        <div
          className={`relative flex flex-col bg-secondary/85 backdrop-blur-2xl border border-white/10 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-[width,padding,border-radius] duration-300 ease-in-out overflow-hidden ${
            isExpanded
              ? 'w-60 rounded-3xl p-3'
              : 'w-[3.35rem] rounded-full p-1.5 py-2.5'
          }`}
        >
          {/* Subtle Ambient Accent Glow behind dock */}
          <div className="absolute inset-0 -z-10 rounded-full bg-accent/5 blur-xl pointer-events-none" />

          {/* Dock Header: Title + Expand/Collapse Button */}
          <div className="flex items-center justify-between w-full h-8 px-1 mb-1">
            <div
              className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-w-[140px] opacity-100 pl-1' : 'max-w-0 opacity-0 pl-0 pointer-events-none'
              }`}
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-neutral uppercase">
                Navigate
              </span>
            </div>

            <button
              onClick={toggleExpanded}
              aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              className="size-8 mx-auto flex-shrink-0 flex items-center justify-center text-primary-content hover:text-accent hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? (
                <PanelRightClose className="size-4" />
              ) : (
                <PanelRightOpen className="size-4" />
              )}
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="flex flex-col gap-1 w-full">
            {NAV_SECTIONS.map(({ id, label, shortLabel, number, icon: Icon, badge }) => {
              const isActive = activeSection === id && pathname === '/'

              return (
                <div key={id} className="relative group w-full">
                  <button
                    onClick={() => scrollToSection(id)}
                    aria-label={`Jump to ${label}`}
                    className={`relative w-full h-10 flex items-center rounded-xl transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? isExpanded
                          ? 'bg-accent/15 text-accent border border-accent/30 shadow-[0_0_15px_rgba(24,242,229,0.15)] font-semibold'
                          : 'bg-accent text-primary shadow-[0_0_16px_rgba(24,242,229,0.55)]'
                        : 'text-primary-content hover:text-neutral hover:bg-white/5'
                    }`}
                  >
                    {/* Fixed Icon container - stays steady at left during transition */}
                    <div className="size-10 flex-shrink-0 flex items-center justify-center">
                      <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                    </div>

                    {/* Smoothly expanding label container with overflow-hidden & max-w transition */}
                    <div
                      className={`flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-3 ${
                        isExpanded
                          ? 'max-w-[170px] opacity-100'
                          : 'max-w-0 opacity-0 pointer-events-none'
                      }`}
                    >
                      <span className="text-xs truncate font-medium">{shortLabel}</span>
                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        {badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                            {badge}
                          </span>
                        )}
                        <span className="text-[10px] font-mono opacity-50">
                          {number}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Compact Mode Floating Tooltip on Hover */}
                  {!isExpanded && (
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/95 text-neutral text-xs font-mono font-medium shadow-xl border border-white/15 backdrop-blur-xl">
                        <span className="text-accent font-bold">{number}</span>
                        <span>{label}</span>
                        {badge && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-accent/20 text-accent font-sans">
                            {badge}
                          </span>
                        )}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-[1px] border-4 border-transparent border-l-secondary/95" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Divider with steady full width */}
          <div className="w-full my-1.5 px-1">
            <div className="w-full h-px bg-border/40" />
          </div>

          {/* Quick Blog Link */}
          <div className="relative group w-full">
            <Link
              href="/blog"
              aria-label="Go to Technical Blog"
              className={`relative w-full h-10 flex items-center rounded-xl transition-all duration-300 cursor-pointer group ${
                pathname.startsWith('/blog')
                  ? isExpanded
                    ? 'bg-accent/15 text-accent border border-accent/30 font-semibold'
                    : 'bg-accent text-primary shadow-[0_0_16px_rgba(24,242,229,0.55)]'
                  : 'text-primary-content hover:text-neutral hover:bg-white/5'
              }`}
            >
              <div className="size-10 flex-shrink-0 flex items-center justify-center">
                <Newspaper className="size-4 transition-transform duration-200 group-hover:scale-110" />
              </div>

              <div
                className={`flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-3 ${
                  isExpanded
                    ? 'max-w-[170px] opacity-100'
                    : 'max-w-0 opacity-0 pointer-events-none'
                }`}
              >
                <span className="text-xs truncate font-medium">Tech Blog</span>
                <Sparkles className="size-3 text-accent animate-pulse flex-shrink-0 ml-2" />
              </div>
            </Link>

            {!isExpanded && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/95 text-neutral text-xs font-mono font-medium shadow-xl border border-white/15 backdrop-blur-xl">
                  <Sparkles className="size-3 text-accent" />
                  <span>Technical Blog</span>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-[1px] border-4 border-transparent border-l-secondary/95" />
                </div>
              </div>
            )}
          </div>

          {/* Footer: Circular Progress & Back to Top */}
          <div className="flex items-center justify-between w-full pt-1">
            <div
              className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pl-2 ${
                isExpanded ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
              }`}
            >
              <span className="text-[9px] font-mono text-primary-content/60 uppercase tracking-wider">
                Page Read
              </span>
              <span className="text-xs font-mono font-bold text-accent">
                {Math.round(scrollProgress)}%
              </span>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className={`relative size-10 mx-auto flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                showBackToTop
                  ? 'opacity-100 scale-100 hover:scale-110 text-accent'
                  : 'opacity-40 hover:opacity-80 text-primary-content'
              }`}
              title="Back to Top"
            >
              <svg className="size-8 -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r={circleRadius}
                  className="stroke-white/10 fill-none"
                  strokeWidth="2.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r={circleRadius}
                  className="stroke-accent fill-none transition-all duration-150"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              <ArrowUp className="size-3.5 absolute inset-0 m-auto" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE FLOATING QUICK-NAV TRIGGER & SLIDE-OVER SHEET           */}
      {/* ============================================================== */}
      <div className="md:hidden">
        {/* Floating Trigger Pill on Mobile */}
        <button
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open Section Navigation"
          className={`fixed bottom-6 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-secondary/90 text-neutral border border-white/15 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer ${
            scrollProgress > 3 ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-0'
          }`}
        >
          <Compass className="size-4 text-accent animate-spin-slow" />
          <span className="text-xs font-mono font-bold tracking-wide">
            {pathname === '/'
              ? NAV_SECTIONS.find((s) => s.id === activeSection)?.shortLabel || 'Sections'
              : 'Sections'}
          </span>
          <span className="text-[10px] font-mono text-accent pl-1 border-l border-white/20">
            {Math.round(scrollProgress)}%
          </span>
        </button>

        {/* Mobile Slide-Over Backdrop */}
        {isMobileOpen && (
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
          />
        )}

        {/* Mobile Slide-Over Drawer Sheet */}
        <div
          className={`fixed bottom-0 inset-x-0 z-50 bg-secondary/95 backdrop-blur-2xl border-t border-white/15 rounded-t-3xl shadow-2xl p-5 transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto ${
            isMobileOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-accent" />
              <span className="text-sm font-mono font-bold text-neutral">
                Quick Navigation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-accent">
                {Math.round(scrollProgress)}% read
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close navigation"
                className="p-1 rounded-full text-primary-content hover:text-neutral hover:bg-white/10 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Section Grid Links */}
          <div className="grid grid-cols-2 gap-2 my-2">
            {NAV_SECTIONS.map(({ id, shortLabel, number, icon: Icon, badge }) => {
              const isActive = activeSection === id && pathname === '/'
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-accent/20 border-accent text-accent font-semibold'
                      : 'bg-primary/50 border-border/40 text-primary-content hover:text-neutral hover:bg-white/5'
                  }`}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs truncate font-medium">{shortLabel}</span>
                      <span className="text-[10px] font-mono opacity-60">{number}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Extra Quick Links */}
          <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between">
            <Link
              href="/blog"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/60 border border-border/40 text-xs text-neutral hover:text-accent font-mono"
            >
              <Newspaper className="size-3.5 text-accent" />
              <span>Technical Blog</span>
            </Link>

            <button
              onClick={() => {
                scrollToTop()
                setIsMobileOpen(false)
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-primary font-bold text-xs font-mono shadow-md"
            >
              <ArrowUp className="size-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
