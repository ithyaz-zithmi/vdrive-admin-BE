import { query } from '../../shared/database';
import { Location, PriceSetting, PriceSettingResponse, RateDetail, Timing } from './price.model';

// Note: These tables need to be created in the database with the schema provided in init.ts
// For now, using mock implementations since actual tables don't exist yet

async function paginateAndSearch<T>(
  baseSql: string,
  params: any[],
  orderBy: string,
  searchField?: string,
  searchValue?: string,
  page = 1,
  limit = 10
): Promise<{ data: T[]; total: number }> {
  const offset = (page - 1) * limit;
  if (searchField && searchValue) {
    params.push(`%${searchValue}%`);
    baseSql += ` AND ${searchField} ILIKE $${params.length}`;
  }

  // Count query
  const countSql = `SELECT COUNT(*) FROM (${baseSql}) AS subquery`;
  const countRes = await query(countSql, params);

  // Apply order, limit, offset
  baseSql += ` ORDER BY ${orderBy} ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(baseSql, params);

  return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
}

export const PriceRepository = {
  async getPriceSettings(search: string, page: number, limit: number) {
    // This would need the actual table names from the schema
    // For now, returning a mock response
    return {
      data: [],
      total: 0,
    };
  },

  async getPriceSettingById(locationId: string): Promise<PriceSettingResponse | null> {
    // This would need the actual table names from the schema
    return null;
  },

  async createPriceSetting(priceSetting: PriceSetting): Promise<PriceSettingResponse> {
    // Create location first
    const locationResult = await query(
      `INSERT INTO created_locations
       (country, state, district, area, pincode, global_price, is_hotspot, hotspot_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING location_id`,
      [
        priceSetting.location.country,
        priceSetting.location.state || null,
        priceSetting.location.district || null,
        priceSetting.location.area || null,
        priceSetting.location.pincode || null,
        priceSetting.location.global_price || null,
        priceSetting.hotspotDetails.isHotspot,
        priceSetting.hotspotDetails.hotspotId,
      ]
    );

    const locationId = locationResult.rows[0].location_id;

    // Create rate details and timings for each driver type
    const rateDetailsPromises = priceSetting.rateDetails.map(async (rate) => {
      const rateResult = await query(
        `INSERT INTO rate_details
         (location_id, driver_type, cancellation_fee, waiting_per_min, waiting_fee)
         VALUES ($1, $2, $3, $4, $5) RETURNING rate_id`,
        [
          locationId,
          rate.driverType,
          rate.cancellationFee,
          rate.waitingFee.perMinutes,
          rate.waitingFee.fee,
        ]
      );

      const rateId = rateResult.rows[0].rate_id;

      // Create timings for this rate
      const timingPromises = rate.timing.map(async (timing) => {
        await query(
          `INSERT INTO timings
           (rate_id, day, from_time, from_type, to_time, to_type, rate)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            rateId,
            timing.day,
            timing.from.time,
            timing.from.type,
            timing.to.time,
            timing.to.type,
            timing.rate,
          ]
        );
      });

      await Promise.all(timingPromises);

      return {
        rate_id: rateId,
        driverType: rate.driverType,
        cancellationFee: rate.cancellationFee,
        waitingFee: rate.waitingFee,
        timing: rate.timing,
      };
    });

    const rateDetails = await Promise.all(rateDetailsPromises);

    // Get hotspot fare from hotspots table if referenced
    let fare = null;
    if (priceSetting.hotspotDetails.hotspotId) {
      const hotspotResult = await query('SELECT fare FROM hotspots WHERE id = $1', [
        priceSetting.hotspotDetails.hotspotId,
      ]);
      if (hotspotResult.rows[0]) {
        fare = parseFloat(hotspotResult.rows[0].fare);
      }
    }

    const response: PriceSettingResponse = {
      location_id: locationId,
      location: priceSetting.location,
      hotspotDetails: {
        isHotspot: priceSetting.hotspotDetails.isHotspot,
        hotspotId: priceSetting.hotspotDetails.hotspotId,
        hotspotName: priceSetting.hotspotDetails.hotspotName,
        fare: fare,
        multiplier: undefined, // Changed from null to undefined for TypeScript
      },
      rateDetails: rateDetails,
    };

    return response;
  },

  async createMultiplePriceSettings(
    priceSettings: PriceSetting[]
  ): Promise<PriceSettingResponse[]> {
    const results: PriceSettingResponse[] = [];

    for (const setting of priceSettings) {
      const result = await this.createPriceSetting(setting);
      results.push(result);
    }

    return results;
  },

  async updatePriceSetting(
    locationId: string,
    updates: Partial<PriceSetting>
  ): Promise<PriceSettingResponse> {
    // Find existing price setting first
    const existing = await this.getPriceSettingById(locationId);
    if (!existing) {
      throw { statusCode: 404, message: 'Price setting not found' };
    }

    // Update location if provided
    if (updates.location) {
      await query(
        `UPDATE created_locations
         SET country = $1, state = $2, district = $3, area = $4,
             pincode = $5, global_price = $6, is_hotspot = $7, hotspot_id = $8
         WHERE location_id = $9`,
        [
          updates.location.country || existing.location.country,
          updates.location.state || existing.location.state,
          updates.location.district || existing.location.district,
          updates.location.area || existing.location.area,
          updates.location.pincode || existing.location.pincode,
          updates.location.global_price || existing.location.global_price,
          updates.hotspotDetails?.isHotspot ?? existing.hotspotDetails.isHotspot,
          updates.hotspotDetails?.hotspotId || existing.hotspotDetails.hotspotId,
          locationId,
        ]
      );
    }

    // Update hotspot details if provided
    if (updates.hotspotDetails) {
      const updatedIsHotspot =
        updates.hotspotDetails.isHotspot ?? existing.hotspotDetails.isHotspot;
      await query(
        `UPDATE created_locations
         SET is_hotspot = $1, hotspot_id = $2
         WHERE location_id = $3`,
        [
          updatedIsHotspot,
          updatedIsHotspot
            ? updates.hotspotDetails.hotspotId || existing.hotspotDetails.hotspotId
            : null,
          locationId,
        ]
      );
    }

    // Delete existing rate details and timings if new ones are provided
    if (updates.rateDetails) {
      await query('DELETE FROM rate_details WHERE location_id = $1', [locationId]);
    }

    // Insert updated rate details if provided
    if (updates.rateDetails) {
      const rateDetailsPromises = updates.rateDetails.map(async (rate) => {
        const rateResult = await query(
          `INSERT INTO rate_details
           (location_id, driver_type, cancellation_fee, waiting_per_min, waiting_fee)
           VALUES ($1, $2, $3, $4, $5) RETURNING rate_id`,
          [
            locationId,
            rate.driverType,
            rate.cancellationFee,
            rate.waitingFee.perMinutes,
            rate.waitingFee.fee,
          ]
        );

        const rateId = rateResult.rows[0].rate_id;

        // Create timings for this rate
        const timingPromises = rate.timing.map(async (timing) => {
          await query(
            `INSERT INTO timings
             (rate_id, day, from_time, from_type, to_time, to_type, rate)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              rateId,
              timing.day,
              timing.from.time,
              timing.from.type,
              timing.to.time,
              timing.to.type,
              timing.rate,
            ]
          );
        });

        await Promise.all(timingPromises);
      });

      await Promise.all(rateDetailsPromises);
    }

    // Fetch and return the updated price setting
    const updated = await this.getPriceSettingById(locationId);
    if (!updated) {
      throw { statusCode: 404, message: 'Failed to retrieve updated price setting' };
    }
    return updated;
  },

  async deletePriceSetting(locationId: string): Promise<void> {
    // First check if it exists
    const existing = await this.getPriceSettingById(locationId);
    if (!existing) {
      throw { statusCode: 404, message: 'Price setting not found' };
    }

    // The database CASCADE will handle deleting related records
    const result = await query('DELETE FROM created_locations WHERE location_id = $1', [
      locationId,
    ]);

    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Price setting not found or already deleted' };
    }
  },
};
