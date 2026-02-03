'use client'

import { Project } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import ProjectCard from './ProjectCard'
import { useState } from 'react'
import { ChevronDownIcon } from '@/utils/icons'

interface ProjectSectionProps {
  projects: Project[]
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  const [visibleCount, setVisibleCount] = useState(4)
  const isExpanded = visibleCount >= projects.length

  const handleToggle = () => {
    if (isExpanded) {
      setVisibleCount(4)
      const section = document.getElementById('projects')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      setVisibleCount(projects.length)
    }
  }

  return (
    <section id="projects" className="mb-8 scroll-mt-24">
      <SectionHeading title="Projects" />

      <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
        {projects.slice(0, visibleCount).map((project) => (
          <ProjectCard key={project.priority} data={project} />
        ))}
      </div>

      {projects.length > 4 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 border rounded-full text-secondary-content border-secondary-content/20 hover:border-accent hover:text-accent group">
            {isExpanded ? 'See Less' : 'See More'}
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      )}
    </section>
  )
}

export default ProjectSection
