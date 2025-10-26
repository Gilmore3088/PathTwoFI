import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import type { FinancialGoal } from "@shared/schema";

export function GoalsWidget() {
  const { data: goals = [], isLoading } = useQuery<FinancialGoal[]>({
    queryKey: ["/api/financial-goals"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Goals Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const activeGoals = totalGoals - completedGoals;

  // Calculate average progress
  const totalProgress = goals.reduce((sum, goal) => {
    const current = Number.parseFloat(goal.currentAmount ?? "0") || 0;
    const target = Number.parseFloat(goal.targetAmount ?? "0") || 0;
    if (target <= 0) return sum;
    return sum + Math.min((current / target) * 100, 100);
  }, 0);
  const averageProgress = goals.length > 0 ? totalProgress / goals.length : 0;

  // Find goals approaching deadline (within 30 days)
  const upcomingDeadlines = goals
    .filter((g) => !g.isCompleted && g.targetDate)
    .filter((g) => {
      const targetDate = new Date(g.targetDate!);
      const now = new Date();
      const thirtyDaysFromNow = addDays(now, 30);
      return isBefore(now, targetDate) && isBefore(targetDate, thirtyDaysFromNow);
    })
    .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime())
    .slice(0, 3);

  // Find goals on track (>50% progress, not completed)
  const goalsOnTrack = goals.filter((g) => {
    if (g.isCompleted) return false;
    const current = Number.parseFloat(g.currentAmount ?? "0") || 0;
    const target = Number.parseFloat(g.targetAmount ?? "0") || 0;
    if (target <= 0) return false;
    return (current / target) * 100 >= 50;
  }).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Goals Overview
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/goals">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Goals</p>
            <p className="text-2xl font-bold">{totalGoals}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-blue-600">{activeGoals}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">On Track</p>
            <p className="text-2xl font-bold text-purple-600">{goalsOnTrack}</p>
          </div>
        </div>

        {/* Average Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Average Progress
            </span>
            <span className="font-semibold">{averageProgress.toFixed(1)}%</span>
          </div>
          <Progress value={averageProgress} className="h-2" />
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Upcoming Deadlines
            </div>
            <div className="space-y-2">
              {upcomingDeadlines.map((goal) => {
                const current = Number.parseFloat(goal.currentAmount ?? "0") || 0;
                const target = Number.parseFloat(goal.targetAmount ?? "0") || 0;
                const progress = target > 0 ? (current / target) * 100 : 0;

                return (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          Due: {format(new Date(goal.targetDate!), "MMM dd, yyyy")}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {progress.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {totalGoals === 0 && (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              No goals yet. Create your first financial goal!
            </p>
            <Button asChild>
              <Link href="/admin/goals">
                Create Goal
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
