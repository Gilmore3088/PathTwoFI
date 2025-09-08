import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // "admin", "user"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(), // Wealth Progress, FIRE Strategy, Investments, Personal Reflections
  readTime: integer("read_time").notNull(), // in minutes
  views: integer("views").default(0),
  featured: boolean("featured").default(false),
  imageUrl: text("image_url"),
  status: varchar("status").notNull().default("published"), // "draft", "published", "scheduled"
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  
  // Content Series Support
  seriesId: varchar("series_id").references(() => contentSeries.id),
  seriesOrder: integer("series_order"), // Order within the series
  
  // Enhanced Content Discovery
  tags: text("tags").array().default(sql`'{}'::text[]`), // Array of tags for better categorization
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content Series table for learning paths
export const contentSeries = pgTable("content_series", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  difficulty: varchar("difficulty").notNull().default("beginner"), // "beginner", "intermediate", "advanced"
  estimatedTime: integer("estimated_time"), // Total estimated reading time in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wealthData = pgTable("wealth_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  category: varchar("category").notNull().default("Both"), // "His", "Her", "Both"
  
  // Legacy fields (keep for backward compatibility)
  netWorth: decimal("net_worth", { precision: 12, scale: 2 }).notNull(),
  investments: decimal("investments", { precision: 12, scale: 2 }).notNull(),
  cash: decimal("cash", { precision: 12, scale: 2 }).notNull(),
  liabilities: decimal("liabilities", { precision: 12, scale: 2 }).notNull(),
  fireTarget: decimal("fire_target", { precision: 12, scale: 2 }).notNull(),
  savingsRate: decimal("savings_rate", { precision: 5, scale: 2 }).notNull(), // percentage
  
  // Enhanced Asset Breakdown
  stocks: decimal("stocks", { precision: 12, scale: 2 }).default("0"),
  bonds: decimal("bonds", { precision: 12, scale: 2 }).default("0"),
  realEstate: decimal("real_estate", { precision: 12, scale: 2 }).default("0"),
  crypto: decimal("crypto", { precision: 12, scale: 2 }).default("0"),
  commodities: decimal("commodities", { precision: 12, scale: 2 }).default("0"), // Gold, Silver, etc.
  alternativeInvestments: decimal("alternative_investments", { precision: 12, scale: 2 }).default("0"),
  
  // Enhanced Debt Breakdown
  mortgage: decimal("mortgage", { precision: 12, scale: 2 }).default("0"),
  creditCards: decimal("credit_cards", { precision: 12, scale: 2 }).default("0"),
  studentLoans: decimal("student_loans", { precision: 12, scale: 2 }).default("0"),
  autoLoans: decimal("auto_loans", { precision: 12, scale: 2 }).default("0"),
  personalLoans: decimal("personal_loans", { precision: 12, scale: 2 }).default("0"),
  otherDebts: decimal("other_debts", { precision: 12, scale: 2 }).default("0"),
  
  // Account Information
  checkingAccounts: decimal("checking_accounts", { precision: 12, scale: 2 }).default("0"),
  savingsAccounts: decimal("savings_accounts", { precision: 12, scale: 2 }).default("0"),
  retirement401k: decimal("retirement_401k", { precision: 12, scale: 2 }).default("0"),
  retirementIRA: decimal("retirement_ira", { precision: 12, scale: 2 }).default("0"),
  retirementRoth: decimal("retirement_roth", { precision: 12, scale: 2 }).default("0"),
  hsa: decimal("hsa", { precision: 12, scale: 2 }).default("0"),
  
  // Monthly Flow Data
  monthlyIncome: decimal("monthly_income", { precision: 10, scale: 2 }).default("0"),
  monthlyExpenses: decimal("monthly_expenses", { precision: 10, scale: 2 }).default("0"),
  monthlySavings: decimal("monthly_savings", { precision: 10, scale: 2 }).default("0"),
  
  // Metadata
  notes: text("notes"),
  isQuarterly: boolean("is_quarterly").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial Goals and Milestones
export const financialGoals = pgTable("financial_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: varchar("category").notNull().default("Both"), // "His", "Her", "Both"
  goalType: varchar("goal_type").notNull(), // "net_worth", "savings_rate", "debt_payoff", "custom"
  title: text("title").notNull(),
  description: text("description"),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 }).default("0"),
  targetDate: timestamp("target_date"),
  priority: varchar("priority").default("medium"), // "high", "medium", "low"
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goal Milestones/Progress Tracking
export const goalMilestones = pgTable("goal_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalId: varchar("goal_id").notNull().references(() => financialGoals.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
  achievedAt: timestamp("achieved_at"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Monthly/Quarterly Reports
export const wealthReports = pgTable("wealth_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportDate: timestamp("report_date").notNull(),
  reportType: varchar("report_type").notNull(), // "monthly", "quarterly", "annual"
  category: varchar("category").notNull().default("Both"), // "His", "Her", "Both"
  
  // Calculated Metrics
  totalAssets: decimal("total_assets", { precision: 12, scale: 2 }).notNull(),
  totalLiabilities: decimal("total_liabilities", { precision: 12, scale: 2 }).notNull(),
  netWorthChange: decimal("net_worth_change", { precision: 12, scale: 2 }),
  netWorthChangePercent: decimal("net_worth_change_percent", { precision: 8, scale: 4 }),
  savingsRateActual: decimal("savings_rate_actual", { precision: 5, scale: 2 }),
  
  // Performance Metrics
  investmentReturn: decimal("investment_return", { precision: 8, scale: 4 }),
  debtPaydownAmount: decimal("debt_paydown_amount", { precision: 12, scale: 2 }),
  fireProgressPercent: decimal("fire_progress_percent", { precision: 5, scale: 2 }),
  
  // Goals Progress
  goalsCompleted: integer("goals_completed").default(0),
  milestonesReached: integer("milestones_reached").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  active: boolean("active").default(true),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
}).extend({
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  tags: z.array(z.string()).default([]),
  seriesId: z.string().optional(),
  seriesOrder: z.number().optional(),
});

export const insertContentSeriesSchema = createInsertSchema(contentSeries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
});

