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
}

const ComicPanel: React.FC<ComicPanelProps> = ({
  imageSrc,
  title,
  titlePosition = 'top-left', // Default title position
  description,
  descriptionPosition = 'bottom', // Default description position
  children,
  className = '',
}) => {
  // Set background image style if imageSrc is provided
  const panelStyle: React.CSSProperties = imageSrc
    ? { backgroundImage: `url(${imageSrc})` }
    : {};

  // Determine the CSS class for the title/caption
  const titleClass = `text ${titlePosition}`;
  // Determine the CSS class for the description
  const descriptionClass = `description description-${descriptionPosition}`;

  return (
    <div className={`panel ${className}`} style={panelStyle}>
      {/* Render the title/caption if provided */}
      {title && <p className={titleClass}>{title}</p>}

      {/* Render the description block if provided */}
      {description && <p className={descriptionClass}>{description}</p>}

      {/* Render any children passed to the component */}
      {children}
    </div>
  );
};

export default ComicPanel; 