import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactSubmission } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Trash2, Eye, Search, Calendar, MessageSquare, User, AtSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminContact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Fetch all contact submissions
  const { data: submissions = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact"],
  });

  // Delete submission mutation
  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Submission Deleted",
        description: "The contact submission has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the contact submission.",
        variant: "destructive",
      });
    },
  });

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter((submission) =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSubmission = (id: string) => {
    deleteSubmissionMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded mb-8 w-1/3"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-admin-contact-title">
              Contact Management
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-admin-contact-subtitle">
              Manage and respond to contact form submissions
            </p>
          </div>

          {/* Stats and Search */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg" data-testid="text-total-submissions">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground" data-testid="text-submissions-count">
                  {submissions.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg" data-testid="text-recent-submissions">
                  <Calendar className="w-5 h-5 mr-2 text-secondary" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground" data-testid="text-week-submissions-count">
                  {submissions.filter(s => 
                    s.submittedAt && new Date(s.submittedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg" data-testid="text-search-title">
                  <Search className="w-5 h-5 mr-2 text-accent" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-submissions"
                />
              </CardContent>
            </Card>
          </div>

          {/* Contact Submissions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-submissions-title">
              Contact Submissions ({filteredSubmissions.length})
            </h2>
            
            {filteredSubmissions.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-no-submissions">
                      {searchTerm ? "No matching submissions" : "No contact submissions yet"}
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-no-submissions-description">
                      {searchTerm 
                        ? "Try adjusting your search terms to find what you're looking for." 
                        : "Contact form submissions will appear here once visitors start reaching out."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground" data-testid={`text-submission-subject-${submission.id}`}>
                              {submission.subject}
                            </h3>
                            <Badge variant="secondary" data-testid={`badge-submission-date-${submission.id}`}>
                              {submission.submittedAt ? formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true }) : 'Unknown date'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center" data-testid={`text-submission-name-${submission.id}`}>
                              <User className="w-4 h-4 mr-1" />
                              {submission.name}
                            </span>
                            <span className="flex items-center" data-testid={`text-submission-email-${submission.id}`}>
                              <AtSign className="w-4 h-4 mr-1" />
                              {submission.email}
                            </span>
                          </div>
                          
                          <p className="text-muted-foreground line-clamp-3" data-testid={`text-submission-preview-${submission.id}`}>
                            {submission.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-view-submission-${submission.id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center" data-testid={`dialog-title-${submission.id}`}>
                                  <MessageSquare className="w-5 h-5 mr-2" />
                                  {submission.subject}
                                </DialogTitle>
                                <DialogDescription data-testid={`dialog-description-${submission.id}`}>
                                  From {submission.name} ({submission.email}) • {submission.submittedAt ? formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true }) : 'Unknown date'}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <h4 className="font-medium text-foreground mb-2">Message:</h4>
                                <div className="bg-muted/50 rounded-lg p-4">
                                  <p className="text-foreground whitespace-pre-wrap" data-testid={`text-full-message-${submission.id}`}>
                                    {submission.message}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={deleteSubmissionMutation.isPending}
                                data-testid={`button-delete-submission-${submission.id}`}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle data-testid="text-delete-confirm-title">
                                  Delete Contact Submission
                                </AlertDialogTitle>
                                <AlertDialogDescription data-testid="text-delete-confirm-description">
                                  Are you sure you want to delete this contact submission from {submission.name}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-testid="button-delete-cancel">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSubmission(submission.id)}
                                  data-testid="button-delete-confirm"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}