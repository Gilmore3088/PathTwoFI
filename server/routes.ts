import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBlogPostSchema, 
  insertWealthDataSchema, 
  insertNewsletterSubscriptionSchema,
  insertContactSubmissionSchema 
} from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";

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
      console.log('Received blog post data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertBlogPostSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error('Blog post validation error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      res.status(400).json({ message: "Invalid blog post data", error: error instanceof Error ? error.message : 'Unknown error' });
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
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.get("/api/contact/:id", async (req, res) => {
    try {
      const submission = await storage.getContactSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submission" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  app.delete("/api/contact/:id", async (req, res) => {
    try {
      const success = await storage.deleteContactSubmission(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      res.json({ message: "Contact submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact submission" });
    }
  });

  // Financial Goals routes
  app.get("/api/financial-goals", async (req, res) => {
    try {
      const category = req.query.category as string;
      const goals = await storage.getFinancialGoals(category);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial goals" });
    }
  });

  app.post("/api/financial-goals", async (req, res) => {
    try {
      const goal = await storage.createFinancialGoal(req.body);
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create financial goal" });
    }
  });

  app.put("/api/financial-goals/:id", async (req, res) => {
    try {
      const goal = await storage.updateFinancialGoal(req.params.id, req.body);
      if (!goal) {
        return res.status(404).json({ message: "Financial goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial goal" });
    }
  });

  app.delete("/api/financial-goals/:id", async (req, res) => {
    try {
      const success = await storage.deleteFinancialGoal(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Financial goal not found" });
      }
      res.json({ message: "Financial goal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete financial goal" });
    }
  });

  // Wealth Reports routes
  app.get("/api/wealth-reports", async (req, res) => {
    try {
      const category = req.query.category as string;
      const reportType = req.query.reportType as string;
      const reports = await storage.getWealthReports(category, reportType);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wealth reports" });
    }
  });

  app.post("/api/wealth-reports", async (req, res) => {
    try {
      const report = await storage.createWealthReport(req.body);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to create wealth report" });
    }
  });

  // Object storage routes
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      
      // Get file metadata and set response headers
      const [metadata] = await objectFile.getMetadata();
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": "public, max-age=3600",
      });

      // Stream the file to the response
      const stream = objectFile.createReadStream();
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "Object not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
