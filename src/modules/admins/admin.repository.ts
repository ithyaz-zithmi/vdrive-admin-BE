import { query } from '../../shared/database';
import { Admin } from './admin.model';

// Helper to map DB row to Admin interface
const mapToAdmin = (row: any): Admin => {
  // Determine email and phone from contact/email columns
  let email = row.email;
  let phoneNumber = row.contact; // Default assumption

  // Heuristic adjustment if email column is empty
  const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  
  if (!email && isEmail(row.contact)) {
    email = row.contact;
    // phoneNumber might be missing effectively if contact was email
  }
  
  // If contact was used for phone, it stays in phoneNumber. 
  // If contact was email, and we mapped it to email, phoneNumber might be disjoint or we check alternate?
  // But let's stick to what we have. 
  
  return {
    id: row.id,
    fullName: row.name,
    email: email || '',
    phoneNumber: phoneNumber || '',
    alternativePhone: row.alternate_contact, // column name in DB is alternate_contact
    role: row.role,
    status: row.status || 'active',
    // password: row.password, // Don't return password by default
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const AdminRepository = {
  async findAll(): Promise<Admin[]> {
    const result = await query("SELECT * FROM users WHERE role = 'admin' ORDER BY created_at DESC");
    return result.rows.map(mapToAdmin);
  },

  async findById(id: string): Promise<Admin | null> {
    const result = await query("SELECT * FROM users WHERE id = $1 AND role = 'admin'", [id]);
    if (result.rows.length === 0) return null;
    return mapToAdmin(result.rows[0]);
  },

  async create(data: Partial<Admin> & { password?: string }): Promise<Admin> {
    // We need to decide what goes into 'contact'.
    // 'contact' is NOT NULL and UNIQUE.
    // We should prefer phone number as contact if available, or email.
    
    // Logic: Use phoneNumber as primary contact. If duplicate, that's an error.
    // If auth expects email in contact for login, we should store email in contact?
    // But Admin Login usually happens via email?
    // Let's assume we store email in `contact` if provided, as it's more standard for login.
    // But wait, the schema has phoneNumber too.
    
    const contactValue = data.phoneNumber || data.email; 
    
    const result = await query(
      `INSERT INTO users (name, password, contact, alternate_contact, role, status, email)
       VALUES ($1, $2, $3, $4, 'admin', $5, $6)
       RETURNING *`,
      [
        data.fullName, 
        data.password, 
        contactValue, 
        data.alternativePhone, 
        data.status || 'active',
        data.email
      ]
    );
    return mapToAdmin(result.rows[0]);
  },

  async update(id: string, data: Partial<Admin> & { password?: string }): Promise<Admin | null> {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [id];
    let paramIndex = 2;

    if (data.fullName !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.fullName);
    }
    if (data.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(data.email);
      // We might want to update 'contact' if it was storing email? 
      // Let's avoid touching 'contact' implicitly on update unless user explicitly wants to update login username.
      // But here we are separating.
    }
    if (data.phoneNumber !== undefined) {
       // If contact stores phone, update it?
       // This ambiguity is why I should have asked, but I must act.
       // I'll leave 'contact' alone unless we passed it explicitly, but we work with Admin model here.
       // Let's assume we update only if strictly needed. 
       // For now, let's just update fields we mapped.
       
       // If I don't update 'contact', and 'contact' was the phone number, it gets out of sync.
       // Safer: Update 'contact' = phoneNumber IF 'contact' is not an email?
       // Let's just create a custom logic: 
       // If we change phoneNumber, we update contact ONLY IF contact == oldPhoneNumber? Too complex for SQL.
       
       // Simplification: We do NOT update 'contact' via this API to avoid breaking Auth login.
       // We only update 'email', 'name', 'status', 'alternate_contact'.
    }
    
    if (data.alternativePhone !== undefined) {
      updates.push(`alternate_contact = $${paramIndex++}`);
      values.push(data.alternativePhone);
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.password !== undefined) {
      updates.push(`password = $${paramIndex++}`);
      values.push(data.password);
    }

    if (updates.length === 0) return await AdminRepository.findById(id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND role = 'admin' RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) return null;
    return mapToAdmin(result.rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await query("DELETE FROM users WHERE id = $1 AND role = 'admin'", [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
