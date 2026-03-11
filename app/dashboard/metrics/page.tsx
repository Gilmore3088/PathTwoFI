import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  FileText,
} from "lucide-react";

const METRICS_DATA = {
  overview: [
    {
      title: "Total Posts",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Total Views",
      value: "12,543",
      change: "+23%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Subscribers",
      value: "1,284",
      change: "+8%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "$3,240",
      change: "-2%",
      trend: "down",
      icon: DollarSign,
    },
  ],
  monthlyStats: [
    { month: "Jan", posts: 4, views: 1200, subscribers: 45 },
    { month: "Feb", posts: 3, views: 1450, subscribers: 62 },
    { month: "Mar", posts: 5, views: 2100, subscribers: 89 },
    { month: "Apr", posts: 2, views: 1800, subscribers: 71 },
    { month: "May", posts: 4, views: 2400, subscribers: 103 },
    { month: "Jun", posts: 6, views: 3593, subscribers: 914 },
  ],
};

export default function MetricsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Metrics</h1>
        <p className="text-muted-foreground mt-2">
          Track your blog's performance and growth.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {METRICS_DATA.overview.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p
                  className={cn(
                    "text-xs flex items-center gap-1 mt-1",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>
                Your blog's performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {METRICS_DATA.monthlyStats.map((stat) => (
                  <div
                    key={stat.month}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <div className="font-medium">{stat.month}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.posts} posts
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.views.toLocaleString()} views
                    </div>
                    <div className="text-sm text-muted-foreground">
                      +{stat.subscribers} subs
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                How readers interact with your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Average Read Time</p>
                    <p className="text-xs text-muted-foreground">
                      Time spent per article
                    </p>
                  </div>
                  <div className="text-2xl font-bold">4.2 min</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Bounce Rate</p>
                    <p className="text-xs text-muted-foreground">
                      Visitors who leave quickly
                    </p>
                  </div>
                  <div className="text-2xl font-bold">32%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Comments per Post</p>
                    <p className="text-xs text-muted-foreground">
                      Average engagement
                    </p>
                  </div>
                  <div className="text-2xl font-bold">8.4</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Insights</CardTitle>
              <CardDescription>
                Track your blog's growth trajectory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Monthly Growth Rate</p>
                    <p className="text-xs text-muted-foreground">
                      New subscribers per month
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">+15%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Top Traffic Source</p>
                    <p className="text-xs text-muted-foreground">
                      Where visitors come from
                    </p>
                  </div>
                  <div className="text-2xl font-bold">Google</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Conversion Rate</p>
                    <p className="text-xs text-muted-foreground">
                      Visitors to subscribers
                    </p>
                  </div>
                  <div className="text-2xl font-bold">10.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
