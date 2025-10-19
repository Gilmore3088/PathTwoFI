import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CashFlowData {
  income: number;
  expenses: number;
  savings: number;
}

interface CashFlowChartProps {
  data: CashFlowData | null;
  className?: string;
}

const FLOW_CONFIG = [
  { key: "income" as const, label: "Income", color: "hsl(var(--chart-1))" },
  { key: "expenses" as const, label: "Expenses", color: "hsl(var(--destructive))" },
  { key: "savings" as const, label: "Savings", color: "hsl(var(--chart-3))" },
];

export function CashFlowChart({ data, className }: CashFlowChartProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Monthly Cash Flow</CardTitle>
        <CardDescription>Latest snapshot of income, expenses, and savings</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {data ? (
          <div className="space-y-5">
            {FLOW_CONFIG.map((item) => {
              const value = Math.max(data[item.key] ?? 0, 0);
              const total = Math.max(data.income ?? 0, 1);
              const width = item.key === "income" ? 100 : Math.min((value / total) * 100, 100);
              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{item.label}</span>
                    <span>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${width}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <p className="text-sm font-medium">No cash flow data yet</p>
            <p className="text-xs">Track monthly income and expenses to visualise savings momentum.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
