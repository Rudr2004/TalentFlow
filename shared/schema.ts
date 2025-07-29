import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "admin" or "user"
  createdAt: timestamp("created_at").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  source: text("source").notNull(), // "linkedin" or "indeed"
  skills: text("skills").array().default([]),
  experience: text("experience"),
  summary: text("summary"),
  aiScore: text("ai_score"), // AI confidence score
  status: text("status").notNull().default("pending"), // "pending", "shortlisted", "rejected", "contacted"
  isAiRecommended: boolean("is_ai_recommended").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActions = pgTable("user_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  candidateId: varchar("candidate_id").notNull(),
  action: text("action").notNull(), // "view", "shortlist", "reject", "contact"
  timestamp: timestamp("timestamp").defaultNow(),
});

export const contactForms = pgTable("contact_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).pick({
  name: true,
  email: true,
  source: true,
  skills: true,
  experience: true,
  summary: true,
  aiScore: true,
  isAiRecommended: true,
});

export const insertUserActionSchema = createInsertSchema(userActions).pick({
  userId: true,
  candidateId: true,
  action: true,
});

export const insertContactFormSchema = createInsertSchema(contactForms).pick({
  email: true,
  message: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertUserAction = z.infer<typeof insertUserActionSchema>;
export type UserAction = typeof userActions.$inferSelect;
export type InsertContactForm = z.infer<typeof insertContactFormSchema>;
export type ContactForm = typeof contactForms.$inferSelect;
