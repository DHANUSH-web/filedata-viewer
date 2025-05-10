import { users, files, type User, type InsertUser, type File, type InsertFile } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // File-related methods
  getFile(id: number): Promise<File | undefined>;
  getFiles(limit?: number): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }
  
  async getFiles(limit?: number): Promise<File[]> {
    let query = db.select().from(files).orderBy(desc(files.createdAt));
    
    if (limit && limit > 0) {
      return await query.limit(limit);
    }
    
    return await query;
  }
  
  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db
      .insert(files)
      .values(insertFile)
      .returning();
    return file;
  }
}

export const storage = new DatabaseStorage();
