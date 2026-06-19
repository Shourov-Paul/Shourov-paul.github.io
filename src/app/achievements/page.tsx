import { getAchievements } from '@/services'
import AchievementsSection from '@/components/Achievements/AchievementsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Achievements | Shourov Paul',
  description: 'Certifications, training course awards, and academic accomplishments.',
}

export default async function AchievementsPage() {
  const achievements = await getAchievements()

  return (
    <main className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem] min-h-[70vh]">
      <AchievementsSection achievements={achievements} showSeeMore={false} />

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
