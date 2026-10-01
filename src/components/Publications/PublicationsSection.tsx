'use client'

import { PublicationItem } from '@/lib/types'
import SectionHeading from '../SectionHeading/SectionHeading'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, GoogleScholarIcon, OrcidIcon, ResearchGateIcon } from '@/utils/icons'

// External academic profile links shown under the section heading
const researchProfiles = [
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?view_op=list_works&hl=en&user=PSu4uPgAAAAJ',
    icon: GoogleScholarIcon,
  },
  {
    label: 'ORCID',
    href: 'https://orcid.org/0009-0009-6664-7839',
    icon: OrcidIcon,
  },
  {
    label: 'ResearchGate',
    href: 'https://www.researchgate.net/profile/Shourov-Paul?ev=hdr_xprf',
    icon: ResearchGateIcon,
  },
]

// Certificate Lightbox Modal Component
const CertificateModal = ({
  certificateUrl,
  title,
  onClose,
}: {
  certificateUrl: string
  title: string
  onClose: () => void
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-secondary border border-border/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border/80 bg-primary/80">
          <div>
            <h3 className="text-sm font-bold font-mono text-accent uppercase tracking-wider">
              Presentation Certificate
            </h3>
            <p className="text-xs text-tertiary-content line-clamp-1">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-tertiary-content hover:text-white hover:border-accent hover:bg-accent/10 transition-colors"
            aria-label="Close certificate modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body / Image */}
        <div className="relative flex-grow p-4 md:p-6 overflow-auto flex items-center justify-center min-h-[300px]">
          <Image
            src={certificateUrl}
            alt={`Certificate for ${title}`}
            width={1200}
            height={850}
            className="w-auto max-h-[72vh] object-contain rounded-lg border border-border/40 shadow-lg"
            priority
          />
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center px-6 py-3 border-t border-border/80 bg-primary/60 text-xs text-tertiary-content">
          <span>Click outside or press X to close</span>
          <a
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 font-mono text-xs font-bold border border-border rounded text-neutral hover:border-accent hover:text-accent transition-colors"
          >
            Open Full Image ↗
          </a>
        </div>
      </div>
    </div>
  )
}

