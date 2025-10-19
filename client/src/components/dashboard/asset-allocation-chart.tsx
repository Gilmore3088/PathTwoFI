import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AllocationPoint {
  label: string;
  value: number;
  percentage: number;
}

interface AssetAllocationChartProps {
  data: AllocationPoint[] | null;
  className?: string;
}

const BAR_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function formatLabel(label: string) {
  return label.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
}

export function AssetAllocationChart({ data, className }: AssetAllocationChartProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Latest portfolio mix by category</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {data && data.length > 0 ? (
          <div className="space-y-5">
            {data.map((item, index) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="capitalize">{formatLabel(item.label)}</span>
                  <span>
                    ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span className="ml-2 text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                  </span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <p className="text-sm font-medium">No allocation data available yet</p>
            <p className="text-xs">Record a new update to breakdown where your dollars live.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
