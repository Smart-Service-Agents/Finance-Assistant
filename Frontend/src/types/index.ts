export interface Message {
  id: string;
  content: string;
  video?: string
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BackendChatEntry {
  chat_id: string;
  question: string;
  answer: string;
  video?: string;
};

export interface QuickQuestion {
  id: string;
  text: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  key?: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
  key?: string;
}

export interface PasswordStrength {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  hasMinLength: boolean;
  score: number;
}