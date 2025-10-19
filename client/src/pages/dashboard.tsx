import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressIndicator } from "@/components/dashboard/progress-indicator";
import { NetWorthChart } from "@/components/dashboard/net-worth-chart";
import { AssetAllocationChart } from "@/components/dashboard/asset-allocation-chart";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/ui/seo";
import { TrendingUp, Wallet, PiggyBank, Calendar, Target, DollarSign, Shield, ListChecks } from "lucide-react";
import { FIRE_TARGET } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type AllocationPoint = {
  label: string;
  value: number;
  percentage: number;
};

type TrendPoint = {
  id: string;
  date: string;
  netWorth: number;
  investments: number;
  cash: number;
  liabilities: number;
  savingsRate: number;
};

type WealthSummaryCategory = {
  category: string;
  totalEntries: number;
  range: { start: string; end: string } | null;
  latest: {
    id: string;
    date: string;
    category: string;
    netWorth: number;
    investments: number;
    cash: number;
    liabilities: number;
    fireTarget: number;
    savingsRate: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
  } | null;
  monthlyGrowth: number;
  averageSavingsRate: number;
  trend: TrendPoint[];
  assetAllocation: AllocationPoint[] | null;
  debtBreakdown: AllocationPoint[] | null;
  cashFlow: {
    income: number;
    expenses: number;
    savings: number;
  } | null;
};

