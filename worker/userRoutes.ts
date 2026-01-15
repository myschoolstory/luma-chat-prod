import { Hono } from "hono";
import { Env } from './core-utils';
import type { Message, ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    const getStub = (c: any) => c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
    app.post('/api/auth/register', async (c) => {
        const body = await c.req.json() as RegisterRequest;
        const stub = getStub(c);
        const result = await stub.register(body.username, body.password);
        if (!result) return c.json({ success: false, error: "Username already taken" } satisfies AuthResponse, 400);
        return c.json({ success: true, ...result } satisfies AuthResponse);
    });
    app.post('/api/auth/login', async (c) => {
        const body = await c.req.json() as LoginRequest;
        const stub = getStub(c);
        const result = await stub.login(body.username, body.password);
        if (!result) return c.json({ success: false, error: "Invalid credentials" } satisfies AuthResponse, 401);
        return c.json({ success: true, ...result } satisfies AuthResponse);
    });
    app.get('/api/auth/me', async (c) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false }, 401);
        const token = authHeader.split(' ')[1];
        const stub = getStub(c);
        const user = await stub.verifySession(token);
        if (!user) return c.json({ success: false }, 401);
        return c.json({ success: true, data: user });
    });
    app.get('/api/chat/messages', async (c) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, error: "Unauthorized" }, 401);
        const token = authHeader.split(' ')[1];
        const stub = getStub(c);
        const user = await stub.verifySession(token);
        if (!user) return c.json({ success: false, error: "Unauthorized" }, 401);
        const data = await stub.getMessages(user.id);
        return c.json({ success: true, data } satisfies ApiResponse<Message[]>);
    });
    app.post('/api/chat/messages', async (c) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, error: "Unauthorized" }, 401);
        const token = authHeader.split(' ')[1];
        const stub = getStub(c);
        const user = await stub.verifySession(token);
        if (!user) return c.json({ success: false, error: "Unauthorized" }, 401);
        const body = await c.req.json() as { text: string };
        const data = await stub.addMessage(user.id, user.username, body.text);
        return c.json({ success: true, data } satisfies ApiResponse<Message[]>);
    });
}