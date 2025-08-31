// src/modules/users/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: Date;
  updated_at: Date;
}
