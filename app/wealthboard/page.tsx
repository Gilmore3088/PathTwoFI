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
import type { WealthData, FinancialGoal, PublicWealthData } from "@/types/wealth.types";
import { EyeOff } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Wealthboard - PathTwo FIRE Journey",
  description:
    "Follow our journey to financial independence. Track our net worth, savings rate, and progress toward our $3.5M FIRE goal in real-time.",
};

export default async function PublicWealthboardPage() {
  const supabase = await createClient();

  const { data: rpcData, error } = await supabase.rpc("get_public_wealth_data");

  const publicData = (rpcData as PublicWealthData) ?? { is_public: false };

  if (!publicData.is_public) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <EyeOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Wealthboard is Private
            </h1>
            <p className="text-lg text-muted-foreground">
              The owners have chosen to keep their financial data private.
              Check back later or visit the blog for updates on their FIRE journey.
            </p>
            <Button asChild size="lg">
              <Link href="/blog">Read the Blog</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  const entries = (publicData.entries || []) as WealthData[];
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const currentNetWorth = latestEntry
    ? Number(latestEntry.net_worth)
    : FIRE_CONFIG.currentNetWorth;

  const showNetWorth = publicData.show_net_worth !== "hidden";
  const showAssets = publicData.show_assets !== "hidden";
  const showCashFlow = publicData.show_cash_flow !== "hidden";
  const showGoals = publicData.show_goals !== "hidden";

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
              {publicData.display_name && publicData.display_name !== "Anonymous"
                ? `${publicData.display_name}'s journey to financial independence.`
                : "Follow our journey to financial independence."}{" "}
              Real progress toward our $3.5M FIRE goal.
            </p>
          </div>

          {showNetWorth && (
            <FireProgressCard currentNetWorth={currentNetWorth} />
          )}

          <Tabs defaultValue="networth" className="space-y-4">
            <TabsList>
              {showNetWorth && (
                <TabsTrigger value="networth">Net Worth</TabsTrigger>
              )}
              {showCashFlow && (
                <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              )}
              {showGoals && (
                <TabsTrigger value="goals">Goals</TabsTrigger>
              )}
            </TabsList>

            {showNetWorth && (
              <TabsContent value="networth" className="space-y-6">
                <NetWorthChart data={entries} />
                {showAssets && <AssetBreakdown data={latestEntry} />}
              </TabsContent>
            )}

            {showCashFlow && (
              <TabsContent value="cashflow" className="space-y-6">
                <CashFlowCard data={latestEntry} />
              </TabsContent>
            )}

            {showGoals && (
              <TabsContent value="goals" className="space-y-6">
                <GoalsList goals={[]} />
              </TabsContent>
            )}
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
