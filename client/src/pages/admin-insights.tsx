import { useMemo, useState } from "react";
import { addDays, differenceInCalendarDays, format, isWithinInterval, parseISO, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminLayout } from "@/components/admin/admin-layout";
import { SEO } from "@/components/ui/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  BarChart3,
  CalendarRange,
  Clock3,
  Flame,
  Gauge,
  Globe,
  Laptop,
  LineChart as LineChartIcon,
  Newspaper,
  PieChart as PieChartIcon,
  Repeat,
  Sparkles,
  TabletSmartphone,
  Target,
  Users,
} from "lucide-react";

interface TrafficDay {
  date: string;
  sessions: number;
  uniqueVisitors: number;
  avgReadTime: number;
  newSubscribers: number;
  returningVisitors: number;
  channels: Record<string, number>;
  postTypeBreakdown: {
    wealthUpdate: number;
    blog: number;
    other: number;
  };
}

interface PostMetric {
  id: string;
  title: string;
  publishedAt: string;
  type: "Wealth Update" | "Blog" | "Other";
  views: number;
  avgReadTime: number;
  scroll75: number;
  readComplete: number;
  subscribers: number;
  notes: string;
  wordCount: number;
}

interface QueryMetric {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topPage: string;
}

interface FunnelStep {
  id: string;
  label: string;
  count: number;
}

interface CtaPlacementMetric {
  placement: string;
  views: number;
  clicks: number;
  conversions: number;
}

const endDate = parseISO("2024-10-20");

const trafficDaily: TrafficDay[] = Array.from({ length: 120 }, (_, index) => {
  const date = subDays(endDate, 119 - index);
  const sin = Math.sin(index / 6.5);
  const cos = Math.cos(index / 4.2);
  const sessionsBase = 180 + index * 0.6 + sin * 28 + cos * 18;
  const sessions = Math.round(Math.max(140, sessionsBase));
  const uniqueVisitors = Math.round(sessions * (0.78 + Math.sin(index / 8) * 0.04));
  const avgReadTime = 3.4 + Math.sin(index / 9) * 0.35 + (index % 14 === 0 ? 0.35 : 0);
  const returningVisitors = 0.18 + Math.cos(index / 10) * 0.03 + (index % 21 === 0 ? 0.04 : 0);
  const newSubscribers = Math.max(4, Math.round(8 + sin * 3 + (index % 14 === 0 ? 6 : 0)));
  const wealthShare = 0.18 + Math.max(-0.04, Math.sin(index / 7 + 0.5) * 0.06);
  const blogShare = 0.56 + Math.cos(index / 5) * 0.05;
  const otherShare = Math.max(0.12, 1 - wealthShare - blogShare);
  const wealthSessions = Math.round(sessions * wealthShare);
  const blogSessions = Math.round(sessions * blogShare);
  const otherSessions = Math.max(0, sessions - wealthSessions - blogSessions);

  const organicShare = 0.46 + Math.sin(index / 10) * 0.05;
  const socialShare = 0.14 + Math.cos(index / 8) * 0.03;
  const emailShare = 0.12 + Math.sin(index / 6) * 0.02;
  const referralShare = 0.08 + Math.cos(index / 12) * 0.02;
  const directShare = Math.max(0.12, 1 - organicShare - socialShare - emailShare - referralShare);
  const channelSessions = (share: number) => Math.round(Math.max(0, sessions * share));

  return {
    date: date.toISOString(),
    sessions,
    uniqueVisitors,
    avgReadTime,
    newSubscribers,
    returningVisitors,
    channels: {
      Organic: channelSessions(organicShare),
      Direct: channelSessions(directShare),
      Social: channelSessions(socialShare),
      Email: channelSessions(emailShare),
      Referral: channelSessions(referralShare),
    },
    postTypeBreakdown: {
      wealthUpdate: wealthSessions,
      blog: blogSessions,
      other: otherSessions,
    },
  };
});

