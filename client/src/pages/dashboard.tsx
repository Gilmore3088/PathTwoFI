import { useState, useMemo } from "react";
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
import { TrendingUp, Wallet, PiggyBank, Calendar, ChartArea, DollarSign, Target, Users, User, Heart, Shield, ListChecks } from "lucide-react";
import { FIRE_TARGET } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { WealthData } from "@shared/schema";

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

  // Fetch all wealth data for selected category for charts
  const { data: wealthData, isLoading: wealthLoading } = useQuery<WealthData[]>({
    queryKey: ["/api/wealth-data", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/wealth-data?category=${selectedCategory}`);
      return response.json();
    }
  });

  // Fetch latest wealth data for selected category for current metrics
  const { data: latestWealth, isLoading: latestLoading } = useQuery<WealthData | undefined>({
    queryKey: ["/api/wealth-data/latest", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/wealth-data/latest?category=${selectedCategory}`);
      if (!response.ok) {
        return undefined;
      }
      return response.json();
    }
  });

  const latest = latestWealth ?? null;
  const target = latest?.fireTarget ? parseFloat(latest.fireTarget) : FIRE_TARGET;
  const netWorthValue = latest ? parseFloat(latest.netWorth) : 0;
  const netWorthProgress = latest ? Math.min((netWorthValue / target) * 100, 999) : 0;

  const previousNetWorth = wealthData && wealthData.length > 1
    ? parseFloat(wealthData[1].netWorth)
    : null;

  const netWorthDelta = latest && previousNetWorth !== null
    ? netWorthValue - previousNetWorth
    : 0;

  const savingsRate = latest?.savingsRate ? parseFloat(latest.savingsRate) : 0;
  const monthlySavings = latest?.monthlySavings ? parseFloat(latest.monthlySavings) : 0;
  const remainingToTarget = latest ? Math.max(target - netWorthValue, 0) : target;
  const monthsToFire = monthlySavings > 0 ? remainingToTarget / monthlySavings : null;
  const yearsToFire = monthsToFire !== null && Number.isFinite(monthsToFire) ? monthsToFire / 12 : null;
  const monthlyGrowthPercent = 0;

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

  if (wealthLoading || latestLoading) {
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


  const hasData = Boolean(latestWealth);

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-dashboard-title">
              Wealth Dashboard
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-dashboard-subtitle">
              Real-time tracking of financial progress toward FIRE
            </p>
          </div>

          {/* Category Selector */}
          <div className="flex justify-center gap-3 mb-12">
            <Button
              variant={selectedCategory === "Both" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Both")}
              data-testid="button-category-both"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Both (Combined)
            </Button>
            <Button
              variant={selectedCategory === "His" ? "default" : "outline"}
              onClick={() => setSelectedCategory("His")}
              data-testid="button-category-his"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              His
            </Button>
            <Button
              variant={selectedCategory === "Her" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Her")}
              data-testid="button-category-her"
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Hers
            </Button>
          </div>

          {/* No Data Message */}
          {!latestLoading && !latestWealth && (
            <div className="text-center py-16 bg-muted/30 rounded-xl mb-12">
              <ChartArea className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Data Available</h3>
              <p className="text-muted-foreground mb-4">
                No wealth data found for "{selectedCategory}" category.
              </p>
              <p className="text-sm text-muted-foreground">
                Try selecting a different category or add wealth data from the admin panel.
              </p>
            </div>
          )}

          {/* FIRE Progress Section */}
          {latestWealth && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center" data-testid="text-fire-progress-title">
                FIRE Progress
              </h2>
              <ProgressIndicator current={netWorthValue} target={target} />
            </div>
          )}

          {hasData && latest && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <MetricCard
                title="Net Worth"
                value={formatCurrency(netWorthValue)}
                change={netWorthChangeLabel}
                changeType={netWorthChangeType}
                icon={TrendingUp}
              />
              <MetricCard
                title="Investment Portfolio"
                value={formatCurrency(parseFloat(latest.investments))}
                change={portfolioChangeLabel}
                changeType={portfolioChangeType}
                icon={Wallet}
                iconColor="text-secondary"
              />
              <MetricCard
                title="Cash & Savings"
                value={formatCurrency(parseFloat(latest.cash))}
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
                value={formatCurrency(parseFloat(latest.liabilities))}
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

          {hasData && wealthData && wealthData.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <NetWorthChart data={wealthData.map(d => ({
                id: d.id,
                date: format(new Date(d.date!), 'MMM dd'),
                netWorth: parseFloat(d.netWorth),
                investments: parseFloat(d.investments),
                cash: parseFloat(d.cash),
                liabilities: parseFloat(d.liabilities),
                savingsRate: parseFloat(d.savingsRate)
              }))} />
              <AssetAllocationChart data={null} />
              <CashFlowChart data={latest ? {
                income: latest.monthlyIncome ? parseFloat(latest.monthlyIncome) : 0,
                expenses: latest.monthlyExpenses ? parseFloat(latest.monthlyExpenses) : 0,
                savings: latest.monthlySavings ? parseFloat(latest.monthlySavings) : 0
              } : null} />
              <Card className="h-full">
                <CardHeader className="pb-0">
                  <CardTitle>Debt Breakdown</CardTitle>
                  <CardDescription>Monitoring remaining obligations across categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                    <ListChecks className="h-10 w-10" />
                    <p className="text-sm font-medium">No outstanding liabilities recorded</p>
                    <p className="text-xs">You're debt-free in this category—amazing progress!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : !latestLoading && !wealthLoading ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
