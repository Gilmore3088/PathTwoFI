import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/ui/seo";
import { 
  TrendingUp, 
  FileText, 
  Target, 
  MessageSquare, 
  LogOut, 
  Shield,
  ArrowRight,
  Lock
} from "lucide-react";

export default function AdminHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("adminAuth");
      const authExpiry = localStorage.getItem("adminAuthExpiry");
      
      if (authToken && authExpiry) {
        const now = new Date().getTime();
        const expiry = parseInt(authExpiry);
        
        if (now < expiry) {
          setIsAuthenticated(true);
        } else {
          // Token expired, clean up
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminAuthExpiry");
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple password check - CHANGE THIS PASSWORD!
    const ADMIN_PASSWORD = "PathTwo2024Admin!"; // Change this to your secure password!
    
    if (password === ADMIN_PASSWORD) {
      // Set auth in localStorage with 24 hour expiry
      const now = new Date().getTime();
      const expiry = now + (24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminAuthExpiry", expiry.toString());
      setIsAuthenticated(true);
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminAuthExpiry");
    setIsAuthenticated(false);
    setPassword("");
  };

  // Admin routes configuration
  const adminRoutes = [
    {
      href: "/admin/wealth",
      title: "Wealth Management",
      description: "Track and manage wealth data entries",
      icon: TrendingUp,
      color: "bg-green-500",
      stats: "Updated daily"
    },
    {
      href: "/admin/blog",
      title: "Blog Management",
      description: "Create and edit blog posts",
      icon: FileText,
      color: "bg-blue-500",
      stats: "Manage posts"
    },
    {
      href: "/admin/goals",
      title: "Financial Goals",
      description: "Set and track FIRE milestones",
      icon: Target,
      color: "bg-purple-500",
      stats: "Track progress"
    },
    {
      href: "/admin/messages",
      title: "Contact Messages",
      description: "View visitor messages",
      icon: MessageSquare,
      color: "bg-orange-500",
      stats: "Inbox"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <p className="text-muted-foreground mt-2">
              This area is restricted to authorized personnel only
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  autoFocus
                  data-testid="input-admin-password"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2" data-testid="text-error-message">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full" data-testid="button-admin-login">
                <Shield className="w-4 h-4 mr-2" />
                Authenticate
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-back-to-site">
                  ← Back to public site
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard (Authenticated)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO 
        title="Admin Dashboard - PathTwo"
        description="Admin dashboard for managing PathTwo content and data."
        type="website"
        url="/admin"
      />
      
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground" data-testid="text-admin-dashboard-title">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Secure Management Portal</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-welcome-title">
              Welcome to Your Admin Portal
            </h2>
            <p className="text-lg text-muted-foreground">
              Manage your PathTwo content, track wealth data, and monitor site activity
            </p>
          </div>

          {/* Admin Routes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {adminRoutes.map((route) => {
              const IconComponent = route.icon;
              return (
                <Link key={route.href} href={route.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer" data-testid={`card-admin-${route.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <div className={`w-12 h-12 ${route.color} rounded-lg flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {route.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {route.stats}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {route.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary">
                        Manage
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-quick-actions-title">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/admin/blog">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-new-post">
                    <FileText className="w-4 h-4 mr-2" />
                    Create New Blog Post
                  </Button>
                </Link>
                <Link href="/admin/wealth">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-add-wealth">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Add Wealth Entry
                  </Button>
                </Link>
                <Link href="/admin/goals">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-update-goals">
                    <Target className="w-4 h-4 mr-2" />
                    Update Financial Goals
                  </Button>
                </Link>
                <Link href="/admin/messages">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-check-messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Check Messages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back to Site */}
          <div className="mt-12 text-center">
            <Link href="/">
              <span className="inline-flex items-center text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-back-to-public-site">
                ← Back to Public Site
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}