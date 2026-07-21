'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SketchAnnotation } from './SketchAnnotation';

const RecentUpdates: React.FC = () => {
  const [displayDate, setDisplayDate] = useState('');
  const latestPostTitle = "The Ballbot Always Wins";
  const latestPostSummary = "Origin story of the ROB311 robot that balances on top of a basketball";
  const latestPostSlug = "ballbot-always-wins";

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
              <SketchAnnotation color="#ef2841" padding={4}>{latestPostTitle}</SketchAnnotation>
            </h2>

            <p className="w-full leading-relaxed text-sm sm:text-base">
              {latestPostSummary}
            </p>
          </div>
          <span className="latest-post-date">April 26, 2025</span>
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
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span data-sketch-target className="text-[var(--sa-blue)] tracking-tight leading-tight font-medium">{currentLanguage}</span>
            </div>
          </Link>

          <Link
            href={foodUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span data-sketch-target className="text-[var(--sa-green)] tracking-tight leading-tight font-medium">{currentFood}</span>
            </div>
          </Link>

          <Link
            href={songUrl}
            className="sa-link block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-left">
              <span data-sketch-target className="text-[var(--sa-red)] tracking-tight leading-tight font-medium">{currentSong}</span>
            </div>
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
