import { ExperienceItem } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import Link from 'next/link'
import { ChevronDownIcon } from '@/utils/icons'

interface ExperienceSectionProps {
  experiences: ExperienceItem[]
  showSeeMore?: boolean
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, showSeeMore = false }) => {
  return (
    <section id="experience" className="mb-8 scroll-mt-24">
      <SectionHeading title="WORK EXPERIENCE" subtitle="My professional journey and industrial training" />

      <div className="relative mt-8 md:mt-12 pl-6 md:pl-8 border-l-2 border-border/80 ml-2 md:ml-4 space-y-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-4.5 w-4.5 rounded-full border-2 border-accent bg-primary transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_var(--color-accent)]" />

            {/* Experience card */}
            <div className="border border-border bg-secondary rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-neutral transition-colors duration-300 group-hover:text-accent">
                    {exp.role}
                  </h3>
                  <p className="text-primary-content font-medium">{exp.company}</p>
                </div>
                <div className="text-sm font-semibold text-accent md:text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    {exp.period}
                  </span>
                </div>
              </div>

              {/* Description Bullet Points */}
              <ul className="space-y-1.5 mb-3 text-tertiary-content text-sm leading-relaxed">
                {exp.description.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent mt-1 select-none">▹</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md bg-primary border border-border text-primary-content font-medium transition-all duration-200 hover:border-accent hover:text-accent">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSeeMore && (
        <div className="flex justify-center mt-8">
          <Link
            href="/experience"
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

export default ExperienceSection
