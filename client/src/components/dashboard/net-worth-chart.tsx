import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TrendPoint {
  date: string | Date;
  netWorth: number;
  investments: number;
  cash: number;
}

interface NetWorthChartProps {
  data: TrendPoint[];
  className?: string;
}

const LINE_COLORS = {
  netWorth: "hsl(var(--primary))",
  investments: "hsl(var(--chart-1))",
  cash: "hsl(var(--chart-3))",
};

const LABELS: Record<keyof typeof LINE_COLORS, string> = {
  netWorth: "Net Worth",
  investments: "Investments",
  cash: "Cash",
};

function normaliseSeries(values: number[], height: number) {
  const sanitized = values.map((value) => (Number.isFinite(value) ? Math.max(value, 0) : 0));
  const max = Math.max(...sanitized, 1);
  return sanitized.map((value) => height - (value / max) * (height - 10));
}

export function NetWorthChart({ data, className }: NetWorthChartProps) {
  if (!data.length) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader className="pb-0">
          <CardTitle>Net Worth Trend</CardTitle>
          <CardDescription>Log a few wealth updates to unlock the timeline.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
          No history to visualise yet.
        </CardContent>
      </Card>
    );
  }

  const pointsCount = data.length;
  const width = 100;
  const height = 100;
  const step = pointsCount > 1 ? width / (pointsCount - 1) : 0;

  const netWorthSeries = data.map((point) => point.netWorth);
  const investmentSeries = data.map((point) => point.investments);
  const cashSeries = data.map((point) => point.cash);

  const netWorthPoints = normaliseSeries(netWorthSeries, height);
  const investmentPoints = normaliseSeries(investmentSeries, height);
  const cashPoints = normaliseSeries(cashSeries, height);

  const buildLine = (values: number[]) =>
    values
      .map((value, index) => {
        const x = pointsCount > 1 ? index * step : width / 2;
        return `${x.toFixed(2)},${value.toFixed(2)}`;
      })
      .join(" ");

  const areaPath = (() => {
    const topLine = buildLine(netWorthPoints);
    if (!topLine) return "";
    const firstX = 0;
    const lastX = pointsCount > 1 ? (pointsCount - 1) * step : width / 2;
    return `M ${firstX},${height} ${topLine} L ${lastX},${height} Z`;
  })();

  const latest = data[data.length - 1];
  const first = data[0];

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Net Worth Trend</CardTitle>
        <CardDescription>
          {format(new Date(first.date), "MMM yyyy")} – {format(new Date(latest.date), "MMM yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[260px] w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="netWorthFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={LINE_COLORS.netWorth} stopOpacity={0.3} />
                <stop offset="100%" stopColor={LINE_COLORS.netWorth} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#netWorthFill)" stroke="none" />
            <polyline
              fill="none"
              stroke={LINE_COLORS.netWorth}
              strokeWidth={1.8}
              points={buildLine(netWorthPoints)}
              strokeLinecap="round"
            />
            <polyline
              fill="none"
              stroke={LINE_COLORS.investments}
              strokeWidth={1.4}
              points={buildLine(investmentPoints)}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            <polyline
              fill="none"
              stroke={LINE_COLORS.cash}
              strokeWidth={1.4}
              points={buildLine(cashPoints)}
              strokeDasharray="2 3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {(Object.keys(LINE_COLORS) as Array<keyof typeof LINE_COLORS>).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LINE_COLORS[key] }} />
              <span>{LABELS[key]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
