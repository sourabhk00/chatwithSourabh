import { type User, type InsertUser, type File, type InsertFile, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";


export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFile(file: InsertFile): Promise<File>;
  getFile(id: string): Promise<File | undefined>;
  getFiles(): Promise<File[]>;
  deleteFile(id: string): Promise<boolean>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(): Promise<ChatMessage[]>;
  clearChatHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private files: Map<string, File>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.chatMessages = new Map();
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = { 
      ...insertFile, 
      id, 
      uploadedAt: new Date(),
      content: insertFile.content || null
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values()).sort(
      (a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0)
    );
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      fileIds: insertMessage.fileIds || null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort(
      (a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
    );
  }

  async clearChatHistory(): Promise<void> {
    this.chatMessages.clear();
  }
}

export const storage = new MemStorage();
