import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Mountain, TrendingUp, Target, Coffee, Mail } from "lucide-react";
import { getFireProgress, formatCurrency, formatPercent } from "@/lib/fire-constants";

export const metadata = {
  title: "About Us - PathTwo FIRE Journey",
  description:
    "Meet the couple behind PathTwo. Learn about our mission to achieve financial independence through transparent wealth tracking, data-driven decisions, and sharing our journey.",
};

const MILESTONES = [
  {
    year: "2040",
    title: "Target: FIRE",
    description: "Projected to reach full financial independence",
  },
  {
    year: "Mar 2026",
    title: "$816K Combined",
    description:
      "Combined assets (excluding home equity) surpassed $816K",
  },
  {
    year: "Jul 2025",
    title: "$679K Combined",
    description:
      "Combined assets (excluding home equity) surpassed $679K",
  },
  {
    year: "Mar 2025",
    title: "Debt Freedom!",
    description:
      "Student loans completely paid off - only mortgage remains",
  },
  {
    year: "Jan 2025",
    title: "Strong Start to 2025",
    description: "His: $295K | Hers: $340K in assets (excl. home)",
  },
  {
    year: "Sep 2024",
    title: "We Got Married!",
    description: "Two became one - Combined assets hit $470K",
  },
  {
    year: "Jan 2024",
    title: "Momentum Building",
    description: "Assets (excl. home) $181K | Net worth $156K",
  },
  {
    year: "Jul 2023",
    title: "Recovery Mode",
    description: "Net worth recovered to $76K through discipline",
  },
  {
    year: "Jan 2023",
    title: "Rock Bottom",
    description:
      "Net worth $29K | Credit card debt $22K - The turning point",
  },
  {
    year: "Aug 2022",
    title: "First Home",
    description: "Locked in 2.9% mortgage rate - perfect timing",
  },
  {
    year: "Jul 2022",
    title: "Voyager Bankruptcy",
    description: "Lost six figures in crypto - expensive education",
  },
  {
    year: "Jan 2021",
    title: "First $100K",
    description: "Reached six-figure net worth milestone",
  },
  {
    year: "Feb 2020",
    title: "The Awakening",
    description: "Started tracking finances and discovered FIRE",
  },
];

const PRINCIPLES = [
  {
    icon: TrendingUp,
    title: "Data-Driven Decisions",
    description:
      "Every financial choice backed by thorough analysis and tracking",
  },
  {
    icon: Target,
    title: "Long-Term Focus",
    description:
      "Building wealth for financial independence, not short-term gains",
  },
  {
    icon: Mountain,
    title: "Sustainable Approach",
    description:
      "Maintaining quality of life while optimizing for the future",
  },
  {
    icon: Coffee,
    title: "Transparency",
    description:
      "Sharing real numbers and honest reflections on the journey",
  },
];

export default function AboutPage() {
  const progress = getFireProgress(816_457);

  return (
    <div className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mountain className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About PathTwo
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A transparent look at our path to financial independence as a
              couple, sharing real data, strategies, and lessons learned along
              our journey together.
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Mission Statement
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                This blog exists to document and share our journey toward
                Financial Independence, Retire Early (FIRE) as a couple through
                transparent wealth tracking, data-driven decision making, and
                honest reflection on both successes and setbacks along our path
                together.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The goal isn&apos;t just to reach FIRE, but to inspire other
                couples to take control of their financial future and show that
                financial independence is achievable together with discipline,
                planning, and patience.
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(progress.currentNetWorth)}
              </div>
              <div className="text-sm text-muted-foreground">
                Current Net Worth
              </div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <Mountain className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(progress.futureGoal)}
              </div>
              <div className="text-sm text-muted-foreground">
                FIRE Goal (inflation-adj.)
              </div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <Coffee className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {formatPercent(progress.progressPercent)}
              </div>
              <div className="text-sm text-muted-foreground">
                Progress to FIRE
              </div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {progress.yearsToFire.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Years to FIRE</div>
            </div>
          </div>

          {/* Progress Bars */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-4">
                Progress to Financial Independence
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Current: {formatCurrency(progress.currentNetWorth)}</span>
                    <span className="font-semibold">
                      FIRE Goal: {formatCurrency(progress.futureGoal)} (inflation-adjusted)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                      style={{
                        width: `${Math.min(progress.progressPercent, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-xl font-bold text-primary mt-2">
                    {formatPercent(progress.progressPercent)} to FIRE Goal
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Current: {formatCurrency(progress.currentNetWorth)}</span>
                    <span className="font-semibold">
                      Stretch: {formatCurrency(progress.futureStretchGoal)} (inflation-adjusted)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                      style={{
                        width: `${Math.min(progress.stretchProgressPercent, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-xl font-bold text-primary mt-2">
                    {formatPercent(progress.stretchProgressPercent)} to Stretch Goal
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Target Date</div>
                    <div className="font-semibold">Jan 2040</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Years to Go</div>
                    <div className="font-semibold">{progress.yearsToFire.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Today&apos;s Goal</div>
                    <div className="font-semibold">{formatCurrency(progress.todayGoal)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Inflation Rate</div>
                    <div className="font-semibold">3%/year</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Principles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Core Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {PRINCIPLES.map((principle, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <principle.icon className="w-8 h-8 text-primary mr-3" />
                      <h3 className="text-lg font-semibold text-foreground">
                        {principle.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Journey Milestones
            </h2>
            <div className="space-y-6">
              {MILESTONES.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Badge variant="outline" className="mt-1 min-w-fit">
                    {milestone.year}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PNW */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Why the Pacific Northwest?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Living in the Pacific Northwest provides the perfect backdrop for
                this FIRE journey. The region&apos;s emphasis on outdoor
                activities, sustainable living, and work-life balance aligns
                perfectly with FIRE principles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The natural beauty serves as a constant reminder that the best
                things in life -- hiking trails, mountain views, and fresh air --
                are free. This lifestyle naturally supports a lower cost of
                living while maintaining high quality of life.
              </p>
            </CardContent>
          </Card>

          {/* Transparency */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Commitment to Transparency
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                This blog shares real numbers, real strategies, and real
                challenges. While personal details remain anonymous for privacy,
                all financial data and progress updates are authentic and
                unfiltered.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Real Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Actual net worth and progress numbers
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">
                    Honest Mistakes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Sharing failures and lessons learned
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Coffee className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">
                    Regular Updates
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Monthly progress reports and insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Join the Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you&apos;re just starting your FIRE journey or well on
              your way, we&apos;d love to connect and share experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/blog">
                  <Mail className="w-4 h-4 mr-2" />
                  Read the Blog
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
