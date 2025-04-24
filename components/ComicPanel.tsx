import Link from 'next/link';
import React from 'react';

interface ComicPanelProps {
  /** Optional: URL for the background image */
  imageSrc?: string;
  /** Optional: Text for the corner caption */
  title?: string;
  /** Optional: Position for the corner caption */
  titlePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Optional: Text for the description block */
  description?: string;
  /** Optional: Position for the description block */
  descriptionPosition?: 'top' | 'bottom';
  /** Content to render inside the panel (e.g., speech bubbles) */
  children?: React.ReactNode;
  /** Additional CSS classes for grid layout or custom styling */
  className?: string;
  /** Additional CSS classes for the children */
  childrenClassName?: string;
  /** Optional: URL to link the panel to */
  href?: string;
}

const ComicPanel: React.FC<ComicPanelProps> = ({
  imageSrc,
  title,
  titlePosition = 'top-left', // Default title position
  description,
  descriptionPosition = 'bottom', // Default description position
  children,
  className = '',
  childrenClassName = '',
  href, // Destructure the new href prop
}) => {
  // Set background image style if imageSrc is provided
  const panelStyle: React.CSSProperties = imageSrc
    ? { backgroundImage: `url(${imageSrc})` }
    : {};

  // Determine the CSS class for the title/caption
  const titleClass = `text ${titlePosition}`;
  // Determine the CSS class for the description
  const descriptionClass = `description description-${descriptionPosition}`;

  // Hover effect classes - applied to the inner styling div
  // const hoverClasses = href
  //   ? 'hover:scale-[1.02] hover:brightness-110 hover:border-4 hover:border-accent transition-all duration-200 ease-in-out'
  //   : '';

  return (
    // 1. Outermost div: Always present, receives grid layout classes.
    // Added relative positioning to act as a container for the absolute link.
    <div className={`${className} relative`}>
      {/* 2. Inner div: Handles visual styling (panel class, background) */}
      {/* Conditionally add the panel-link-hover class if href is present */}
      <div
        className={`panel ${href ? 'panel-link-hover' : ''} h-full w-full transition-all duration-200 ease-in-out`} // Add base transition here
        style={panelStyle}
      >
        {/* Render title/caption - Add z-index to ensure they are above the link overlay */}
        {title && <p className={`${titleClass} relative z-10`}>{title}</p>}

        {/* Render description - Add z-index */}
        {description && <p className={`${descriptionClass} relative z-10`}>{description}</p>}

        {/* Children Wrapper */}
        <div className={`relative z-0 ${childrenClassName} h-full overflow-auto`}>
          {children}
        </div>

        {/* 3. Conditionally render the Link overlay */}
        {href && (
          <Link href={href} legacyBehavior>
            {/* Make the link cover the entire panel area using absolute positioning */}
            {/* z-0 places it below text (z-10) but clickable */}
            <a className="absolute inset-0 z-0" aria-label={title || 'Panel link'}></a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ComicPanel; 