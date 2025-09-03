// src/modules/users/user.model.ts// src/modules/users/user.model.ts
export interface User {
  id: string;
  name: string;
  password: string;
  contact: string;
  alternateContact?: string;
  role: 'customer' | 'admin';
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  created_at: Date;
  updated_at: Date;
}
