import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '@/components/footer'
import { baseUrl } from './sitemap'
import { ThemeProvider } from 'next-themes'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import { LinkSketches } from '@/components/LinkSketches'
import { ImageContourFilters } from '@/components/ImageContourFilters'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Senthur Ayyappan',
    template: '%s | Senthur Ayyappan',
  },
  description: 'PhD student at the Neurobionics Lab, U-M Robotics, working on robot codesign across mechanics, simulation, and control.',
  openGraph: {
    title: 'Senthur Ayyappan | PhD Student, Michigan Robotics',
    description: 'PhD student at the Neurobionics Lab, U-M Robotics, working on robot codesign across mechanics, simulation, and control.',
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
  icons: {
    icon: '/logo/favicons/favicon.ico',
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        GeistSans.variable,
        GeistMono.variable,
        "h-full"
      )}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ImageContourFilters />
          <LinkSketches />
          <main className="site-shell">
            <Navbar />
            <div className="site-content">{children}</div>
          </main>
          <div className="site-footer"><Footer /></div>
          <Analytics />
          <SpeedInsights />
          <PerformanceMonitor />
        </ThemeProvider>
      </body>
    </html>
  )
}