const PublicationCard = ({ pub }: { pub: PublicationItem }) => {
  const [showAbstract, setShowAbstract] = useState(false)
  const [showBibtex, setShowBibtex] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
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

  // Determine Category Badge Styles
  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case 'Conference':
        return 'bg-accent/10 border-accent/40 text-accent'
      case 'Submitted':
        return 'bg-amber-500/10 border-amber-500/40 text-amber-400'
      case 'Journal':
        return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
      default:
        return 'bg-secondary border-border text-tertiary-content'
    }
  }

  // Determine Status Badge Styles
  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'Presented':
        return 'bg-purple-500/10 border-purple-500/40 text-purple-400'
      case 'Under Review':
        return 'bg-orange-500/10 border-orange-500/40 text-orange-400'
      case 'Published':
        return 'bg-blue-500/10 border-blue-500/40 text-blue-400'
      default:
        return 'bg-secondary border-border text-tertiary-content'
    }
  }

  return (
    <>
      <div className="relative group flex flex-col md:flex-row md:items-center gap-6 py-8 border-b border-border/60 last:border-b-0 transition-all duration-300">
        {/* Thumbnail image on the left */}
        <div className="flex-shrink-0 w-[160px] h-[160px] relative rounded-xl overflow-hidden border border-border bg-secondary shadow-sm hover:scale-[1.02] transition-transform duration-300">
          <Image
            src={pub.image}
            alt={pub.title}
            fill
            sizes="160px"
            loading="lazy"
            className="object-contain"
          />
        </div>

        {/* Content wrapper */}
        <div className="flex-grow flex flex-row justify-between items-start gap-4 min-w-0">
          {/* Main content */}
          <div className="flex-grow flex flex-col min-w-0">
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {pub.category && (
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-full border ${getCategoryBadgeClass(
                    pub.category
                  )}`}
                >
                  {pub.category}
                </span>
              )}
              {pub.status && (
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-full border ${getStatusBadgeClass(
                    pub.status
                  )}`}
                >
                  {pub.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-neutral leading-snug mb-1 group-hover:text-accent transition-colors duration-300">
              {pub.title}
            </h3>

            {/* Authors */}
            <p className="text-sm text-primary-content mb-1 font-medium">
              {pub.authors}
            </p>

            {/* Journal / Venue and year */}
            <p className="text-sm text-tertiary-content mb-3 italic">
              {pub.journal}, {pub.year}
            </p>

            {/* Buttons row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <button
                onClick={() => {
                  setShowAbstract(!showAbstract)
                  setShowBibtex(false)
                }}
                className={`px-3 py-1 text-xs font-mono font-bold border rounded transition-all cursor-pointer ${
                  showAbstract
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'border-border text-neutral hover:border-accent hover:text-accent'
                }`}
              >
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
                }`}
              >
                BIB
              </button>

              {/* Certificate Button */}
              {pub.certificateUrl && (
                <button
                  onClick={() => setShowCertificate(true)}
                  data-cursor-text="Click to see"
                  className="flex items-center gap-1 px-3 py-1 text-xs font-mono font-bold border border-accent/60 bg-accent/10 text-accent hover:bg-accent hover:text-black transition-all rounded cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  CERT
                </button>
              )}

              {/* Certificate Pending Badge if presented but certificate pending */}
              {pub.category === 'Conference' && pub.certificateUrl === '' && (
                <span
                  title="Certificate will be available soon"
                  className="px-2.5 py-1 text-[11px] font-mono font-medium border border-border/70 text-tertiary-content/80 rounded bg-secondary/50 cursor-help"
                >
                  Cert Pending
                </span>
              )}

              {pub.htmlUrl && (
                <a
                  href={pub.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-mono font-bold border border-border text-neutral hover:border-accent hover:text-accent transition-all rounded"
                >
                  HTML
                </a>
              )}
              {pub.pdfUrl && (
                <a
                  href={pub.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-mono font-bold border border-border text-neutral hover:border-accent hover:text-accent transition-all rounded"
                >
                  PDF
                </a>
              )}
            </div>

            {/* Citations Count Badge */}
            {pub.citations !== undefined && (
              <div className="flex items-center mt-1 w-fit rounded border border-border/80 text-[11px] font-mono overflow-hidden">
                <span className="bg-[#FFFFFF1A] px-2 py-0.5 text-neutral font-medium border-r border-border/80">
                  Citations
                </span>
                <span className="bg-secondary px-2 py-0.5 text-neutral font-bold">
                  {pub.citations}
                </span>
              </div>
            )}

            {/* Collapsible Abstract */}
            {showAbstract && (
              <div className="mt-4 p-4 bg-secondary border border-border/80 rounded-xl animate-fade-in text-sm text-tertiary-content leading-relaxed">
                <h4 className="text-xs font-bold font-mono text-accent uppercase mb-1.5 tracking-wide">
                  Abstract
                </h4>
                <p>{pub.abstract}</p>
              </div>
            )}

            {/* Collapsible BibTeX */}
            {showBibtex && (
              <div className="mt-4 p-4 bg-secondary border border-border/80 rounded-xl animate-fade-in text-xs font-mono text-neutral relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-accent uppercase tracking-wide">
                    BibTeX Citation
                  </span>
                  <button
                    onClick={handleCopyBib}
                    className="px-2 py-1 text-[10px] bg-primary border border-border rounded hover:border-accent hover:text-accent transition-colors cursor-pointer"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-all pr-4 text-tertiary-content select-all">
                  {pub.bibtex}
                </pre>
              </div>
            )}
          </div>

          {/* Large Year Watermark */}
          <div className="flex-shrink-0 text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral/15 select-none pointer-events-none transition-colors duration-300 group-hover:text-accent/25 pt-1">
            {pub.year}
          </div>
        </div>
      </div>

      {/* Certificate Modal Overlay */}
      {showCertificate && pub.certificateUrl && (
        <CertificateModal
          certificateUrl={pub.certificateUrl}
          title={pub.title}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  )
}

interface PublicationsSectionProps {
  publications: PublicationItem[]
  /** When set, renders a short home-page preview: only this many publications, tabs hidden,
   *  and a "See More" link that navigates to the full /publications page. Omit for the full page. */
  previewCount?: number
}

type TabCategory = 'All' | 'Conference' | 'Submitted' | 'Journal'

const PublicationsSection: React.FC<PublicationsSectionProps> = ({ publications, previewCount }) => {
  const isPreview = typeof previewCount === 'number'
  const [activeTab, setActiveTab] = useState<TabCategory>('All')

  // Calculate publication counts per tab category
  const categoryCounts = useMemo(() => {
    const counts: Record<TabCategory, number> = {
      All: publications.length,
      Conference: 0,
      Submitted: 0,
      Journal: 0,
    }
    publications.forEach((pub) => {
      if (pub.category === 'Conference') counts.Conference++
      else if (pub.category === 'Submitted') counts.Submitted++
      else if (pub.category === 'Journal') counts.Journal++
    })
    return counts
  }, [publications])

  // Filter publications based on active tab category (full page only)
  const filteredPublications = useMemo(() => {
    if (activeTab === 'All') return publications
    return publications.filter((pub) => pub.category === activeTab)
  }, [publications, activeTab])

  // In preview mode, just take the top N overall; on the full page, show everything for the active tab
  const displayedPublications = isPreview ? publications.slice(0, previewCount) : filteredPublications
  const remaining = isPreview ? publications.length - (previewCount ?? 0) : 0

  const tabs: { key: TabCategory; label: string }[] = [
    { key: 'All', label: 'All' },
    { key: 'Conference', label: 'Conferences' },
    { key: 'Submitted', label: 'Submitted / Under Review' },
    { key: 'Journal', label: 'Journals' },
  ]

  return (
    <section id="publications" className="mb-8 scroll-mt-24">
      <SectionHeading
        title="PUBLICATIONS"
        subtitle="Research papers, conference proceedings, articles, and preprints"
      />

      {/* External Research Profile Links */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {researchProfiles.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-border text-tertiary-content transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <Icon className="w-4 h-4" />
            {label}
          </a>
        ))}
      </div>

      {/* Filter Tabs Navigation (full page only, not in the home preview) */}
      {!isPreview && (
        <div className="my-6 flex flex-wrap gap-2 p-1.5 bg-secondary/40 border border-border/80 rounded-2xl w-fit">
          {tabs.map((tab) => {
            const count = categoryCounts[tab.key]
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-accent/15 border border-accent text-accent shadow-sm'
                    : 'text-tertiary-content hover:text-white hover:bg-secondary border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded-md ${
                    isActive
                      ? 'bg-accent text-black font-bold'
                      : 'bg-primary/80 border border-border text-tertiary-content'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Publications List */}
      <div className="my-6 flex flex-col transition-all duration-300 min-h-[200px]">
        {displayedPublications.length > 0 ? (
          displayedPublications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} />
          ))
        ) : (
          <div className="py-12 text-center text-tertiary-content font-mono text-sm border border-dashed border-border/80 rounded-2xl my-4">
            No publications found in this category.
          </div>
        )}
      </div>

      {isPreview && remaining > 0 && (
        <div className="flex justify-center mt-8">
          <Link
            href="/publications"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 border rounded-full text-secondary-content border-secondary-content/20 hover:border-accent hover:text-accent group"
          >
            +{remaining} See More
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  )
}

export default PublicationsSection
