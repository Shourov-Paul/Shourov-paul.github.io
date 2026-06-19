import { getPublications } from '@/services'
import PublicationsSection from '@/components/Publications/PublicationsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publications | Shourov Paul',
  description: 'My academic publications, research papers, and conference proceedings.',
}

export default async function PublicationsPage() {
  const publications = await getPublications()

  return (
    <main className="mx-auto my-8 max-w-[1000px] px-4 md:my-[3.75rem] min-h-[70vh]">
      <PublicationsSection publications={publications} showSeeMore={false} />

      <div className="mt-16 text-center">
        <a
          href="/"
          className="text-accent hover:text-white transition-colors duration-300 font-semibold"
        >
          ← Back to Homepage
        </a>
      </div>
    </main>
  )
}
