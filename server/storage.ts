import { type User, type InsertUser, type Candidate, type InsertCandidate, type UserAction, type InsertUserAction, type ContactForm, type InsertContactForm } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCandidates(limit?: number, offset?: number): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidatesBySource(source: string): Promise<Candidate[]>;
  getAiRecommendedCandidates(): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidateStatus(id: string, status: string): Promise<Candidate | undefined>;
  
  getUserActions(userId?: string): Promise<UserAction[]>;
  createUserAction(action: InsertUserAction): Promise<UserAction>;
  
  createContactForm(form: InsertContactForm): Promise<ContactForm>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private candidates: Map<string, Candidate>;
  private userActions: Map<string, UserAction>;
  private contactForms: Map<string, ContactForm>;

  constructor() {
    this.users = new Map();
    this.candidates = new Map();
    this.userActions = new Map();
    this.contactForms = new Map();
    
    // Initialize with some demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Create demo candidates
    const candidates = [
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        source: "linkedin",
        skills: ["React", "TypeScript", "Node.js", "Python"],
        experience: "5 years in full-stack development",
        summary: "Experienced full-stack developer with expertise in modern web technologies",
        aiScore: "95.7",
        isAiRecommended: true,
        status: "pending",
      },
      {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        source: "indeed",
        skills: ["Java", "Spring Boot", "AWS", "Docker"],
        experience: "7 years in backend development",
        summary: "Senior backend engineer with cloud architecture experience",
        aiScore: "92.3",
        isAiRecommended: true,
        status: "shortlisted",
      },
      {
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        source: "linkedin",
        skills: ["UI/UX", "Figma", "React", "CSS"],
        experience: "4 years in frontend development",
        summary: "Creative frontend developer with strong design skills",
        aiScore: "88.9",
        isAiRecommended: false,
        status: "pending",
      },
    ];

    candidates.forEach(candidateData => {
      const id = randomUUID();
      const candidate: Candidate = {
        id,
        ...candidateData,
        skills: candidateData.skills || [],
        experience: candidateData.experience || null,
        summary: candidateData.summary || null,
        aiScore: candidateData.aiScore || null,
        isAiRecommended: candidateData.isAiRecommended || false,
        createdAt: new Date(),
      };
      this.candidates.set(id, candidate);
    });
  }

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
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getCandidates(limit = 50, offset = 0): Promise<Candidate[]> {
    const allCandidates = Array.from(this.candidates.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return allCandidates.slice(offset, offset + limit);
  }

  async getCandidate(id: string): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async getCandidatesBySource(source: string): Promise<Candidate[]> {
    return Array.from(this.candidates.values()).filter(
      candidate => candidate.source === source
    );
  }

  async getAiRecommendedCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values()).filter(
      candidate => candidate.isAiRecommended
    );
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = randomUUID();
    const candidate: Candidate = {
      ...insertCandidate,
      id,
      skills: insertCandidate.skills || [],
      experience: insertCandidate.experience || null,
      summary: insertCandidate.summary || null,
      aiScore: insertCandidate.aiScore || null,
      isAiRecommended: insertCandidate.isAiRecommended || false,
      status: "pending",
      createdAt: new Date(),
    };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async updateCandidateStatus(id: string, status: string): Promise<Candidate | undefined> {
    const candidate = this.candidates.get(id);
    if (candidate) {
      candidate.status = status;
      this.candidates.set(id, candidate);
      return candidate;
    }
    return undefined;
  }

  async getUserActions(userId?: string): Promise<UserAction[]> {
    const actions = Array.from(this.userActions.values());
    if (userId) {
      return actions.filter(action => action.userId === userId);
    }
    return actions.sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime());
  }

  async createUserAction(insertAction: InsertUserAction): Promise<UserAction> {
    const id = randomUUID();
    const action: UserAction = {
      ...insertAction,
      id,
      timestamp: new Date(),
    };
    this.userActions.set(id, action);
    return action;
  }

  async createContactForm(insertForm: InsertContactForm): Promise<ContactForm> {
    const id = randomUUID();
    const form: ContactForm = {
      ...insertForm,
      id,
      message: insertForm.message || null,
      createdAt: new Date(),
    };
    this.contactForms.set(id, form);
    return form;
  }
}

export const storage = new MemStorage();
