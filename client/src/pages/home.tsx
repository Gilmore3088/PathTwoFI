import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost, WealthData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/ui/seo";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Calendar,
  ArrowDown,
  ArrowRight,
  ChartArea,
  Target,
  DollarSign,
  Clock,
  Eye,
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // FIRE calculations - matching your About page
  const currentNetWorthExclHome = 679000; // $679K
  const fireGoalToday = 3500000; // $3.5M in today's dollars
  const yearsToFire = 14; // Target: Jan 2040
  const inflationRate = 0.03;
  const inflationMultiplier = Math.pow(1 + inflationRate, yearsToFire);
  const fireGoalFuture = fireGoalToday * inflationMultiplier; // ~$5.29M
  const progressToFire = (currentNetWorthExclHome / fireGoalFuture) * 100; // ~13%

  // Fetch recent blog posts
  const { data: recentPosts = [], isLoading: postsLoading } = useQuery<
    BlogPost[]
  >({
    queryKey: ["/api/blog-posts"],
  });

  // Fetch latest wealth data for "Both" category
  const { data: latestWealth, isLoading: wealthLoading } = useQuery<WealthData>(
    {
      queryKey: ["/api/wealth-data/latest", "Both"],
      queryFn: async () => {
        try {
          const response = await fetch("/api/wealth-data/latest?category=Both");
          if (!response.ok) return null;
          return response.json();
        } catch {
          return null;
        }
      },
    },
  );

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      // Simulate API call - replace with actual endpoint when available
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get featured posts (most viewed)
  const featuredPosts = recentPosts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 2);

  // Get category color helper
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Wealth Progress":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case "FIRE Strategy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "Investments":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "Personal Reflections":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

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
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              PathTwo to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Financial Independence
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Our transparent journey to FIRE as a couple. Real numbers, honest
              reflections, and data-driven strategies from our path to $5.29M by
              2040.
            </p>

            {/* FIRE Progress */}
            <div className="mb-12 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    FIRE Progress
                  </h3>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {progressToFire.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                    style={{ width: `${Math.min(progressToFire, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Current: {formatCurrency(currentNetWorthExclHome)}
                  </span>
                  <span>Goal: {formatCurrency(fireGoalFuture)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <ChartArea className="mr-2 h-5 w-5" />
                  View Live Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Read Our Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Current Snapshot
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Real-time metrics from our FIRE journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      +2,240% from low
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatCurrency(currentNetWorthExclHome)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Net Worth (excl. home)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="h-8 w-8 text-purple-500" />
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                      13% complete
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatCurrency(fireGoalFuture)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    FIRE Goal (2040)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    14 Years
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Time to FIRE
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatCurrency(3500000)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Today's $ Goal
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Articles
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Deep dives into our wealth-building strategies
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {post.imageUrl && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime} min
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views?.toLocaleString() || 0}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                          Read more →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Recent Posts
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Latest updates from our journey
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/blog">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {postsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-64"
                  />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.slice(0, 6).map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <Badge
                        className={`${getCategoryColor(post.category)} mb-3`}
                      >
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          {new Date(post.createdAt!).toLocaleDateString()}
                        </span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Join Our FIRE Journey
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get monthly updates on our progress, strategies, and lessons
              learned
            </p>

            <form
              onSubmit={handleNewsletterSignup}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12"
                />
                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-sm text-blue-100 mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