type WealthSummaryResponse = {
  categories: WealthSummaryCategory[];
};

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<"Both" | "His" | "Her">("Both");

  const { data, isLoading, isError } = useQuery<WealthSummaryResponse>({
    queryKey: ["/api/wealth-data/summary"],
  });

  const summary = useMemo(
    () => data?.categories.find((category) => category.category === selectedCategory) ?? null,
    [data, selectedCategory],
  );

  const latest = summary?.latest ?? null;
  const target = latest?.fireTarget || FIRE_TARGET;
  const netWorthProgress = latest ? Math.min((latest.netWorth / target) * 100, 999) : 0;

  const previousNetWorth = summary && summary.trend.length > 1
    ? summary.trend[summary.trend.length - 2].netWorth
    : null;

  const netWorthDelta = latest && previousNetWorth !== null
    ? latest.netWorth - previousNetWorth
    : 0;

  const savingsRate = latest?.savingsRate ?? 0;
  const monthlySavings = latest?.monthlySavings ?? 0;
  const remainingToTarget = latest ? Math.max(target - latest.netWorth, 0) : target;
  const monthsToFire = monthlySavings > 0 ? remainingToTarget / monthlySavings : null;
  const yearsToFire = monthsToFire !== null && Number.isFinite(monthsToFire) ? monthsToFire / 12 : null;
  const monthlyGrowthPercent = summary?.monthlyGrowth ?? 0;

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || Number.isNaN(amount)) {
      return "$0";
    }
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (value: number) => {
    if (!Number.isFinite(value)) return "0%";
    return `${value.toFixed(1)}%`;
  };

  const netWorthChangeLabel = netWorthDelta === 0
    ? "No change since last update"
    : `${netWorthDelta > 0 ? "+" : "-"}${formatCurrency(Math.abs(netWorthDelta)).replace("$", "")} since last update`;

  const netWorthChangeType = netWorthDelta > 0 ? "positive" : netWorthDelta < 0 ? "negative" : "neutral";

  const portfolioChangeLabel = monthlyGrowthPercent === 0
    ? "Holding steady this month"
    : monthlyGrowthPercent > 0
      ? `Up ${formatPercent(monthlyGrowthPercent)} month over month`
      : `Down ${formatPercent(Math.abs(monthlyGrowthPercent))} month over month`;

  const portfolioChangeType = monthlyGrowthPercent > 0 ? "positive" : monthlyGrowthPercent < 0 ? "negative" : "neutral";

  if (isLoading) {
    return (
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded mb-8 w-1/3"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl"></div>
                ))}
              </div>
              <div className="h-64 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Wealth dashboard unavailable</h1>
            <p className="text-muted-foreground">
              We couldn't load the latest numbers right now. Please refresh the page or try again in a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasData = Boolean(summary && summary.latest);

  return (
    <div className="py-16 lg:py-20">
      <SEO
        title="Wealth Dashboard - Real-Time FIRE Progress Tracking"
        description="Track our real-time progress toward financial independence. View current net worth, investment growth, savings rate, and estimated time to FIRE."
        keywords="wealth dashboard, FIRE progress, net worth tracking, investment portfolio, financial independence metrics"
        type="website"
        url="/dashboard"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-dashboard-title">
              Wealth Dashboard
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-dashboard-subtitle">
              Real-time tracking of financial progress toward FIRE
            </p>
          </div>

          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  Updated {latest ? format(new Date(latest.date), "PPP") : "soon"}
                </Badge>
                {summary?.range && (
                  <span className="text-sm text-muted-foreground">
                    Tracking since {format(new Date(summary.range.start), "MMMM yyyy")}
                  </span>
                )}
              </div>
              {summary?.totalEntries ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {summary.totalEntries} recorded updates • Category: {selectedCategory}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Add your first wealth entry from the admin dashboard to populate these insights.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Both", "His", "Her"].map((category) => (
                <button
                  key={category}
                  className={cn(
                    buttonVariants({ variant: selectedCategory === category ? "default" : "outline", size: "sm" }),
                    "capitalize",
                  )}
                  onClick={() => setSelectedCategory(category as typeof selectedCategory)}
                  data-testid={`toggle-category-${category.toLowerCase()}`}
                >
                  {category === "Both" ? "Both (Combined)" : category}
                </button>
              ))}
            </div>
          </div>

          {hasData && latest && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center" data-testid="text-fire-progress-title">
                FIRE Progress
              </h2>
              <ProgressIndicator current={latest.netWorth} target={target} />
            </div>
          )}

          {hasData && latest && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <MetricCard
                title="Net Worth"
                value={formatCurrency(latest.netWorth)}
                change={netWorthChangeLabel}
                changeType={netWorthChangeType}
                icon={TrendingUp}
              />
              <MetricCard
                title="Investment Portfolio"
                value={formatCurrency(latest.investments)}
                change={portfolioChangeLabel}
                changeType={portfolioChangeType}
                icon={Wallet}
                iconColor="text-secondary"
              />
              <MetricCard
                title="Cash & Savings"
                value={formatCurrency(latest.cash)}
                icon={DollarSign}
                iconColor="text-accent"
              />
              <MetricCard
                title="Savings Rate"
                value={formatPercent(savingsRate)}
                change="of gross income"
                icon={PiggyBank}
                iconColor="text-chart-3"
              />
            </div>
          )}

          {hasData && latest && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <MetricCard
                title="Liabilities"
                value={formatCurrency(latest.liabilities)}
                icon={Shield}
                iconColor="text-destructive"
              />
              <MetricCard
                title="Years to FIRE"
                value={
                  yearsToFire !== null && Number.isFinite(yearsToFire)
                    ? `${yearsToFire.toFixed(1)} yrs`
                    : "–"
                }
                change={monthlySavings > 0 ? "at current savings pace" : "add monthly savings to estimate"}
                icon={Calendar}
                iconColor="text-chart-4"
              />
              <MetricCard
                title="FIRE Target"
                value={formatCurrency(target)}
                change={`${Math.max(100 - netWorthProgress, 0).toFixed(1)}% remaining`}
                icon={Target}
                iconColor="text-primary"
              />
            </div>
          )}

          {hasData ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <NetWorthChart data={summary?.trend ?? []} />
              <AssetAllocationChart data={summary?.assetAllocation ?? null} />
              <CashFlowChart data={summary?.cashFlow ?? null} />
              <Card className="h-full">
                <CardHeader className="pb-0">
                  <CardTitle>Debt Breakdown</CardTitle>
                  <CardDescription>Monitoring remaining obligations across categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {summary?.debtBreakdown && summary.debtBreakdown.length > 0 ? (
                    summary.debtBreakdown.map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span className="capitalize">{item.label.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{formatCurrency(item.value)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-destructive"
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                      <ListChecks className="h-10 w-10" />
                      <p className="text-sm font-medium">No outstanding liabilities recorded</p>
                      <p className="text-xs">You're debt-free in this category—amazing progress!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Waiting for your first update</CardTitle>
                <CardDescription>
                  The dashboard will spring to life after you log the first wealth snapshot in the admin tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="/admin/wealth">Add wealth data</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/blog">Read how we invest</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
