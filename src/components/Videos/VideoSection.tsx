'use client'

import { Video } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import { useState } from 'react'
import { ChevronDownIcon } from '@/utils/icons'

const VideoSection = ({ videos }: { videos: Video[] }) => {
    const [visibleCount, setVisibleCount] = useState(2)
    const isExpanded = visibleCount >= videos.length

    const handleToggle = () => {
        if (isExpanded) {
            setVisibleCount(2)
            const section = document.getElementById('videos')
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' })
            }
        } else {
            setVisibleCount(videos.length)
        }
    }

    return (
        <section id="videos" className="mb-8 scroll-mt-24">
            <SectionHeading title="Videos" subtitle="My Recent Videos" />
            <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
                {videos.slice(0, visibleCount).map((video) => (
                    <div
                        key={video.id}
                        className="border-border bg-secondary flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-300 hover:border-accent">
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                            <iframe
                                src={`https://www.youtube.com/embed/${video.id}`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 h-full w-full border-0"
                            />
                        </div>
                        <div className="flex flex-col gap-2 p-2">
                            <h3 className="text-secondary-content text-xl font-bold">{video.title}</h3>
                            <p className="text-neutral font-light">{video.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {videos.length > 2 && (
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

export default VideoSection
