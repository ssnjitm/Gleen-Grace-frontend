export type UserRole = 'admin' | 'editor' | 'developer' | 'user' | 'partner';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  customerID?: string; // Optional if not always present
  createdAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  token?: string;
  

}