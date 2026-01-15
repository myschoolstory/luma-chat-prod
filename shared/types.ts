export interface User {
  id: string;
  username: string;
  createdAt: number;
}
export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  userId?: string;
}
export interface ChatState {
  messages: Message[];
}
export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  password: string;
}