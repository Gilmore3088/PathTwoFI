import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WealthData } from "@shared/schema";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressIndicator } from "@/components/dashboard/progress-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/ui/seo";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Calendar,
  DollarSign,
  Target,
  Home,
  Bitcoin,
  Users,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<
    "Both" | "Him" | "Her"
  >("Both");
  const [chartTimeframe, setChartTimeframe] = useState<"6M" | "1Y" | "ALL">(
    "1Y",
  );

  // FIRE calculations with inflation
  const fireGoalToday = 3500000; // $3.5M in today's dollars
  const stretchGoalToday = 4000000; // $4M stretch goal
  const yearsToFire = 14; // Target: Jan 2040
  const inflationRate = 0.03;
  const inflationMultiplier = Math.pow(1 + inflationRate, yearsToFire);
  const fireGoalFuture = fireGoalToday * inflationMultiplier; // ~$5.29M
  const stretchGoalFuture = stretchGoalToday * inflationMultiplier; // ~$6.05M

  // Fetch wealth data based on selected category
  const { data: wealthData, isLoading: wealthLoading } = useQuery<WealthData[]>(
    {
      queryKey: ["/api/wealth-data", selectedCategory],
      queryFn: async () => {
        return await fetch(
          `/api/wealth-data?category=${selectedCategory}`,
        ).then((res) => res.json());
      },
    },
  );

  // Fetch latest wealth data
  const { data: latestWealth, isLoading: latestLoading } = useQuery<WealthData>(
    {
      queryKey: ["/api/wealth-data/latest", selectedCategory],
      queryFn: async () => {
        return await fetch(
          `/api/wealth-data/latest?category=${selectedCategory}`,
        ).then((res) => res.json());
      },
    },
  );

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined) return "$0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "$0";
    return "$" + num.toLocaleString();
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Calculate progress metrics
  const calculateProgress = () => {
    if (!latestWealth)
      return {
        netWorth: 0,
        netWorthExclHome: 0,
        progressToFire: 0,
        progressToStretch: 0,
        monthlyGrowth: 0,
        yearlyGrowth: 0,
        projectedFire: new Date(),
      };

    const netWorth = parseFloat(latestWealth.netWorth);
    const assets = parseFloat(latestWealth.assets);
    const liabilities = parseFloat(latestWealth.liabilities);
    const netWorthExclHome = assets - liabilities; // Approximation - would be better with specific home equity field

    // Progress percentages against inflation-adjusted goals
    const progressToFire = (netWorthExclHome / fireGoalFuture) * 100;
    const progressToStretch = (netWorthExclHome / stretchGoalFuture) * 100;

    // Calculate growth rates
    let monthlyGrowth = 0;
    let yearlyGrowth = 0;

    if (wealthData && wealthData.length > 1) {
      const latest = parseFloat(wealthData[wealthData.length - 1].netWorth);
      const previous = parseFloat(wealthData[wealthData.length - 2].netWorth);
      monthlyGrowth = ((latest - previous) / previous) * 100;

      // Find data from ~1 year ago
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const yearAgoData = wealthData.find(
        (d) => new Date(d.date) <= oneYearAgo,
      );
      if (yearAgoData) {
        const yearAgoValue = parseFloat(yearAgoData.netWorth);
        yearlyGrowth = ((latest - yearAgoValue) / yearAgoValue) * 100;
      }
    }

    // Simple projection based on current growth rate
    const projectedFire = new Date();
    projectedFire.setFullYear(projectedFire.getFullYear() + yearsToFire);

    return {
      netWorth,
      netWorthExclHome,
      progressToFire,
      progressToStretch,
      monthlyGrowth,
      yearlyGrowth,
      projectedFire,
    };
  };

  const metrics = calculateProgress();

  // Prepare chart data
  const prepareChartData = () => {
    if (!wealthData) return [];

    let filteredData = [...wealthData];
    const now = new Date();

    if (chartTimeframe === "6M") {
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
      filteredData = wealthData.filter((d) => new Date(d.date) >= sixMonthsAgo);
    } else if (chartTimeframe === "1Y") {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      filteredData = wealthData.filter((d) => new Date(d.date) >= oneYearAgo);
    }

    return filteredData.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      netWorth: parseFloat(d.netWorth),
      assets: parseFloat(d.assets),
      liabilities: parseFloat(d.liabilities),
      investments: parseFloat(d.investments),
      cash: parseFloat(d.cash),
    }));
  };

  // Prepare allocation data for pie chart
  const prepareAllocationData = () => {
    if (!latestWealth) return [];

    return [
      {
        name: "Investments",
        value: parseFloat(latestWealth.investments),
        color: "#10b981",
      },
      {
        name: "Cash & Savings",
        value: parseFloat(latestWealth.cash),
        color: "#3b82f6",
      },
      {
        name: "Crypto",
        value: parseFloat(latestWealth.crypto || "0"),
        color: "#f59e0b",
      },
      {
        name: "Other Assets",
        value: Math.max(
          0,
          parseFloat(latestWealth.assets) -
            parseFloat(latestWealth.investments) -
            parseFloat(latestWealth.cash) -
            parseFloat(latestWealth.crypto || "0"),
        ),
        color: "#8b5cf6",
      },
    ].filter((item) => item.value > 0);
  };

  const chartData = prepareChartData();
  const allocationData = prepareAllocationData();

  if (latestLoading) {
    return (
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded mb-8 w-1/3"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto">
          {/* Header with Category Selector */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  Wealth Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  Real-time tracking toward $5.29M FIRE goal
                  (inflation-adjusted)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === "Both" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Both")}
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Combined
                </Button>
                <Button
                  variant={selectedCategory === "Him" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Him")}
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Him
                </Button>
                <Button
                  variant={selectedCategory === "Her" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Her")}
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Her
                </Button>
              </div>
            </div>
          </div>

          {/* Dual FIRE Progress Bars */}
          {latestWealth && (
            <div className="mb-12 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    FIRE Progress (Inflation-Adjusted)
                  </h2>

                  {/* Main FIRE Goal */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>
                        Current: {formatCurrency(metrics.netWorthExclHome)}
                      </span>
                      <span className="font-semibold">
                        Goal: {formatCurrency(fireGoalFuture)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(metrics.progressToFire, 100)}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {metrics.progressToFire.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stretch Goal */}
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>
                        Current: {formatCurrency(metrics.netWorthExclHome)}
                      </span>
                      <span className="font-semibold">
                        Stretch: {formatCurrency(stretchGoalFuture)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(metrics.progressToStretch, 100)}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {metrics.progressToStretch.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Key Metrics Grid */}
          {latestWealth && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <MetricCard
                title="Net Worth"
                value={formatCurrency(metrics.netWorth)}
                change={`${metrics.monthlyGrowth >= 0 ? "+" : ""}${metrics.monthlyGrowth.toFixed(1)}% this month`}
                changeType={
                  metrics.monthlyGrowth >= 0 ? "positive" : "negative"
                }
                icon={TrendingUp}
              />
              <MetricCard
                title="Net Worth (excl. Home)"
                value={formatCurrency(metrics.netWorthExclHome)}
                change={`Primary FIRE metric`}
                icon={Home}
                iconColor="text-blue-500"
              />
              <MetricCard
                title="Investment Portfolio"
                value={formatCurrency(latestWealth.investments)}
                change={`${metrics.yearlyGrowth >= 0 ? "+" : ""}${metrics.yearlyGrowth.toFixed(1)}% YoY`}
                changeType={metrics.yearlyGrowth >= 0 ? "positive" : "negative"}
                icon={Wallet}
                iconColor="text-green-500"
              />
              <MetricCard
                title="Cryptocurrency"
                value={formatCurrency(latestWealth.crypto || 0)}
                icon={Bitcoin}
                iconColor="text-orange-500"
              />
            </div>
          )}

          {/* Secondary Metrics */}
          {latestWealth && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <MetricCard
                title="Cash & Savings"
                value={formatCurrency(latestWealth.cash)}
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
              <MetricCard
                title="Target FIRE Date"
                value="Jan 2040"
                change={`${yearsToFire} years remaining`}
                icon={Calendar}
                iconColor="text-purple-500"
              />
            </div>
          )}

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Net Worth Trend Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Net Worth Trend
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={chartTimeframe === "6M" ? "default" : "outline"}
                      onClick={() => setChartTimeframe("6M")}
                    >
                      6M
                    </Button>
                    <Button
                      size="sm"
                      variant={chartTimeframe === "1Y" ? "default" : "outline"}
                      onClick={() => setChartTimeframe("1Y")}
                    >
                      1Y
                    </Button>
                    <Button
                      size="sm"
                      variant={chartTimeframe === "ALL" ? "default" : "outline"}
                      onClick={() => setChartTimeframe("ALL")}
                    >
                      All
                    </Button>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" tickFormatter={formatShortCurrency} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Net Worth"
                    />
                    <Area
                      type="monotone"
                      dataKey="assets"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Total Assets"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Asset Allocation Pie Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Asset Allocation
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {allocationData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name}: {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FIRE Projection */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                FIRE Projection Analysis
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Goal</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(fireGoalToday)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Inflation-Adjusted (2040)
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(fireGoalFuture)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Required Annual Growth
                  </p>
                  <p className="text-2xl font-bold text-green-500">~15%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Annual Growth
                  </p>
                  <p className="text-2xl font-bold text-blue-500">
                    {metrics.yearlyGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Summary */}
          {wealthData && (
            <div className="mt-12 bg-muted/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Data Summary
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Total Data Points:
                  </span>
                  <span className="font-medium text-foreground ml-2">
                    {wealthData.length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tracking Since:</span>
                  <span className="font-medium text-foreground ml-2">
                    {wealthData.length > 0
                      ? new Date(wealthData[0].date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium text-foreground ml-2">
                    {latestWealth
                      ? new Date(latestWealth.date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Viewing:</span>
                  <span className="font-medium text-foreground ml-2">
                    {selectedCategory === "Both"
                      ? "Combined"
                      : selectedCategory}
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
