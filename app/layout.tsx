import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '@/components/footer'
import { baseUrl } from './sitemap'
import { ThemeProvider } from 'next-themes'

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
        GeistMono.variable
      )}
      suppressHydrationWarning
    >
      <body 
        className="antialiased h-screen flex flex-col overflow-hidden"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="w-full h-full flex flex-col px-4 sm:px-4 md:px-6 lg:px-20">
            <div className="pt-4 md:pt-6 pb-2 md:pb-6">
              <Navbar />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide py-4">
              {children}
            </div>
            <div className="pb-4 pt-4 md:pb-6 md:pt-6">
              <Footer />
            </div>
          </main>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
