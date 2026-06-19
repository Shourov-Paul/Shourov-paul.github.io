import ContactSection from '@/components/Contact/ContactSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Shourov Paul',
  description: 'Get in touch with me for collaborations, inquiries, or opportunities.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto my-8 max-w-[1000px] px-4 md:my-[3.75rem] min-h-[70vh]">
      <ContactSection />

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