const postMetrics: PostMetric[] = [
  {
    id: "2024-10-18-wealth",
    title: "October Wealth Check-In",
    publishedAt: "2024-10-18",
    type: "Wealth Update",
    views: 850,
    avgReadTime: 3.92,
    scroll75: 0.68,
    readComplete: 0.42,
    subscribers: 19,
    notes: "Strong retention with clear milestone framing.",
    wordCount: 1280,
  },
  {
    id: "2024-10-11-fire",
    title: "FIRE Tracker Update",
    publishedAt: "2024-10-11",
    type: "Wealth Update",
    views: 510,
    avgReadTime: 3.35,
    scroll75: 0.57,
    readComplete: 0.34,
    subscribers: 8,
    notes: "Add CTA near the top and reinforce key wins.",
    wordCount: 1145,
  },
  {
    id: "2024-10-08-budget",
    title: "How We Dialed In Our Q4 Budget",
    publishedAt: "2024-10-08",
    type: "Blog",
    views: 460,
    avgReadTime: 3.1,
    scroll75: 0.61,
    readComplete: 0.37,
    subscribers: 11,
    notes: "Budget template download performing well.",
    wordCount: 980,
  },
  {
    id: "2024-10-02-wealth",
    title: "Late September Wealth Update",
    publishedAt: "2024-10-02",
    type: "Wealth Update",
    views: 620,
    avgReadTime: 3.76,
    scroll75: 0.63,
    readComplete: 0.39,
    subscribers: 14,
    notes: "Strong lift from Twitter shares.",
    wordCount: 1225,
  },
  {
    id: "2024-09-26-investing",
    title: "Index Investing in Volatile Markets",
    publishedAt: "2024-09-26",
    type: "Blog",
    views: 540,
    avgReadTime: 4.05,
    scroll75: 0.7,
    readComplete: 0.45,
    subscribers: 16,
    notes: "Consider repurposing into a webinar outline.",
    wordCount: 1620,
  },
  {
    id: "2024-09-21-side",
    title: "Side Hustle Report: September",
    publishedAt: "2024-09-21",
    type: "Other",
    views: 310,
    avgReadTime: 2.8,
    scroll75: 0.49,
    readComplete: 0.28,
    subscribers: 5,
    notes: "Add infographics for quick skimming.",
    wordCount: 860,
  },
  {
    id: "2024-09-12-wealth",
    title: "Mid-September Wealth Update",
    publishedAt: "2024-09-12",
    type: "Wealth Update",
    views: 560,
    avgReadTime: 3.62,
    scroll75: 0.6,
    readComplete: 0.38,
    subscribers: 13,
    notes: "Email subject drove 42% open rate.",
    wordCount: 1180,
  },
  {
    id: "2024-09-05-cost",
    title: "Our Monthly Cost Breakdown",
    publishedAt: "2024-09-05",
    type: "Blog",
    views: 490,
    avgReadTime: 3.4,
    scroll75: 0.58,
    readComplete: 0.35,
    subscribers: 12,
    notes: "CTA in the intro captured fast signups.",
    wordCount: 1010,
  },
  {
    id: "2024-08-29-wealth",
    title: "August Close-Out Wealth Update",
    publishedAt: "2024-08-29",
    type: "Wealth Update",
    views: 600,
    avgReadTime: 3.7,
    scroll75: 0.65,
    readComplete: 0.4,
    subscribers: 15,
    notes: "Add a milestone graphic for quick scanning.",
    wordCount: 1190,
  },
  {
    id: "2024-08-22-mini",
    title: "Mini-Retirements: Testing the Waters",
    publishedAt: "2024-08-22",
    type: "Blog",
    views: 420,
    avgReadTime: 3.05,
    scroll75: 0.55,
    readComplete: 0.33,
    subscribers: 9,
    notes: "Readers loved the sample itinerary.",
    wordCount: 1340,
  },
];

const wealthUpdateDates = postMetrics
  .filter((post) => post.type === "Wealth Update")
  .map((post) => post.publishedAt);

const topSources = [
  { domain: "google.com", sessions: 980, subscribers: 31 },
  { domain: "direct", sessions: 820, subscribers: 18 },
  { domain: "twitter.com", sessions: 460, subscribers: 14 },
  { domain: "newsletter", sessions: 350, subscribers: 27 },
  { domain: "reddit.com", sessions: 210, subscribers: 6 },
];

const visitorsByCountry = [
  { country: "United States", share: 0.62 },
  { country: "Canada", share: 0.12 },
  { country: "United Kingdom", share: 0.08 },
  { country: "Australia", share: 0.05 },
  { country: "Germany", share: 0.04 },
  { country: "India", share: 0.03 },
  { country: "Other", share: 0.06 },
];

const queryMetrics: QueryMetric[] = [
  {
    query: "path two fire progress",
    clicks: 210,
    impressions: 4200,
    ctr: 0.05,
    position: 4.1,
    topPage: "/blog/october-wealth-check-in",
  },
  {
    query: "monthly wealth update blog",
    clicks: 160,
    impressions: 2800,
    ctr: 0.057,
    position: 3.7,
    topPage: "/blog/october-wealth-check-in",
  },
  {
    query: "financial independence tracker template",
    clicks: 110,
    impressions: 5200,
    ctr: 0.021,
    position: 5.3,
    topPage: "/blog/fire-tracker-update",
  },
  {
    query: "path two budget",
    clicks: 75,
    impressions: 1900,
    ctr: 0.039,
    position: 6.1,
    topPage: "/blog/how-we-dialed-in-our-q4-budget",
  },
  {
    query: "wealth update newsletter",
    clicks: 58,
    impressions: 2400,
    ctr: 0.024,
    position: 7.8,
    topPage: "/blog/late-september-wealth-update",
  },
];

const funnel: FunnelStep[] = [
  { id: "views", label: "Post Views", count: 6400 },
  { id: "cta", label: "CTA Clicks", count: 1480 },
  { id: "subscribe", label: "Subscribers Started", count: 620 },
  { id: "confirmed", label: "Confirmed Subscribers", count: 470 },
];

const ctaPlacements: CtaPlacementMetric[] = [
  { placement: "Header banner", views: 5200, clicks: 430, conversions: 180 },
  { placement: "Inline CTA", views: 4100, clicks: 560, conversions: 210 },
  { placement: "Footer CTA", views: 3800, clicks: 280, conversions: 80 },
];

const technicalHealth = {
  lcp: 2.7,
  lcpChange: -0.2,
  errors404: 4,
  errorChange: -2,
  largestImages: [
    { path: "/images/blog/october-update-hero.jpg", sizeKb: 780 },
    { path: "/images/blog/q4-budget.jpg", sizeKb: 640 },
    { path: "/images/blog/index-investing.jpg", sizeKb: 590 },
  ],
  mobileScore: 86,
  desktopScore: 94,
};

const seoDaily = trafficDaily.map((day, index) => {
  const clicks = 95 + Math.sin(index / 5) * 18 + (index % 14 === 0 ? 28 : 0);
  const impressions = 3400 + index * 18 + Math.cos(index / 7) * 120;
  const ctr = clicks / impressions;
  const position = 6.1 - Math.sin(index / 16) * 0.3;
  return {
    date: day.date,
    clicks: Math.round(Math.max(40, clicks)),
    impressions: Math.round(impressions),
    ctr,
    position,
  };
});

