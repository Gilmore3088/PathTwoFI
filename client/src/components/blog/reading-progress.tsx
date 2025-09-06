import { useReadingProgress } from "@/hooks/use-reading-progress";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
  showPercentage?: boolean;
}

export function ReadingProgress({ className, showPercentage = false }: ReadingProgressProps) {
  const progress = useReadingProgress();

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50", className)}>
      <div className="h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="absolute top-2 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

interface ReadingTimeDisplayProps {
  estimatedTime: number;
  timeRead?: number;
  timeRemaining?: number;
  className?: string;
}

export function ReadingTimeDisplay({ 
  estimatedTime, 
  timeRead, 
  timeRemaining, 
  className 
}: ReadingTimeDisplayProps) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-2">
        <span>📖 {estimatedTime} min read</span>
        {timeRead !== undefined && timeRemaining !== undefined && (
          <>
            <span>•</span>
            <span>⏱️ {timeRemaining} min left</span>
          </>
        )}
      </span>
    </div>
  );
}