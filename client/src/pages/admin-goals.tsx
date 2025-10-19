import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { insertFinancialGoalSchema, type FinancialGoal, type InsertFinancialGoal } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/ui/seo";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminGoals() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading: goalsLoading } = useQuery<FinancialGoal[]>({
    queryKey: ["/api/financial-goals"],
    enabled: isAuthenticated && isAdmin,
  });

  const filteredGoals = goals.filter((goal) => selectedCategory === "all" || goal.category === selectedCategory);

  const goalSummary = (() => {
    if (goals.length === 0) {
      return { total: 0, completed: 0, active: 0, averageProgress: 0 };
    }

    const completed = goals.filter((goal) => goal.isCompleted).length;
    const totalProgress = goals.reduce((sum, goal) => sum + calculateProgress(goal.currentAmount, goal.targetAmount), 0);
    const averageProgress = totalProgress / goals.length;

    return {
      total: goals.length,
      completed,
      active: goals.length - completed,
      averageProgress: Number.isFinite(averageProgress) ? averageProgress : 0,
    };
  })();

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
      priority: "medium",
    },
  });

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);

      if (!open) {
        setEditingGoal(null);
        form.reset();
      }
    },
    [form, setEditingGoal, setIsDialogOpen],
  );

  const createMutation = useMutation({
    mutationFn: async (data: InsertFinancialGoal) => {
      return await apiRequest("POST", "/api/financial-goals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      handleDialogOpenChange(false);
      toast({
        title: "Success",
        description: "Financial goal created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create financial goal",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertFinancialGoal> }) => {
      return await apiRequest("PUT", `/api/financial-goals/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      handleDialogOpenChange(false);
      toast({
        title: "Success",
        description: "Financial goal updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update financial goal",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/financial-goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      toast({
        title: "Success",
        description: "Financial goal deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete financial goal",
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PUT", `/api/financial-goals/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-goals"] });
      toast({
        title: "Congratulations!",
        description: "Goal completed successfully! 🎉",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete goal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFinancialGoal) => {
    if (editingGoal) {
      updateMutation.mutate({ id: editingGoal.id, data });
      return;
    }

    createMutation.mutate(data);
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    form.reset({
      title: goal.title,
      description: goal.description ?? "",
      targetAmount: goal.targetAmount ?? "",
      currentAmount: goal.currentAmount ?? "0",
      category: (goal.category ?? "Both") as "His" | "Her" | "Both",
      goalType: (goal.goalType ?? "custom") as "net_worth" | "savings_rate" | "debt_payoff" | "custom",
      targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
      priority: (goal.priority ?? "medium") as "low" | "medium" | "high",
    });
    handleDialogOpenChange(true);
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

  return (
    <AdminLayout
      title="Financial Goals"
      description="Track and manage your financial goals and milestones"
      titleTestId="text-admin-goals-title"
      descriptionTestId="text-admin-goals-subtitle"
      seo={
        <SEO
          title="Financial Goals Management - PathTwo Admin"
          description="Manage FIRE milestones, progress tracking, and goal planning for PathTwo."
          type="website"
          url="/admin/goals"
        />
      }
      actions={
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-goal">
              <PlusCircle className="mr-2 h-4 w-4" />
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
                          <Textarea
                            placeholder="Save 6 months of expenses for emergencies"
                            {...field}
                            value={field.value ?? ""}
                            data-testid="input-description"
                          />
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
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="50000.00"
                            {...field}
                            value={field.value ?? ""}
                            data-testid="input-target-amount"
                          />
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
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? ""}
                            data-testid="input-current-amount"
                          />
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                            value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                            onChange={(event) => field.onChange(event.target.value ? new Date(event.target.value) : undefined)}
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                  <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)} data-testid="button-cancel">
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
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{goalSummary.total}</p>
            <p className="text-sm text-muted-foreground">{goalSummary.active} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{goalSummary.completed}</p>
            <p className="text-sm text-muted-foreground">Celebrate your wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{goalSummary.averageProgress.toFixed(1)}%</span>
              <span className="text-muted-foreground">Across all goals</span>
            </div>
            <Progress value={goalSummary.averageProgress} className="h-2" />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      {goalsLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const isCompleted = goal.isCompleted;
            const currentAmount = parseAmount(goal.currentAmount);
            const targetAmount = parseAmount(goal.targetAmount);

            return (
              <Card key={goal.id} className={isCompleted ? "border-green-500 bg-green-50 dark:bg-green-950" : undefined}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        <span className="mr-2 inline-flex items-center gap-2">
                          {renderGoalTypeIcon(goal.goalType)}
                          {goal.title}
                        </span>
                        {isCompleted && <CheckCircle className="inline h-4 w-4 text-green-600" />}
                      </CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary" className={getPriorityBadgeColor(goal.priority)}>
                          {goal.priority ?? "medium"}
                        </Badge>
                        <Badge variant="secondary">{goal.category ?? "Both"}</Badge>
                        <Badge variant="outline">{(goal.goalType ?? "custom").replace("_", " ")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        data-testid={`button-edit-${goal.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        data-testid={`button-delete-${goal.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}

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
                    <Clock className="h-4 w-4" />
                    <span>
                      Target: {goal.targetDate ? format(new Date(goal.targetDate), "MMM dd, yyyy") : "No target date"}
                    </span>
                  </div>

                  {!isCompleted && progress >= 100 && (
                    <Button
                      onClick={() => handleComplete(goal.id)}
                      className="w-full"
                      data-testid={`button-complete-${goal.id}`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredGoals.length === 0 && !goalsLoading && (
        <div className="py-12 text-center">
          <Target className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No Goals Yet</h3>
          <p className="mb-4 text-muted-foreground">
            Start by creating your first financial goal to track your progress.
          </p>
          <Button onClick={() => handleDialogOpenChange(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Goal
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}

function calculateProgress(current: string | null | undefined, target: string | null | undefined) {
  const currentNum = Number.parseFloat(current ?? "0") || 0;
  const targetNum = Number.parseFloat(target ?? "0") || 0;

  if (targetNum <= 0) {
    return currentNum > 0 ? 100 : 0;
  }

  return Math.min((currentNum / targetNum) * 100, 100);
}

function parseAmount(value: string | null | undefined) {
  const parsed = Number.parseFloat(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function getPriorityBadgeColor(priority: string | null | undefined) {
  switch (priority) {
    case "high":
      return "bg-destructive text-destructive-foreground";
    case "low":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200";
  }
}

function renderGoalTypeIcon(goalType: string | null | undefined) {
  switch (goalType) {
    case "net_worth":
      return <TrendingUp className="h-4 w-4" />;
    case "savings_rate":
      return <Target className="h-4 w-4" />;
    case "debt_payoff":
      return <Flag className="h-4 w-4" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
}
