import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost, WealthData } from "@shared/schema";
import { FeaturedPost } from "@/components/blog/featured-post";
import { BlogCard } from "@/components/blog/blog-card";
import { ProgressIndicator } from "@/components/dashboard/progress-indicator";
import { MetricCard } from "@/components/dashboard/metric-card";
import { GoalsShowcase } from "@/components/goals/goals-showcase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/ui/seo";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Wallet, PiggyBank, Calendar, ArrowDown, ArrowRight, ChartArea } from "lucide-react";
import { FIRE_TARGET } from "@/lib/constants";

export default function Home() {
  const { toast } = useToast();

  // Fetch featured posts
  const { data: featuredPosts, isLoading: featuredLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
  });

  // Fetch recent posts
  const { data: recentPosts, isLoading: recentLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Fetch latest wealth data for "Both" category (combined finances)
  const { data: latestWealth, isLoading: wealthLoading } = useQuery<WealthData | null>({
    queryKey: ["/api/wealth-data/latest", "Both"],
    queryFn: async () => {
      const response = await fetch('/api/wealth-data/latest?category=Both');
      if (response.status === 404) {
        return null; // No wealth data yet
      }
      if (!response.ok) {
        throw new Error('Failed to fetch wealth data');
      }
      return response.json();
    },
    retry: false, // Don't retry on 404
  });


  const netWorthFormatted = latestWealth ? parseFloat(latestWealth.netWorth).toLocaleString() : "0";
  const investmentsFormatted = latestWealth ? parseFloat(latestWealth.investments).toLocaleString() : "0";
  const savingsRate = latestWealth ? parseFloat(latestWealth.savingsRate) : 0;
  const currentNetWorth = latestWealth ? parseFloat(latestWealth.netWorth) : 0;
  const monthlySavingsAmount = latestWealth ? parseFloat(latestWealth.monthlySavings ?? "0") : 0;
  const remainingToTarget = Math.max(FIRE_TARGET - currentNetWorth, 0);
  const yearsToFireValue = monthlySavingsAmount > 0 ? (remainingToTarget / monthlySavingsAmount) / 12 : null;
  const yearsToFire = yearsToFireValue !== null && Number.isFinite(yearsToFireValue)
    ? yearsToFireValue.toFixed(1)
    : "—";

  return (
    <div>
      <SEO 
        title="PathTwo - Personal Finance FIRE Journey"
        description="Follow our data-driven journey to financial independence as a couple. Real wealth tracking, investment strategies, and transparent progress toward FIRE."
        keywords="FIRE, financial independence, personal finance, wealth tracking, early retirement, investment strategy, couples finance"
        type="website"
        url="/"
      />
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-hero-title">
              PathTwo to<br />
              <span className="text-primary">Financial Independence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
              Our data-driven journey toward FIRE as a couple. Follow along as we document wealth building, investment strategies, and our pursuit of financial freedom together.
            </p>
            
            {/* FIRE Progress Indicator */}
            {!wealthLoading && latestWealth && (
              <div className="mb-8">
                <ProgressIndicator 
                  current={currentNetWorth} 
                  target={FIRE_TARGET} 
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild data-testid="button-read-posts">
                <Link href="#featured-posts" className="inline-flex items-center justify-center">
                  Read Latest Posts
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                data-testid="button-view-dashboard"
              >
                <Link href="/dashboard" className="inline-flex items-center justify-center">
                  View Dashboard
                  <ChartArea className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section id="featured-posts" className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-featured-title">Featured Posts</h2>
              <p className="text-lg text-muted-foreground" data-testid="text-featured-subtitle">Latest insights on wealth building and financial independence</p>
            </div>
            
            {featuredLoading ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-muted animate-pulse rounded-xl h-96" />
                <div className="bg-muted animate-pulse rounded-xl h-96" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {featuredPosts?.map((post) => (
                  <FeaturedPost key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Wealth Dashboard Section */}
      <section className="py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-wealth-title">Wealth Snapshot</h2>
              <p className="text-lg text-muted-foreground" data-testid="text-wealth-subtitle">Real-time view of financial progress and key metrics</p>
            </div>
            
            {wealthLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-xl h-32" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Net Worth"
                  value={`$${netWorthFormatted}`}
                  change="+12.3% this quarter"
                  changeType="positive"
                  icon={TrendingUp}
                />
                <MetricCard
                  title="Investment Portfolio"
                  value={`$${investmentsFormatted}`}
                  change="+8.7% YTD"
                  changeType="positive"
                  icon={Wallet}
                  iconColor="text-secondary"
                />
                <MetricCard
                  title="Savings Rate"
                  value={`${savingsRate.toFixed(1)}%`}
                  change="of gross income"
                  icon={PiggyBank}
                  iconColor="text-accent"
                />
                <MetricCard
                  title="Years to FIRE"
                  value={yearsToFire}
                  change={monthlySavingsAmount > 0 ? "at current savings pace" : "add monthly savings to estimate"}
                  changeType={monthlySavingsAmount > 0 ? "positive" : "neutral"}
                  icon={Calendar}
                  iconColor="text-chart-4"
                />
              </div>
            )}
            
            {/* Chart Placeholder */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground" data-testid="text-chart-title">Net Worth Over Time</h3>
                <div className="flex space-x-2">
                  <Button size="sm" data-testid="button-chart-1y">1Y</Button>
                  <Button size="sm" variant="outline" data-testid="button-chart-2y">2Y</Button>
                  <Button size="sm" variant="outline" data-testid="button-chart-all">All</Button>
                </div>
              </div>
              
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border" data-testid="placeholder-chart">
                <div className="text-center">
                  <ChartArea className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">Net Worth Chart</p>
                  <p className="text-xs text-muted-foreground mt-1">Interactive chart will be rendered here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Goals Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-goals-title">Financial Goals</h2>
              <p className="text-lg text-muted-foreground" data-testid="text-goals-subtitle">Tracking our milestones on the path to financial independence</p>
            </div>

            <GoalsShowcase category="all" limit={6} />
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-recent-title">Recent Posts</h2>
                <p className="text-lg text-muted-foreground" data-testid="text-recent-subtitle">Latest updates from the financial journey</p>
              </div>
              <div className="hidden md:flex space-x-2">
                <Button size="sm" data-testid="button-filter-all">All</Button>
                <Button size="sm" variant="outline" data-testid="button-filter-wealth">Wealth Progress</Button>
                <Button size="sm" variant="outline" data-testid="button-filter-fire">FIRE Strategy</Button>
                <Button size="sm" variant="outline" data-testid="button-filter-investments">Investments</Button>
              </div>
            </div>
            
            {recentLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-xl h-80" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts?.slice(0, 3).map((post) => (
                  <BlogCard key={post.id} post={post} size="compact" />
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Button variant="outline" asChild data-testid="button-view-all-posts">
                <Link href="/blog" className="inline-flex items-center justify-center">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
