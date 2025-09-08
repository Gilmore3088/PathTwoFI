import { 
  type User, 
  type InsertUser,
  type UpsertUser, 
  type BlogPost, 
  type InsertBlogPost,
  type WealthData,
  type InsertWealthData,
  type FinancialGoal,
  type InsertFinancialGoal,
  type GoalMilestone,
  type InsertGoalMilestone,
  type WealthReport,
  type InsertWealthReport,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type ContactSubmission,
  type InsertContactSubmission,
  users,
  blogPosts,
  wealthData,
  financialGoals,
  goalMilestones,
  wealthReports,
  newsletterSubscriptions,
  contactSubmissions
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  incrementBlogPostViews(id: string): Promise<void>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Wealth data methods
  getWealthData(category?: string): Promise<WealthData[]>;
  getLatestWealthData(category?: string): Promise<WealthData | undefined>;
  createWealthData(data: InsertWealthData): Promise<WealthData>;
  updateWealthData(id: string, data: Partial<InsertWealthData>): Promise<WealthData | undefined>;
  deleteWealthData(id: string): Promise<boolean>;

  // Newsletter methods
  subscribeToNewsletter(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined>;

  // Contact methods
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;

  // Financial Goals methods
  getFinancialGoals(category?: string): Promise<FinancialGoal[]>;
  getFinancialGoal(id: string): Promise<FinancialGoal | undefined>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: string, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined>;
  deleteFinancialGoal(id: string): Promise<boolean>;
  completeFinancialGoal(id: string): Promise<FinancialGoal | undefined>;

  // Goal Milestones methods
  getGoalMilestones(goalId: string): Promise<GoalMilestone[]>;
  createGoalMilestone(milestone: InsertGoalMilestone): Promise<GoalMilestone>;
  updateGoalMilestone(id: string, milestone: Partial<InsertGoalMilestone>): Promise<GoalMilestone | undefined>;
  deleteGoalMilestone(id: string): Promise<boolean>;
  completeGoalMilestone(id: string): Promise<GoalMilestone | undefined>;

  // Wealth Reports methods
  getWealthReports(category?: string, reportType?: string): Promise<WealthReport[]>;
  createWealthReport(report: InsertWealthReport): Promise<WealthReport>;
  getLatestWealthReport(category?: string, reportType?: string): Promise<WealthReport | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with sample data on first run
    this.initializeSampleDataIfNeeded();
  }

  private async initializeSampleDataIfNeeded() {
    try {
      // Check if data already exists
      const existingPosts = await db.select().from(blogPosts).limit(1);
      if (existingPosts.length > 0) return;

      // Sample blog posts
      const samplePosts: InsertBlogPost[] = [
        {
          title: "Q4 2024 Net Worth Update: Breaking the $350K Milestone",
          slug: "q4-2024-net-worth-update",
          content: `<h1>Q4 2024 Net Worth Update: Breaking the $350K Milestone</h1>

<p>What a quarter it's been! As we wrap up Q4 2024, I'm excited to share that we've officially crossed the <strong>$350K net worth milestone</strong>. This represents a significant step forward in our FIRE journey, and I want to break down exactly how we got here.</p>

<h2>The Numbers</h2>
<p>Our net worth increased by <strong>$28,500</strong> this quarter, bringing our total to <strong>$351,200</strong>. Here's the breakdown:</p>

<ul>
<li><strong>Investment accounts:</strong> $287,400 (+$22,100)</li>
<li><strong>Cash & savings:</strong> $63,800 (+$6,400)</li>
<li><strong>Total assets:</strong> $351,200</li>
<li><strong>Liabilities:</strong> $0</li>
</ul>

<h2>What Drove Growth</h2>
<p>Several factors contributed to our strong Q4 performance:</p>

<p><strong>Market Recovery:</strong> After a volatile start to the year, the markets ended strong. Our diversified portfolio of index funds benefited from the broad market rally, contributing approximately $15,000 to our growth.</p>

<p><strong>Increased Savings Rate:</strong> We managed to increase our savings rate to 47% this quarter, up from 42% in Q3. This was possible through some lifestyle adjustments and a small bonus at work.</p>

<p><strong>Side Hustle Income:</strong> My freelance writing continued to provide supplemental income, contributing about $1,200 monthly to our savings.</p>

<h2>Lessons Learned</h2>
<p>This quarter reinforced some key principles:</p>

<ul>
<li><strong>Consistency beats perfection:</strong> Regular monthly investments, regardless of market conditions, proved more valuable than trying to time the market.</li>
<li><strong>Lifestyle inflation is real:</strong> We had to actively fight against increasing our spending as our income grew.</li>
<li><strong>Emergency fund peace of mind:</strong> Having 6 months of expenses saved provided tremendous psychological comfort during market volatility.</li>
</ul>

<h2>Looking Ahead to 2025</h2>
<p>With $351K in the bank, we're now 35% of the way to our $1M FIRE target. Our goals for 2025 include:</p>

<ul>
<li>Reaching $425K net worth by end of Q4 2025</li>
<li>Maintaining our 47% savings rate</li>
<li>Exploring real estate investment opportunities</li>
<li>Continuing to optimize our tax strategy</li>
</ul>

<p>The journey to financial independence isn't always easy, but milestones like this remind us why we're doing it. Every dollar saved and invested today is a step closer to the freedom we're working toward.</p>

<p><em>Thank you for following along on our FIRE journey. Here's to an even better 2025!</em></p>`,
          excerpt: "A detailed breakdown of our fourth quarter performance, including investment gains, new asset allocations, and key lessons learned from market volatility...",
          category: "Wealth Progress",
          readTime: 8,
          status: "published" as const,
          featured: true,
          tags: ["net worth", "Q4 update", "milestones", "FIRE journey"],
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
        },
        {
          title: "Optimizing Tax-Advantaged Accounts: A 2025 Strategy",
          slug: "optimizing-tax-advantaged-accounts-2025",
          content: `<h1>Optimizing Tax-Advantaged Accounts: A 2025 Strategy</h1>

<p>With 2025 here, it's time to maximize every tax-advantaged dollar we can get. Tax optimization isn't just about reducing what you owe today—it's about strategically positioning your wealth for decades of compound growth.</p>

<h2>The 2025 Contribution Limits</h2>
<p>Here's what we're working with this year:</p>

<ul>
<li><strong>401(k):</strong> $23,500 (up from $23,000)</li>
<li><strong>IRA (Traditional/Roth):</strong> $7,000 (unchanged)</li>
<li><strong>HSA:</strong> $4,300 individual / $8,550 family</li>
<li><strong>Catch-up contributions (50+):</strong> Additional $7,500 for 401(k), $1,000 for IRA</li>
</ul>

<h2>Our Tax Optimization Strategy</h2>

<h3>1. Max Out the 401(k) First</h3>
<p>The 401(k) offers the highest contribution limit, so we prioritize this first. With the increased limit, we're putting away <strong>$1,958 per month</strong> to hit the full $23,500.</p>

<p>Pro tip: If your employer offers a match, contribute at least enough to get the full match—it's free money.</p>

<h3>2. HSA: The Triple Tax Advantage</h3>
<p>The HSA is the most tax-efficient account available:</p>
<ul>
<li>Tax-deductible contributions</li>
<li>Tax-free growth</li>
<li>Tax-free withdrawals for qualified medical expenses</li>
</ul>

<p>We're maxing out our family HSA at $8,550. After age 65, you can withdraw for any purpose (taxed as ordinary income), making it a second retirement account.</p>

<h3>3. Roth IRA: Tax-Free Growth Forever</h3>
<p>Even though we can't deduct Roth contributions, the tax-free growth over decades is incredible. We're doing the <strong>backdoor Roth conversion</strong> since our income is too high for direct contributions.</p>

<p>The process: Contribute $7,000 to traditional IRA → immediately convert to Roth → pay taxes on any gains during the conversion period.</p>

<h3>4. Taxable Accounts: The Bridge</h3>
<p>Since we're aiming for FIRE before 59.5, we need accessible money. After maxing tax-advantaged accounts, everything else goes into taxable brokerage accounts invested in tax-efficient index funds.</p>

<h2>Advanced Strategies We're Using</h2>

<p><strong>Mega Backdoor Roth:</strong> My employer's 401(k) allows after-tax contributions up to the total limit of $70,000. We contribute after-tax dollars and immediately convert to Roth, getting more tax-free growth space.</p>

<p><strong>Tax Loss Harvesting:</strong> Systematically realizing losses in taxable accounts to offset gains and reduce tax burden. This can save us $1,000-3,000 annually.</p>

<p><strong>Asset Location:</strong> Placing tax-inefficient investments (bonds, REITs) in tax-advantaged accounts and tax-efficient investments (index funds) in taxable accounts.</p>

<h2>The Numbers for 2025</h2>
<p>Our total tax-advantaged savings target:</p>
<ul>
<li>401(k): $23,500 × 2 = $47,000</li>
<li>HSA: $8,550</li>
<li>Backdoor Roth: $7,000 × 2 = $14,000</li>
<li><strong>Total: $69,550 in tax-advantaged space</strong></li>
</ul>

<p>This represents 58% of our gross income, and it's all growing tax-free or tax-deferred. The compound effect over 15-20 years will be massive.</p>

<h2>Common Mistakes to Avoid</h2>

<ul>
<li><strong>Not prioritizing employer match:</strong> Always get the full match first</li>
<li><strong>Ignoring HSA potential:</strong> Many people use HSAs like checking accounts instead of investment vehicles</li>
<li><strong>Poor asset location:</strong> Putting growth investments in tax-advantaged accounts and income investments in taxable accounts</li>
<li><strong>Neglecting backdoor Roth conversions:</strong> High earners missing out on Roth space</li>
</ul>

<p>Tax optimization isn't sexy, but it's one of the highest-return activities you can do. Every dollar saved in taxes is a dollar that can compound for decades. In our FIRE journey, tax efficiency isn't optional—it's essential.</p>

<p><em>Remember: Always consult with a tax professional for your specific situation. Tax laws are complex and change frequently.</em></p>`,
          excerpt: "Exploring advanced strategies for maximizing 401(k), IRA, and HSA contributions while maintaining liquidity for early retirement goals...",
          category: "FIRE Strategy",
          readTime: 12,
          status: "published" as const,
          featured: true,
          tags: ["tax optimization", "401k", "IRA", "HSA", "strategy"],
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
        },
        {
          title: "Lessons from a Market Downturn",
          slug: "lessons-from-market-downturn",
          content: "How staying the course during volatility reinforced my FIRE strategy and investment philosophy. Market downturns test our resolve and strategy...",
          excerpt: "How staying the course during volatility reinforced my FIRE strategy and investment philosophy...",
          category: "Personal Reflections",
          readTime: 6,
          status: "published" as const,
          featured: false,
          tags: ["market volatility", "investment strategy", "lessons learned", "reflections"],
          imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300"
        }
      ];

      for (const post of samplePosts) {
        await db.insert(blogPosts).values(post);
      }

      // Sample wealth data for different categories
      const currentDate = new Date();
      const categories = ["Both", "His", "Her"];
      
      for (const category of categories) {
        for (let i = 12; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setMonth(date.getMonth() - i);
          
          const baseNetWorth = 280000 + (12 - i) * 6000;
          const categoryMultiplier = category === "Both" ? 1.0 : category === "His" ? 0.6 : 0.4;
          
          await db.insert(wealthData).values({
            date,
            category,
            netWorth: ((baseNetWorth + Math.random() * 10000) * categoryMultiplier).toFixed(2),
            investments: ((baseNetWorth * 0.82) * categoryMultiplier).toFixed(2),
            cash: ((baseNetWorth * 0.18) * categoryMultiplier).toFixed(2),
            liabilities: (15000 * categoryMultiplier).toFixed(2),
            fireTarget: "1000000.00",
            savingsRate: "47.00"
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize sample data:", error);
    }
  }

  // User methods (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.category, category))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    await db.update(blogPosts)
      .set({ views: sql`${blogPosts.views} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Wealth data methods
  async getWealthData(category?: string): Promise<WealthData[]> {
    if (category) {
      return await db.select().from(wealthData)
        .where(eq(wealthData.category, category))
        .orderBy(asc(wealthData.date));
    }
    return await db.select().from(wealthData).orderBy(asc(wealthData.date));
  }

  async getLatestWealthData(category?: string): Promise<WealthData | undefined> {
    const query = category 
      ? db.select().from(wealthData).where(eq(wealthData.category, category))
      : db.select().from(wealthData);
    
    const [latest] = await query.orderBy(desc(wealthData.date)).limit(1);
    return latest || undefined;
  }

  async createWealthData(insertData: InsertWealthData): Promise<WealthData> {
    const [data] = await db.insert(wealthData).values(insertData).returning();
    return data;
  }

  async updateWealthData(id: string, updateData: Partial<InsertWealthData>): Promise<WealthData | undefined> {
    const [updated] = await db.update(wealthData)
      .set(updateData)
      .where(eq(wealthData.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWealthData(id: string): Promise<boolean> {
    const result = await db.delete(wealthData).where(eq(wealthData.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Newsletter methods
  async subscribeToNewsletter(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [subscription] = await db.insert(newsletterSubscriptions).values(insertSubscription).returning();
    return subscription;
  }

  async getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return subscription || undefined;
  }

  // Contact methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission;
  }

  // Financial Goals methods
  async getFinancialGoals(category?: string): Promise<FinancialGoal[]> {
    if (category) {
      return await db.select().from(financialGoals)
        .where(eq(financialGoals.category, category))
        .orderBy(desc(financialGoals.createdAt));
    }
    return await db.select().from(financialGoals).orderBy(desc(financialGoals.createdAt));
  }

  async getFinancialGoal(id: string): Promise<FinancialGoal | undefined> {
    const [goal] = await db.select().from(financialGoals).where(eq(financialGoals.id, id));
    return goal || undefined;
  }

  async createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const [createdGoal] = await db.insert(financialGoals).values(goal).returning();
    return createdGoal;
  }

  async updateFinancialGoal(id: string, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    const [updated] = await db.update(financialGoals)
      .set({ ...goal, updatedAt: new Date() })
      .where(eq(financialGoals.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteFinancialGoal(id: string): Promise<boolean> {
    const result = await db.delete(financialGoals).where(eq(financialGoals.id, id));
    return (result.rowCount || 0) > 0;
  }

  async completeFinancialGoal(id: string): Promise<FinancialGoal | undefined> {
    const [updated] = await db.update(financialGoals)
      .set({ 
        isCompleted: true, 
        completedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(financialGoals.id, id))
      .returning();
    return updated || undefined;
  }

  // Goal Milestones methods
  async getGoalMilestones(goalId: string): Promise<GoalMilestone[]> {
    return await db.select().from(goalMilestones)
      .where(eq(goalMilestones.goalId, goalId))
      .orderBy(asc(goalMilestones.targetAmount));
  }

  async createGoalMilestone(milestone: InsertGoalMilestone): Promise<GoalMilestone> {
    const [created] = await db.insert(goalMilestones).values(milestone).returning();
    return created;
  }

  async updateGoalMilestone(id: string, milestone: Partial<InsertGoalMilestone>): Promise<GoalMilestone | undefined> {
    const [updated] = await db.update(goalMilestones)
      .set(milestone)
      .where(eq(goalMilestones.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteGoalMilestone(id: string): Promise<boolean> {
    const result = await db.delete(goalMilestones).where(eq(goalMilestones.id, id));
    return (result.rowCount || 0) > 0;
  }

  async completeGoalMilestone(id: string): Promise<GoalMilestone | undefined> {
    const [updated] = await db.update(goalMilestones)
      .set({ 
        isCompleted: true, 
        achievedAt: new Date() 
      })
      .where(eq(goalMilestones.id, id))
      .returning();
    return updated || undefined;
  }

  // Wealth Reports methods
  async getWealthReports(category?: string, reportType?: string): Promise<WealthReport[]> {
    if (category && reportType) {
      return await db.select().from(wealthReports)
        .where(sql`${wealthReports.category} = ${category} AND ${wealthReports.reportType} = ${reportType}`)
        .orderBy(desc(wealthReports.reportDate));
    } else if (category) {
      return await db.select().from(wealthReports)
        .where(eq(wealthReports.category, category))
        .orderBy(desc(wealthReports.reportDate));
    } else if (reportType) {
      return await db.select().from(wealthReports)
        .where(eq(wealthReports.reportType, reportType))
        .orderBy(desc(wealthReports.reportDate));
    }
    
    return await db.select().from(wealthReports).orderBy(desc(wealthReports.reportDate));
  }

  async createWealthReport(report: InsertWealthReport): Promise<WealthReport> {
    const [created] = await db.insert(wealthReports).values(report).returning();
    return created;
  }

  async getLatestWealthReport(category?: string, reportType?: string): Promise<WealthReport | undefined> {
    if (category && reportType) {
      const [latest] = await db.select().from(wealthReports)
        .where(sql`${wealthReports.category} = ${category} AND ${wealthReports.reportType} = ${reportType}`)
        .orderBy(desc(wealthReports.reportDate))
        .limit(1);
      return latest || undefined;
    } else if (category) {
      const [latest] = await db.select().from(wealthReports)
        .where(eq(wealthReports.category, category))
        .orderBy(desc(wealthReports.reportDate))
        .limit(1);
      return latest || undefined;
    } else if (reportType) {
      const [latest] = await db.select().from(wealthReports)
        .where(eq(wealthReports.reportType, reportType))
        .orderBy(desc(wealthReports.reportDate))
        .limit(1);
      return latest || undefined;
    }
    
    const [latest] = await db.select().from(wealthReports)
      .orderBy(desc(wealthReports.reportDate))
      .limit(1);
    return latest || undefined;
  }
}

export const storage = new DatabaseStorage();
