'use client'

import { Achievement } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import Image from 'next/image'
import { useState } from 'react'
import Modal from '../UI/Modal'
import { ChevronDownIcon, DownloadIcon } from '@/utils/icons'

const AchievementsSection = ({ achievements }: { achievements: Achievement[] }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [visibleCount, setVisibleCount] = useState(3)
    const isExpanded = visibleCount >= achievements.length

    const handleToggle = () => {
        if (isExpanded) {
            setVisibleCount(3)
            const section = document.getElementById('achievements')
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' })
            }
        } else {
            setVisibleCount(achievements.length)
        }
    }

    return (
        <section id="achievements" className="mb-8 scroll-mt-24">
            <SectionHeading title="ACHIEVEMENTS" subtitle="Certifications & Awards" />

            <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:my-12">
                {achievements.slice(0, visibleCount).map((achievement) => (
                    <div
                        key={achievement.id}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-secondary transition-all hover:border-accent hover:shadow-lg"
                        onClick={() => setSelectedImage(achievement.image)}>
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                                src={achievement.image}
                                alt={achievement.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                <span className="text-white font-medium px-4 py-2 border border-white/50 rounded-full backdrop-blur-sm select-none">
                                    View Certificate
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <h3 className="text-lg font-semibold text-primary-content line-clamp-1" title={achievement.title}>
                                {achievement.title}
                            </h3>
                            <p className="text-sm text-accent line-clamp-1">{achievement.issuer}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-neutral">{achievement.date}</p>
                                <a
                                    href={achievement.image}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 text-neutral hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                    title="Download Certificate">
                                    <DownloadIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {achievements.length > 3 && (
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

            <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
                {selectedImage && (
                    <div className="relative h-[80vh] w-[90vw] md:w-[80vw] lg:w-[60vw]">
                        <Image src={selectedImage} alt="Certificate" fill className="object-contain" />
                    </div>
                )}
            </Modal>
        </section>
    )
}

export default AchievementsSection
