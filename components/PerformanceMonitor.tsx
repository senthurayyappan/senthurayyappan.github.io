'use client'

import { useEffect } from 'react';

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and when Performance API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined' || !window.performance) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const metrics: Partial<PerformanceMetrics> = {};

      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
            break;
          
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            break;
          
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            break;
          
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
            break;
          
          case 'first-input':
            metrics.fid = (entry as any).processingStart - entry.startTime;
            break;
        }
      });

      // Log metrics for debugging (remove in production)
      if (Object.keys(metrics).length > 0) {
        console.log('Performance metrics:', metrics);
      }
    });

    // Observe different performance entry types
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (error) {
      // Fallback for browsers that don't support all entry types
      console.warn('Performance monitoring not fully supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  // This component doesn't render anything
  return null;
}

export default PerformanceMonitor; 