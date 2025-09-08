import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/ui/seo";
import { Mail, Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { format } from "date-fns";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { ContactSubmission } from "@shared/schema";

export default function AdminContact() {
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

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

  const { data: submissions, isLoading: isLoadingSubmissions, error } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"],
    enabled: isAuthenticated && isAdmin,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Authentication Required",
        description: "Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

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

  return (
    <div className="py-16 lg:py-20">
      <SEO 
        title="Contact Messages - Admin"
        description="Manage contact form submissions and messages"
        type="website"
        url="/admin/contact"
      />
      
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4" data-testid="link-admin-back">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Contact Messages</h1>
          <p className="text-xl text-muted-foreground" data-testid="text-page-subtitle">
            View and manage contact form submissions
          </p>
        </div>

        {/* Loading State */}
        {isLoadingSubmissions && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Contact Submissions List */}
        {submissions && !isLoadingSubmissions && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card data-testid="card-total-messages">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-message-count">{submissions.length}</p>
                      <p className="text-muted-foreground">Total Messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="card-recent-messages">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-recent-count">
                        {submissions.filter(s => new Date(s.submittedAt!) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </p>
                      <p className="text-muted-foreground">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-latest-message">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-accent">Latest</Badge>
                    <div className="flex-1">
                      {submissions.length > 0 ? (
                        <p className="text-sm text-muted-foreground" data-testid="text-latest-date">
                          {format(new Date(submissions[0].submittedAt!), "MMM dd, yyyy")}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No messages yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold" data-testid="text-messages-title">Recent Messages</h2>
              
              {submissions.length === 0 ? (
                <Card data-testid="card-no-messages">
                  <CardContent className="p-8 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No contact messages yet</p>
                    <p className="text-sm text-muted-foreground">Messages submitted through your contact form will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                submissions.map((submission) => (
                  <Card key={submission.id} className="transition-shadow hover:shadow-md" data-testid={`card-message-${submission.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg" data-testid={`text-message-name-${submission.id}`}>
                            {submission.name}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm" data-testid={`text-message-email-${submission.id}`}>
                            {submission.email}
                          </p>
                        </div>
                        <Badge variant="secondary" data-testid={`badge-message-date-${submission.id}`}>
                          {format(new Date(submission.submittedAt!), "MMM dd, yyyy 'at' h:mm a")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Subject</p>
                          <p className="font-medium" data-testid={`text-message-subject-${submission.id}`}>
                            {submission.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Message</p>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid={`text-message-content-${submission.id}`}>
                            {submission.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}