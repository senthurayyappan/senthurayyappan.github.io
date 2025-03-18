import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
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
        'text-white',
        GeistSans.variable,
        GeistMono.variable
      )}
      suppressHydrationWarning
    >
      <body 
        className="antialiased h-screen flex flex-col overflow-hidden"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col h-full">
            <main className="w-full h-full flex flex-col px-4 sm:px-4 md:px-6 lg:px-20">
              <div className="py-4 sm:py-6 md:py-12">
                <Navbar />
              </div>
              <div className="flex-1 min-h-0 flex items-start justify-center">
                <div className="w-full w-full h-full overflow-y-auto scrollbar-hide">
                  {children}
                </div>
              </div>
              <div className="py-4 sm:py-6 md:py-12">
                <Footer />
              </div>
            </main>
            <Analytics />
            <SpeedInsights />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
