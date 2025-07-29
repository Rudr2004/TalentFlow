import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("user"), // "admin" or "user"
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  profileUrl: text("profile_url"),
  source: text("source").notNull(), // "linkedin" or "indeed"
  skills: text("skills").array().default([]),
  experience: text("experience"),
  summary: text("summary"),
  aiScore: text("ai_score"), // AI confidence score
  aiSummary: text("ai_summary"), // AI-generated summary
  status: text("status").notNull().default("pending"), // "pending", "shortlisted", "rejected", "contacted"
  isAiRecommended: boolean("is_ai_recommended").default(false),
  jobTitle: text("job_title"),
  company: text("company"),
  education: text("education"),
  yearsOfExperience: text("years_of_experience"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userActions = pgTable("user_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  candidateId: varchar("candidate_id").notNull(),
  action: text("action").notNull(), // "view", "shortlist", "reject", "contact"
  details: text("details"), // Additional action details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const contactForms = pgTable("contact_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  message: text("message"),
  status: text("status").default("pending"), // "pending", "contacted", "resolved"
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table for candidate alerts
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // "new_candidate", "ai_recommendation", "status_update"
  title: text("title").notNull(),
  message: text("message").notNull(),
  candidateId: varchar("candidate_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Candidate schemas
export const insertCandidateSchema = createInsertSchema(candidates).pick({
  name: true,
  email: true,
  phone: true,
  location: true,
  profileUrl: true,
  source: true,
  skills: true,
  experience: true,
  summary: true,
  aiScore: true,
  aiSummary: true,
  isAiRecommended: true,
  jobTitle: true,
  company: true,
  education: true,
  yearsOfExperience: true,
});

// User action schemas
export const insertUserActionSchema = createInsertSchema(userActions).pick({
  userId: true,
  candidateId: true,
  action: true,
  details: true,
});

// Contact form schemas
export const insertContactFormSchema = createInsertSchema(contactForms).pick({
  email: true,
  firstName: true,
  lastName: true,
  company: true,
  message: true,
});

// Notification schemas
export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  title: true,
  message: true,
  candidateId: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type InsertUserAction = z.infer<typeof insertUserActionSchema>;
export type UserAction = typeof userActions.$inferSelect;

export type InsertContactForm = z.infer<typeof insertContactFormSchema>;
export type ContactForm = typeof contactForms.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
