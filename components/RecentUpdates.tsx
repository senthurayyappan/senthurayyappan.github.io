import React from 'react'
import Link from 'next/link'
import { formatDate } from 'app/blog/utils'

interface LatestPost {
  title: string
  summary?: string
  slug: string
  publishedAt: string
}

interface RecentUpdatesProps {
  latestPost?: LatestPost
}

const RecentUpdates: React.FC<RecentUpdatesProps> = ({ latestPost }) => {
  // Personal recommendations — update these by hand when something new
  // is worth surfacing on the home page.
  const currentLanguage = 'Rust'
  const currentFood = 'Chicken 65 Biriyani'
  const currentSong = 'Cccoolie Powerhouse'
  const languageUrl = 'https://doc.rust-lang.org/book/'
  const foodUrl =
    'https://www.banglarrannaghor.com/post/simple-chicken-65-biryani'
  const songUrl =
    'https://music.youtube.com/watch?v=Rm_gznXaaKY&si=37x4ldJgZGv9hDqb'

  return (
    <div className="h-full w-full p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6 justify-between">
      {latestPost ? (
        <Link
          href={`/blog/${latestPost.slug}`}
          className="block p-3 sm:p-4 border border-current md:mb-2 lg:mb-4 panel-link-hover"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0">
            <span className="text-xs font-bold uppercase tracking-wider muted">
              Latest Post
            </span>
            <span className="text-xs font-medium muted">
              {formatDate(latestPost.publishedAt)}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="w-full text-2xl sm:text-4xl font-bold tracking-tight title">
              {latestPost.title}
            </h2>

            {latestPost.summary && (
              <p className="w-full leading-relaxed text-sm sm:text-base">
                {latestPost.summary}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div className="block p-3 sm:p-4 border border-current md:mb-2 lg:mb-4">
          <span className="text-xs font-bold uppercase tracking-wider muted">
            Latest Post
          </span>
          <p className="mt-3 opacity-70 text-sm">
            New writing coming soon.
          </p>
        </div>
      )}

      <div className="flex-1">
        <div className="">
          <p className="w-full leading-relaxed text-base sm:text-lg text-justify font-medium">
            Gearing up to start my PhD this Winter and navigating the
            transition from leading the development of the Open-Source Leg
            project full-time to focusing on my research interests in the
            realm of rehab robotics and computational design :)
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex flex-col items-start justify-center text-xl sm:text-3xl">
          <span className="text-xs font-bold uppercase tracking-wider mb-2 sm:mb-4 opacity-50">
            Recommendations
          </span>
          <Link
            href={languageUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span className="text-[var(--sa-blue)] uppercase tracking-wider leading-none font-extrabold">
                {currentLanguage}
              </span>
            </div>
          </Link>

          <Link
            href={foodUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span className="text-[var(--sa-green)] uppercase tracking-wider leading-none font-extrabold">
                {currentFood}
              </span>
            </div>
          </Link>

          <Link
            href={songUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span className="text-[var(--sa-red)] uppercase tracking-wider leading-none font-extrabold">
                {currentSong}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RecentUpdates
