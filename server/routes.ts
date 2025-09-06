import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBlogPostSchema, 
  insertWealthDataSchema, 
  insertNewsletterSubscriptionSchema,
  insertContactSubmissionSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog post routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const category = req.query.category as string;
      const posts = category 
        ? await storage.getBlogPostsByCategory(category)
        : await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/featured", async (req, res) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Increment view count
      await storage.incrementBlogPostViews(post.id);
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Wealth data routes
  app.get("/api/wealth-data", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const data = await storage.getWealthData(category);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wealth data" });
    }
  });

  app.get("/api/wealth-data/latest", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const data = await storage.getLatestWealthData(category);
      if (!data) {
        return res.status(404).json({ message: "No wealth data found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest wealth data" });
    }
  });

  app.put("/api/wealth-data/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertWealthDataSchema.partial().parse(req.body);
      const data = await storage.updateWealthData(id, validatedData);
      if (!data) {
        return res.status(404).json({ message: "Wealth data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to update wealth data" });
    }
  });

  app.delete("/api/wealth-data/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteWealthData(id);
      if (!success) {
        return res.status(404).json({ message: "Wealth data not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete wealth data" });
    }
  });

  app.post("/api/wealth-data", async (req, res) => {
    try {
      const validatedData = insertWealthDataSchema.parse(req.body);
      const data = await storage.createWealthData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid wealth data" });
    }
  });

  // Newsletter subscription routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getNewsletterSubscription(validatedData.email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      
      const subscription = await storage.subscribeToNewsletter(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  // Contact form routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
