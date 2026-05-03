// src/types/roles.ts
export type UserRole = 'ADMIN' | 'EDITOR' | 'DEVELOPER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

