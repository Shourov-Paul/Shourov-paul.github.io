import { Video } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'

const VideoSection = ({ videos }: { videos: Video[] }) => {
    return (
        <section id="videos" className="mb-24 scroll-mt-24">
            <SectionHeading title="Videos" subtitle="My Recent Videos" />
            <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
                {videos.map((video) => (
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
        </section>
    )
}

export default VideoSection
