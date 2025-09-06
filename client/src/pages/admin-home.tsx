import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/ui/seo";
import { TrendingUp, Edit, Target, Settings } from "lucide-react";

export default function AdminHome() {
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
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-primary" data-testid="icon-admin-settings" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-admin-title">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-admin-subtitle">
              Manage your PathTwo content and financial tracking data
            </p>
          </div>

          {/* Admin Routes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminRoutes.map((route) => {
              const IconComponent = route.icon;
              return (
                <Link key={route.href} href={route.href} data-testid={`link-admin-${route.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <a>
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
                  </a>
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
                <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors">
                  <Edit className="w-4 h-4 text-secondary" />
                  <span className="text-foreground">Create New Blog Post</span>
                </a>
              </Link>
              <Link href="/admin/wealth" data-testid="link-quick-add-wealth">
                <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Add Wealth Data</span>
                </a>
              </Link>
              <Link href="/admin/goals" data-testid="link-quick-set-goal">
                <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Set New Goal</span>
                </a>
              </Link>
              <Link href="/" data-testid="link-quick-view-site">
                <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">View Public Site</span>
                </a>
              </Link>
            </div>
          </div>

          {/* Back to Site */}
          <div className="mt-8 text-center">
            <Link href="/" data-testid="link-back-to-site">
              <a className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                ← Back to PathTwo Site
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}