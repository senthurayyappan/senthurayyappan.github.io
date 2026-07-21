'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type RecommendationIconKind = 'show' | 'recipe' | 'song';

function RecommendationIcon({ kind }: { kind: RecommendationIconKind }) {
  if (kind === 'show') {
    return (
      <svg className="recommendation-icon" viewBox="0 0 36 36" aria-hidden="true">
        <path d="M9.2 5.6 17.7 11l8.1-6.2" />
        <path d="M5.1 11.3c8.6-.7 17.2-.6 25.8.2.5 5.8.3 11.7-.4 17.4-8.4.6-16.7.5-25.2-.2-.7-5.8-.8-11.6-.2-17.4Z" />
        <path d="M8.6 14.8c5.9-.5 11.9-.4 17.9.1.4 3.7.3 7.4-.2 11.1-5.8.4-11.7.3-17.5-.2-.5-3.6-.6-7.3-.2-11Z" />
        <path d="m10 30.2-1.7 2.1m17.5-2 1.6 2" />
        <circle cx="28.5" cy="17" r=".9" />
      </svg>
    );
  }

  if (kind === 'recipe') {
    return (
      <svg className="recommendation-icon" viewBox="0 0 36 36" aria-hidden="true">
        <path d="M11.3 10.3c-2-2.2 1.8-3.1-.2-5.4m7.2 5.2c-2.1-2.3 1.7-3.3-.4-5.7m7 6c-2-2.1 1.6-3.1-.1-5.2" />
        <path d="M5.2 16.1c8.5-.7 17.1-.6 25.6.2-.7 8-5 13.4-12.9 13.7-7.7-.4-11.8-5.8-12.7-13.9Z" />
        <path d="M4.1 16.7c9.3.7 18.6.8 27.8.1M10.3 30.6c5.1.4 10.2.4 15.3 0" />
        <path d="M27.8 12.3c2.2.3 3.8 1.5 4.7 3.7" />
      </svg>
    );
  }

  return (
    <svg className="recommendation-icon" viewBox="0 0 36 36" aria-hidden="true">
      <path d="M15.2 7.1c5.2-.7 9.6-1.7 14.5-3v18.1" />
      <path d="M15.2 7.1v18.1" />
      <path d="M15.3 12.2c5-.5 9.6-1.5 14.4-2.8" />
      <path d="M14.9 23.4c-2.1-1.1-5.6-.1-7.1 2.1-1.3 2-.1 4.1 2.6 4.3 2.8.1 4.9-1.7 4.5-6.4Zm14.7-3c-2.2-1-5.5.1-6.8 2.2-1.3 2 .1 4 2.7 4.1 2.6.1 4.7-1.8 4.1-6.3Z" />
      <path className="recommendation-icon-echo" d="M16.4 8.4c4.6-.6 8.5-1.5 12.8-2.6" />
    </svg>
  );
}

const RecentUpdates: React.FC = () => {
  const [displayDate, setDisplayDate] = useState('');
  const latestPostTitle = "Designing a Robot That Can Change Its Mind";
  const latestPostSummary = "A field note on treating morphology, control, and simulation as one continuous design conversation.";
  const latestPostSlug = "designing-a-robot-that-can-change";

  // Quick edit section - update these frequently
  const currentLanguage = "The Studio";
  const currentFood = "Dindigul Biriyani";
  const currentSong = "Osai Kekkudho";
  const languageUrl = "https://www.imdb.com/title/tt23649128/";
  const foodUrl = "https://www.kannammacooks.com/tamilnadu-thalappakatti-biriyani/";
  const songUrl = "https://youtu.be/E69KvVkemeM";

  useEffect(() => {
    setDisplayDate(new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
    }).format(new Date()));
  }, []);

  return (
    <div className="h-full w-full p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6 justify-between">
      {/* Latest Blog Post Section */}
      <div className="latest-post-cell md:mb-2 lg:mb-4">
        <Link
          href={`/blog/${latestPostSlug}`}
          className="latest-post-card"
          data-sketch="off"
        >
          <div className="space-y-3">
            <h2 className="w-full text-2xl sm:text-4xl font-medium tracking-tight title">
              {latestPostTitle}
            </h2>

            <p className="w-full leading-relaxed text-sm sm:text-base">
              {latestPostSummary}
            </p>
          </div>
          <span className="latest-post-date">July 20, 2026</span>
        </Link>
      </div>

      {/* Writing Section */}
      <div className="flex-1">
        <div className="">
          <p className="w-full leading-relaxed text-base sm:text-lg font-normal">
            Hello there! I&rsquo;m a PhD student in Robotics at the University of
            Michigan, working with Prof. Elliott Rouse in the Neurobionics Lab.
            My research focuses on robot codesign: how a robot&rsquo;s
            mechanical design and control policy can co-evolve inside simulation
            instead of being engineered one after the other.
          </p>
        </div>
      </div>

      {/* Typography Style Words */}
      <div className="flex items-center">
        <div className="flex flex-col items-start justify-center text-xl sm:text-3xl">
          <span className="text-xs font-medium tracking-tight mb-2 sm:mb-4 opacity-60">Recommendations</span>
          <Link
            href={languageUrl}
            className="sa-link recommendation-link text-[var(--sa-blue)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RecommendationIcon kind="show" />
            <span data-sketch-target className="tracking-tight leading-tight font-medium">{currentLanguage}</span>
          </Link>

          <Link
            href={foodUrl}
            className="sa-link recommendation-link text-[var(--sa-yellow)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RecommendationIcon kind="recipe" />
            <span data-sketch-target className="tracking-tight leading-tight font-medium">{currentFood}</span>
          </Link>

          <Link
            href={songUrl}
            className="sa-link recommendation-link text-[var(--sa-red)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RecommendationIcon kind="song" />
            <span data-sketch-target className="tracking-tight leading-tight font-medium">{currentSong}</span>
          </Link>
        </div>
      </div>

      {/* Data Timestamp */}
      <div className="flex justify-end">
        <span className="min-w-20 text-right text-xs opacity-50 font-medium">{displayDate}</span>
      </div>
    </div>
  );
};

export default RecentUpdates;
