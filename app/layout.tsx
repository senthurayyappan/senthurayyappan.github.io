import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Young_Serif, Newsreader, Inter } from 'next/font/google'

const youngSerif = Young_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif-display',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif-body',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

import { Navbar } from '@/components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '@/components/footer'
import { baseUrl } from './sitemap'
import { ThemeProvider } from 'next-themes'
import PerformanceMonitor from '@/components/PerformanceMonitor'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Senthur Ayyappan',
    template: '%s | Senthur Ayyappan',
  },
  description:
    'PhD student at the Neurobionics Lab, U-M Robotics, advised by Prof. Elliott Rouse. Working on co-design — co-evolving a robot’s mechanical design and its control inside a simulator.',
  openGraph: {
    title: 'Senthur Ayyappan | PhD Student, Michigan Robotics',
    description:
      'PhD student at the Neurobionics Lab, U-M Robotics, advised by Prof. Elliott Rouse. Working on co-design — co-evolving a robot’s mechanical design and its control inside a simulator.',
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

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ')

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
        youngSerif.variable,
        newsreader.variable,
        inter.variable,
        'h-full'
      )}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="page-grid wrap">
            <Navbar />
            <div className="page-content min-w-0">{children}</div>
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
          <PerformanceMonitor />
        </ThemeProvider>
      </body>
    </html>
  )
}
