import { useQuery } from "@tanstack/react-query";
import { WealthData } from "@shared/schema";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressIndicator } from "@/components/dashboard/progress-indicator";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, PiggyBank, Calendar, ChartArea, DollarSign, Target } from "lucide-react";
import { FIRE_TARGET } from "@/lib/constants";

export default function Dashboard() {
  // Fetch all wealth data for charts
  const { data: wealthData, isLoading: wealthLoading } = useQuery<WealthData[]>({
    queryKey: ["/api/wealth-data"],
  });

  // Fetch latest wealth data for current metrics
  const { data: latestWealth, isLoading: latestLoading } = useQuery<WealthData>({
    queryKey: ["/api/wealth-data/latest"],
  });

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString();
  };

  const calculateProgress = () => {
    if (!latestWealth) return { percentage: 0, monthlyGrowth: 0, yearsToFire: 0 };
    
    const current = parseFloat(latestWealth.netWorth);
    const percentage = (current / FIRE_TARGET) * 100;
    
    // Calculate monthly growth rate from recent data
    const monthlyGrowth = wealthData && wealthData.length > 1 
      ? ((parseFloat(wealthData[wealthData.length - 1].netWorth) - parseFloat(wealthData[wealthData.length - 2].netWorth)) / parseFloat(wealthData[wealthData.length - 2].netWorth)) * 100
      : 0;
    
    // Estimate years to FIRE based on current savings rate and growth
    const savingsRate = parseFloat(latestWealth.savingsRate) / 100;
    const yearsToFire = savingsRate > 0 ? ((FIRE_TARGET - current) / (current * savingsRate / 12)) / 12 : 0;
    
    return { percentage, monthlyGrowth, yearsToFire };
  };

  const { percentage, monthlyGrowth, yearsToFire } = calculateProgress();

  if (latestLoading) {
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

  return (
    <div className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-dashboard-title">
              Wealth Dashboard
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-dashboard-subtitle">
              Real-time tracking of financial progress toward FIRE
            </p>
          </div>

          {/* FIRE Progress Section */}
          {latestWealth && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center" data-testid="text-fire-progress-title">
                FIRE Progress
              </h2>
              <ProgressIndicator 
                current={parseFloat(latestWealth.netWorth)} 
                target={FIRE_TARGET} 
              />
            </div>
          )}

          {/* Key Metrics */}
          {latestWealth && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <MetricCard
                title="Net Worth"
                value={`$${formatCurrency(latestWealth.netWorth)}`}
                change={`+${monthlyGrowth.toFixed(1)}% this month`}
                changeType="positive"
                icon={TrendingUp}
              />
              <MetricCard
                title="Investment Portfolio"
                value={`$${formatCurrency(latestWealth.investments)}`}
                change="+8.7% YTD"
                changeType="positive"
                icon={Wallet}
                iconColor="text-secondary"
              />
              <MetricCard
                title="Cash & Savings"
                value={`$${formatCurrency(latestWealth.cash)}`}
                icon={DollarSign}
                iconColor="text-accent"
              />
              <MetricCard
                title="Savings Rate"
                value={`${parseFloat(latestWealth.savingsRate)}%`}
                change="of gross income"
                icon={PiggyBank}
                iconColor="text-chart-3"
              />
            </div>
          )}

          {/* Additional Metrics */}
          {latestWealth && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <MetricCard
                title="Liabilities"
                value={`$${formatCurrency(latestWealth.liabilities)}`}
                icon={Target}
                iconColor="text-destructive"
              />
              <MetricCard
                title="Years to FIRE"
                value={yearsToFire.toFixed(1)}
                change="at current rate"
                icon={Calendar}
                iconColor="text-chart-4"
              />
              <MetricCard
                title="FIRE Target"
                value={`$${formatCurrency(FIRE_TARGET)}`}
                change={`${(100 - percentage).toFixed(1)}% remaining`}
                icon={Target}
                iconColor="text-primary"
              />
            </div>
          )}

          {/* Charts Section */}
          <div className="space-y-8">
            {/* Net Worth Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground" data-testid="text-net-worth-chart-title">
                  Net Worth Over Time
                </h3>
                <div className="flex space-x-2">
                  <Button size="sm" data-testid="button-chart-6m">6M</Button>
                  <Button size="sm" variant="outline" data-testid="button-chart-1y">1Y</Button>
                  <Button size="sm" variant="outline" data-testid="button-chart-all">All</Button>
                </div>
              </div>
              
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border" data-testid="placeholder-net-worth-chart">
                <div className="text-center">
                  <ChartArea className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">Net Worth Trend Chart</p>
                  <p className="text-xs text-muted-foreground mt-1">Line chart showing wealth growth over time</p>
                </div>
              </div>
            </div>

            {/* Asset Allocation Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6" data-testid="text-allocation-chart-title">
                Asset Allocation
              </h3>
              
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border" data-testid="placeholder-allocation-chart">
                <div className="text-center">
                  <ChartArea className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">Asset Allocation Pie Chart</p>
                  <p className="text-xs text-muted-foreground mt-1">Breakdown of investments, cash, and other assets</p>
                </div>
              </div>
            </div>

            {/* FIRE Progress Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6" data-testid="text-fire-chart-title">
                FIRE Progress Timeline
              </h3>
              
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border" data-testid="placeholder-fire-chart">
                <div className="text-center">
                  <ChartArea className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">FIRE Progress Projection</p>
                  <p className="text-xs text-muted-foreground mt-1">Projected timeline to reach financial independence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          {wealthData && (
            <div className="mt-12 bg-muted/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-data-summary-title">
                Data Summary
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Data Points:</span>
                  <span className="font-medium text-foreground ml-2" data-testid="text-data-points">
                    {wealthData.length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tracking Since:</span>
                  <span className="font-medium text-foreground ml-2" data-testid="text-tracking-since">
                    {wealthData.length > 0 ? new Date(wealthData[0].date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium text-foreground ml-2" data-testid="text-last-updated">
                    {latestWealth ? new Date(latestWealth.date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
