import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/ui/seo";
import { Mountain, TrendingUp, Target, Coffee, Mail } from "lucide-react";

export default function About() {
  // FIRE calculations with inflation
  const currentNetWorthExclHome = 679000; // $679K
  const fireGoalToday = 3500000; // $3.5M
  const stretchGoalToday = 4000000; // $4M
  const yearsToFire = 14; // Target: Jan 2040
  const inflationRate = 0.03;
  const inflationMultiplier = Math.pow(1 + inflationRate, yearsToFire);
  const fireGoalFuture = fireGoalToday * inflationMultiplier; // ~$5.29M
  const stretchGoalFuture = stretchGoalToday * inflationMultiplier; // ~$6.05M
  const progressToFire = (currentNetWorthExclHome / fireGoalFuture) * 100;
  const progressToStretch = (currentNetWorthExclHome / stretchGoalFuture) * 100;

  const milestones = [
    { year: "2022", title: "Started FIRE Journey", description: "Began systematic wealth tracking and optimization" },
    { year: "2023", title: "Reached $200K Net Worth", description: "Hit first major milestone through disciplined saving" },
    { year: "2024", title: "Coast FIRE Achieved", description: "Reached the point where investments can grow to retirement" },
    { year: "2025", title: "$679K Combined", description: "Current net worth excluding home equity" },
    { year: "2040", title: "FIRE Target", description: "Achieve financial independence with $5.3M (inflation-adjusted)" },
  ];

  const principles = [
    { icon: TrendingUp, title: "Data-Driven Decisions", description: "Every financial choice backed by thorough analysis and tracking" },
    { icon: Target, title: "Long-Term Focus", description: "Building wealth for financial independence, not short-term gains" },
    { icon: Mountain, title: "Sustainable Approach", description: "Maintaining quality of life while optimizing for the future" },
    { icon: Coffee, title: "Transparency", description: "Sharing real numbers and honest reflections on the journey" },
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
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mountain className="w-12 h-12 text-primary" data-testid="icon-about-hero" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-about-title">
              About PathTwo
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-about-subtitle">
              A transparent look at our path to financial independence as a couple, 
              sharing real data, strategies, and lessons learned along our journey together.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-mission-title">Mission Statement</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-mission-content">
                This blog exists to document and share our journey toward Financial Independence, Retire Early (FIRE) 
                as a couple through transparent wealth tracking, data-driven decision making, and honest reflection on both 
                successes and setbacks along our path together.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-mission-goal">
                The goal isn't just to reach FIRE, but to inspire other couples to take control of their financial future 
                and show that financial independence is achievable together with discipline, planning, and patience.
              </p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">${(currentNetWorthExclHome / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Current Net Worth</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <Mountain className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">$5.3M</div>
              <div className="text-sm text-muted-foreground">FIRE Goal</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <Coffee className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{progressToFire.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Progress to FIRE</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{yearsToFire}</div>
              <div className="text-sm text-muted-foreground">Years to FIRE</div>
            </div>
          </div>

          {/* Progress Bar Card */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-4">Progress to Financial Independence</h3>
              <div className="space-y-6">
                {/* FIRE Goal Progress */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Current: $679K</span>
                    <span className="font-semibold">FIRE Goal: $5.3M (inflation-adjusted)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                      style={{ width: `${Math.min(progressToFire, 100)}%` }}
                    />
                  </div>
                  <div className="text-center text-xl font-bold text-primary mt-2">
                    {progressToFire.toFixed(1)}% to FIRE Goal
                  </div>
                </div>

                {/* Stretch Goal Progress */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Current: $679K</span>
                    <span className="font-semibold">Stretch: $6.1M (inflation-adjusted)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                      style={{ width: `${Math.min(progressToStretch, 100)}%` }}
                    />
                  </div>
                  <div className="text-center text-xl font-bold text-secondary mt-2">
                    {progressToStretch.toFixed(1)}% to Stretch Goal
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Target Date</div>
                    <div className="font-semibold">Jan 2040</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Years to Go</div>
                    <div className="font-semibold">14</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Today's Goal</div>
                    <div className="font-semibold">$3.5M</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Inflation Rate</div>
                    <div className="font-semibold">3%/year</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Principles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center" data-testid="text-principles-title">
              Core Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <principle.icon className="w-8 h-8 text-primary mr-3" data-testid={`icon-principle-${index}`} />
                      <h3 className="text-lg font-semibold text-foreground" data-testid={`text-principle-title-${index}`}>
                        {principle.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground" data-testid={`text-principle-description-${index}`}>
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center" data-testid="text-timeline-title">
              Journey Milestones
            </h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Badge variant="outline" className="mt-1 min-w-fit" data-testid={`badge-milestone-year-${index}`}>
                    {milestone.year}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-milestone-title-${index}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`text-milestone-description-${index}`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Pacific Northwest */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-location-title">
                Why the Pacific Northwest?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-location-content">
                Living in the Pacific Northwest provides the perfect backdrop for this FIRE journey. The region's 
                emphasis on outdoor activities, sustainable living, and work-life balance aligns perfectly with 
                FIRE principles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-location-benefits">
                The natural beauty serves as a constant reminder that the best things in life—hiking trails, 
                mountain views, and fresh air—are free. This lifestyle naturally supports a lower cost of living 
                while maintaining high quality of life.
              </p>
            </CardContent>
          </Card>

          {/* Transparency Commitment */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-transparency-title">
                Commitment to Transparency
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-transparency-content">
                This blog shares real numbers, real strategies, and real challenges. While personal details remain 
                anonymous for privacy, all financial data and progress updates are authentic and unfiltered.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg" data-testid="card-transparency-real-data">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Real Data</h4>
                  <p className="text-sm text-muted-foreground">Actual net worth and progress numbers</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg" data-testid="card-transparency-honest-mistakes">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Honest Mistakes</h4>
                  <p className="text-sm text-muted-foreground">Sharing failures and lessons learned</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg" data-testid="card-transparency-regular-updates">
                  <Coffee className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Regular Updates</h4>
                  <p className="text-sm text-muted-foreground">Monthly progress reports and insights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-cta-title">
              Join the Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-cta-description">
              Whether you're just starting your FIRE journey or well on your way, we'd love to connect and 
              share experiences. Feel free to reach out with questions, feedback, or your own FIRE story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild data-testid="button-contact">
                <Link href="/contact">
                  <span className="inline-flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </span>
                </Link>
              </Button>
              <Button variant="outline" asChild data-testid="button-blog">
                <Link href="/blog">
                  <span>Read the Blog</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
