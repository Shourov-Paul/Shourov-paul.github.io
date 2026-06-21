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

    const isMarkItDown = slug === 'markitdown-converter'

    if (isMarkItDown) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden select-none">
                {/* FontAwesome Icons Link */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                {/* Background glowing spheres */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-[100px] -right-[50px] w-[500px] h-[500px] rounded-full bg-accent/15 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute -bottom-[200px] -left-[150px] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }}></div>
                </div>

                <div className="w-full max-w-4xl relative z-10">
                    <header className="mb-8 text-center flex flex-col items-center">
                        <div className="flex items-center gap-3.5 mb-3.5">
                            {/* Detailed blue floppy disk save icon logo */}
                            <svg viewBox="0 0 24 24" className="w-10 h-10 select-none" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 8px var(--gradient-start))' }}>
                                <rect width="24" height="24" rx="5.5" fill="var(--gradient-start)" />
                                <path d="M6 5.5h10l2.5 2.5V18.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13z" fill="white" />
                                <rect x="8.5" y="5.5" width="5.5" height="4" fill="var(--gradient-start)" />
                                <rect x="10.5" y="6" width="2.5" height="3.5" fill="white" />
                                <rect x="8.5" y="12" width="7" height="6.5" fill="#cbd5e1" rx="0.5" />
                                <line x1="10" y1="14" x2="14" y2="14" stroke="#475569" strokeWidth="1" />
                                <line x1="10" y1="16" x2="14" y2="16" stroke="#475569" strokeWidth="1" />
                            </svg>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                                MarkIt<span className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">Down</span>
                            </h1>
                        </div>
                        <p className="text-neutral text-sm md:text-[15px] font-medium max-w-lg mb-6 opacity-80">
                            Convert any document, image, or media into clean Markdown instantly
                        </p>
                        <div className="w-full h-px bg-border/40 mb-6"></div>
                    </header>

                    <MarkItDownConverter />
                    
                    <div className="mt-8 text-center">
                        <a
                            href="/blog"
                            className="text-neutral hover:text-accent font-semibold text-xs tracking-wider uppercase transition-colors duration-300"
                        >
                            &larr; Back to Blog
                        </a>
                    </div>
                </div>
            </div>
        )
    }

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
