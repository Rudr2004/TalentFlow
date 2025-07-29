import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCandidateSchema, insertContactFormSchema, insertUserActionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Candidates API
  app.get("/api/candidates", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const source = req.query.source as string;
      const aiRecommended = req.query.aiRecommended === "true";
      
      let candidates;
      if (aiRecommended) {
        candidates = await storage.getAiRecommendedCandidates();
      } else if (source) {
        candidates = await storage.getCandidatesBySource(source);
      } else {
        candidates = await storage.getCandidates(limit, offset);
      }
      
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  app.post("/api/candidates", async (req, res) => {
    try {
      const validatedData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(validatedData);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(400).json({ message: "Invalid candidate data" });
    }
  });

  app.patch("/api/candidates/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const candidate = await storage.updateCandidateStatus(req.params.id, status);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update candidate status" });
    }
  });

  // User Actions API
  app.get("/api/user-actions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const actions = await storage.getUserActions(userId);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user actions" });
    }
  });

  app.post("/api/user-actions", async (req, res) => {
    try {
      const validatedData = insertUserActionSchema.parse(req.body);
      const action = await storage.createUserAction(validatedData);
      res.status(201).json(action);
    } catch (error) {
      res.status(400).json({ message: "Invalid action data" });
    }
  });

  // Contact Form API
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const form = await storage.createContactForm(validatedData);
      res.status(201).json({ message: "Contact form submitted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });

  // Dashboard stats API
  app.get("/api/stats", async (req, res) => {
    try {
      const allCandidates = await storage.getCandidates(1000, 0);
      const aiRecommended = await storage.getAiRecommendedCandidates();
      const linkedinCandidates = await storage.getCandidatesBySource("linkedin");
      const indeedCandidates = await storage.getCandidatesBySource("indeed");
      
      const stats = {
        totalCandidates: allCandidates.length,
        aiRecommended: aiRecommended.length,
        linkedin: linkedinCandidates.length,
        indeed: indeedCandidates.length,
        shortlisted: allCandidates.filter(c => c.status === "shortlisted").length,
        contacted: allCandidates.filter(c => c.status === "contacted").length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
