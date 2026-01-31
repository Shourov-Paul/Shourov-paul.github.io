'use client'

import { themes } from '@/appData'
import useOutsideClick from '@/hooks/useOutsideClick'
import { CheckIcon, CloseIcon } from '@/utils/icons'
import { useEffect, useState } from 'react'

const ThemeMenu = () => {
  const [theme, setTheme] = useState('dark')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const menuRef = useOutsideClick(() => setShowThemeMenu(false))

  useEffect(() => {
    if (window) setTheme(localStorage.getItem('theme') ?? theme)
  }, [])

  useEffect(() => {
    if (window) document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const changeTheme = (theme: string) => {
    if (window) {
      setTheme(theme)
      localStorage.setItem('theme', theme)
    }
  }

  return (
    <div ref={menuRef} className="relative z-50">
      <button
        onClick={() => setShowThemeMenu(!showThemeMenu)}
        className="grid cursor-pointer grid-cols-2 place-content-center gap-0.5 p-1 transition-transform hover:scale-110">
        <div className="size-[7px] rounded-t-full rounded-bl-full bg-[#B13753] md:size-[10px]"></div>
        <div className="size-[7px] rounded-t-full rounded-br-full bg-[#BAA32B] md:size-[10px]"></div>
        <div className="size-[7px] rounded-tl-full rounded-b-full bg-[#3178C6] md:size-[10px]"></div>
        <div className="size-[7px] rounded-tr-full rounded-b-full bg-[#50B359] md:size-[10px]"></div>
      </button>

      {showThemeMenu && (
        <div className="bg-secondary animate-fade-in border-border absolute right-0 top-full mt-4 space-y-3 rounded-xl border p-3 md:space-y-4 md:p-5">
          <div className="text-primary-content border-border flex items-center justify-between border-b pb-3 md:pb-4">
            <span className="text-sm md:text-base">SELECT THEME</span>
            <CloseIcon
              onClick={() => setShowThemeMenu(false)}
              className="h-3 w-3 cursor-pointer md:h-4 md:w-4"
            />
          </div>

          {themes.map(({ name, colors }) => (
            <div
              key={name}
              onClick={() => changeTheme(name.toLowerCase())}
              style={{ background: colors[0], color: colors[1] }}
              className="flex min-w-48 cursor-pointer items-center justify-between rounded-lg p-2 md:min-w-60 md:rounded-xl md:p-4">
              <div className="flex items-end gap-1.5">
                <CheckIcon className={name.toLowerCase() === theme ? 'block' : 'hidden'} />
                <span className="text-sm md:text-base">{name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {colors.slice(1).map((color, idx) => (
                  <div
                    key={color + idx}
                    style={{ background: color }}
                    className="size-2 rounded-full md:size-3"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeMenu
