// src/modules/users/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';

export const RideMatchingController = {

    async match(req: Request, res: Response, next: NextFunction) {
        const { pool } = req

        const client = await pool.connect();
        try {
            const { passenger_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = req.body;

            if (!passenger_id || !pickup_lat || !pickup_lng || !dropoff_lat || !dropoff_lng) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            await client.query("BEGIN");

            // 1️⃣ Insert new ride request
            const rideResult = await client.query(
                `INSERT INTO rides (passenger_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, status) 
       VALUES ($1, $2, $3, $4, $5, 'requested') 
       RETURNING id`,
                [passenger_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng]
            );
            const rideId = rideResult.rows[0].id;

            // 2️⃣ Find nearest available driver using PostGIS
            const driverResult = await client.query(
                `
      WITH pickup AS (
        SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography AS loc
      )
      SELECT 
        d.driver_id,
        u.user_id,
        u.full_name,
        d.car_model,
        d.license_plate,
        dl.latitude,
        dl.longitude,
        ROUND(ST_Distance(dl.location, p.loc)) AS distance_meters
      FROM drivers d
      JOIN users u ON d.user_id = u.user_id
      JOIN driver_locations dl ON d.driver_id = dl.driver_id
      JOIN pickup p ON TRUE
      WHERE d.status = 'available'
      ORDER BY distance_meters
      LIMIT 1
      `,
                [pickup_lng, pickup_lat] // IMPORTANT: lng first, then lat
            );

            if (driverResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "No available drivers nearby" });
            }

            const driver = driverResult.rows[0];

            // 3️⃣ Assign driver to ride + mark driver on_trip
            await client.query(
                "UPDATE rides SET driver_id=$1, status='accepted' WHERE id=$2",
                [driver.driver_id, rideId]
            );
            await client.query("UPDATE drivers SET status='on_trip' WHERE driver_id=$1", [
                driver.driver_id,
            ]);

            await client.query("COMMIT");

            // 4️⃣ Return result
            res.json({
                ride_id: rideId,
                assigned_driver: driver,
                message: "Driver assigned successfully",
            });
        } catch (err) {
            await client.query("ROLLBACK");
            console.error("❌ Error requesting ride:", err);
            res.status(500).json({ error: "Something went wrong" });
        } finally {
            client.release();
        }


    }

}