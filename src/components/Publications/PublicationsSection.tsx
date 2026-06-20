'use client'

import { PublicationItem } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import Image from 'next/image'
import { useState } from 'react'

const PublicationCard = ({ pub }: { pub: PublicationItem }) => {
  const [showAbstract, setShowAbstract] = useState(false)
  const [showBibtex, setShowBibtex] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyBib = async () => {
    try {
      await navigator.clipboard.writeText(pub.bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="relative group flex flex-col md:flex-row gap-6 py-8 border-b border-border/60 last:border-b-0 transition-all duration-300">
      {/* Thumbnail image on the left */}
      <div className="flex-shrink-0 w-full md:w-[160px] aspect-[4/3] relative rounded-xl overflow-hidden border border-border bg-secondary shadow-sm hover:scale-[1.02] transition-transform duration-300">
        <Image
          src={pub.image}
          alt={pub.title}
          fill
          sizes="(max-width: 768px) 100vw, 160px"
          loading="lazy"
          className="object-cover"
        />
      </div>

      {/* Content wrapper with flex layout to prevent text overlapping with year watermark */}
      <div className="flex-grow flex flex-row justify-between items-start gap-4 min-w-0">
        {/* Main content in the middle */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Title */}
          <h3 className="text-lg font-bold text-neutral leading-snug mb-1 group-hover:text-accent transition-colors duration-300">
            {pub.title}
          </h3>

          {/* Authors */}
          <p className="text-sm text-primary-content mb-1 font-medium">
            {pub.authors}
          </p>

          {/* Journal and publisher details */}
          <p className="text-sm text-tertiary-content mb-3 italic">
            {pub.journal}, {pub.year}
          </p>

          {/* Buttons row */}
          <div className="flex flex-wrap gap-2.5 mb-2.5">
            <button
              onClick={() => {
                setShowAbstract(!showAbstract)
                setShowBibtex(false)
              }}
              className={`px-3 py-1 text-xs font-mono font-bold border rounded transition-all cursor-pointer ${
                showAbstract
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-neutral hover:border-accent hover:text-accent'
              }`}>
              ABS
            </button>
            <button
              onClick={() => {
                setShowBibtex(!showBibtex)
                setShowAbstract(false)
              }}
              className={`px-3 py-1 text-xs font-mono font-bold border rounded transition-all cursor-pointer ${
                showBibtex
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border text-neutral hover:border-accent hover:text-accent'
              }`}>
              BIB
            </button>
            {pub.htmlUrl && (
              <a
                href={pub.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs font-mono font-bold border border-border text-neutral hover:border-accent hover:text-accent transition-all rounded">
                HTML
              </a>
            )}
            {pub.pdfUrl && (
              <a
                href={pub.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs font-mono font-bold border border-border text-neutral hover:border-accent hover:text-accent transition-all rounded">
                PDF
              </a>
            )}
          </div>

          {/* Citations Count Badge (replicated styling from reference image) */}
          {pub.citations !== undefined && (
            <div className="flex items-center mt-1 w-fit rounded border border-border/80 text-[11px] font-mono overflow-hidden">
              <span className="bg-[#FFFFFF1A] px-2 py-0.5 text-neutral font-medium border-r border-border/80">Citations</span>
              <span className="bg-secondary px-2 py-0.5 text-neutral font-bold">{pub.citations}</span>
            </div>
          )}

          {/* Collapsible Abstract Content */}
          {showAbstract && (
            <div className="mt-4 p-4 bg-secondary border border-border/80 rounded-xl animate-fade-in text-sm text-tertiary-content leading-relaxed">
              <h4 className="text-xs font-bold font-mono text-accent uppercase mb-1.5 tracking-wide">Abstract</h4>
              <p>{pub.abstract}</p>
            </div>
          )}

          {/* Collapsible BibTeX Content */}
          {showBibtex && (
            <div className="mt-4 p-4 bg-secondary border border-border/80 rounded-xl animate-fade-in text-xs font-mono text-neutral relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-accent uppercase tracking-wide">BibTeX Citation</span>
                <button
                  onClick={handleCopyBib}
                  className="px-2 py-1 text-[10px] bg-primary border border-border rounded hover:border-accent hover:text-accent transition-colors cursor-pointer">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all pr-4 text-tertiary-content select-all">
                {pub.bibtex}
              </pre>
            </div>
          )}
        </div>

        {/* Large Year Watermark on the right */}
        <div className="flex-shrink-0 text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral/15 select-none pointer-events-none transition-colors duration-300 group-hover:text-accent/25 pt-1">
          {pub.year}
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { ChevronDownIcon } from '@/utils/icons'

interface PublicationsSectionProps {
  publications: PublicationItem[]
  showSeeMore?: boolean
}

const PublicationsSection: React.FC<PublicationsSectionProps> = ({ publications, showSeeMore = false }) => {
  return (
    <section id="publications" className="mb-8 scroll-mt-24">
      <SectionHeading title="PUBLICATIONS" subtitle="Research papers, articles, and technical preprints" />

      <div className="my-8 flex flex-col md:my-12">
        {publications.map((pub) => (
          <PublicationCard key={pub.id} pub={pub} />
        ))}
      </div>

      {showSeeMore && (
        <div className="flex justify-center mt-8">
          <Link
            href="/publications"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 border rounded-full text-secondary-content border-secondary-content/20 hover:border-accent hover:text-accent group">
            See More
            <ChevronDownIcon
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      )}
    </section>
  )
}

export default PublicationsSection
