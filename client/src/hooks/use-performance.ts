import { useEffect, useState } from "react";

// Hook for monitoring performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    cls: 0, // Cumulative Layout Shift
    fid: 0, // First Input Delay
    ttfb: 0, // Time to First Byte
  });

  useEffect(() => {
    // Check if Performance Observer is supported
    if ('PerformanceObserver' in window) {
      // Measure First Contentful Paint and Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }));
          }
          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
      } catch (e) {
        // Some browsers might not support all entry types
        console.warn('Performance Observer not fully supported');
      }

      // Measure TTFB using Navigation Timing
      if ('navigation' in performance) {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          setMetrics(prev => ({ 
            ...prev, 
            ttfb: navigationEntry.responseStart - navigationEntry.requestStart 
          }));
        }
      }

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
}

// Hook for prefetching pages on hover
export function usePrefetch() {
  const prefetchedUrls = new Set<string>();

  const prefetchPage = (url: string) => {
    if (prefetchedUrls.has(url)) return;
    
    prefetchedUrls.add(url);
    
    // Prefetch HTML
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    // Optionally prefetch API data
    if (url.includes('/blog/')) {
      const slug = url.split('/blog/')[1];
      const apiLink = document.createElement('link');
      apiLink.rel = 'prefetch';
      apiLink.href = `/api/blog-posts/${slug}`;
      document.head.appendChild(apiLink);
    }
  };

  return { prefetchPage };
}

// Hook for connection-aware loading
export function useConnectionAware() {
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: '4g',
    saveData: false,
    downlink: 10,
  });

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnection = () => {
        setConnectionInfo({
          effectiveType: connection.effectiveType || '4g',
          saveData: connection.saveData || false,
          downlink: connection.downlink || 10,
        });
      };

      updateConnection();
      connection.addEventListener('change', updateConnection);
      
      return () => connection.removeEventListener('change', updateConnection);
    }
  }, []);

  const shouldLoadHighQuality = () => {
    return connectionInfo.effectiveType === '4g' && 
           !connectionInfo.saveData && 
           connectionInfo.downlink > 1.5;
  };

  const shouldPreload = () => {
    return shouldLoadHighQuality() && connectionInfo.downlink > 5;
  };

  return {
    connectionInfo,
    shouldLoadHighQuality,
    shouldPreload,
  };
}

// Hook for reducing motion based on user preferences
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
}

// Hook for viewport-based loading
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
}