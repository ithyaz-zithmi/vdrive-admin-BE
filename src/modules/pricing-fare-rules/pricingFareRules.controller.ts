import { PricingFareRulesService } from './pricingFareRules.service';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';
import { logger } from '../../shared/logger';

class PricingFareRulesController {
  static async getPricingFareRules(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search = '',
        page = 1,
        limit = 10,
        city_id,
        district_id,
        is_hotspot,
        include_time_slots,
      } = req.query;

      logger.info(
        `📋 Pricing fare rules list requested: page ${page}, limit ${limit}, search "${search}"`
      );

      const filters = {
        search: search as string,
        city_id: city_id as string | undefined,
        district_id: district_id as string | undefined,
        is_hotspot: is_hotspot === 'true' ? true : is_hotspot === 'false' ? false : undefined,
      };

      const includeSlots = include_time_slots === 'true';

      const fareRules = await PricingFareRulesService.getPricingFareRules(
        filters,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        includeSlots
      );

      successResponse(res, 200, 'Pricing fare rules fetched successfully', fareRules);
    } catch (err: any) {
      logger.error(`❌ Pricing fare rules list failed: ${err.message}`);
      next(err);
    }
  }

  static async getPricingFareRuleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`🔍 Pricing fare rule lookup: ID ${id}`);

      const fareRule = await PricingFareRulesService.getPricingFareRuleById(id);

      logger.info(`✅ Pricing fare rule found: ID ${fareRule.id}`);
      successResponse(res, 200, 'Pricing fare rule fetched successfully', fareRule);
    } catch (err: any) {
      logger.warn(`❌ Pricing fare rule lookup failed: ID ${req.params.id} - ${err.message}`);
      next(err);
    }
  }

  static async createPricingFareRule(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      logger.info(`🆕 Pricing fare rule creation from ${ip}`);

      const fareRuleData = req.body;
      const newFareRule = await PricingFareRulesService.createPricingFareRule(fareRuleData);

      logger.info(`✅ Pricing fare rule created: ID ${newFareRule.id}`);
      successResponse(res, 201, 'Pricing fare rule created successfully', newFareRule);
    } catch (err: any) {
      logger.error(`❌ Pricing fare rule creation failed: ${err.message}`);
      next(err);
    }
  }

  static async updatePricingFareRule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`✏️ Pricing fare rule update: ID ${id} from ${ip}`);

      const updatedFareRule = await PricingFareRulesService.updatePricingFareRule(id, updates);

      logger.info(`🔄 Pricing fare rule updated: ID ${updatedFareRule.id}`);
      successResponse(res, 200, 'Pricing fare rule updated successfully', updatedFareRule);
    } catch (err: any) {
      logger.warn(`❌ Pricing fare rule update failed: ID ${req.params.id} - ${err.message}`);
      next(err);
    }
  }

  static async deletePricingFareRule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.warn(`🗑️ Pricing fare rule deletion: ID ${id} from ${ip}`);

      await PricingFareRulesService.deletePricingFareRule(id);

      logger.info(`✅ Pricing fare rule deleted: ID ${id}`);
      successResponse(res, 200, 'Pricing fare rule deleted successfully', null);
    } catch (err: any) {
      logger.error(`❌ Pricing fare rule deletion failed: ID ${req.params.id} - ${err.message}`);
      next(err);
    }
  }

  static async createPricingRuleWithSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      logger.info(`🆕 Pricing fare rule with slots creation from ${ip}`);

      const data = req.body;
      const result = await PricingFareRulesService.createPricingRuleWithSlots(data);

      logger.info(
        `✅ Pricing fare rule created with ${result.timeSlots.length} time slots: ID ${result.pricingRule.id}`
      );
      successResponse(res, 201, 'Pricing fare rule with slots created successfully', result);
    } catch (err: any) {
      logger.error(`❌ Pricing fare rule with slots creation failed: ${err.message}`);
      next(err);
    }
  }

  static async updatePricingRuleWithSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      logger.info(`✏️ Pricing fare rule with slots update: ID ${id} from ${ip}`);

      const data = req.body;
      const result = await PricingFareRulesService.updatePricingRuleWithSlots(id, data);

      logger.info(
        `✅ Pricing fare rule updated with ${result.timeSlots.length} time slots: ID ${result.pricingRule.id}`
      );
      successResponse(res, 200, 'Pricing fare rule with slots updated successfully', result);
    } catch (err: any) {
      logger.error(`❌ Pricing fare rule with slots update failed: ${err.message}`);
      next(err);
    }
  }
}

export default PricingFareRulesController;
