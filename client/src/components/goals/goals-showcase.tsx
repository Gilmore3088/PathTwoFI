import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Flag, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { FinancialGoal } from "@shared/schema";
import { Link } from "wouter";

interface GoalsShowcaseProps {
  category?: "His" | "Her" | "Both" | "all";
  limit?: number;
  showViewAll?: boolean;
}

export function GoalsShowcase({ category = "all", limit, showViewAll = true }: GoalsShowcaseProps) {
  const { data: goals = [], isLoading } = useQuery<FinancialGoal[]>({
    queryKey: ["/api/financial-goals/public", category],
    queryFn: async () => {
      const url = category === "all"
        ? "/api/financial-goals/public"
        : `/api/financial-goals/public?category=${category}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch goals");
      return response.json();
    },
  });

  const displayGoals = limit ? goals.slice(0, limit) : goals;
  const activeGoals = displayGoals.filter((g) => !g.isCompleted);
  const completedGoals = displayGoals.filter((g) => g.isCompleted);

  const calculateProgress = (current: string | null | undefined, target: string | null | undefined) => {
    const currentNum = Number.parseFloat(current ?? "0") || 0;
    const targetNum = Number.parseFloat(target ?? "0") || 0;
    if (targetNum <= 0) return currentNum > 0 ? 100 : 0;
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const formatAmount = (value: string | null | undefined) => {
    const parsed = Number.parseFloat(value ?? "0");
    return Number.isFinite(parsed) ? parsed.toLocaleString() : "0";
  };

  const renderGoalIcon = (goalType: string | null | undefined) => {
    switch (goalType) {
      case "net_worth":
        return <TrendingUp className="h-5 w-5" />;
      case "savings_rate":
        return <Target className="h-5 w-5" />;
      case "debt_payoff":
        return <Flag className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (displayGoals.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Target className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goals Set Yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Financial goals will be displayed here once they're created.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Active Goals
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const currentAmount = formatAmount(goal.currentAmount);
              const targetAmount = formatAmount(goal.targetAmount);

              return (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-primary">
                          {renderGoalIcon(goal.goalType)}
                        </div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      {goal.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">High Priority</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{goal.category || "Both"}</Badge>
                      <Badge variant="outline" className="capitalize">
                        {(goal.goalType || "custom").replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {goal.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${currentAmount}</span>
                        <span>${targetAmount}</span>
                      </div>
                    </div>

                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Target: {format(new Date(goal.targetDate), "MMM dd, yyyy")}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completed Goals
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{goal.title}</h4>
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${formatAmount(goal.targetAmount)} goal achieved
                  </p>
                  {goal.completedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      {format(new Date(goal.completedAt), "MMM yyyy")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View All Button */}
      {showViewAll && goals.length > (limit || 0) && (
        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="inline-flex items-center gap-2">
              View All Goals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
