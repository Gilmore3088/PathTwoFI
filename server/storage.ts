import { 
  type User, 
  type InsertUser, 
  type BlogPost, 
  type InsertBlogPost,
  type WealthData,
  type InsertWealthData,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { randomUUID } from "crypto";

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

  // Wealth data methods
  getWealthData(): Promise<WealthData[]>;
  getLatestWealthData(): Promise<WealthData | undefined>;
  createWealthData(data: InsertWealthData): Promise<WealthData>;

  // Newsletter methods
  subscribeToNewsletter(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined>;

  // Contact methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;
  private wealthData: Map<string, WealthData>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;
  private contactSubmissions: Map<string, ContactSubmission>;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.wealthData = new Map();
    this.newsletterSubscriptions = new Map();
    this.contactSubmissions = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample blog posts
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Q4 2024 Net Worth Update: Breaking the $350K Milestone",
        slug: "q4-2024-net-worth-update",
        content: "A detailed breakdown of our fourth quarter performance, including investment gains, new asset allocations, and key lessons learned from market volatility. This quarter marked a significant milestone in our FIRE journey...",
        excerpt: "A detailed breakdown of our fourth quarter performance, including investment gains, new asset allocations, and key lessons learned from market volatility...",
        category: "Wealth Progress",
        readTime: 8,
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
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300"
      }
    ];

    samplePosts.forEach(post => {
      const id = randomUUID();
      const blogPost: BlogPost = {
        ...post,
        id,
        views: Math.floor(Math.random() * 3000) + 500,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      this.blogPosts.set(id, blogPost);
    });

    // Sample wealth data
    const currentDate = new Date();
    for (let i = 12; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const baseNetWorth = 280000 + (12 - i) * 6000;
      const id = randomUUID();
      const wealthEntry: WealthData = {
        id,
        date,
        netWorth: (baseNetWorth + Math.random() * 10000).toFixed(2),
        investments: (baseNetWorth * 0.82).toFixed(2),
        cash: (baseNetWorth * 0.18).toFixed(2),
        liabilities: "15000.00",
        fireTarget: "1000000.00",
        savingsRate: "47.00"
      };
      this.wealthData.set(id, wealthEntry);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const blogPost: BlogPost = {
      ...insertPost,
      id,
      views: 0,
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    const post = this.blogPosts.get(id);
    if (post) {
      post.views = (post.views || 0) + 1;
      this.blogPosts.set(id, post);
    }
  }

  // Wealth data methods
  async getWealthData(): Promise<WealthData[]> {
    return Array.from(this.wealthData.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getLatestWealthData(): Promise<WealthData | undefined> {
    const data = await this.getWealthData();
    return data[data.length - 1];
  }

  async createWealthData(insertData: InsertWealthData): Promise<WealthData> {
    const id = randomUUID();
    const wealthEntry: WealthData = { ...insertData, id };
    this.wealthData.set(id, wealthEntry);
    return wealthEntry;
  }

  // Newsletter methods
  async subscribeToNewsletter(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      ...insertSubscription,
      id,
      subscribedAt: new Date(),
      active: true
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values()).find(
      sub => sub.email === email
    );
  }

  // Contact methods
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      submittedAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
