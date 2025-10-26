import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Edit, Trash2, CheckCircle, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { format } from "date-fns";
import { insertGoalMilestoneSchema, type GoalMilestone, type InsertGoalMilestone } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GoalMilestonesProps {
  goalId: string;
  goalTitle: string;
  targetAmount: string | null;
}

export function GoalMilestones({ goalId, goalTitle, targetAmount }: GoalMilestonesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<GoalMilestone | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: milestones = [], isLoading } = useQuery<GoalMilestone[]>({
    queryKey: [`/api/goal-milestones/${goalId}`],
    enabled: isOpen,
  });

  const form = useForm<InsertGoalMilestone>({
    resolver: zodResolver(insertGoalMilestoneSchema),
    defaultValues: {
      goalId,
      title: "",
      targetAmount: "",
      isCompleted: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGoalMilestone) => {
      return await apiRequest("POST", "/api/goal-milestones", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goal-milestones/${goalId}`] });
      setIsDialogOpen(false);
      form.reset({ goalId, title: "", targetAmount: "", isCompleted: false });
      toast({
        title: "Success",
        description: "Milestone created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGoalMilestone> }) => {
      return await apiRequest("PUT", `/api/goal-milestones/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goal-milestones/${goalId}`] });
      setIsDialogOpen(false);
      setEditingMilestone(null);
      form.reset({ goalId, title: "", targetAmount: "", isCompleted: false });
      toast({
        title: "Success",
        description: "Milestone updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/goal-milestones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goal-milestones/${goalId}`] });
      toast({
        title: "Success",
        description: "Milestone deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PUT", `/api/goal-milestones/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goal-milestones/${goalId}`] });
      toast({
        title: "Milestone Complete! 🎉",
        description: "Great progress on your goal!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete milestone",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertGoalMilestone) => {
    if (editingMilestone) {
      updateMutation.mutate({ id: editingMilestone.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (milestone: GoalMilestone) => {
    setEditingMilestone(milestone);
    form.reset({
      goalId,
      title: milestone.title,
      targetAmount: milestone.targetAmount ?? "",
      isCompleted: milestone.isCompleted ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleComplete = (id: string) => {
    completeMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingMilestone(null);
    form.reset({ goalId, title: "", targetAmount: "", isCompleted: false });
  };

  const completedCount = milestones.filter(m => m.isCompleted).length;
  const totalCount = milestones.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between p-2">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span className="text-sm font-medium">
                Milestones {totalCount > 0 && `(${completedCount}/${totalCount})`}
              </span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        {isOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMilestone ? "Edit Milestone" : "Add Milestone"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">For: {goalTitle}</p>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Milestone Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Save first $10,000" {...field} />
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
                            placeholder="10000.00"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <CollapsibleContent className="pt-2 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No milestones yet. Add your first milestone to track progress!
          </p>
        ) : (
          <div className="space-y-2">
            {milestones.map((milestone) => {
              const isCompleted = milestone.isCompleted;
              const targetNum = Number.parseFloat(milestone.targetAmount ?? "0");
              const goalTargetNum = Number.parseFloat(targetAmount ?? "0");
              const progress = goalTargetNum > 0 ? (targetNum / goalTargetNum) * 100 : 0;

              return (
                <div
                  key={milestone.id}
                  className={`border rounded-lg p-3 ${
                    isCompleted
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{milestone.title}</p>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          ${targetNum.toLocaleString()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {progress.toFixed(0)}% of goal
                        </span>
                      </div>
                      {milestone.achievedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Achieved: {format(new Date(milestone.achievedAt), "MMM dd, yyyy")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!isCompleted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComplete(milestone.id)}
                          className="h-8 w-8 p-0"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(milestone)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(milestone.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalCount > 0 && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Overall Progress</span>
              <span>{completedCount} of {totalCount} completed</span>
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="h-2" />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
