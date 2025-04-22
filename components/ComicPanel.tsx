import React from 'react';

interface ComicPanelProps {
  /** Optional: URL for the background image */
  imageSrc?: string;
  /** Optional: Text for the caption */
  title?: string;
  /** Optional: Position for the caption */
  titlePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Content to render inside the panel (e.g., speech bubbles) */
  children?: React.ReactNode;
  /** Additional CSS classes for grid layout or custom styling */
  className?: string;
}

const ComicPanel: React.FC<ComicPanelProps> = ({
  imageSrc,
  title,
  titlePosition = 'top-left', // Default title position
  children,
  className = '',
}) => {
  // Set background image style if imageSrc is provided
  const panelStyle: React.CSSProperties = imageSrc
    ? { backgroundImage: `url(${imageSrc})` }
    : {};

  // Determine the CSS class for the title/caption
  const titleClass = `text ${titlePosition}`;

  return (
    <div className={`panel ${className}`} style={panelStyle}>
      {/* Render the title/caption if provided */}
      {title && <p className={titleClass}>{title}</p>}

      {/* Render any children passed to the component */}
      {children}
    </div>
  );
};

export default ComicPanel; 