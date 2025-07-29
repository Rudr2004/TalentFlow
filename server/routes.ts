import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCandidateSchema, 
  insertContactFormSchema, 
  insertUserActionSchema,
  loginUserSchema,
  registerUserSchema
} from "@shared/schema";
import { getSessionConfig, requireAuth, requireAdmin } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(getSessionConfig());

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ 
          error: "User already exists",
          message: "An account with this email already exists" 
        });
      }

      const user = await storage.createUser({
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role || "user"
      });

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;
      req.session.userName = `${user.firstName} ${user.lastName}`;

      await storage.updateUserLastLogin(user.id);

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ 
        error: "Registration failed",
        message: error.message || "Invalid registration data" 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          message: "Email or password is incorrect" 
        });
      }

      const isValidPassword = await storage.verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          message: "Email or password is incorrect" 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          error: "Account deactivated",
          message: "Your account has been deactivated. Please contact support." 
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;
      req.session.userName = `${user.firstName} ${user.lastName}`;

      await storage.updateUserLastLogin(user.id);

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ 
        error: "Login failed",
        message: error.message || "Invalid login data" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ 
          error: "Logout failed",
          message: "Could not log out. Please try again." 
        });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ 
          error: "User not found",
          message: "User account no longer exists" 
        });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        lastLogin: user.lastLogin
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        error: "Failed to get user data",
        message: "Could not retrieve user information" 
      });
    }
  });

  // Candidates API (protected routes)
  app.get("/api/candidates", requireAuth, async (req, res) => {
    try {
      const params = {
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
        source: req.query.source as string,
        aiRecommended: req.query.aiRecommended === "true" ? true : undefined,
        search: req.query.search as string,
        status: req.query.status as string,
      };

      const candidates = await storage.getCandidates(params);
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ 
        error: "Failed to fetch candidates",
        message: "Could not retrieve candidate data" 
      });
    }
  });

  app.get("/api/candidates/:id", requireAuth, async (req, res) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ 
          error: "Candidate not found",
          message: "The requested candidate does not exist" 
        });
      }

      // Log user action
      await storage.createUserAction({
        userId: req.session.userId!,
        candidateId: req.params.id,
        action: "view"
      });

      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({ 
        error: "Failed to fetch candidate",
        message: "Could not retrieve candidate details" 
      });
    }
  });

  app.post("/api/candidates", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(validatedData);
      
      // Create notification for new candidate
      await storage.createNotification({
        userId: req.session.userId!,
        type: "new_candidate",
        title: "New Candidate Added",
        message: `${candidate.name} has been added to the system`,
        candidateId: candidate.id
      });

      res.status(201).json(candidate);
    } catch (error: any) {
      console.error("Error creating candidate:", error);
      res.status(400).json({ 
        error: "Invalid candidate data",
        message: error.message || "Please check your input data" 
      });
    }
  });

  app.patch("/api/candidates/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ 
          error: "Status is required",
          message: "Please provide a valid status" 
        });
      }
      
      const candidate = await storage.updateCandidateStatus(req.params.id, status);
      if (!candidate) {
        return res.status(404).json({ 
          error: "Candidate not found",
          message: "The requested candidate does not exist" 
        });
      }

      // Log user action
      await storage.createUserAction({
        userId: req.session.userId!,
        candidateId: req.params.id,
        action: status,
        details: `Status updated to ${status}`
      });

      // Create notification for status update
      await storage.createNotification({
        userId: req.session.userId!,
        type: "status_update",
        title: "Candidate Status Updated",
        message: `${candidate.name} status changed to ${status}`,
        candidateId: candidate.id
      });

      res.json(candidate);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      res.status(500).json({ 
        error: "Failed to update candidate status",
        message: "Could not update the candidate's status" 
      });
    }
  });

  // Get candidate statistics
  app.get("/api/candidates/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getCandidateStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching candidate stats:", error);
      res.status(500).json({ 
        error: "Failed to fetch statistics",
        message: "Could not retrieve candidate statistics" 
      });
    }
  });

  // User Actions API (Admin only)
  app.get("/api/user-actions", requireAdmin, async (req, res) => {
    try {
      const params = {
        userId: req.query.userId as string,
        limit: parseInt(req.query.limit as string) || 100,
        offset: parseInt(req.query.offset as string) || 0,
      };
      
      const actions = await storage.getUserActions(params);
      res.json(actions);
    } catch (error) {
      console.error("Error fetching user actions:", error);
      res.status(500).json({ 
        error: "Failed to fetch user actions",
        message: "Could not retrieve activity logs" 
      });
    }
  });

  app.post("/api/user-actions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserActionSchema.parse({
        ...req.body,
        userId: req.session.userId!
      });
      
      const action = await storage.createUserAction(validatedData);
      res.status(201).json(action);
    } catch (error: any) {
      console.error("Error creating user action:", error);
      res.status(400).json({ 
        error: "Invalid action data",
        message: error.message || "Could not record user action" 
      });
    }
  });

  // Notifications API
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const unreadOnly = req.query.unread === "true";
      const notifications = await storage.getUserNotifications(req.session.userId!, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ 
        error: "Failed to fetch notifications",
        message: "Could not retrieve notifications" 
      });
    }
  });

  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ 
        error: "Failed to update notification",
        message: "Could not mark notification as read" 
      });
    }
  });

  app.patch("/api/notifications/read-all", requireAuth, async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.session.userId!);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ 
        error: "Failed to update notifications",
        message: "Could not mark all notifications as read" 
      });
    }
  });

  // Contact Form API (Public)
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const form = await storage.createContactForm(validatedData);
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        id: form.id 
      });
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      res.status(400).json({ 
        error: "Invalid contact form data",
        message: error.message || "Please check your input and try again" 
      });
    }
  });

  // Dashboard stats API (Admin only)
  app.get("/api/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getCandidateStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ 
        error: "Failed to fetch statistics",
        message: "Could not retrieve dashboard statistics" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
