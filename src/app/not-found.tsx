'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-8"
      style={{ minHeight: 'calc(100dvh - 10rem)' }}
    >
      {/* ─── Background Grid ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(30,45,61,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,61,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
          opacity: 0.5,
        }}
      />

      {/* ─── Glow Orbs ─── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400,
          background: 'var(--a)',
          top: '10%', left: '-5%',
          filter: 'blur(100px)',
          opacity: 0.15,
          animation: 'orbFloat1 12s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 350, height: 350,
          background: '#5565e8',
          bottom: '10%', right: '-5%',
          filter: 'blur(100px)',
          opacity: 0.15,
          animation: 'orbFloat2 10s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200, height: 200,
          background: '#ffa800',
          top: '50%', left: '50%',
          filter: 'blur(100px)',
          opacity: 0.08,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* ─── Floating Particles ─── */}
      {[
        { top: '20%', left: '15%', delay: '0s' },
        { top: '60%', left: '80%', delay: '1s' },
        { top: '35%', left: '65%', delay: '2s' },
        { top: '75%', left: '25%', delay: '0.5s' },
        { top: '15%', left: '90%', delay: '3s' },
        { top: '85%', left: '55%', delay: '1.5s' },
        { top: '45%', left: '10%', delay: '2.5s' },
        { top: '55%', left: '45%', delay: '3.5s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3, height: 3,
            background: 'var(--a)',
            top: p.top, left: p.left,
            animation: 'particleFade 4s ease-in-out infinite',
            animationDelay: p.delay,
            opacity: 0,
          }}
        />
      ))}

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center text-center" style={{ maxWidth: 720 }}>



        {/* ─── Title ─── */}
        <h1
          className="text-neutral font-bold tracking-wider mb-3"
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <span className="text-accent">&lt;</span> Page Not Found{' '}
          <span className="text-accent">/&gt;</span>
        </h1>

        {/* ─── Subtitle ─── */}
        <p
          className="text-primary-content text-sm leading-relaxed mb-8 md:text-base"
          style={{
            maxWidth: 480,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.65s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.65s',
          }}
        >
          The page you&apos;re looking for has been moved, deleted, or possibly
          never existed. Let&apos;s get you back on track.
        </p>

        {/* ─── Code Block ─── */}
        <div
          className="bg-secondary border border-border rounded-lg p-5 text-left text-xs mb-10 w-full relative overflow-hidden md:text-sm"
          style={{
            maxWidth: 480,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
          }}
        >
          {/* Scan Line */}
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--a), transparent)',
              animation: 'scanLine 3s linear infinite',
            }}
          />

          <div style={{ margin: '0.2rem 0' }}>
            <span style={{ color: '#3b5068', marginRight: '1rem', userSelect: 'none' }}>1</span>
            <span style={{ color: '#3b5068', fontStyle: 'italic' }}>
              {'// attempting to resolve route...'}
            </span>
          </div>
          <div style={{ margin: '0.2rem 0' }}>
            <span style={{ color: '#3b5068', marginRight: '1rem', userSelect: 'none' }}>2</span>
            <span style={{ color: '#c792ea' }}>const</span>{' '}
            <span className="text-accent">page</span>{' '}
            <span style={{ color: '#7fdbca' }}>=</span>{' '}
            <span style={{ color: '#82aaff' }}>findRoute</span>
            <span style={{ color: '#7fdbca' }}>(</span>
            <span style={{ color: '#addb67' }}>&quot;/unknown&quot;</span>
            <span style={{ color: '#7fdbca' }}>);</span>
          </div>
          <div style={{ margin: '0.2rem 0' }}>
            <span style={{ color: '#3b5068', marginRight: '1rem', userSelect: 'none' }}>3</span>
            <span style={{ color: '#c792ea' }}>if</span>{' '}
            <span style={{ color: '#7fdbca' }}>(!</span>
            <span className="text-accent">page</span>
            <span style={{ color: '#7fdbca' }}>)</span>{' '}
            <span style={{ color: '#c792ea' }}>throw</span>{' '}
            <span style={{ color: '#c792ea' }}>new</span>{' '}
            <span style={{ color: '#82aaff' }}>Error</span>
            <span style={{ color: '#7fdbca' }}>(</span>
            <span style={{ color: '#addb67' }}>&quot;404&quot;</span>
            <span style={{ color: '#7fdbca' }}>);</span>
          </div>
          <div style={{ margin: '0.2rem 0' }}>
            <span style={{ color: '#3b5068', marginRight: '1rem', userSelect: 'none' }}>4</span>
            <span style={{ color: '#3b5068', fontStyle: 'italic' }}>
              {'// redirect → '}
              <Link
                href="/"
                style={{
                  color: '#82aaff',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                home
              </Link>
            </span>
            <span
              className="animate-blink inline-block"
              style={{
                width: 8,
                height: '1.1em',
                background: 'var(--a)',
                verticalAlign: 'text-bottom',
              }}
            />
          </div>
        </div>

        {/* ─── Buttons ─── */}
        <div
          className="flex flex-wrap gap-4 justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.95s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.95s',
          }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--a)',
              color: '#011627',
              borderColor: 'var(--a)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm transition-all duration-300 border border-border text-primary-content hover:border-accent hover:text-accent hover:-translate-y-0.5"
            style={{ backgroundColor: 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            View Projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm transition-all duration-300 border border-border text-primary-content hover:border-accent hover:text-accent hover:-translate-y-0.5"
            style={{ backgroundColor: 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact Me
          </Link>
        </div>
      </div>

      {/* ─── Keyframes ─── */}
      <style jsx global>{`
        @keyframes orbFloat1 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 30px); }
        }
        @keyframes orbFloat2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-30px, -40px); }
        }
        @keyframes scanLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes particleFade {
          0%, 100% { opacity: 0; transform: scale(0.5) translateY(0); }
          50% { opacity: 0.6; transform: scale(1.2) translateY(-20px); }
        }
      `}</style>
    </main>
  );
}
