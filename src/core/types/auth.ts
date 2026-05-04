import  {type AuthUser } from './user';

export interface LoginCredentials {
  email: string;
  password: string;     
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string; // If using JWT, otherwise optional for cookie-based auth
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}