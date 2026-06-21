import { getAllBlogs, getBlogBySlug } from '@/services'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import CodeBlock from '@/components/UI/CodeBlock'
import TTSConfigurator from '@/components/Blog/TTSConfigurator'
import MarkItDownConverter from '@/components/Blog/MarkItDownConverter'

export async function generateStaticParams() {
    const blogs = await getAllBlogs()
    return blogs
        .filter((blog) => blog.slug)
        .map((blog) => ({
            slug: blog.slug,
        }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)

    if (!blog) {
        return {
            title: 'Blog Not Found | Shourov Paul',
        }
    }

    const title = `${blog.title} | Shourov Paul's Blog`
    const description = blog.shortDescription || `Read ${blog.title} by Shourov Paul.`

    return {
        title,
        description,
        keywords: blog.keywords || [],
        openGraph: {
            title,
            description,
            tags: blog.keywords || [],
        },
        twitter: {
            title,
            description,
        }
    }
}

const BlogDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)

    if (!blog) return notFound()

    const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return (
        <article className="mx-auto max-w-3xl px-4 py-12 md:px-0">
            <header className="mb-10 text-center">
                <h1 className="text-secondary-content mb-4 text-3xl font-bold md:text-5xl">
                    {blog.title}
                </h1>
                <div className="text-neutral flex justify-center gap-4 text-sm uppercase tracking-wider">
                    <span>{formattedDate}</span>
                </div>
            </header>

            {blog.coverImage && (
                <figure className="my-8 overflow-hidden rounded-xl border border-[#FFFFFF1A] shadow-lg">
                    <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={800}
                        height={400}
                        className="w-full object-cover max-h-[400px]"
                    />
                </figure>
            )}

            {/* Render Sections */}
            <div className="space-y-12">
                {blog.detailSections?.map((section, index) => (
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
                                    alt={section.title || blog.title}
                                    width={800}
                                    height={500}
                                    className="w-full object-cover"
                                />
                            </figure>
                        )}

                        {section.code && (
                            <CodeBlock
                                code={section.code}
                                language={section.language}
                                filename={section.filename}
                            />
                        )}

                        {section.interactive === 'TTSConfigurator' && (
                            <TTSConfigurator />
                        )}

                        {section.interactive === 'MarkItDownConverter' && (
                            <MarkItDownConverter />
                        )}
                    </section>
                ))}

                {!blog.detailSections && (
                    <div className="text-center text-gray-500">
                        <p>Full content coming soon.</p>
                    </div>
                )}
            </div>

            <div className="mt-16 border-t border-[#FFFFFF1A] pt-8">
                {blog.keywords && blog.keywords.length > 0 && (
                    <div className="mb-8 flex flex-wrap justify-center gap-2">
                        {blog.keywords.map((keyword, idx) => (
                            <span key={idx} className="bg-primary border border-border text-neutral px-3 py-1.5 text-xs rounded-full cursor-default hover:text-accent hover:border-accent transition-colors duration-300">
                                #{keyword.replace(/\s+/g, '').toLowerCase()}
                            </span>
                        ))}
                    </div>
                )}
                <div className="text-center">
                    <a
                        href="/blog"
                        className="text-accent hover:text-white transition-colors duration-300 font-medium"
                    >
                        &larr; Back to Blog
                    </a>
                </div>
            </div>
        </article>
    )
}

export default BlogDetails
