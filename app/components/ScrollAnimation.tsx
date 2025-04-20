'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.2, // Trigger when 20% of the element is in view
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: once, amount: amount });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: duration, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation; 