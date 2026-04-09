import type { Metadata } from 'next'
import './globals.css'

import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const title = 'Shourov Paul\'s Portfolio'

const description =
  'Shourov Paul — Embedded Systems & Robotics Engineer with Full-Stack Developing experience. I design and build Robot and IoT devices with modern web applications. Explore my projects and get in touch.'
const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://shourov-paul.github.io'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Shourov Paul', 'Shourav Paul', 'Sourov Paul', 'Sourav Paul',
    'Shurov Paul', 'Surov Paul', 'Shourab Paul', 'Sourab Paul',
    'Shourov Pal', 'Sourov Pal', 'Saurav Paul', 'Saurav Pal',
    'Shourov', 'Paul', 'Full-Stack Developer', 'Embedded Systems Engineer',
    'Software Engineer', 'React Developer', 'Next.js Developer', 'IoT Developer', 'Robotics Engineer'
  ],
  category: 'technology',
  metadataBase: new URL(url),
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'SHOUROV PAUL Portfolio',
    type: 'website',
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@ShourovPaul',
  },
  verification: {
    google: 'z5vyMwjsamJXI2lCyYmzt4scYhy6UoNBa7QjQZjEfng',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${firaCode.className}`}>
        <header className="sticky top-0 z-50">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Shourov Paul",
                "jobTitle": "Embedded Systems & Robotics Engineer with Full-Stack Developing experience.",
                "url": "https://shourov-paul.github.io",
                "sameAs": [
                  "https://github.com/Shourov-paul",
                  "https://www.linkedin.com/in/shourov-paul-b052a7259/"
                ]
              })
            }}
          />
          <Navbar />
        </header>
        {children}
        <Footer />
      </body>
    </html>
  )
}
