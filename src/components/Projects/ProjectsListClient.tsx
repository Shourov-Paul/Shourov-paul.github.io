'use client'

import { Project } from '@/lib/types'
import ProjectCard from './ProjectCard'

interface ProjectsListClientProps {
  projects: Project[]
}

const ProjectsListClient: React.FC<ProjectsListClientProps> = ({ projects }) => {
  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Grid of Projects */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.slug || `project-${idx}`}
            data={project}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectsListClient
