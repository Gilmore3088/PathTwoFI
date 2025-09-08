import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/ui/seo";
import { TrendingUp, Edit, Target, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function AdminHome() {
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Fetch dashboard data
  const { data: messageCount, isLoading: messagesLoading } = useQuery<number>({
    queryKey: ["/api/contact-submissions/count"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: postCount, isLoading: postsLoading } = useQuery<number>({
    queryKey: ["/api/blog-posts/count"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: latestWealth, isLoading: wealthLoading } = useQuery({
    queryKey: ["/api/wealth-data/latest"],
    enabled: isAuthenticated && isAdmin,
  });

  const statsLoading = messagesLoading || postsLoading || wealthLoading;

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "Authentication Required",
        description: "Redirecting to login...",
        variant: "destructive",
      });
      // Immediate redirect to login
      window.location.href = "/api/login";
      return;
    }
  }, [isAuthenticated, isAdmin, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  const adminRoutes = [
    {
      href: "/admin/wealth",
      title: "Wealth Management",
      description: "Add, edit, and manage wealth tracking data",
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      href: "/admin/blog",
      title: "Blog Management",
      description: "Create, edit, and manage blog posts",
      icon: Edit,
      color: "text-secondary"
    },
    {
      href: "/admin/goals",
      title: "Goals Management", 
      description: "Set and track financial goals and milestones",
      icon: Target,
      color: "text-accent"
    },
    {
      href: "/admin/messages",
      title: "Message Management",
      description: "View and manage contact form submissions",
      icon: MessageSquare,
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="py-16 lg:py-20">
      <SEO 
        title="Admin Dashboard - PathTwo"
        description="Admin dashboard for managing PathTwo content, wealth data, and financial goals."
        type="website"
        url="/admin"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Admin Header with Logout */}
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <button
              onClick={() => window.location.href = '/api/logout'}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-primary" data-testid="icon-admin-dashboard" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-admin-title">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-admin-subtitle">
              Manage your PathTwo content and financial tracking data
            </p>
          </div>

          {/* Dashboard Stats */}
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{messageCount || 0}</div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{postCount || 0}</div>
                  <p className="text-sm text-muted-foreground">Blog Posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    ${latestWealth ? Math.round(parseFloat(latestWealth.netWorth) / 1000) : 0}K
                  </div>
                  <p className="text-sm text-muted-foreground">Net Worth</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {latestWealth ? Math.round((parseFloat(latestWealth.netWorth) / parseFloat(latestWealth.fireTarget || '1000000')) * 100) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">FIRE Progress</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Routes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminRoutes.map((route) => {
              const IconComponent = route.icon;
              return (
                <Link key={route.href} href={route.href} data-testid={`link-admin-${route.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${route.color}`} />
                        </div>
                        <CardTitle className="text-lg" data-testid={`text-${route.title.toLowerCase().replace(/\s+/g, '-')}-title`}>
                          {route.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground" data-testid={`text-${route.title.toLowerCase().replace(/\s+/g, '-')}-description`}>
                        {route.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4" data-testid="text-quick-actions-title">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/admin/blog" data-testid="link-quick-new-post">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <Edit className="w-4 h-4 text-secondary" />
                  <span className="text-foreground">Create New Blog Post</span>
                </div>
              </Link>
              <Link href="/admin/wealth" data-testid="link-quick-add-wealth">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Add Wealth Data</span>
                </div>
              </Link>
              <Link href="/admin/goals" data-testid="link-quick-set-goal">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Set New Goal</span>
                </div>
              </Link>
              <Link href="/admin/messages" data-testid="link-quick-view-messages">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">View Messages</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 p-6 bg-muted/50 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-muted">
                <span>Last wealth update</span>
                <span className="text-muted-foreground">
                  {latestWealth ? new Date(latestWealth.date).toLocaleDateString() : 'No data yet'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-muted">
                <span>Total blog posts</span>
                <span className="text-muted-foreground">{postCount || 0} published</span>
              </div>
              <div className="flex justify-between py-2">
                <span>New messages</span>
                <span className="text-muted-foreground">{messageCount || 0} unread</span>
              </div>
            </div>
          </div>

          {/* Back to Site */}
          <div className="mt-8 text-center">
            <Link href="/" data-testid="link-back-to-site">
              <span className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                ← Back to PathTwo Site
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}