const cohortWeeks = [
  { cohort: "Week of Aug 26", returningRate: 0.28 },
  { cohort: "Week of Sep 2", returningRate: 0.31 },
  { cohort: "Week of Sep 9", returningRate: 0.33 },
  { cohort: "Week of Sep 16", returningRate: 0.36 },
  { cohort: "Week of Sep 23", returningRate: 0.32 },
  { cohort: "Week of Sep 30", returningRate: 0.35 },
  { cohort: "Week of Oct 7", returningRate: 0.39 },
  { cohort: "Week of Oct 14", returningRate: 0.41 },
];

const DEVICE_BREAKDOWN = [
  { label: "Mobile", value: 62 },
  { label: "Desktop", value: 34 },
  { label: "Tablet", value: 4 },
];

const rangePresets: { label: string; days: number }[] = [
  { label: "Today", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

const postTypeOptions = [
  { label: "All posts", value: "all" },
  { label: "Wealth Update", value: "wealth" },
  { label: "Blog", value: "blog" },
  { label: "Other", value: "other" },
] as const;

type PostTypeFilter = (typeof postTypeOptions)[number]["value"];

function getRangeFromPreset(days: number): DateRange {
  const end = endDate;
  const start = subDays(end, days - 1);
  return { from: start, to: end };
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function formatPercent(value: number, fractionDigits = 0): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

function formatMinutes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "0m 00s";
  }
  const minutes = Math.floor(value);
  const seconds = Math.round((value - minutes) * 60);
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function filterTrafficByRange(data: TrafficDay[], range?: DateRange, filter: PostTypeFilter = "all") {
  if (!range?.from || !range?.to) {
    return data;
  }

  return data
    .filter((day) =>
      isWithinInterval(parseISO(day.date), {
        start: range.from!,
        end: addDays(range.to!, 1),
      }),
    )
    .map((day) => {
      if (filter === "all") {
        return day;
      }
      const total = day.sessions === 0 ? 1 : day.sessions;
      const multiplier =
        filter === "wealth"
          ? day.postTypeBreakdown.wealthUpdate / total
          : filter === "blog"
          ? day.postTypeBreakdown.blog / total
          : day.postTypeBreakdown.other / total;

      const scale = Number.isFinite(multiplier) ? multiplier : 0;

      return {
        ...day,
        sessions: Math.round(day.sessions * scale),
        uniqueVisitors: Math.round(day.uniqueVisitors * scale),
        avgReadTime: day.avgReadTime,
        newSubscribers: Math.round(day.newSubscribers * scale),
        returningVisitors: day.returningVisitors,
        channels: Object.fromEntries(
          Object.entries(day.channels).map(([key, value]) => [key, Math.round(value * scale)]),
        ),
      } satisfies TrafficDay;
    });
}

function getPreviousRange(range?: DateRange): DateRange | undefined {
  if (!range?.from || !range?.to) return undefined;
  const duration = Math.max(1, differenceInCalendarDays(range.to, range.from) + 1);
  const previousEnd = subDays(range.from, 1);
  const previousStart = subDays(previousEnd, duration - 1);
  return { from: previousStart, to: previousEnd };
}

function sumChannels(data: TrafficDay[]): Record<string, number> {
  return data.reduce<Record<string, number>>((acc, day) => {
    Object.entries(day.channels).forEach(([channel, value]) => {
      acc[channel] = (acc[channel] ?? 0) + value;
    });
    return acc;
  }, {});
}

function aggregatePosts(range: DateRange | undefined, filter: PostTypeFilter): PostMetric[] {
  return postMetrics.filter((post) => {
    if (filter === "wealth" && post.type !== "Wealth Update") return false;
    if (filter === "blog" && post.type !== "Blog") return false;
    if (filter === "other" && post.type !== "Other") return false;
    if (!range?.from || !range?.to) return true;
    const publishedAt = parseISO(post.publishedAt);
    return isWithinInterval(publishedAt, { start: range.from, end: range.to });
  });
}

function computeAverageReadTime(data: TrafficDay[]): number {
  const totalSessions = data.reduce((sum, day) => sum + day.sessions, 0);
  if (totalSessions === 0) return 0;
  const weighted = data.reduce((sum, day) => sum + day.avgReadTime * day.sessions, 0);
  return weighted / totalSessions;
}

function computeReturningRate(data: TrafficDay[]): number {
  const totalSessions = data.reduce((sum, day) => sum + day.sessions, 0);
  if (totalSessions === 0) {
    if (data.length === 0) return 0;
    return data.reduce((sum, day) => sum + day.returningVisitors, 0) / data.length;
  }
  const weighted = data.reduce((sum, day) => sum + day.returningVisitors * day.sessions, 0);
  return weighted / totalSessions;
}

function computeDelta(current: number, previous: number) {
  if (previous === 0) {
    return { value: current, change: null as number | null };
  }
  const delta = (current - previous) / previous;
  return { value: current, change: delta };
}

function computeAverage<T>(values: T[], selector: (item: T) => number): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((total, item) => total + selector(item), 0);
  return sum / values.length;
}

export default function AdminInsights() {
  const [dateRange, setDateRange] = useState<DateRange>(getRangeFromPreset(30));
  const [comparisonEnabled, setComparisonEnabled] = useState(true);
  const [postType, setPostType] = useState<PostTypeFilter>("all");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const filteredTraffic = useMemo(() => filterTrafficByRange(trafficDaily, dateRange, postType), [dateRange, postType]);
  const previousRange = useMemo(() => getPreviousRange(dateRange), [dateRange]);
  const previousTraffic = useMemo(
    () => (comparisonEnabled ? filterTrafficByRange(trafficDaily, previousRange, postType) : []),
    [comparisonEnabled, postType, previousRange],
  );

  const contentPerformance = useMemo(() => aggregatePosts(dateRange, postType), [dateRange, postType]);
  const previousContentPerformance = useMemo(
    () => aggregatePosts(previousRange, postType),
    [postType, previousRange],
  );

  const totalSessions = filteredTraffic.reduce((sum, day) => sum + day.sessions, 0);
  const totalUniqueVisitors = filteredTraffic.reduce((sum, day) => sum + day.uniqueVisitors, 0);
  const averageReadTime = computeAverageReadTime(filteredTraffic);
  const totalSubscribers = filteredTraffic.reduce((sum, day) => sum + day.newSubscribers, 0);
  const returningRate = computeReturningRate(filteredTraffic);

  const previousSessions = previousTraffic.reduce((sum, day) => sum + day.sessions, 0);
  const previousVisitors = previousTraffic.reduce((sum, day) => sum + day.uniqueVisitors, 0);
  const previousReadTime = computeAverageReadTime(previousTraffic);
  const previousSubscribers = previousTraffic.reduce((sum, day) => sum + day.newSubscribers, 0);
  const previousReturningRate = computeReturningRate(previousTraffic);

  const topPost = useMemo(() => {
    if (contentPerformance.length === 0) return null;
    return [...contentPerformance].sort((a, b) => b.views - a.views)[0];
  }, [contentPerformance]);

  const previousTopPost = useMemo(() => {
    if (previousContentPerformance.length === 0) return null;
    return [...previousContentPerformance].sort((a, b) => b.views - a.views)[0];
  }, [previousContentPerformance]);

  const sessionsDelta = computeDelta(totalSessions, previousSessions);
  const visitorsDelta = computeDelta(totalUniqueVisitors, previousVisitors);
  const readTimeDelta = computeDelta(averageReadTime, previousReadTime);
  const subscriberDelta = computeDelta(totalSubscribers, previousSubscribers);
  const returningDelta = computeDelta(returningRate, previousReturningRate);

  const channelTotals = useMemo(() => sumChannels(filteredTraffic), [filteredTraffic]);
  const channelData = useMemo(() => Object.entries(channelTotals).map(([name, value]) => ({ name, value })), [channelTotals]);

  const wealthImpact = useMemo(() => {
    if (wealthUpdateDates.length === 0) return null;
    const windows = wealthUpdateDates.map((dateString) => {
      const publishDate = parseISO(dateString);
      const beforeRange: DateRange = { from: subDays(publishDate, 7), to: subDays(publishDate, 1) };
      const afterRange: DateRange = { from: publishDate, to: addDays(publishDate, 6) };
      const beforeTraffic = filterTrafficByRange(trafficDaily, beforeRange, "all");
      const afterTraffic = filterTrafficByRange(trafficDaily, afterRange, "all");

      const beforeSessions = beforeTraffic.reduce((sum, day) => sum + day.sessions, 0);
      const afterSessions = afterTraffic.reduce((sum, day) => sum + day.sessions, 0);
      const beforeSubscribers = beforeTraffic.reduce((sum, day) => sum + day.newSubscribers, 0);
      const afterSubscribers = afterTraffic.reduce((sum, day) => sum + day.newSubscribers, 0);
      const beforeReturning = computeReturningRate(beforeTraffic);
      const afterReturning = computeReturningRate(afterTraffic);
      const beforeTime = computeAverageReadTime(beforeTraffic);
      const afterTime = computeAverageReadTime(afterTraffic);

      return {
        publishDate,
        beforeSessions,
        afterSessions,
        beforeSubscribers,
        afterSubscribers,
        beforeReturning,
        afterReturning,
        beforeTime,
        afterTime,
      };
    });

    const sessionLift = computeAverage(windows, (item) => item.afterSessions - item.beforeSessions);
    const subscriberLift = computeAverage(windows, (item) => item.afterSubscribers - item.beforeSubscribers);
    const returningLift = computeAverage(windows, (item) => item.afterReturning - item.beforeReturning);
    const timeDelta = computeAverage(windows, (item) => item.afterTime - item.beforeTime);

    return {
      sessionLift,
      subscriberLift,
      returningLift,
      timeDelta,
    };
  }, []);

  const seoSummary = useMemo(() => {
    if (filteredTraffic.length === 0) return { impressions: 0, clicks: 0, ctr: 0, position: 0 };
    const filteredSeo = seoDaily.filter((day) =>
      isWithinInterval(parseISO(day.date), {
        start: dateRange.from ?? subDays(endDate, 29),
        end: dateRange.to ?? endDate,
      }),
    );
    const impressions = filteredSeo.reduce((sum, day) => sum + day.impressions, 0);
    const clicks = filteredSeo.reduce((sum, day) => sum + day.clicks, 0);
    const ctr = impressions === 0 ? 0 : clicks / impressions;
    const position = computeAverage(filteredSeo, (day) => day.position);
    return { impressions, clicks, ctr, position };
  }, [dateRange.from, dateRange.to, filteredTraffic.length]);

  const subscriberGrowthLine = useMemo(() => {
    let total = 0;
    return filteredTraffic.map((day) => {
      total += day.newSubscribers;
      return {
        date: format(parseISO(day.date), "MMM d"),
        subscribers: total,
      };
    });
  }, [filteredTraffic]);

  const subscriberTable = useMemo(() => {
    if (contentPerformance.length === 0) return [] as PostMetric[];
    return [...contentPerformance].sort((a, b) => b.subscribers - a.subscribers);
  }, [contentPerformance]);

  const ctaTotals = useMemo(() => {
    const totalViews = ctaPlacements.reduce((sum, item) => sum + item.views, 0);
    return ctaPlacements.map((item) => ({
      ...item,
      viewShare: totalViews === 0 ? 0 : item.views / totalViews,
      conversionRate: item.views === 0 ? 0 : item.conversions / item.views,
    }));
  }, []);

  const totalFunnel = funnel[0]?.count ?? 0;

  const insightSummary = useMemo(() => {
    const sessionsChange = sessionsDelta.change ? sessionsDelta.change * 100 : null;
    const returningPct = returningRate * 100;
    const topPostTitle = topPost?.title ?? "your latest posts";
    return `Traffic ${sessionsChange && sessionsChange >= 0 ? "increased" : "shifted"} ${
      sessionsChange ? `${Math.abs(sessionsChange).toFixed(1)}%` : ""
    } with ${topPostTitle} leading engagement. Average read time reached ${formatMinutes(averageReadTime)}, and returning visitors are at ${returningPct.toFixed(
      1,
    )}%. ${totalSubscribers} new subscribers joined during this period.`;
  }, [sessionsDelta.change, topPost, averageReadTime, returningRate, totalSubscribers]);

  const lowCtrAlerts = queryMetrics.filter(
    (metric) => metric.position >= 3 && metric.position <= 10 && metric.ctr < 0.02,
  );

  const rangeLabel = dateRange.from && dateRange.to
    ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
    : "All time";
  return (
    <AdminLayout
      title="My Insights"
      description="Monitor traffic, content performance, SEO visibility, and subscriber growth in one private dashboard."
      titleTestId="text-admin-insights-title"
      descriptionTestId="text-admin-insights-description"
      seo={
        <SEO
          title="Admin Insights Dashboard - PathTwo"
          description="Private analytics dashboard showing PathTwo blog performance, SEO health, and newsletter growth."
          type="website"
          url="/admin/insights"
        />
      }
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="toggle-comparison" checked={comparisonEnabled} onCheckedChange={setComparisonEnabled} />
            <label htmlFor="toggle-comparison" className="text-sm text-muted-foreground">
              Compare to previous period
            </label>
          </div>
          <Select value={postType} onValueChange={(value: PostTypeFilter) => setPostType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Post type" />
            </SelectTrigger>
            <SelectContent>
              {postTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2" data-testid="button-date-range">
                <CalendarRange className="h-4 w-4" />
                {rangeLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (!range?.from || !range?.to) return;
                  setDateRange(range);
                  setCalendarOpen(false);
                }}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-between border-t p-3">
                <div className="flex gap-2">
                  {rangePresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateRange(getRangeFromPreset(preset.days));
                        setCalendarOpen(false);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateRange(getRangeFromPreset(30));
                    setCalendarOpen(false);
                  }}
                >
                  Reset
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      }
    >
      <section>
        <div className="grid gap-4 lg:grid-cols-6">
          <KeyMetricCard
            icon={Activity}
            title="Total Sessions"
            value={formatNumber(totalSessions)}
            delta={comparisonEnabled && sessionsDelta.change !== null ? sessionsDelta.change : null}
          />
          <KeyMetricCard
            icon={Users}
            title="Unique Visitors"
            value={formatNumber(totalUniqueVisitors)}
            delta={comparisonEnabled && visitorsDelta.change !== null ? visitorsDelta.change : null}
          />
          <KeyMetricCard
            icon={Clock3}
            title="Avg. Read Time"
            value={formatMinutes(averageReadTime)}
            delta={comparisonEnabled && readTimeDelta.change !== null ? readTimeDelta.change : null}
          />
          <KeyMetricCard
            icon={Newspaper}
            title="Top Post"
            value={topPost?.title ?? "No posts"}
            subtitle={
              comparisonEnabled && previousTopPost ? `Previously: ${previousTopPost.title}` : undefined
            }
          />
          <KeyMetricCard
            icon={Target}
            title="New Subscribers"
            value={formatNumber(totalSubscribers)}
            delta={comparisonEnabled && subscriberDelta.change !== null ? subscriberDelta.change : null}
          />
          <KeyMetricCard
            icon={Repeat}
            title="Return Rate"
            value={`${(returningRate * 100).toFixed(1)}%`}
            delta={comparisonEnabled && returningDelta.change !== null ? returningDelta.change : null}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <TrafficChart
          data={filteredTraffic}
          wealthDates={wealthUpdateDates}
          comparisonEnabled={comparisonEnabled}
          comparisonData={previousTraffic}
        />
        <AcquisitionBreakdown
          channelData={channelData}
          sources={topSources}
          visitorsByCountry={visitorsByCountry}
          totalSessions={totalSessions}
        />
      </section>

      <section>
        <ContentPerformanceTable posts={contentPerformance} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {wealthImpact ? (
          <WealthImpactCards
            sessionLift={wealthImpact.sessionLift}
            subscriberLift={wealthImpact.subscriberLift}
            returningLift={wealthImpact.returningLift}
            timeDelta={wealthImpact.timeDelta}
          />
        ) : null}
        <InsightPanel summary={insightSummary} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <SeoPerformance
          seoSummary={seoSummary}
          trendData={seoDaily}
          dateRange={dateRange}
          queries={queryMetrics}
          alerts={lowCtrAlerts}
        />
        <NewsletterSection
          growthData={subscriberGrowthLine}
          posts={subscriberTable}
          funnel={funnel}
          placements={ctaTotals}
          totalFunnel={totalFunnel}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <EngagementSection traffic={filteredTraffic} cohort={cohortWeeks} />
        <TechnicalHealthSection health={technicalHealth} />
      </section>

      <section>
        <SummaryCard summary={insightSummary} />
      </section>
    </AdminLayout>
  );
}
interface KeyMetricCardProps {
  icon: typeof Activity;
  title: string;
  value: string;
  delta?: number | null;
  subtitle?: string;
}

