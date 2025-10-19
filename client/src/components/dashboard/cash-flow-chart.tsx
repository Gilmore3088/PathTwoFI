import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CashFlowChartProps {
  data: {
    income: number;
    expenses: number;
    savings: number;
  } | null;
  className?: string;
}

export function CashFlowChart({ data, className }: CashFlowChartProps) {
  const chartData = data
    ? [
        { label: "Income", value: data.income },
        { label: "Expenses", value: data.expenses },
        { label: "Savings", value: data.savings },
      ]
    : [];

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle>Monthly Cash Flow</CardTitle>
        <CardDescription>Latest reported income, spending, and savings</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] px-0">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 24, left: 24, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "var(--radius)",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center text-muted-foreground">
            <p className="text-sm font-medium">Cash flow data will appear with your next update</p>
            <p className="text-xs">Track income, expenses, and savings to keep this card up to date.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
