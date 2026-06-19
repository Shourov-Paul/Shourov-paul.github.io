import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ServiceSection from '@/components/Services/ServiceSection'
import VideoSection from '@/components/Videos/VideoSection'
import AchievementsSection from '@/components/Achievements/AchievementsSection'
import ExperienceSection from '@/components/Experience/ExperienceSection'
import PublicationsSection from '@/components/Publications/PublicationsSection'
import { getAllProjects, getAchievements, getVideos, getExperiences, getPublications } from '@/services'

export default async function Home() {
  const projects = await getAllProjects()
  const videos = await getVideos()
  const achievements = await getAchievements()
  const experiences = await getExperiences()
  const publications = await getPublications()

  return (
    <main>
      <Hero />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem] space-y-16 md:space-y-24">
        <ProjectSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <PublicationsSection publications={publications} />
        <AchievementsSection achievements={achievements} />
        <VideoSection videos={videos} />
        <ServiceSection />
        <ContactSection />
      </div>
    </main>
  )
}
