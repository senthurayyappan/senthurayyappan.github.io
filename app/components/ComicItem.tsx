import React from 'react';
import Image from 'next/image';
import ScrollAnimation from './ScrollAnimation';

interface ComicItemProps {
  title?: string; // Title is now optional
  caption?: string; // Main caption/text
  topLeftCaption?: string; // For text positioned top-left
  bottomRightCaption?: string; // For text positioned bottom-right
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  basis?: string; // Tailwind basis class e.g., 'basis-1/2', 'basis-1/3'
  backgroundClass?: string; // Optional background class e.g., gradient
  animationDelay?: number;
}

export const ComicItem: React.FC<ComicItemProps> = ({
  title,
  caption,
  topLeftCaption,
  bottomRightCaption,
  className = '',
  imageSrc,
  imageAlt = '',
  basis = 'basis-full sm:basis-1/2 md:basis-1/3', // Default flex basis
  backgroundClass = 'bg-white', // Default background
  animationDelay = 0,
}) => {
  // Basic text style from reference
  const textBaseClass = 'absolute bg-white border-2 border-black m-0 py-0.5 px-2.5';
  const topLeftClass = 'top-[-2px] left-[-6px] transform -skew-x-15';
  const bottomRightClass = 'bottom-[-2px] right-[-6px] transform -skew-x-15';

  return (
    <ScrollAnimation delay={animationDelay} className={`p-1 ${basis}`}> {/* Apply basis and padding here */}
      <div
        className={`
          relative flex flex-col justify-center items-center 
          border-2 border-black shadow-[0_6px_6px_-6px_rgba(0,0,0,0.5)] 
          h-48 md:h-56 m-1 overflow-hidden rounded 
          ${backgroundClass} ${className}
        `}
      >
        {/* Optional Image */}
        {imageSrc && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Top Left Caption */}
        {topLeftCaption && (
          <p className={`${textBaseClass} ${topLeftClass} z-10`}>
            {topLeftCaption}
          </p>
        )}

        {/* Main Content Area (Title/Caption) - Center Aligned */}
        <div className="relative z-10 text-center p-2">
          {title && <h3 className="font-semibold mb-1 text-lg text-black">{title}</h3>}
          {caption && (
             // Basic text styling, potentially add speech bubble later
            <p className="text-sm text-black bg-white/70 dark:bg-black/70 p-1 rounded">
              {caption}
            </p>
          )}
        </div>

        {/* Bottom Right Caption */}
        {bottomRightCaption && (
          <p className={`${textBaseClass} ${bottomRightClass} z-10`}>
            {bottomRightCaption}
          </p>
        )}
      </div>
    </ScrollAnimation>
  );
};

// Removed the problematic generateSafelist function 