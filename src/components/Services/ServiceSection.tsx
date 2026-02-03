'use client'

import { serviceData } from '../../appData'
import SectionHeading from '../SectionHeading/SectionHeading'
import ServiceCard from './ServiceCard'
import { useState } from 'react'
import { ChevronDownIcon } from '@/utils/icons'

const ServiceSection = () => {
  const [visibleCount, setVisibleCount] = useState(3)
  const isExpanded = visibleCount >= serviceData.length

  const handleToggle = () => {
    if (isExpanded) {
      setVisibleCount(3)
      const section = document.getElementById('skills')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      setVisibleCount(serviceData.length)
    }
  }

  return (
    <section id="skills" className="mb-8 scroll-mt-24">
      <SectionHeading
        title="SKILLS"
        subtitle="Most of my skills are related to the following categories."
      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {serviceData.slice(0, visibleCount).map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            shortDescription={service.shortDescription}
          />
        ))}
      </div>

      {serviceData.length > 3 && (
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

export default ServiceSection
