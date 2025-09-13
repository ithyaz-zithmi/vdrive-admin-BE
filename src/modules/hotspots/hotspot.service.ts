import { HotspotRepository } from './hotspot.repository';
import { Hotspot } from './hotspot.model';

export const HotspotService = {
  async getHotspots(
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: Hotspot[]; total: number }> {
    return await HotspotRepository.getHotspots(search, page, limit);
  },

  async getHotspotById(hotspot_id: string): Promise<Hotspot> {
    const hotspot = await HotspotRepository.getHotspotById(hotspot_id);
    if (!hotspot) {
      throw { statusCode: 404, message: 'Hotspot not found' };
    }
    return hotspot;
  },

  async addHotspot(data: {
    id: string;
    hotspot_name: string;
    fare: number;
    multiplier: number;
  }): Promise<Hotspot> {
    // Check if ID already exists
    const existingId = await HotspotRepository.getHotspotById(data.id);
    if (existingId) {
      throw { statusCode: 409, message: 'Hotspot ID already exists' };
    }

    // Check if hotspot name already exists
    const existingName = await HotspotRepository.getHotspotByName(data.hotspot_name);
    if (existingName) {
      throw { statusCode: 409, message: 'Hotspot name already exists' };
    }

    // Validate fare and multiplier
    if (data.fare < 0) {
      throw { statusCode: 400, message: 'Fare cannot be negative' };
    }
    if (data.multiplier <= 0) {
      throw { statusCode: 400, message: 'Multiplier must be greater than 0' };
    }

    return await HotspotRepository.createHotspot(data);
  },

  async updateHotspot(
    id: string,
    data: {
      hotspot_name?: string;
      fare?: number;
      multiplier?: number;
    }
  ): Promise<Hotspot> {
    // Check if hotspot exists
    const existing = await HotspotRepository.getHotspotById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Hotspot not found' };
    }

    // Check if new hotspot_name conflicts with existing records (if being updated)
    if (data.hotspot_name && data.hotspot_name !== existing.hotspot_name) {
      const existingName = await HotspotRepository.getHotspotByName(data.hotspot_name);
      if (existingName) {
        throw { statusCode: 409, message: 'Hotspot name already exists' };
      }
    }

    // Validate fare and multiplier if provided
    if (data.fare !== undefined && data.fare < 0) {
      throw { statusCode: 400, message: 'Fare cannot be negative' };
    }
    if (data.multiplier !== undefined && data.multiplier <= 0) {
      throw { statusCode: 400, message: 'Multiplier must be greater than 0' };
    }

    return await HotspotRepository.updateHotspot(id, data);
  },

  async deleteHotspot(id: string): Promise<void> {
    // Check if hotspot exists (will throw if not found)
    const existing = await HotspotRepository.getHotspotById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Hotspot not found' };
    }

    await HotspotRepository.deleteHotspot(id);
  },
};
