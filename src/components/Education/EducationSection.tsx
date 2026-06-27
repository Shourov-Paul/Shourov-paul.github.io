import { EducationItem } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import Link from 'next/link'
import { ChevronDownIcon, PreviewIcon } from '@/utils/icons'

interface EducationSectionProps {
  education: EducationItem[]
  showSeeMore?: boolean
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, showSeeMore = false }) => {
  return (
    <section id="education" className="mb-8 scroll-mt-24">
      <SectionHeading title="EDUCATION" subtitle="My academic journey and qualifications" />

      <div className="relative mt-8 md:mt-12 pl-6 md:pl-8 border-l-2 border-border/80 ml-2 md:ml-4 space-y-8">
        {education.map((edu) => (
          <div key={edu.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-4.5 w-4.5 rounded-full border-2 border-accent bg-primary transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_var(--color-accent)]" />

            {/* Education card */}
            <div className="border border-border bg-secondary rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-neutral transition-colors duration-300 group-hover:text-accent">
                    {edu.degree}
                  </h3>
                  <p className="text-primary-content font-medium mb-2">{edu.institution}</p>
                  
                  {/* Grade details */}
                  <div className="text-sm text-tertiary-content flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-neutral">
                      {edu.grade}
                    </span>
                    {edu.details && (
                      <span className="text-accent/90 flex items-center gap-1.5 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        {edu.details}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-semibold text-accent flex flex-col items-start md:items-end gap-3 flex-shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    {edu.period}
                  </span>
                  {edu.certificateUrl && (
                    <a
                      href={edu.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-primary transition-all duration-300 cursor-pointer"
                    >
                      <PreviewIcon className="w-4 h-4" />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSeeMore && (
        <div className="flex justify-center mt-8">
          <Link
            href="/education"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 border rounded-full text-secondary-content border-secondary-content/20 hover:border-accent hover:text-accent group"
          >
            See More
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  )
}

export default EducationSection