function KeyMetricCard({ icon: Icon, title, value, delta, subtitle }: KeyMetricCardProps) {
  const changeLabel = delta != null ? `${delta >= 0 ? "+" : ""}${(delta * 100).toFixed(1)}%` : null;
  const changeTone = delta == null ? "text-muted-foreground" : delta >= 0 ? "text-emerald-500" : "text-destructive";

  return (
    <Card className="h-full" data-testid={`card-key-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="text-2xl font-semibold text-foreground">{value}</CardDescription>
      </CardHeader>
      {(changeLabel || subtitle) && (
        <CardContent className="pt-0">
          {changeLabel ? <p className={`text-xs font-medium ${changeTone}`}>{changeLabel} vs. prev.</p> : null}
          {subtitle ? <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p> : null}
        </CardContent>
      )}
    </Card>
  );
}

interface TrafficChartProps {
  data: TrafficDay[];
  comparisonData: TrafficDay[];
  wealthDates: string[];
  comparisonEnabled: boolean;
}

function TrafficChart({ data, wealthDates, comparisonData, comparisonEnabled }: TrafficChartProps) {
  const chartData = useMemo(
    () =>
      data.map((day) => ({
        date: format(parseISO(day.date), "MMM d"),
        sessions: day.sessions,
      })),
    [data],
  );

  const comparisonChartData = useMemo(
    () =>
      comparisonData.map((day) => ({
        date: format(parseISO(day.date), "MMM d"),
        sessions: day.sessions,
      })),
    [comparisonData],
  );

  const wealthMarks = useMemo(
    () =>
      wealthDates
        .map((dateString) => {
          const parsed = parseISO(dateString);
          return {
            date: format(parsed, "MMM d"),
            original: format(parsed, "MMMM d, yyyy"),
          };
        })
        .filter((mark) => chartData.some((point) => point.date === mark.date)),
    [chartData, wealthDates],
  );

  return (
    <Card className="h-full" data-testid="card-traffic-trend">
      <CardHeader>
        <CardTitle>Traffic Trends</CardTitle>
        <CardDescription>Sessions over time with Wealth Update publish dates highlighted</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <RechartsTooltip
                formatter={(value: number) => [`${value}`, "Sessions"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
              {comparisonEnabled ? (
                <Line
                  type="monotone"
                  data={comparisonChartData}
                  dataKey="sessions"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
          {wealthMarks.length ? (
            <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-between px-6 text-[10px] uppercase tracking-wide text-muted-foreground">
              {wealthMarks.map((mark) => (
                <div key={mark.date} className="flex flex-col items-center">
                  <div className="h-10 w-px bg-primary/40" />
                  <span className="mt-2 font-semibold">Wealth</span>
                  <span>{mark.date}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface AcquisitionBreakdownProps {
  channelData: { name: string; value: number }[];
  sources: { domain: string; sessions: number; subscribers: number }[];
  visitorsByCountry: { country: string; share: number }[];
  totalSessions: number;
}

function AcquisitionBreakdown({ channelData, sources, visitorsByCountry, totalSessions }: AcquisitionBreakdownProps) {
  return (
    <Card className="h-full" data-testid="card-acquisition">
      <CardHeader>
        <CardTitle>Traffic &amp; Acquisition</CardTitle>
        <CardDescription>Understand how people discovered the site</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={channelData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={4}>
                {channelData.map((entry, index) => (
                  <Cell key={entry.name} fill={`hsl(var(--chart-${((index % 5) + 1) as 1 | 2 | 3 | 4 | 5}))`} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number, name) => [`${value} sessions`, name as string]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {channelData.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-sm">
                <span>{channel.name}</span>
                <span className="font-medium tabular-nums">{formatNumber(channel.value)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Top sources</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.domain}>
                  <TableCell className="font-medium">{source.domain}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(source.sessions)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(source.subscribers)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Visitors by region</h4>
          <div className="space-y-2">
            {visitorsByCountry.map((country) => (
              <div key={country.country} className="flex items-center justify-between text-sm">
                <span>{country.country}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-28 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(country.share * 100)}%` }} />
                  </div>
                  <span className="w-10 text-right tabular-nums">{Math.round(country.share * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-auto rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
          {formatNumber(totalSessions)} sessions recorded in this window. Organic search led overall traffic, while newsletter and social channels produced the highest subscriber density.
        </p>
      </CardContent>
    </Card>
  );
}

interface ContentPerformanceTableProps {
  posts: PostMetric[];
}

function ContentPerformanceTable({ posts }: ContentPerformanceTableProps) {
  const heatmapClass = (value: number) => {
    if (value >= 0.45) return "bg-emerald-500/30";
    if (value >= 0.35) return "bg-emerald-500/15";
    if (value >= 0.25) return "bg-amber-500/20";
    return "bg-rose-500/20";
  };

  return (
    <Card data-testid="card-content-performance">
      <CardHeader>
        <CardTitle>Content Performance</CardTitle>
        <CardDescription>Engagement depth and subscriber impact by story</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[420px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Avg. Read</TableHead>
                <TableHead className="text-right">75% Scroll</TableHead>
                <TableHead className="text-right">Read Complete</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{post.title}</span>
                      <span className="text-xs text-muted-foreground">{post.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(parseISO(post.publishedAt), "MMM d")}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(post.views)}</TableCell>
                  <TableCell className="text-right">{formatMinutes(post.avgReadTime)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground">{Math.round(post.scroll75 * 100)}%</span>
                      <div className="h-2 w-16 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${post.scroll75 * 100}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground">{Math.round(post.readComplete * 100)}%</span>
                      <div className={cn("h-2 w-16 rounded-full", heatmapClass(post.readComplete))} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{post.subscribers}</TableCell>
                  <TableCell className="max-w-[220px] text-xs text-muted-foreground">{post.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface WealthImpactCardsProps {
  sessionLift: number;
  subscriberLift: number;
  returningLift: number;
  timeDelta: number;
}

function WealthImpactCards({ sessionLift, subscriberLift, returningLift, timeDelta }: WealthImpactCardsProps) {
  const impactItems = [
    {
      label: "Sessions lift",
      value: sessionLift,
      formatter: (value: number) => `${value >= 0 ? "+" : ""}${Math.round(value)}`,
      icon: LineChartIcon,
    },
    {
      label: "Subscribers lift",
      value: subscriberLift,
      formatter: (value: number) => `${value >= 0 ? "+" : ""}${Math.round(value)}`,
      icon: Target,
    },
    {
      label: "Returning visitor delta",
      value: returningLift,
      formatter: (value: number) => `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1)}%`,
      icon: Repeat,
    },
    {
      label: "Avg. time change",
      value: timeDelta,
      formatter: (value: number) => `${value >= 0 ? "+" : ""}${formatMinutes(Math.abs(value))}`,
      icon: Clock3,
    },
  ];

  return (
    <Card className="h-full" data-testid="card-wealth-impact">
      <CardHeader>
        <CardTitle>Wealth Update Impact</CardTitle>
        <CardDescription>7-day lift after each Wealth Update publish</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {impactItems.map((item) => (
          <div key={item.label} className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
            <div className="text-2xl font-semibold text-foreground">{item.formatter(item.value)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface InsightPanelProps {
  summary: string;
}

function InsightPanel({ summary }: InsightPanelProps) {
  return (
    <Card className="h-full" data-testid="card-insight-panel">
      <CardHeader>
        <CardTitle>Insight Spotlight</CardTitle>
        <CardDescription>Auto-curated highlights for the selected window</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Narrative summary
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
        </div>
        <div className="rounded-lg border border-dashed border-primary/30 p-4 text-xs text-muted-foreground">
          Action idea: schedule the next Wealth Update on Tuesday mornings to maximize newsletter click-through.
        </div>
      </CardContent>
    </Card>
  );
}
interface SeoPerformanceProps {
  seoSummary: { impressions: number; clicks: number; ctr: number; position: number };
  trendData: { date: string; clicks: number; impressions: number; ctr: number; position: number }[];
  dateRange: DateRange;
  queries: QueryMetric[];
  alerts: QueryMetric[];
}

function SeoPerformance({ seoSummary, trendData, dateRange, queries, alerts }: SeoPerformanceProps) {
  const filteredTrend = useMemo(
    () =>
      trendData.filter((point) =>
        !dateRange.from || !dateRange.to
          ? true
          : isWithinInterval(parseISO(point.date), { start: dateRange.from, end: dateRange.to }),
      ),
    [dateRange.from, dateRange.to, trendData],
  );

  return (
    <Card className="h-full" data-testid="card-seo-performance">
      <CardHeader>
        <CardTitle>SEO &amp; Discovery</CardTitle>
        <CardDescription>Search visibility and keyword momentum</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <MetricPill label="Impressions" value={formatNumber(seoSummary.impressions)} icon={Globe} tone="primary" />
          <MetricPill label="Clicks" value={formatNumber(seoSummary.clicks)} icon={BarChart3} tone="emerald" />
          <MetricPill label="CTR" value={formatPercent(seoSummary.ctr, 1)} icon={PieChartIcon} tone="amber" />
          <MetricPill label="Avg. Position" value={seoSummary.position.toFixed(1)} icon={Gauge} tone="purple" />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={filteredTrend}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={(point) => format(parseISO(point.date), "MMM d")} tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} width={40} />
            <RechartsTooltip
              formatter={(value: number) => [`${value}`, "Clicks"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#colorClicks)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top queries</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queries.map((query) => (
                    <TableRow key={query.query}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{query.query}</span>
                          <span className="text-xs text-muted-foreground">{query.topPage}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(query.clicks)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatPercent(query.ctr, 1)}</TableCell>
                      <TableCell className="text-right tabular-nums">{query.position.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Low CTR alerts</CardTitle>
              <CardDescription className="text-xs">
                Opportunities where rankings are strong but clicks underperform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No alerts. All monitored keywords have healthy click-through.</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.query} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{alert.query}</span>
                      <Badge variant="outline" className="border-amber-300 bg-amber-100 text-amber-800">
                        {formatPercent(alert.ctr, 1)} CTR
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ranking {alert.position.toFixed(1)} — add a compelling meta description or FAQ snippet.
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricPillProps {
  label: string;
  value: string;
  icon: typeof Activity;
  tone: "primary" | "emerald" | "amber" | "purple";
}

function MetricPill({ label, value, icon: Icon, tone }: MetricPillProps) {
  const toneClass =
    tone === "primary"
      ? "text-primary bg-primary/10"
      : tone === "emerald"
      ? "text-emerald-500 bg-emerald-500/10"
      : tone === "amber"
      ? "text-amber-500 bg-amber-500/10"
      : "text-purple-500 bg-purple-500/10";

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className={cn("mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold", toneClass)}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

interface NewsletterSectionProps {
  growthData: { date: string; subscribers: number }[];
  posts: PostMetric[];
  funnel: FunnelStep[];
  placements: (CtaPlacementMetric & { viewShare: number; conversionRate: number })[];
  totalFunnel: number;
}

function NewsletterSection({ growthData, posts, funnel, placements, totalFunnel }: NewsletterSectionProps) {
  return (
    <Card className="h-full" data-testid="card-newsletter">
      <CardHeader>
        <CardTitle>Newsletter &amp; Conversion</CardTitle>
        <CardDescription>Subscriber momentum and funnel performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <RechartsTooltip
              formatter={(value: number) => [`${value}`, "Subscribers"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Area type="monotone" dataKey="subscribers" stroke="hsl(var(--chart-2))" fill="url(#colorSubscribers)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Top converting posts</h4>
            <div className="space-y-3">
              {posts.slice(0, 4).map((post) => (
                <div key={post.id} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between text-sm font-medium text-foreground">
                    {post.title}
                    <Badge variant="outline" className="text-xs">
                      +{post.subscribers} subs
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatMinutes(post.avgReadTime)} · {Math.round(post.readComplete * 100)}% completions
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Conversion funnel</h4>
            <div className="space-y-3">
              {funnel.map((step, index) => {
                const nextValue = funnel[index + 1]?.count ?? step.count;
                const conversionRate = step.count === 0 ? 0 : nextValue / step.count;
                return (
                  <div key={step.id} className="rounded-lg border border-muted-foreground/20 p-3">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      {step.label}
                      <span className="tabular-nums">{formatNumber(step.count)}</span>
                    </div>
                    {index < funnel.length - 1 ? (
                      <p className="text-xs text-muted-foreground">{Math.round(conversionRate * 100)}% continue</p>
                    ) : null}
                    <Progress value={(step.count / totalFunnel) * 100} className="mt-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">CTA placement performance</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placement</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conv. rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.map((placement) => (
                <TableRow key={placement.placement}>
                  <TableCell className="font-medium">{placement.placement}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(placement.views)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(placement.clicks)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(placement.conversionRate, 1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface EngagementSectionProps {
  traffic: TrafficDay[];
  cohort: { cohort: string; returningRate: number }[];
}

function EngagementSection({ traffic, cohort }: EngagementSectionProps) {
  const averageReturn = computeReturningRate(traffic);
  const averageTime = computeAverageReadTime(traffic);
  const scrollDistribution = [
    { label: "25%", value: 0.84 },
    { label: "50%", value: 0.62 },
    { label: "75%", value: 0.41 },
    { label: "100%", value: 0.28 },
  ];
  const deviceTotals = DEVICE_BREAKDOWN.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full" data-testid="card-engagement">
      <CardHeader>
        <CardTitle>Engagement Deep Dive</CardTitle>
        <CardDescription>Reader loyalty, scroll depth, and device usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Return visitors (28d)</p>
            <p className="text-2xl font-semibold">{(averageReturn * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Avg. time on page</p>
            <p className="text-2xl font-semibold">{formatMinutes(averageTime)}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Avg. subscribers / day</p>
            <p className="text-2xl font-semibold">{formatNumber(Math.round(traffic.reduce((sum, day) => sum + day.newSubscribers, 0) / Math.max(traffic.length, 1)))}
            </p>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Scroll depth distribution</h4>
          <div className="space-y-2">
            {scrollDistribution.map((bucket) => (
              <div key={bucket.label} className="flex items-center justify-between text-sm">
                <span>{bucket.label}</span>
                <div className="flex items-center gap-2">
                  <Progress value={bucket.value * 100} className="w-48" />
                  <span className="w-12 text-right tabular-nums">{Math.round(bucket.value * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Device breakdown</h4>
          <div className="flex flex-wrap gap-3">
            {DEVICE_BREAKDOWN.map((device) => (
              <div key={device.label} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                {device.label === "Mobile" ? (
                  <Flame className="h-4 w-4 text-emerald-500" />
                ) : device.label === "Desktop" ? (
                  <Laptop className="h-4 w-4 text-primary" />
                ) : (
                  <TabletSmartphone className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{device.label}</span>
                <Badge variant="outline" className="border-transparent bg-muted text-xs">
                  {Math.round((device.value / deviceTotals) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Returning visitor cohorts</h4>
          <div className="space-y-2">
            {cohort.map((week) => (
              <div key={week.cohort} className="flex items-center justify-between text-sm">
                <span>{week.cohort}</span>
                <span className="font-medium tabular-nums">{Math.round(week.returningRate * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TechnicalHealthSectionProps {
  health: typeof technicalHealth;
}

function TechnicalHealthSection({ health }: TechnicalHealthSectionProps) {
  return (
    <Card className="h-full" data-testid="card-technical-health">
      <CardHeader>
        <CardTitle>Technical &amp; Site Health</CardTitle>
        <CardDescription>Performance, errors, and optimization cues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Average LCP</p>
            <p className="text-2xl font-semibold">{health.lcp.toFixed(1)}s</p>
            <p className="text-xs text-emerald-500">{health.lcpChange.toFixed(1)}s faster</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">404 errors</p>
            <p className="text-2xl font-semibold">{health.errors404}</p>
            <p className="text-xs text-emerald-500">{health.errorChange} resolved</p>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Largest image files</h4>
          <ul className="space-y-2 text-sm">
            {health.largestImages.map((image) => (
              <li key={image.path} className="flex items-center justify-between">
                <span className="truncate">{image.path}</span>
                <span className="tabular-nums">{image.sizeKb} KB</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Mobile performance</p>
            <p className="text-2xl font-semibold">{health.mobileScore}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Desktop performance</p>
            <p className="text-2xl font-semibold">{health.desktopScore}</p>
          </div>
        </div>
        <p className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          Tip: compress the October hero image and lazy load sidebar graphics to unlock a sub-2s page load.
        </p>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ summary }: { summary: string }) {
  return (
    <Card data-testid="card-insights-summary">
      <CardHeader>
        <CardTitle>Weekly Insights Summary</CardTitle>
        <CardDescription>Use this recap for personal notes or a future automated digest</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
}
