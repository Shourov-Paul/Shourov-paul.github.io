import { Blog } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { Timer } from '../../utils/icons'

interface BlogCardProps {
  data: Blog
}

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  const { title, shortDescription, date, coverImage, slug } = data

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-secondary border-border flex flex-col justify-between rounded-[14px] border p-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link href={`/blog/${slug}`} className="block group">
            <div className="flex flex-col gap-2">
              <h3 className="text-secondary-content group-hover:text-accent text-lg font-medium transition-colors md:font-semibold">{title}</h3>
              <p className="text-neutral text-sm flex items-center gap-2">
                  <Image src={Timer} alt="Date" className="size-[16px]" />
                  {formattedDate}
              </p>
            </div>
          </Link>
        </div>
        {coverImage && (
          <figure className="flex justify-end overflow-hidden flex-shrink-0 rounded-md">
            <Link href={`/blog/${slug}`}>
              <Image
                src={coverImage}
                width={150}
                height={80}
                loading="lazy"
                alt={`${title} cover`}
                className="h-[80px] w-[150px] cursor-pointer object-cover shadow-[0px_1.66px_3.74px_-1.25px_#18274B1F] transition-all duration-300 hover:scale-105"
              />
            </Link>
          </figure>
        )}
      </div>

      <div className="mt-4">
        <div className="bg-primary text-primary-content rounded-2xl px-4 py-3 h-[100px] overflow-hidden">
          <p className="text-[14px] font-normal md:text-base leading-relaxed line-clamp-3">{shortDescription}</p>
        </div>
        <div className="mt-4 flex gap-5">
           <Link
              href={`/blog/${slug}`}
              className="text-accent flex gap-2 text-sm underline underline-offset-[3px] transition-all duration-75 ease-linear hover:scale-105 md:text-base">
              <span>Read Full Article &rarr;</span>
            </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
