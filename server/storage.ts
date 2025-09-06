import { 
  type User, 
  type InsertUser, 
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
  // User methods
  getUser(id: string): Promise<User | undefined>;
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
          content: "A detailed breakdown of our fourth quarter performance, including investment gains, new asset allocations, and key lessons learned from market volatility. This quarter marked a significant milestone in our FIRE journey...",
          excerpt: "A detailed breakdown of our fourth quarter performance, including investment gains, new asset allocations, and key lessons learned from market volatility...",
          category: "Wealth Progress",
          readTime: 8,
          status: "published" as const,
          featured: true,
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
        },
        {
          title: "Optimizing Tax-Advantaged Accounts: A 2025 Strategy",
          slug: "optimizing-tax-advantaged-accounts-2025",
          content: "Exploring advanced strategies for maximizing 401(k), IRA, and HSA contributions while maintaining liquidity for early retirement goals. Tax optimization is crucial for FIRE success...",
          excerpt: "Exploring advanced strategies for maximizing 401(k), IRA, and HSA contributions while maintaining liquidity for early retirement goals...",
          category: "FIRE Strategy",
          readTime: 12,
          status: "published" as const,
          featured: true,
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

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
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
    let query = db.select().from(wealthReports);
    
    if (category && reportType) {
      query = query.where(
        sql`${wealthReports.category} = ${category} AND ${wealthReports.reportType} = ${reportType}`
      );
    } else if (category) {
      query = query.where(eq(wealthReports.category, category));
    } else if (reportType) {
      query = query.where(eq(wealthReports.reportType, reportType));
    }
    
    return await query.orderBy(desc(wealthReports.reportDate));
  }

  async createWealthReport(report: InsertWealthReport): Promise<WealthReport> {
    const [created] = await db.insert(wealthReports).values(report).returning();
    return created;
  }

  async getLatestWealthReport(category?: string, reportType?: string): Promise<WealthReport | undefined> {
    let query = db.select().from(wealthReports);
    
    if (category && reportType) {
      query = query.where(
        sql`${wealthReports.category} = ${category} AND ${wealthReports.reportType} = ${reportType}`
      );
    } else if (category) {
      query = query.where(eq(wealthReports.category, category));
    } else if (reportType) {
      query = query.where(eq(wealthReports.reportType, reportType));
    }
    
    const [latest] = await query.orderBy(desc(wealthReports.reportDate)).limit(1);
    return latest || undefined;
  }
}

export const storage = new DatabaseStorage();
