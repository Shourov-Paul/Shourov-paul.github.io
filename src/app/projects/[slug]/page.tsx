import { getAllProjects, getProjectBySlug } from '@/services'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    const projects = await getAllProjects()
    return projects
        .filter((project) => project.slug) // Only generate for projects with slugs
        .map((project) => ({
            slug: project.slug,
        }))
}

const ProjectDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) return notFound()

    return (
        <article className="mx-auto max-w-3xl px-4 py-12 md:px-0">
            <header className="mb-10 text-center">
                <h1 className="text-secondary-content mb-4 text-3xl font-bold md:text-5xl">
                    {project.title}
                </h1>
                <div className="text-neutral flex justify-center gap-4 text-sm uppercase tracking-wider">
                    {project.siteAge && <span>{project.siteAge}</span>}
                    {project.type && <span>| {project.type}</span>}
                </div>
            </header>

            {/* Render Sections */}
            <div className="space-y-12">
                {project.detailSections?.map((section, index) => (
                    <section key={index} className="animate-fade-up">
                        {section.title && (
                            <h2 className="text-accent mb-4 text-2xl font-semibold">{section.title}</h2>
                        )}

                        {section.content && (
                            <div
                                className="text-primary-content text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                        )}

                        {section.image && (
                            <figure className="my-6 overflow-hidden rounded-xl border border-[#FFFFFF1A] shadow-lg">
                                <Image
                                    src={section.image}
                                    alt={section.title || project.title}
                                    width={800}
                                    height={500}
                                    className="w-full object-cover"
                                />
                            </figure>
                        )}

                        {section.code && (
                            <pre className="mt-4 overflow-x-auto rounded-lg bg-[#0d1f33] p-6 text-sm text-gray-100 shadow-inner">
                                <code>{section.code}</code>
                            </pre>
                        )}
                    </section>
                ))}

                {!project.detailSections && (
                    <div className="text-center text-gray-500">
                        <p>Full project details coming soon.</p>
                    </div>
                )}
            </div>

            <div className="mt-16 border-t border-[#FFFFFF1A] pt-8 text-center">
                <a
                    href="/"
                    className="text-accent hover:text-white transition-colors duration-300"
                >
                    ← Back to Portfolio
                </a>
            </div>
        </article>
    )
}

export default ProjectDetails
