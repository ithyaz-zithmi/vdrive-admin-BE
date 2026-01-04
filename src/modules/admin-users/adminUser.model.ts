// src/modules/users/user.model.ts// src/modules/users/user.model.ts
export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  password: string;
  contact: string;
  alternate_contact?: string;
  role: 'admin';
  reset_token: string | null;
  reset_token_expiry: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  is_deleted: boolean;
}
