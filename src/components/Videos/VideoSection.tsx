'use client'

import { Video } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import { useState } from 'react'
import { ChevronDownIcon } from '@/utils/icons'

const YouTubeFacade = ({ id, title }: { id: string; title: string }) => {
    const [showIframe, setShowIframe] = useState(false)
    const thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`

    if (showIframe) {
        return (
            <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 h-full w-full border-0"
            />
        )
    }

    return (
        <button
            onClick={() => setShowIframe(true)}
            className="absolute top-0 left-0 h-full w-full border-0 cursor-pointer bg-black group/play"
            aria-label={`Play video: ${title}`}>
            <img
                src={thumbnailUrl}
                alt={`Thumbnail for ${title}`}
                loading="lazy"
                className="h-full w-full object-cover"
            />
            {/* YouTube-style play button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-red-600 transition-all duration-300 group-hover/play:bg-red-500 group-hover/play:scale-110 md:h-14 md:w-20">
                    <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 ml-0.5 md:h-7 md:w-7">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </button>
    )
}

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
                            <YouTubeFacade id={video.id} title={video.title} />
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
