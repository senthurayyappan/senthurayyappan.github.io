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
        GeistMono.variable,
        "h-full"
      )}
      suppressHydrationWarning
    >
      <body 
        className="antialiased mx-auto flex flex-col min-h-full"
        style={{ maxWidth: "min(90vw, 120rem)" }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="w-full flex flex-col flex-grow md:px-6 lg:px-20 min-h-[calc(100vh-2rem)]">
            <div className="sticky top-0 z-50 bg-[var(--background)] pt-2 pb-2 border-b">
              <Navbar />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
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
