import { DurableObject } from "cloudflare:workers";
import type { Message, User } from '@shared/types';
interface UserRecord extends User {
  passwordHash: string;
  salt: string;
}
export class GlobalDurableObject extends DurableObject {
    private readonly MAX_MESSAGES = 100;
    private generateToken(): string {
      return crypto.randomUUID();
    }
    private async hashPassword(password: string, salt: string): Promise<string> {
      const encoder = new TextEncoder();
      const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: encoder.encode(salt),
          iterations: 100000,
          hash: "SHA-256",
        },
        passwordKey,
        256
      );
      return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
    }
    async register(username: string, password: string): Promise<{ user: User; token: string } | null> {
      const cleanUsername = username.trim();
      if (cleanUsername.length < 3 || password.length < 6) return null;
      const users = (await this.ctx.storage.get<Record<string, UserRecord>>("auth_users")) || {};
      if (users[cleanUsername]) return null;
      const salt = crypto.randomUUID();
      const passwordHash = await this.hashPassword(password, salt);
      const user: UserRecord = {
        id: crypto.randomUUID(),
        username: cleanUsername,
        createdAt: Date.now(),
        passwordHash,
        salt
      };
      users[cleanUsername] = user;
      await this.ctx.storage.put("auth_users", users);
      const token = this.generateToken();
      const sessions = (await this.ctx.storage.get<Record<string, string>>("auth_sessions")) || {};
      sessions[token] = user.id;
      await this.ctx.storage.put("auth_sessions", sessions);
      const { passwordHash: _, salt: __, ...publicUser } = user;
      return { user: publicUser, token };
    }
    async login(username: string, password: string): Promise<{ user: User; token: string } | null> {
      const cleanUsername = username.trim();
      const users = (await this.ctx.storage.get<Record<string, UserRecord>>("auth_users")) || {};
      const user = users[cleanUsername];
      if (!user) return null;
      const hash = await this.hashPassword(password, user.salt);
      if (hash !== user.passwordHash) return null;
      const token = this.generateToken();
      const sessions = (await this.ctx.storage.get<Record<string, string>>("auth_sessions")) || {};
      sessions[token] = user.id;
      await this.ctx.storage.put("auth_sessions", sessions);
      const { passwordHash: _, salt: __, ...publicUser } = user;
      return { user: publicUser, token };
    }
    async verifySession(token: string): Promise<User | null> {
      const sessions = (await this.ctx.storage.get<Record<string, string>>("auth_sessions")) || {};
      const userId = sessions[token];
      if (!userId) return null;
      const users = (await this.ctx.storage.get<Record<string, UserRecord>>("auth_users")) || {};
      const userRecord = Object.values(users).find(u => u.id === userId);
      if (!userRecord) return null;
      const { passwordHash: _, salt: __, ...publicUser } = userRecord;
      return publicUser;
    }
    async getMessages(userId: string): Promise<Message[]> {
      const messages = (await this.ctx.storage.get<Message[]>(`msgs:${userId}`)) || [];
      return messages;
    }
    async addMessage(userId: string, sender: string, text: string): Promise<Message[]> {
      const cleanText = text.trim();
      if (!cleanText) return await this.getMessages(userId);
      const messages = await this.getMessages(userId);
      const newMessage: Message = {
        id: crypto.randomUUID(),
        sender,
        text: cleanText,
        timestamp: Date.now(),
        userId
      };
      const updatedMessages = [...messages, newMessage].slice(-this.MAX_MESSAGES);
      await this.ctx.storage.put(`msgs:${userId}`, updatedMessages);
      return updatedMessages;
    }
}