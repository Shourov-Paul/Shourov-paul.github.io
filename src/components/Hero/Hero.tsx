'use client'
import { useState } from 'react'
import useRoleSwitcher from '@/hooks/useRoleSwitcher'
import useRotatingAnimation from '@/hooks/useRotatingAnimation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Youtube,
  Facebook,
  GithubIcon,
  Instagram,
  LinkedIn,
  X,
} from '../../utils/icons'
import { HeroImage } from '../../utils/images'
import Ellipse from './Ellipse'
import AnalyticsMapModal from '../MapModal/AnalyticsMapModal'

const Hero = () => {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const ellipseRef = useRotatingAnimation()
  const role = useRoleSwitcher({ roles: ['ELECTRONICS engineer', 'PCB designer', 'ROBOTICS engineer', '3D model designer'] })

  return (
    <section className="bg-primary bg-small-glow bg-small-glow-position md:bg-large-glow-position lg:bg-large-glow min-h-[calc(dvh-4rem)] bg-no-repeat">
      <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-center gap-4 px-4 pt-4 pb-10 md:grid md:grid-cols-2 lg:p-4">
        <div className="flex min-h-48 flex-col justify-between lg:min-h-56 lg:max-w-[33.75rem]">
          <h1>
            <span className="text-neutral mb-2 block text-3xl font-bold">Hi - I'm SHOUROV PAUL</span>
            <span className="text-accent block text-[1.75rem] font-bold">{role}</span>
          </h1>

          <p className="text-neutral mt-3">
            Ambitious EEE student skilled in circuit design, signal processing, and programming, with strong expertise in Embedded Systems, PCB design, microcontroller programming, Simulation & Analysis, and Technical Drawing, seeking opportunities to contribute to innovative projects and continuous learning.
          </p>

          <div className="mt-6 flex flex-wrap gap-6">
            <a
              href="/CV/Shourov_Paul_Resume.pdf"
              download="Shourov_Paul_Resume.pdf"
              aria-label="Download CV"
              className="bg-accent w-[170px] cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium text-[#00071E] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              Download CV
            </a>
            <button
              onClick={() => setIsMapOpen(true)}
              aria-label="View Analytics Map"
              className="text-neutral bg-secondary min-w-[170px] cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
              </span>
              Views: 2,847
            </button>
          </div>

          <div className="mt-8 flex w-full max-w-[364px] items-center justify-between text-neutral">
            <Link href="https://github.com/Shourov-Paul" target="_blank" aria-label="GitHub Profile" className="hover:text-accent transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1">
              <GithubIcon className="size-6" />
            </Link>
            <Link href="https://www.linkedin.com/in/shourov-paul-b052a7259/" target="_blank" aria-label="LinkedIn Profile" className="hover:text-accent transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1">
              <LinkedIn className="size-6" />
            </Link>
            <Link href="https://www.youtube.com/channel/UCQ18lfqzlZH-a-WyphayNWw" target="_blank" aria-label="YouTube Channel" className="hover:text-accent transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1">
              <Youtube className="size-6" />
            </Link>
            <Link href="https://twitter.com/shourov_pal" target="_blank" aria-label="X (Twitter) Profile" className="hover:text-accent transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1">
              <X className="size-6" />
            </Link>
            <Link href="https://www.instagram.com/sh0ur0v_p/" target="_blank" aria-label="Instagram Profile" className="hover:text-accent transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1">
              <Instagram className="size-6" />
            </Link>
            <Link href="https://www.facebook.com/shourov.paul0/" target="_blank" aria-label="Facebook Profile" className="hover:text-accent transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1">
              <Facebook className="size-6" />
            </Link>
          </div>
        </div>

        <div className="flex min-h-[18.75rem] items-center justify-center lg:min-h-[35rem]">
          <div className="text-accent relative size-56 sm:size-60 md:size-[20rem] lg:size-[25.75rem]">
            <Image
              src={HeroImage}
              fill={true}
              priority={true}
              sizes="(min-width: 1024px) 25.75rem, (min-width: 768px) 20rem, (min-width: 640px) 15rem, 14rem"
              alt="SHOUROV PAUL - Full Stack Developer"
              className="object-contain p-7"
            />
            <Ellipse
              ref={ellipseRef}
              className="absolute top-0 left-0 size-56 transition-transform duration-500 ease-out sm:size-60 md:size-[20rem] lg:size-[25.75rem]"
            />
          </div>
        </div>
      </div>
      <AnalyticsMapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </section>
  )
}

export default Hero
