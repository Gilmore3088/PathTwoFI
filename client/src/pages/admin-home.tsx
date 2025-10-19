import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/ui/seo";
import { ArrowRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminRoutes } from "@/components/admin/admin-routes";

const managementRoutes = adminRoutes.filter((route) => route.href !== "/admin");

const quickActions = [
  {
    href: "/admin/blog",
    label: "Create New Blog Post",
    testId: "button-quick-new-post",
  },
  {
    href: "/admin/wealth",
    label: "Add Wealth Entry",
    testId: "button-quick-add-wealth",
  },
  {
    href: "/admin/goals",
    label: "Update Financial Goals",
    testId: "button-quick-update-goals",
  },
  {
    href: "/admin/messages",
    label: "Check Messages",
    testId: "button-quick-check-messages",
  },
];

export default function AdminHome() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Manage PathTwo content, track wealth data, and monitor site activity."
      titleTestId="text-admin-dashboard-title"
      seo={
        <SEO
          title="Admin Dashboard - PathTwo"
          description="Admin dashboard for managing PathTwo content and data."
          type="website"
          url="/admin"
        />
      }
    >
      <section className="text-center">
        <h3 className="text-3xl font-bold text-foreground" data-testid="text-welcome-title">
          Welcome to Your Admin Portal
        </h3>
        <p className="mt-4 text-lg text-muted-foreground">
          Review dashboards, publish new content, and respond to the community from one secure hub.
        </p>
      </section>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {managementRoutes.map((route) => {
            const IconComponent = route.icon;
            return (
              <Link key={route.href} href={route.href} className="group block">
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg" data-testid={`card-admin-${route.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader>
                    {route.color ? (
                      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${route.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    ) : null}
                    <CardTitle className="text-lg">{route.label}</CardTitle>
                    {route.stats ? (
                      <p className="text-sm text-muted-foreground">{route.stats}</p>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    {route.description ? (
                      <p className="mb-4 text-sm text-muted-foreground">{route.description}</p>
                    ) : null}
                    <div className="flex items-center text-sm font-medium text-primary">
                      Manage
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-quick-actions-title">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action) => {
                const route = managementRoutes.find((item) => item.href === action.href);
                const IconComponent = route?.icon;
                return (
                  <Button
                    key={`action-${action.href}`}
                    variant="outline"
                    className="justify-start"
                    asChild
                    data-testid={action.testId}
                  >
                    <Link href={action.href}>
                      {IconComponent ? <IconComponent className="mr-2 h-4 w-4" /> : null}
                      {action.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          data-testid="link-back-to-public-site"
        >
          ← Back to Public Site
        </Link>
      </section>
    </AdminLayout>
  );
}