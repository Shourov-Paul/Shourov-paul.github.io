import { getExperiences } from '@/services'
import ExperienceSection from '@/components/Experience/ExperienceSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experience | Shourov Paul',
  description: 'My professional work journey, teaching assistant roles, and industrial training experiences.',
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <main className="mx-auto my-8 max-w-[1000px] px-4 md:my-[3.75rem] min-h-[70vh]">
      <ExperienceSection experiences={experiences} showSeeMore={false} />

      <div className="mt-16 text-center">
        <a
          href="/"
          className="text-accent hover:text-white transition-colors duration-300 font-semibold"
        >
          ← Back to Homepage
        </a>
      </div>
    </main>
  )
}
