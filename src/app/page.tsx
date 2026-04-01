import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ServiceSection from '@/components/Services/ServiceSection'
import VideoSection from '@/components/Videos/VideoSection'
import AchievementsSection from '@/components/Achievements/AchievementsSection'
import { getAllProjects, getAchievements, getVideos } from '@/services'

export default async function Home() {
  const projects = await getAllProjects()
  const videos = await getVideos()
  const achievements = await getAchievements()

  return (
    <main>
      <Hero />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectSection projects={projects} />
        <AchievementsSection achievements={achievements} />
        <VideoSection videos={videos} />
        <ServiceSection />
        <ContactSection />
      </div>
    </main>
  )
}
