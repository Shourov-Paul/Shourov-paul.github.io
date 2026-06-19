'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BurgerIcon, CloseIcon } from '../../utils/icons'
import Logo from './Logo'

const navItems = [
  {
    label: 'PROJECTS',
    href: '/projects',
  },
  {
    label: 'EXPERIENCE',
    href: '/experience',
  },
  {
    label: 'PUBLICATIONS',
    href: '/publications',
  },
  {
    label: 'ACHIEVEMENTS',
    href: '/achievements',
  },
  {
    label: 'BLOG',
    href: '/blog',
  },
  {
    label: 'CONTACT ME',
    href: '/contact',
  },
]

import ScrollProgress from '../ScrollProgress/ScrollProgress'

import ThemeMenu from '../Theme/ThemeMenu'

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsVisible(!isVisible)
  }

  return (
    <nav className="bg-primary border-border relative h-16 border-b">
      <ScrollProgress />
      <div className="mx-auto flex h-full w-dvw max-w-[1200px] items-center justify-between px-4 py-1">
        {isVisible ? (
          <div className="text-primary-content md:hidden">MENU</div>
        ) : (
          <a href="/" className="flex-shrink-0">
            <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300 md:static">
              <Logo />
              <span className="text-primary-content hover:text-accent cursor-pointer text-lg font-bold transition-colors duration-300 whitespace-nowrap select-none">
                SHOUROV PAUL
              </span>
            </div>
          </a>
        )}

        <div className="flex items-center gap-4 md:hidden">
          <ThemeMenu />
          <button onClick={toggleMenu} aria-label={isVisible ? 'Close menu' : 'Open menu'}>
            {isVisible ? (
              <CloseIcon className="text-primary-content" />
            ) : (
              <BurgerIcon className="text-primary-content" />
            )}
          </button>
        </div>

        <ul
          className={`${isVisible ? 'flex' : 'hidden'} animate-fade-in bg-primary absolute top-16 left-0 z-10 h-dvh w-dvw flex-col md:static md:top-0 md:flex md:h-full md:flex-row md:justify-end md:flex-1`}>
          {navItems.map(({ label, href }) => {
            return (
              <li
                key={href}
                onClick={() => setIsVisible(false)}
                className="border-border flex items-center border-b px-2 text-2xl md:border-y-0 md:border-e md:text-sm md:first:border-s lg:px-3 flex-shrink-0 whitespace-nowrap">
                <Link
                  href={href}
                  className={`text-primary-content hover:text-neutral w-full py-4 transition-all duration-150 md:py-0 ${pathname === href ? 'text-neutral' : ''}`}>
                  {label}
                </Link>
              </li>
            )
          })}
          <li className="hidden border-border border-b px-2 py-4 md:flex md:items-center md:justify-center md:border-none md:py-0 md:pl-3 flex-shrink-0 whitespace-nowrap">
            <ThemeMenu />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