export const insertWealthDataSchema = createInsertSchema(wealthData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  category: z.enum(["His", "Her", "Both"]).default("Both"),
});

export const insertFinancialGoalSchema = createInsertSchema(financialGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
}).extend({
  category: z.enum(["His", "Her", "Both"]).default("Both"),
  goalType: z.enum(["net_worth", "savings_rate", "debt_payoff", "custom"]),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  targetDate: z.coerce.date().optional(),
});

export const insertGoalMilestoneSchema = createInsertSchema(goalMilestones).omit({
  id: true,
  createdAt: true,
  achievedAt: true,
});

export const insertWealthReportSchema = createInsertSchema(wealthReports).omit({
  id: true,
  createdAt: true,
}).extend({
  category: z.enum(["His", "Her", "Both"]).default("Both"),
  reportType: z.enum(["monthly", "quarterly", "annual"]),
  reportDate: z.coerce.date(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribedAt: true,
  active: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type ContentSeries = typeof contentSeries.$inferSelect;
export type InsertContentSeries = z.infer<typeof insertContentSeriesSchema>;

export type InsertWealthData = z.infer<typeof insertWealthDataSchema>;
export type WealthData = typeof wealthData.$inferSelect;

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;
export type FinancialGoal = typeof financialGoals.$inferSelect;

export type InsertGoalMilestone = z.infer<typeof insertGoalMilestoneSchema>;
export type GoalMilestone = typeof goalMilestones.$inferSelect;

export type InsertWealthReport = z.infer<typeof insertWealthReportSchema>;
export type WealthReport = typeof wealthReports.$inferSelect;
