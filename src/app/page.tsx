import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ServiceSection from '@/components/Services/ServiceSection'
import TestimonialSection from '@/components/Testimonials/TestimonialSection'
import VideoSection from '@/components/Videos/VideoSection'
import { getAllProjects, getAllTestimonials, getVideos } from '@/services'

export default async function Home() {
  const projects = await getAllProjects()
  const testimonials = await getAllTestimonials()
  const videos = await getVideos()

  return (
    <main>
      <Hero />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectSection projects={projects} />
        <VideoSection videos={videos} />
        <ServiceSection />
        {/* <TestimonialSection testimonials={testimonials} /> */}
        <ContactSection />
      </div>
    </main>
  )
}
