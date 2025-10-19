import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type TrendPoint = {
  date: string | Date;
  netWorth: number;
  investments: number;
  cash: number;
  liabilities: number;
};

interface NetWorthChartProps {
  data: TrendPoint[];
  className?: string;
}

export function NetWorthChart({ data, className }: NetWorthChartProps) {
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        date: typeof point.date === "string" ? point.date : point.date.toISOString(),
        label: format(new Date(point.date), "MMM yyyy"),
        netWorth: Math.round(point.netWorth),
        investments: Math.round(point.investments),
        cash: Math.round(point.cash),
      })),
    [data],
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Net Worth Growth</CardTitle>
        <CardDescription>Tracking combined assets and liquidity over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] px-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 24, left: 24, right: 24, bottom: 8 }}>
            <defs>
              <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="text-muted" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "var(--radius)",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Area type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" fill="url(#colorNetWorth)" strokeWidth={2} />
            <Area type="monotone" dataKey="investments" stroke="hsl(var(--chart-1))" fill="url(#colorInvestments)" strokeWidth={2} />
            <Area type="monotone" dataKey="cash" stroke="hsl(var(--chart-3))" fill="url(#colorCash)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
