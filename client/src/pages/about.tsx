import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/ui/seo";
import {
  Mountain,
  TrendingUp,
  Target,
  Coffee,
  Mail,
  ArrowRight,
  CalendarDays,
  DollarSign,
  Users,
} from "lucide-react";

export default function About() {
  const milestones = [
    {
      year: "2030",
      date: "2030-12",
      title: "Target: FIRE",
      description: "Projected to reach full financial independence",
      type: "future",
      highlight: true,
    },
    {
      year: "Jul 2025",
      date: "2025-07",
      title: "$631K Combined",
      description: "Combined assets (excluding home equity) surpassed $631K",
      amount: "$631K",
      type: "achievement",
    },
    {
      year: "Mar 2025",
      date: "2025-03",
      title: "Debt Freedom!",
      description: "Student loans completely paid off - only mortgage remains",
      type: "freedom",
    },
    {
      year: "Jan 2025",
      date: "2025-01",
      title: "Strong Start to 2025",
      description: "His: $295K | Hers: $340K in assets (excl. home)",
      amount: "$635K combined",
      type: "milestone",
    },
    {
      year: "Sep 2024",
      date: "2024-09",
      title: "We Got Married!",
      description: "Two became one - Combined assets hit $470K",
      amount: "$470K",
      type: "life",
      highlight: true,
    },
    {
      year: "Jan 2024",
      date: "2024-01",
      title: "Momentum Building",
      description: "Assets (excl. home) $181K | Net worth $156K",
      amount: "$156K NW",
      type: "growth",
    },
    {
      year: "Jul 2023",
      date: "2023-07",
      title: "Recovery Mode",
      description: "Net worth recovered to $76K through discipline",
      amount: "$76K",
      type: "recovery",
    },
    {
      year: "Jan 2023",
      date: "2023-01",
      title: "Rock Bottom",
      description: "Net worth $29K | Credit card debt $22K - The turning point",
      amount: "$29K NW",
      type: "challenge",
    },
    {
      year: "Aug 2022",
      date: "2022-08",
      title: "First Home",
      description: "Locked in 2.9% mortgage rate - perfect timing",
      type: "life",
    },
    {
      year: "Jul 2022",
      date: "2022-07",
      title: "Voyager Bankruptcy",
      description: "Lost six figures in crypto - expensive education",
      type: "setback",
      highlight: true,
    },
    {
      year: "Jan 2021",
      date: "2021-01",
      title: "First $100K",
      description: "Reached six-figure net worth milestone",
      amount: "$100K",
      type: "milestone",
    },
    {
      year: "Feb 2020",
      date: "2020-02",
      title: "The Awakening",
      description: "Started tracking finances and discovered FIRE",
      type: "beginning",
    },
  ];

  // Helper function to get color based on type
  const getMilestoneStyle = (type: string) => {
    switch (type) {
      case "future":
        return "border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case "achievement":
        return "border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20";
      case "freedom":
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "milestone":
        return "border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
      case "life":
        return "border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-900/20";
      case "growth":
        return "border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
      case "recovery":
        return "border-l-4 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20";
      case "challenge":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "setback":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
      case "beginning":
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "border-l-4 border-gray-300 bg-white dark:bg-gray-800";
    }
  };

  // FIRE calculations with inflation adjustment
  const currentNetWorthExclHome = 679; // $679K (combined assets excluding home)
  const fireGoalToday = 3500; // $3.5M in today's dollars
  const stretchGoalToday = 4000; // $4M stretch goal
  const yearsToFire = 14; // Target date: Jan 2040
  const inflationRate = 0.03;
  const inflationMultiplier = Math.pow(1 + inflationRate, yearsToFire); // ~1.51

  // Future value of goals with inflation
  const fireGoalFuture = fireGoalToday * inflationMultiplier; // ~$5.29M
  const stretchGoalFuture = stretchGoalToday * inflationMultiplier; // ~$6.05M

  // Progress percentages
  const progressToFire = (currentNetWorthExclHome / fireGoalFuture) * 100; // ~13%
  const progressToStretch = (currentNetWorthExclHome / stretchGoalFuture) * 100; // ~11%

  const principles = [
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
      description: "Sharing real numbers and honest reflections on the journey",
    },
  ];

  const stats = [
    {
      label: "Journey Started",
      value: "Feb 2020",
      icon: CalendarDays,
    },
    {
      label: "Growth from Low",
      value: "2,240%",
      icon: TrendingUp,
    },
    {
      label: "Combined Assets",
      value: "$679K",
      icon: DollarSign,
    },
    {
      label: "Team Members",
      value: "2",
      icon: Users,
    },
  ];

  const lessonsLearned = [
    "Diversification matters - learned the hard way with Voyager",
    "Timing can work - secured 2.9% mortgage before rates soared",
    "Two incomes accelerate FIRE exponentially",
    "Tracking is the foundation of wealth building",
    "Recovery from setbacks is always possible with discipline",
    "Lifestyle inflation is the enemy of wealth accumulation",
  ];

  return (
    <div className="py-16 lg:py-20">
      <SEO
        title="About Us - PathTwo FIRE Journey"
        description="Meet the couple behind PathTwo. Learn about our mission to achieve financial independence through transparent wealth tracking, data-driven decisions, and sharing our journey."
        keywords="about PathTwo, FIRE couple, financial independence journey, personal finance transparency"
        type="website"
        url="/about"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mountain className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              About PathTwo
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              A transparent look at our path to financial independence as a
              couple, sharing real data, strategies, and lessons learned along
              our journey together.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Bar */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-4">
                Progress to $1M Target
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Rock Bottom: $29K (Jan 2023)</span>
                  <span>Current: $631K</span>
                  <span>Goal: $1M+</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-center text-2xl font-bold text-primary">
                  {progressPercentage.toFixed(1)}% Complete
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                This blog exists to document and share our journey toward
                Financial Independence, Retire Early (FIRE) as a couple through
                transparent wealth tracking, data-driven decision making, and
                honest reflection on both successes and setbacks.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                After losing six figures in the Voyager bankruptcy, we've
                rebuilt stronger than ever. Our goal isn't just to reach FIRE,
                but to inspire other couples to take control of their financial
                future and show that recovery and success are possible even
                after major setbacks.
              </p>
            </CardContent>
          </Card>

          {/* Journey Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Our Journey
            </h2>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg transition-all hover:shadow-lg ${getMilestoneStyle(milestone.type)} ${
                    milestone.highlight
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {milestone.year}
                        </Badge>
                        {milestone.amount && (
                          <Badge variant="secondary">{milestone.amount}</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                    {milestone.highlight && (
                      <span className="text-2xl ml-4">⭐</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Principles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Core Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
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

          {/* Lessons Learned */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Key Lessons Learned
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {lessonsLearned.map((lesson, index) => (
                  <div key={index} className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{lesson}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Why Pacific Northwest */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Why the Pacific Northwest?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Living in the Pacific Northwest provides the perfect backdrop
                for our FIRE journey. The region's emphasis on outdoor
                activities, sustainable living, and work-life balance aligns
                perfectly with FIRE principles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The natural beauty serves as a constant reminder that the best
                things in life—hiking trails, mountain views, and fresh air—are
                free. This lifestyle naturally supports a lower cost of living
                while maintaining high quality of life.
              </p>
            </CardContent>
          </Card>

          {/* Transparency Commitment */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Commitment to Transparency
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                This blog shares real numbers, real strategies, and real
                challenges. While personal details remain anonymous for privacy,
                all financial data and progress updates are authentic and
                unfiltered.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
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

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Join the Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're just starting your FIRE journey or well on your
              way, we'd love to connect and share experiences. Feel free to
              reach out with questions, feedback, or your own FIRE story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Get in Touch
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">Read the Blog</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
