'use client';

import React from 'react';
import { cn } from '@/lib/utils'; // Corrected import path
import ScrollAnimation from './ScrollAnimation'; // Import ScrollAnimation

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = 'BentoGrid';

interface BentoItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode; // Allow custom content inside the item
  animationDelay?: number;
}

export const BentoItem = React.forwardRef<HTMLDivElement, BentoItemProps>(
  (
    {
      className,
      title,
      description,
      header,
      icon,
      imageSrc,
      imageAlt,
      children,
      animationDelay = 0,
      ...props
    },
    ref
  ) => {
    return (
      <ScrollAnimation delay={animationDelay}> {/* Wrap item in ScrollAnimation */}
        <div
          ref={ref}
          className={cn(
            'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4',
            className
          )}
          {...props}
        >
          {header}
          {imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt || 'Bento item image'}
              className="object-cover w-full h-32 rounded-md" // Adjust styling as needed
            />
          )}
          {children} {/* Render custom children if provided */}
          {!children && ( /* Corrected comment syntax and render default content if no children */
            <div className="group-hover/bento:translate-x-2 transition duration-200">
              {icon}
              <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                {title}
              </div>
              <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                {description}
              </div>
            </div>
          )}
        </div>
      </ScrollAnimation>
    );
  }
);
BentoItem.displayName = 'BentoItem'; 