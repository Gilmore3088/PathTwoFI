import Header from "@/components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Target, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WealthboardPage() {
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
              Follow our journey to financial independence. Track our net worth, savings rate, 
              and progress toward our FI goal in real-time.
            </p>
          </div>

          {/* Financial Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Worth
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated monthly
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Savings Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Of monthly income
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  FI Progress
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  To our FI number
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Years to FI
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground mt-1">
                  At current rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Net Worth Chart Section */}
          <Tabs defaultValue="networth" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="networth">Net Worth</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="networth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Net Worth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">No data yet</p>
                        <p className="text-sm max-w-md">
                          We'll start sharing our financial journey soon. Check back for regular updates!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cash & Savings</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Investments</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Real Estate</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Other</span>
                        <span className="font-medium">$0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Liabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Credit Cards</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Student Loans</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Mortgage</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Other</span>
                        <span className="font-medium">$0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Income & Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Coming Soon</p>
                        <p className="text-sm max-w-md">
                          Monthly breakdown of income sources and expense categories.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Coming Soon</p>
                        <p className="text-sm max-w-md">
                          Detailed breakdown of our investment accounts and asset allocation.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Our FI Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">FI Number Target</span>
                        <span className="text-2xl font-bold">$0</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        0% of our goal achieved
                      </p>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <h3 className="font-semibold">Our Strategy</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Maximize savings rate through intentional spending</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Invest consistently in low-cost index funds</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Build multiple income streams</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Document and share our journey transparently</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-semibold">Want to follow along?</h3>
                <p className="text-sm text-muted-foreground">
                  Read our blog posts for detailed updates and insights on our FI journey.
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
