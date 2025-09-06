import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/ui/seo";
import { Mountain, TrendingUp, Target, Coffee, Mail } from "lucide-react";

export default function About() {
  const milestones = [
    { year: "2022", title: "Started FIRE Journey", description: "Began systematic wealth tracking and optimization" },
    { year: "2023", title: "Reached $200K Net Worth", description: "Hit first major milestone through disciplined saving" },
    { year: "2024", title: "Coast FIRE Achieved", description: "Reached the point where investments can grow to retirement" },
    { year: "2025", title: "Target: $500K", description: "Next major milestone on the path to financial independence" },
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
                  <a className="inline-flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </a>
                </Link>
              </Button>
              <Button variant="outline" asChild data-testid="button-blog">
                <Link href="/blog">
                  <a>Read the Blog</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
