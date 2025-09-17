'use client'

import React from 'react';
import Link from 'next/link';

const RecentUpdates: React.FC = () => {
  const latestPostTitle = "The Ballbot Always Wins";
  const latestPostSummary = "Origin story of the ROB311 robot that balances on top of a basketball";
  const latestPostSlug = "ballbot-always-wins";

  // Quick edit section - update these frequently
  const currentLanguage = "Rust";
  const currentFood = "Chicken 65 Biriyani";
  const currentSong = "Cccoolie Powerhouse";
  const languageUrl = "https://doc.rust-lang.org/book/";
  const foodUrl = "https://www.banglarrannaghor.com/post/simple-chicken-65-biryani";
  const songUrl = "https://music.youtube.com/watch?v=Rm_gznXaaKY&si=37x4ldJgZGv9hDqb";

  return (
    <div className="h-full w-full p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6 justify-between">
      {/* Latest Blog Post Section */}
      <Link
        href={`/blog/${latestPostSlug}`}
        className='block p-3 sm:p-4 border border-current md:mb-2 lg:mb-4 panel-link-hover'
      >

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1 sm:gap-0">
            <span className="text-xs font-bold uppercase tracking-wider muted">Latest Post</span>
            <span className="text-xs font-medium muted">April 26, 2025</span>
          </div>

          <div className="space-y-3">
            <h2 className="w-full text-2xl sm:text-4xl font-bold tracking-tight title">
              {latestPostTitle}
            </h2>

            <p className="w-full leading-relaxed text-sm sm:text-base">
              {latestPostSummary}
            </p>
          </div>
      </Link>

      {/* Writing Section */}
      <div className="flex-1">
        <div className="">
          <p className="w-full leading-relaxed text-base sm:text-lg text-justify font-medium">
            Gearing up to start my PhD this Winter and navigating the transition from leading the development of the Open-Source Leg project full-time 
            to focusing on my research interests in the realm of rehab robotics and computational design :)
          </p>
        </div>
      </div>

      {/* Typography Style Words */}
      <div className="flex items-center">
        <div className="flex flex-col items-start justify-center text-xl sm:text-3xl">
          <span className="text-xs font-bold uppercase tracking-wider mb-2 sm:mb-4 opacity-50">Recommendations</span>
          <Link
            href={languageUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span className="text-[var(--sa-blue)] uppercase tracking-wider leading-none font-extrabold">{currentLanguage}</span>
            </div>
          </Link>

          <Link
            href={foodUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span className="text-[var(--sa-green)] uppercase tracking-wider leading-none font-extrabold">{currentFood}</span>
            </div>
          </Link>

          <Link
            href={songUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span className="text-[var(--sa-red)] uppercase tracking-wider leading-none font-extrabold">{currentSong}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Data Timestamp */}
      <div className="flex justify-end">
        <span className="text-xs opacity-50 font-medium">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default RecentUpdates;