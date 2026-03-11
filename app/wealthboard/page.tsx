import Header from "@/components/header";
import { FireProgressCard } from "@/components/wealthboard/fire-progress-card";
import { NetWorthChart } from "@/components/wealthboard/net-worth-chart";
import { AssetBreakdown } from "@/components/wealthboard/asset-breakdown";
import { CashFlowCard } from "@/components/wealthboard/cash-flow-card";
import { GoalsList } from "@/components/wealthboard/goals-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FIRE_CONFIG } from "@/lib/fire-constants";
import type { WealthData, FinancialGoal } from "@/types/wealth.types";

export const metadata = {
  title: "Wealthboard - PathTwo FIRE Journey",
  description:
    "Follow our journey to financial independence. Track our net worth, savings rate, and progress toward our $3.5M FIRE goal in real-time.",
};

export default async function PublicWealthboardPage() {
  const supabase = await createClient();

  // Fetch public wealth data (no auth required - uses anon key)
  // RLS will control what's visible
  const [entriesRes, goalsRes] = await Promise.all([
    supabase
      .from("wealth_data")
      .select("*")
      .order("date", { ascending: true }),
    supabase
      .from("financial_goals")
      .select("*")
      .order("priority", { ascending: true }),
  ]);

  const entries = (entriesRes.data || []) as WealthData[];
  const goals = (goalsRes.data || []) as FinancialGoal[];

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const currentNetWorth = latestEntry
    ? Number(latestEntry.net_worth)
    : FIRE_CONFIG.currentNetWorth;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Wealthboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Follow our journey to financial independence. Real numbers,
              real progress toward our $3.5M FIRE goal.
            </p>
          </div>

          <FireProgressCard currentNetWorth={currentNetWorth} />

          <Tabs defaultValue="networth" className="space-y-4">
            <TabsList>
              <TabsTrigger value="networth">Net Worth</TabsTrigger>
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="networth" className="space-y-6">
              <NetWorthChart data={entries} />
              <AssetBreakdown data={latestEntry} />
            </TabsContent>

            <TabsContent value="cashflow" className="space-y-6">
              <CashFlowCard data={latestEntry} />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <GoalsList goals={goals} />
            </TabsContent>
          </Tabs>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-semibold">Want to follow along?</h3>
                <p className="text-sm text-muted-foreground">
                  Read our blog posts for detailed updates and insights on our
                  FI journey.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/blog">Read the Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
