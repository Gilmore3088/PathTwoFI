import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { ContactSubmission } from "@shared/schema";

export default function AdminMessages() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const isAdmin = user?.role === "admin";

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "Authentication Required",
        description: "Redirecting to login...",
        variant: "destructive",
      });
      // Immediate redirect to login
      window.location.href = "/api/login";
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, toast]);

  const { data: messages = [], isLoading, error } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    enabled: isAuthenticated && isAdmin,
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Failed to load messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-messages">
          Contact Messages
        </h1>
        <p className="text-muted-foreground">
          Messages submitted through the contact form
        </p>
        <Separator className="mt-4" />
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              When visitors submit the contact form, their messages will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground mb-4" data-testid="message-count">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </div>
          
          {messages.map((message) => (
            <Card key={message.id} data-testid={`message-card-${message.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {message.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {message.email}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(message.submittedAt!), 'MMM d, yyyy')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Subject
                    </h4>
                    <p className="font-medium" data-testid={`message-subject-${message.id}`}>
                      {message.subject}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                      Message
                    </h4>
                    <div 
                      className="prose prose-sm max-w-none bg-muted/30 rounded-lg p-4 border whitespace-pre-wrap"
                      data-testid={`message-content-${message.id}`}
                    >
                      {message.message}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-2">
                    Submitted on {format(new Date(message.submittedAt!), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}