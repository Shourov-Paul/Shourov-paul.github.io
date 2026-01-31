'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BurgerIcon, CloseIcon } from '../../utils/icons'
import Logo from './Logo'

const navItems = [
  {
    label: 'HOME',
    href: '/',
  },
  {
    label: 'PROJECTS',
    href: '/#projects',
  },
  {
    label: 'SKILLS',
    href: '/#skills',
  },
  {
    label: 'CONTACT ME',
    href: '/#contact',
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
          <a href="/">
            <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300 md:static">
              <Logo />
              <span className="text-primary-content hover:text-accent cursor-pointer text-lg font-bold transition-colors duration-300">
                SHOUROV PAUL
              </span>
            </div>
          </a>
        )}

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isVisible ? (
              <CloseIcon className="text-primary-content" />
            ) : (
              <BurgerIcon className="text-primary-content" />
            )}
          </button>
        </div>

        <ul
          className={`${isVisible ? 'flex' : 'hidden'} animate-fade-in bg-primary absolute top-16 left-0 z-10 h-dvh w-dvw flex-col md:static md:top-0 md:flex md:h-full md:w-[72%] md:flex-row lg:w-[70%]`}>
          {navItems.map(({ label, href }) => (
            <li
              key={href}
              onClick={() => setIsVisible(false)}
              className="border-border flex items-center border-b px-4 text-2xl md:border-y-0 md:border-e md:text-base md:first:border-s md:last:ml-auto md:last:border-none md:last:px-0 lg:px-8">
              <Link
                href={href}
                className={`text-primary-content hover:text-neutral w-full py-7 transition-all duration-150 md:py-0 ${pathname === href ? 'text-neutral cursor-text' : ''}`}>
                {label}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-center border-border border-b px-4 py-7 md:ml-auto md:border-none md:py-0 md:pl-8">
            <ThemeMenu />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
