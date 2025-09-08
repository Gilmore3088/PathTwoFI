import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Edit, Trash2, Target, CheckCircle, Clock, TrendingUp, Flag } from "lucide-react";
import { format } from "date-fns";
import { insertFinancialGoalSchema, type FinancialGoal, type InsertFinancialGoal, type GoalMilestone } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function AdminGoals() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You need admin access to view this page. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
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
    return null;
  }

  // Fetch all financial goals
  const { data: goals = [], isLoading } = useQuery<FinancialGoal[]>({
    queryKey: ["/api/financial-goals"],
  });

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => 
      selectedCategory === "all" || goal.category === selectedCategory
    );
  }, [goals, selectedCategory]);

  const form = useForm<InsertFinancialGoal>({
    resolver: zodResolver(insertFinancialGoalSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAmount: "",
      currentAmount: "0",
      category: "Both",
      goalType: "custom",
      targetDate: new Date(),
      priority: "medium"
    }
  });

  // Create/Update mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertFinancialGoal) => {
      return await apiRequest('/api/financial-goals', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      setIsDialogOpen(false);
      setEditingGoal(null);
      form.reset();
      toast({
        title: "Success",
        description: "Financial goal created successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create financial goal",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<InsertFinancialGoal> }) => {
      return await apiRequest(`/api/financial-goals/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      setIsDialogOpen(false);
      setEditingGoal(null);
      form.reset();
      toast({
        title: "Success",
        description: "Financial goal updated successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update financial goal",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/financial-goals/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      toast({
        title: "Success",
        description: "Financial goal deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete financial goal",
        variant: "destructive"
      });
    }
  });

  // Complete goal mutation
  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/financial-goals/${id}/complete`, 'PUT');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      toast({
        title: "Congratulations!",
        description: "Goal completed successfully! 🎉"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete goal",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertFinancialGoal) => {
    if (editingGoal) {
      updateMutation.mutate({ id: editingGoal.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    form.reset({
      title: goal.title,
      description: goal.description?.toString() || "",
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      category: goal.category as "His" | "Her" | "Both",
      goalType: goal.goalType as "net_worth" | "savings_rate" | "debt_payoff" | "custom",
      targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
      priority: goal.priority as "low" | "medium" | "high"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleComplete = (id: string) => {
    if (confirm("Mark this goal as completed?")) {
      completeMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingGoal(null);
    form.reset();
  };

  const calculateProgress = (current: string, target: string) => {
    const currentNum = parseFloat(current) || 0;
    const targetNum = parseFloat(target) || 1;
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getGoalTypeIcon = (goalType: string) => {
    switch (goalType) {
      case "savings": return <Target className="w-4 h-4" />;
      case "investment": return <TrendingUp className="w-4 h-4" />;
      case "debt_payoff": return <Flag className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
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
              <Button variant="outline" className="bg-primary text-primary-foreground">
                Financial Goals
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-goals-title">
                Financial Goals
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="text-admin-goals-subtitle">
                Track and manage your financial goals and milestones
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-goal">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle data-testid="text-dialog-title">
                    {editingGoal ? "Edit Goal" : "Add New Goal"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Goal Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Emergency Fund" {...field} data-testid="input-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Save 6 months of expenses for emergencies" {...field} data-testid="input-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Amount ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="50000.00" {...field} data-testid="input-target-amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Amount ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-current-amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="His">His</SelectItem>
                                <SelectItem value="Her">Her</SelectItem>
                                <SelectItem value="Both">Both</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="goalType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goal Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-goal-type">
                                  <SelectValue placeholder="Select goal type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="net_worth">Net Worth</SelectItem>
                                <SelectItem value="savings_rate">Savings Rate</SelectItem>
                                <SelectItem value="debt_payoff">Debt Payoff</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                data-testid="input-target-date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-priority">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-submit"
                      >
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label>Category:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48" data-testid="select-filter-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="His">His</SelectItem>
                      <SelectItem value="Her">Her</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Grid */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal) => {
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const isCompleted = goal.isCompleted;
                const currentAmount = parseFloat(goal.currentAmount);
                const targetAmount = parseFloat(goal.targetAmount);

                return (
                  <Card key={goal.id} className={`${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getGoalTypeIcon(goal.goalType)}
                            {goal.title}
                            {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge variant="secondary">{goal.category}</Badge>
                            <Badge variant="outline">{goal.goalType.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(goal)}
                            data-testid={`button-edit-${goal.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                            data-testid={`button-delete-${goal.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-semibold">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>${currentAmount.toLocaleString()}</span>
                          <span>${targetAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
                      </div>

                      {!isCompleted && progress >= 100 && (
                        <Button
                          onClick={() => handleComplete(goal.id)}
                          className="w-full"
                          data-testid={`button-complete-${goal.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredGoals.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first financial goal to track your progress.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}