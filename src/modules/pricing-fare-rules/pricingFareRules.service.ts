import { PricingFareRulesRepository } from './pricingFareRules.repository';
import { PricingFareRule, FareSummary } from './pricingFareRules.model';
import { DriverTimeSlotsPricingRepository } from './driverTimeSlotsPricing.repository';

export const PricingFareRulesService = {
  async getPricingFareRules(
    filters: {
      search?: string;
      city_id?: string;
      district_id?: string;
      is_hotspot?: boolean;
    },
    page: number,
    limit: number,
    includeTimeSlots = false
  ): Promise<{ data: FareSummary[]; total: number }> {
    const result = await PricingFareRulesRepository.getPricingFareRules(filters, page, limit);

    // Optionally include time slots for each fare rule
    if (includeTimeSlots && result.data.length > 0) {
      for (const fareRule of result.data) {
        fareRule.time_slots = await DriverTimeSlotsPricingRepository.getByPricingFareRuleId(
          fareRule.id
        );
      }
    }

    return result;
  },

  async getPricingFareRuleById(id: string): Promise<FareSummary> {
    const fareRule = await PricingFareRulesRepository.getFareSummaryById(id);
    if (!fareRule) {
      throw { statusCode: 404, message: 'Pricing fare rule not found' };
    }

    // Always include time slots when fetching a single fare rule
    fareRule.time_slots = await DriverTimeSlotsPricingRepository.getByPricingFareRuleId(id);

    return fareRule;
  },

  async createPricingFareRule(data: {
    district_id: string;
    city_id?: string | null;
    global_price: number;
    is_hotspot: boolean;
    hotspot_id?: string | null;
    multiplier?: number | null;
  }): Promise<PricingFareRule> {
    // Validate hotspot requirements
    if (data.is_hotspot) {
      if (!data.hotspot_id) {
        throw { statusCode: 400, message: 'Hotspot ID is required when is_hotspot is true' };
      }
      if (!data.multiplier) {
        throw { statusCode: 400, message: 'Multiplier is required when is_hotspot is true' };
      }
    }

    // Check for duplicate area/city combination (only if city_id is provided)
    if (data.city_id) {
      const isDuplicate = await PricingFareRulesRepository.checkDuplicateArea(
        data.district_id,
        data.city_id
      );
      if (isDuplicate) {
        throw {
          statusCode: 409,
          message: 'A pricing fare rule already exists for this area and city combination',
        };
      }
    }

    // Validate global_price
    if (data.global_price < 0) {
      throw { statusCode: 400, message: 'Global price cannot be negative' };
    }

    // Validate multiplier if provided
    if (data.multiplier !== null && data.multiplier !== undefined && data.multiplier <= 0) {
      throw { statusCode: 400, message: 'Multiplier must be greater than 0' };
    }

    return await PricingFareRulesRepository.createPricingFareRule(data);
  },

  async updatePricingFareRule(
    id: string,
    data: {
      district_id?: string;
      city_id?: string | null;
      global_price?: number;
      is_hotspot?: boolean;
      hotspot_id?: string | null;
      multiplier?: number | null;
    }
  ): Promise<PricingFareRule> {
    // Check if pricing fare rule exists
    const existing = await PricingFareRulesRepository.getPricingFareRuleById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Pricing fare rule not found' };
    }

    // Merge existing data with updates to validate hotspot requirements
    const mergedData = { ...existing, ...data };
    if (mergedData.is_hotspot) {
      if (!mergedData.hotspot_id) {
        throw { statusCode: 400, message: 'Hotspot ID is required when is_hotspot is true' };
      }
      if (!mergedData.multiplier) {
        throw { statusCode: 400, message: 'Multiplier is required when is_hotspot is true' };
      }
    }

    // If district_id or city_id is being updated, check for duplicates (only if city_id is not null)
    if (data.district_id !== undefined || data.city_id !== undefined) {
      const newDistrictId = data.district_id || existing.district_id;
      const newCityId = data.city_id !== undefined ? data.city_id : existing.city_id;

      // Only check for duplicates if city_id is provided
      if (newCityId) {
        const isDuplicate = await PricingFareRulesRepository.checkDuplicateArea(
          newDistrictId,
          newCityId,
          id
        );
        if (isDuplicate) {
          throw {
            statusCode: 409,
            message: 'A pricing fare rule already exists for this area and city combination',
          };
        }
      }
    }

    // Validate global_price if provided
    if (data.global_price !== undefined && data.global_price < 0) {
      throw { statusCode: 400, message: 'Global price cannot be negative' };
    }

    // Validate multiplier if provided
    if (data.multiplier !== null && data.multiplier !== undefined && data.multiplier <= 0) {
      throw { statusCode: 400, message: 'Multiplier must be greater than 0' };
    }

    return await PricingFareRulesRepository.updatePricingFareRule(id, data);
  },

  async deletePricingFareRule(id: string): Promise<void> {
    // Check if pricing fare rule exists
    const existing = await PricingFareRulesRepository.getPricingFareRuleById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Pricing fare rule not found' };
    }

    await PricingFareRulesRepository.deletePricingFareRule(id);
  },
};
