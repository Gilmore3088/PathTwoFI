import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { adminRoutes } from "./admin-routes";
import { LogOut, Shield } from "lucide-react";

interface AdminLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  seo?: ReactNode;
  titleTestId?: string;
  descriptionTestId?: string;
}

export function AdminLayout({ title, description, actions, children, seo, titleTestId, descriptionTestId }: AdminLayoutProps) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    let redirectTimeout: number | undefined;

    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });

      redirectTimeout = window.setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }

    if (!isLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
    }

    return () => {
      if (redirectTimeout) {
        window.clearTimeout(redirectTimeout);
      }
    };
  }, [isAuthenticated, isAdmin, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <AccessDenied isAuthenticated={isAuthenticated} />;
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-background">
      {seo}

      <header className="border-b bg-card">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Secure management tools for PathTwo</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {adminRoutes.map((route) => {
              const isActive =
                location === route.href ||
                (route.href !== "/admin" && location.startsWith(route.href));

              return (
                <Button
                  key={route.href}
                  asChild
                  size="sm"
                  variant={isActive ? "default" : "ghost"}
                >
                  <Link href={route.href} className="font-medium">
                    {route.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="md:self-start"
            data-testid="button-admin-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground" data-testid={titleTestId}>{title}</h2>
            {description && (
              <p className="mt-2 text-muted-foreground" data-testid={descriptionTestId}>{description}</p>
            )}
          </div>
          {actions ? <div className="flex gap-2 md:shrink-0">{actions}</div> : null}
        </div>

        <div className="mt-10 space-y-10">{children}</div>
      </main>
    </div>
  );
}

interface AccessDeniedProps {
  isAuthenticated: boolean;
}

function AccessDenied({ isAuthenticated }: AccessDeniedProps) {

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <p className="mt-2 text-muted-foreground">
            {!isAuthenticated
              ? "Please log in to access the admin area"
              : "Admin access required"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {!isAuthenticated && (
            <Button className="w-full" onClick={() => (window.location.href = "/api/login")}> 
              <Shield className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          )}
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to public site
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
