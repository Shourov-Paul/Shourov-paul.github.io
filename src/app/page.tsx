import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ServiceSection from '@/components/Services/ServiceSection'
import VideoSection from '@/components/Videos/VideoSection'
import AchievementsSection from '@/components/Achievements/AchievementsSection'
import ExperienceSection from '@/components/Experience/ExperienceSection'
import PublicationsSection from '@/components/Publications/PublicationsSection'
import { getAllProjects, getAchievements, getVideos, getExperiences, getPublications, getPinnedSlugs } from '@/services'

export default async function Home() {
  const allProjects = await getAllProjects()
  const pinnedSlugs = await getPinnedSlugs()
  const videos = await getVideos()
  const achievements = await getAchievements()
  const experiences = await getExperiences()
  const publications = await getPublications()

  // Pre-sort featured projects based on the pinned config at build time
  let initialFeatured = allProjects.filter((p) => p.slug && pinnedSlugs.includes(p.slug))
  initialFeatured.sort((a, b) => pinnedSlugs.indexOf(a.slug!) - pinnedSlugs.indexOf(b.slug!))

  // Fallback to first 4 projects if no valid pinned projects config
  if (initialFeatured.length === 0) {
    initialFeatured = allProjects.slice(0, 4)
  }

  return (
    <main>
      <Hero />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem] space-y-16 md:space-y-24">
        <ProjectSection initialProjects={initialFeatured} allProjects={allProjects} />
        <ExperienceSection experiences={experiences.slice(0, 2)} showSeeMore={experiences.length > 2} />
        <PublicationsSection publications={publications.slice(0, 2)} showSeeMore={publications.length > 2} />
        <AchievementsSection achievements={achievements.slice(0, 4)} showSeeMore={achievements.length > 4} />
        <VideoSection videos={videos} />
        <ServiceSection />
        <ContactSection />
      </div>
    </main>
  )
}
