'use client'

import { Project } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import ProjectCard from './ProjectCard'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@/utils/icons'

import MatlabCodyCard from '../Achievements/MatlabCodyCard'

interface ProjectSectionProps {
  initialProjects: Project[]
  allProjects: Project[]
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ initialProjects, allProjects }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(initialProjects)

  useEffect(() => {
    const saved = localStorage.getItem('featured-projects')
    if (saved) {
      try {
        const slugs = JSON.parse(saved) as string[]
        if (slugs.length > 0) {
          const selected = allProjects.filter((p) => p.slug && slugs.includes(p.slug))
          selected.sort((a, b) => slugs.indexOf(a.slug!) - slugs.indexOf(b.slug!))
          if (selected.length > 0) {
            setFeaturedProjects(selected)
            return
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    setFeaturedProjects(initialProjects)
  }, [initialProjects, allProjects])

  return (
    <section id="projects" className="mb-8 scroll-mt-24">
      <div className="mb-8">
        <MatlabCodyCard />
      </div>
      <SectionHeading title="Projects" />

      <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
        {featuredProjects.map((project, idx) => (
          <ProjectCard key={project.slug || `featured-${idx}`} data={project} />
        ))}
      </div>

      {allProjects.length > 4 && (
        <div className="flex justify-center mt-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 border rounded-full text-secondary-content border-secondary-content/20 hover:border-accent hover:text-accent group">
            See More
            <ChevronDownIcon
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      )}
    </section>
  )
}

export default ProjectSection
