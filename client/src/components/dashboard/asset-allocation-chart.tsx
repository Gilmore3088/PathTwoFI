import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface AllocationPoint {
  label: string;
  value: number;
  percentage: number;
}

interface AssetAllocationChartProps {
  data: AllocationPoint[] | null;
  className?: string;
}

export function AssetAllocationChart({ data, className }: AssetAllocationChartProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Where the latest contributions are invested</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] px-0">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props) => {
                  const point = props.payload as AllocationPoint;
                  return [`$${value.toLocaleString()}`, `${point.percentage.toFixed(1)}% ${name}`];
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "var(--radius)",
                  border: "1px solid hsl(var(--border))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center text-muted-foreground">
            <p className="text-sm font-medium">No allocation data available yet</p>
            <p className="text-xs">Add a new wealth entry to visualize your portfolio mix.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
