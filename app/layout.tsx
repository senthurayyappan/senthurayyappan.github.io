import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Senthur Ayyappan',
    template: '%s | Senthur Ayyappan',
  },
  description: 'Robotics Engineer: developing open-source tools that (mostly) work',
  openGraph: {
    title: 'Senthur Ayyappan | Robotics Engineer',
    description: 'Robotics Engineer: developing open-source tools that (mostly) work',
    url: baseUrl,
    siteName: 'Senthur Ayyappan',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

function getRandomSAColor() {
  const saColors = [
    'var(--sa-black)',
    'var(--sa-gray)',
    'var(--sa-green)',
    'var(--sa-blue)',
  ];
  return saColors[Math.floor(Math.random() * saColors.length)];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-white h-full',
        GeistSans.variable,
        GeistMono.variable
      )}
      style={{ backgroundColor: getRandomSAColor() }}
    >
      <body 
        className="antialiased max-w-xl mx-4 lg:mx-auto h-full flex items-center justify-center"
      >
        <main className="flex flex-col h-[75vh] w-[640px] justify-between px-2 md:px-0">
          <Navbar />
          <div className="flex-grow w-full">
            {children}
          </div>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
