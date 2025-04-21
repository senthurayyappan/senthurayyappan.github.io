import React from 'react';

interface ComicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ComicLayout: React.FC<ComicLayoutProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex flex-wrap p-1 ${className}`}
    >
      {children}
    </div>
  );
}; 