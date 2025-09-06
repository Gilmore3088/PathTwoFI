import { useEffect, useState } from 'react';

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
}

// Hook for calculating estimated reading time based on content
export function useEstimatedReadingTime(content: string, wordsPerMinute: number = 200) {
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

// Hook for reading time and progress tracking
export function useReadingStats(content: string) {
  const progress = useReadingProgress();
  const estimatedTime = useEstimatedReadingTime(content);
  const timeRead = Math.round((progress / 100) * estimatedTime);
  const timeRemaining = Math.max(0, estimatedTime - timeRead);

  return {
    progress,
    estimatedTime,
    timeRead,
    timeRemaining,
    isCompleted: progress >= 95, // Consider 95% as completed
  };
}