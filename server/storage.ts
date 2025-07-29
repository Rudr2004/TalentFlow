import { 
  users, 
  candidates, 
  userActions, 
  contactForms, 
  notifications,
  type User, 
  type InsertUser, 
  type Candidate, 
  type InsertCandidate, 
  type UserAction, 
  type InsertUserAction, 
  type ContactForm, 
  type InsertContactForm,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // Candidate operations
  getCandidates(params?: {
    limit?: number;
    offset?: number;
    source?: string;
    aiRecommended?: boolean;
    search?: string;
    status?: string;
  }): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidatesBySource(source: string): Promise<Candidate[]>;
  getAiRecommendedCandidates(): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidateStatus(id: string, status: string): Promise<Candidate | undefined>;
  getCandidateStats(): Promise<{
    totalCandidates: number;
    aiRecommended: number;
    linkedin: number;
    indeed: number;
    shortlisted: number;
    contacted: number;
    rejected: number;
  }>;
  
  // User action operations
  getUserActions(params?: { userId?: string; limit?: number; offset?: number }): Promise<UserAction[]>;
  createUserAction(action: InsertUserAction): Promise<UserAction>;
  
  // Contact form operations
  createContactForm(form: InsertContactForm): Promise<ContactForm>;
  
  // Notification operations
  getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {}

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(insertUser.password);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  // Candidate operations
  async getCandidates(params?: {
    limit?: number;
    offset?: number;
    source?: string;
    aiRecommended?: boolean;
    search?: string;
    status?: string;
  }): Promise<Candidate[]> {
    const { limit = 50, offset = 0, source, aiRecommended, search, status } = params || {};
    
    let query = db.select().from(candidates);
    const conditions: any[] = [];

    if (source) {
      conditions.push(eq(candidates.source, source));
    }

    if (aiRecommended !== undefined) {
      conditions.push(eq(candidates.isAiRecommended, aiRecommended));
    }

    if (status) {
      conditions.push(eq(candidates.status, status));
    }

    if (search) {
      conditions.push(
        or(
          like(candidates.name, `%${search}%`),
          like(candidates.email, `%${search}%`),
          like(candidates.jobTitle, `%${search}%`),
          like(candidates.company, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query
      .orderBy(desc(candidates.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getCandidate(id: string): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate;
  }

  async getCandidatesBySource(source: string): Promise<Candidate[]> {
    return db.select().from(candidates).where(eq(candidates.source, source));
  }

  async getAiRecommendedCandidates(): Promise<Candidate[]> {
    return db.select().from(candidates).where(eq(candidates.isAiRecommended, true));
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values({
        ...insertCandidate,
        status: "pending",
      })
      .returning();
    
    return candidate;
  }

  async updateCandidateStatus(id: string, status: string): Promise<Candidate | undefined> {
    const [candidate] = await db
      .update(candidates)
      .set({ status, updatedAt: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    
    return candidate;
  }

  async getCandidateStats(): Promise<{
    totalCandidates: number;
    aiRecommended: number;
    linkedin: number;
    indeed: number;
    shortlisted: number;
    contacted: number;
    rejected: number;
  }> {
    const [stats] = await db
      .select({
        totalCandidates: sql<number>`count(*)::int`,
        aiRecommended: sql<number>`count(*) filter (where is_ai_recommended = true)::int`,
        linkedin: sql<number>`count(*) filter (where source = 'linkedin')::int`,
        indeed: sql<number>`count(*) filter (where source = 'indeed')::int`,
        shortlisted: sql<number>`count(*) filter (where status = 'shortlisted')::int`,
        contacted: sql<number>`count(*) filter (where status = 'contacted')::int`,
        rejected: sql<number>`count(*) filter (where status = 'rejected')::int`,
      })
      .from(candidates);

    return stats;
  }

  // User action operations
  async getUserActions(params?: { userId?: string; limit?: number; offset?: number }): Promise<UserAction[]> {
    const { userId, limit = 100, offset = 0 } = params || {};
    
    let query = db.select().from(userActions);
    
    if (userId) {
      query = query.where(eq(userActions.userId, userId));
    }
    
    return query
      .orderBy(desc(userActions.timestamp))
      .limit(limit)
      .offset(offset);
  }

  async createUserAction(insertAction: InsertUserAction): Promise<UserAction> {
    const [action] = await db
      .insert(userActions)
      .values(insertAction)
      .returning();
    
    return action;
  }

  // Contact form operations
  async createContactForm(insertForm: InsertContactForm): Promise<ContactForm> {
    const [form] = await db
      .insert(contactForms)
      .values(insertForm)
      .returning();
    
    return form;
  }

  // Notification operations
  async getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    let query = db.select().from(notifications).where(eq(notifications.userId, userId));
    
    if (unreadOnly) {
      query = query.where(eq(notifications.isRead, false));
    }
    
    return query.orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
