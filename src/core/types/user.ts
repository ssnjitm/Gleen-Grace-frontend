export type UserRole = 'ADMIN' | 'EDITOR' | 'DEVELOPER' | 'USER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  customerID?: string; // Optional if not always present
  createdAt?: string;
  token?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  token?: string;
  

}