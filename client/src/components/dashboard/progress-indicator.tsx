interface ProgressIndicatorProps {
  current: number;
  target: number;
  label?: string;
}

export function ProgressIndicator({ current, target, label = "FIRE Progress" }: ProgressIndicatorProps) {
  const safeTarget = target > 0 ? target : 1;
  const percentage = Math.min((current / safeTarget) * 100, 100);
  
  return (
    <div className="bg-card rounded-lg border border-border p-6 max-w-md mx-auto" data-testid="component-fire-progress">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground" data-testid="text-progress-label">{label}</span>
        <span className="text-sm font-bold text-foreground" data-testid="text-progress-percentage">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div 
          className="progress-bar h-3 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
          data-testid="progress-bar"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2" data-testid="text-progress-amount">
        ${current.toLocaleString()} of ${safeTarget.toLocaleString()} target
      </p>
    </div>
  );
}
