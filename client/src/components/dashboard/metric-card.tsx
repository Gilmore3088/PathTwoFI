import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  iconColor = "text-primary" 
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-primary";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground" data-testid={`text-metric-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</span>
        <Icon className={`h-5 w-5 ${iconColor}`} data-testid={`icon-metric-${title.toLowerCase().replace(/\s+/g, '-')}`} />
      </div>
      <div className="text-2xl font-bold text-foreground" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {value}
      </div>
      {change && (
        <div className="flex items-center mt-2">
          <span className={`text-xs ${getChangeColor()}`} data-testid={`text-metric-change-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
