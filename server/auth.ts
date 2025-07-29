import session from "express-session";
import connectPg from "connect-pg-simple";
import type { RequestHandler } from "express";

const pgStore = connectPg(session);

export function getSessionConfig() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || "development-secret-key-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// Middleware to check if user is authenticated
export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  return res.status(401).json({ 
    error: "Authentication required",
    message: "Please login to access this resource" 
  });
};

// Middleware to check if user is admin
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === "admin") {
    return next();
  }
  
  return res.status(403).json({ 
    error: "Admin access required",
    message: "You don't have permission to access this resource" 
  });
};

// Extend session types
declare module "express-session" {
  interface SessionData {
    userId: string;
    userEmail: string;
    userRole: string;
    userName: string;
  }
}