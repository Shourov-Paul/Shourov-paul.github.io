'use client'
import useRoleSwitcher from '@/hooks/useRoleSwitcher'
import useRotatingAnimation from '@/hooks/useRotatingAnimation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Codepen,
  Facebook,
  GithubIcon,
  Instagram,
  LinkedIn,
  X,
} from '../../utils/icons'
import { HeroImage } from '../../utils/images'
import Ellipse from './Ellipse'

const Hero = () => {
  const ellipseRef = useRotatingAnimation()
  const role = useRoleSwitcher({ roles: ['ELECTRONICS engineer', 'PCB designer', 'ROBOTICS engineer', '3D model designer'] })

  return (
    <section className="bg-primary bg-small-glow bg-small-glow-position md:bg-large-glow-position lg:bg-large-glow min-h-[calc(dvh-4rem)] bg-no-repeat">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-4 px-4 pt-12 pb-10 md:grid-cols-2 lg:p-4">
        <div className="flex min-h-48 flex-col justify-between lg:min-h-56 lg:max-w-[33.75rem]">
          <h1>
            <span className="text-neutral mb-2 block text-3xl font-bold">Hi - I'm SHOUROV PAUL</span>
            <span className="text-accent block text-[1.75rem] font-bold">{role}</span>
          </h1>

          <h2 className="text-neutral mt-3">
            Ambitious EEE student skilled in circuit design, signal processing, and programming, with strong expertise in Embedded Systems, PCB design, microcontroller programming, Simulation & Analysis, and Technical Drawing, seeking opportunities to contribute to innovative projects and continuous learning.
          </h2>

          <div className="mt-6 flex flex-wrap gap-6">
            <a
              href="/Shourov_Paul_Resume.pdf"
              download="Shourov_Paul_Resume.pdf"
              aria-label="Download CV"
              className="bg-accent w-[170px] cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium text-[#00071E] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              Download CV
            </a>
            <a
              href="https://www.linkedin.com/in/shourov-paul-b052a7259/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View LinkedIn Profile"
              className="text-neutral bg-secondary w-[170px] cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              LinkedIn Profile
            </a>
          </div>

          <div className="mt-8 flex w-full max-w-[364px] items-center justify-between text-neutral">
            <Link href="https://github.com" target="_blank" className="hover:text-accent transition-colors duration-300">
              <GithubIcon className="size-6" />
            </Link>
            <Link href="https://www.linkedin.com/in/shourov-paul-b052a7259/" target="_blank" className="hover:text-accent transition-colors duration-300">
              <LinkedIn className="size-6" />
            </Link>
            <Link href="https://codepen.io" target="_blank" className="hover:text-accent transition-colors duration-300">
              <Codepen className="size-6" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-accent transition-colors duration-300">
              <X className="size-6" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-accent transition-colors duration-300">
              <Instagram className="size-6" />
            </Link>
            <Link href="https://facebook.com" target="_blank" className="hover:text-accent transition-colors duration-300">
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
    </section>
  )
}

export default Hero
