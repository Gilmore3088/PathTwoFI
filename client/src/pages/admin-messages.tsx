import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2, Eye, User, Calendar, MessageSquare, LogOut } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { ContactSubmission } from "@shared/schema";

export default function AdminMessages() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check localStorage authentication
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
          // Token expired, redirect to admin login
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminAuthExpiry");
          window.location.href = "/admin";
          return;
        }
      } else {
        // Not authenticated, redirect to admin login
        window.location.href = "/admin";
        return;
      }
      setAuthLoading(false);
    };
    
    checkAuth();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Fetch all contact submissions - temporarily use public contact endpoint since auth is different
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    enabled: isAuthenticated,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/contact-submissions/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
      setIsDialogOpen(false);
      setSelectedMessage(null);
      toast({
        title: "Success",
        description: "Message deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewMessage = (message: ContactSubmission) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "No date";
    return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Admin Navigation */}
          <div className="flex gap-2 mb-6">
            <Link href="/admin/wealth">
              <Button variant="outline">Wealth Data</Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="outline">Blog Posts</Button>
            </Link>
            <Link href="/admin/goals">
              <Button variant="outline">Financial Goals</Button>
            </Link>
            <Link href="/admin/messages">
              <Button variant="outline" className="bg-primary text-primary-foreground">
                Messages
              </Button>
            </Link>
          </div>

          {/* Admin Logout */}
          <div className="flex justify-end mb-4">
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-messages-title">
                Contact Messages
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="text-admin-messages-subtitle">
                View and manage contact form submissions from your website
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <Mail className="w-4 h-4 mr-1" />
                {messages.length} Total Messages
              </Badge>
            </div>
          </div>

          {/* Messages List */}
          {messagesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
                <p className="text-muted-foreground">
                  Contact form submissions will appear here when visitors send messages through your website.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold" data-testid={`text-message-name-${message.id}`}>
                              {message.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {message.email}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-medium mb-2" data-testid={`text-message-subject-${message.id}`}>
                          {message.subject}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`text-message-preview-${message.id}`}>
                          {message.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(message.submittedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                          data-testid={`button-view-${message.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                          data-testid={`button-delete-${message.id}`}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Message Detail Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message from {selectedMessage?.name}
                </DialogTitle>
              </DialogHeader>
              
              {selectedMessage && (
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="font-medium">
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="text-primary hover:underline"
                          data-testid="link-reply-email"
                        >
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                      <p className="font-medium">{formatDate(selectedMessage.submittedAt)}</p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                    <h3 className="text-lg font-semibold mt-1">{selectedMessage.subject}</h3>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Message</label>
                    <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                      <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-close-dialog"
                    >
                      Close
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                        data-testid="button-reply"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(selectedMessage.id)}
                        disabled={deleteMutation.isPending}
                        data-testid="button-delete-dialog"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}