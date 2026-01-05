import { query } from '../../shared/database';

export const RechargePlanRepository = {

  /**
   * 🔹 GET ALL PLANS (Pagination)
   */
  async getPlans(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const plansRes = await query(
      `SELECT *
       FROM recharge_plans
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const totalRes = await query(
      `SELECT COUNT(*) AS total FROM recharge_plans`
    );

    return {
      plans: plansRes.rows,
      total: Number(totalRes.rows[0].total),
    };
  },

  /**
   * 🔹 GET PLAN BY ID
   */
  async getById(id: number) {
    const res = await query(
      `SELECT * FROM recharge_plans WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  },

  /**
   * 🔹 CREATE PLAN
   * planType = ARRAY (multi select)
   */
  async create(data: any) {
    const res = await query(
      `INSERT INTO recharge_plans
       (
         plan_name,
         plan_type,
         description,
         ride_limit,
         validity_days,
         price,
         is_active
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        data.planName,
        data.planType,
        data.description || null,
        data.rideLimit,
        data.validityDays,
        data.price,
        data.isActive ?? true,
      ]
    );

    return res.rows[0];
  },

  /**
   * 🔹 UPDATE PLAN
   * planType = ARRAY (multi select)
   */
  async update(id: number, data: any) {
    const res = await query(
      `UPDATE recharge_plans
       SET
         plan_name     = COALESCE($1, plan_name),
         plan_type     = COALESCE($2, plan_type),
         description   = COALESCE($3, description),
         ride_limit    = COALESCE($4, ride_limit),
         validity_days = COALESCE($5, validity_days),
         price         = COALESCE($6, price)
       WHERE id = $7
       RETURNING *`,
      [
        data.planName || null,
        data.planType || null,   // ✅ ARRAY
        data.description || null,
        data.rideLimit || null,
        data.validityDays || null,
        data.price || null,
        id,
      ]
    );

    return res.rows[0];
  },
  async countActivePlans() {
    const res = await query(
      `SELECT COUNT(*) AS total
     FROM recharge_plans
     WHERE is_active = true`
    );

    return Number(res.rows[0].total);
  },


  /**
   * 🔹 TOGGLE ACTIVE / INACTIVE
   */
  async toggle(id: number, status: boolean) {
    const res = await query(
      `UPDATE recharge_plans
       SET is_active = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  },

  /**
   * 🔹 DELETE PLAN
   */
  async delete(id: number) {
    await query(
      `DELETE FROM recharge_plans WHERE id = $1`,
      [id]
    );
  },
};
