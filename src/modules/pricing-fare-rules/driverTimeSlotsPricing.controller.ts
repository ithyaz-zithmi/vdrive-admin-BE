import { DriverTimeSlotsPricingService } from './driverTimeSlotsPricing.service';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';
import { logger } from '../../shared/logger';

class DriverTimeSlotsPricingController {
  static async getDriverTimeSlotsPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, price_and_fare_rules_id, driver_types, day } = req.query;
      logger.info(`📋 Driver time slots pricing list requested: page ${page}, limit ${limit}`);

      const filters = {
        price_and_fare_rules_id: price_and_fare_rules_id as string | undefined,
        driver_types: driver_types as string | undefined,
        day: day as string | undefined,
      };

      const timeSlots = await DriverTimeSlotsPricingService.getDriverTimeSlotsPricing(
        filters,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      successResponse(res, 200, 'Driver time slots pricing fetched successfully', timeSlots);
    } catch (err: any) {
      logger.error(`❌ Driver time slots pricing list failed: ${err.message}`);
      next(err);
    }
  }

  static async getDriverTimeSlotsPricingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`🔍 Driver time slots pricing lookup: ID ${id}`);

      const timeSlot = await DriverTimeSlotsPricingService.getDriverTimeSlotsPricingById(id);

      logger.info(`✅ Driver time slots pricing found: ID ${timeSlot.id}`);
      successResponse(res, 200, 'Driver time slots pricing fetched successfully', timeSlot);
    } catch (err: any) {
      logger.warn(
        `❌ Driver time slots pricing lookup failed: ID ${req.params.id} - ${err.message}`
      );
      next(err);
    }
  }

  static async getByPricingFareRuleId(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_and_fare_rules_id } = req.params;
      logger.info(
        `🔍 Driver time slots pricing lookup by fare rule: ID ${price_and_fare_rules_id}`
      );

      const timeSlots =
        await DriverTimeSlotsPricingService.getByPricingFareRuleId(price_and_fare_rules_id);

      logger.info(
        `✅ Found ${timeSlots.length} time slots for fare rule ID ${price_and_fare_rules_id}`
      );
      successResponse(res, 200, 'Driver time slots pricing fetched successfully', timeSlots);
    } catch (err: any) {
      logger.warn(`❌ Driver time slots pricing lookup failed: ${err.message}`);
      next(err);
    }
  }

  static async createDriverTimeSlotsPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      logger.info(`🆕 Driver time slots pricing creation from ${ip}`);

      const timeSlotData = req.body;
      const newTimeSlot =
        await DriverTimeSlotsPricingService.createDriverTimeSlotsPricing(timeSlotData);

      logger.info(`✅ Driver time slots pricing created: ID ${newTimeSlot.id}`);
      successResponse(res, 201, 'Driver time slots pricing created successfully', newTimeSlot);
    } catch (err: any) {
      logger.error(`❌ Driver time slots pricing creation failed: ${err.message}`);
      next(err);
    }
  }

  static async bulkCreateDriverTimeSlotsPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      logger.info(`🆕 Bulk driver time slots pricing creation from ${ip}`);

      const { slots } = req.body;
      const newTimeSlots =
        await DriverTimeSlotsPricingService.bulkCreateDriverTimeSlotsPricing(slots);

      logger.info(`✅ ${newTimeSlots.length} driver time slots pricing created`);
      successResponse(res, 201, 'Driver time slots pricing created successfully', newTimeSlots);
    } catch (err: any) {
      logger.error(`❌ Bulk driver time slots pricing creation failed: ${err.message}`);
      next(err);
    }
  }

  static async updateDriverTimeSlotsPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`✏️ Driver time slots pricing update: ID ${id} from ${ip}`);

      const updatedTimeSlot = await DriverTimeSlotsPricingService.updateDriverTimeSlotsPricing(
        id,
        updates
      );

      logger.info(`🔄 Driver time slots pricing updated: ID ${updatedTimeSlot.id}`);
      successResponse(res, 200, 'Driver time slots pricing updated successfully', updatedTimeSlot);
    } catch (err: any) {
      logger.warn(
        `❌ Driver time slots pricing update failed: ID ${req.params.id} - ${err.message}`
      );
      next(err);
    }
  }

  static async deleteDriverTimeSlotsPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.warn(`🗑️ Driver time slots pricing deletion: ID ${id} from ${ip}`);

      await DriverTimeSlotsPricingService.deleteDriverTimeSlotsPricing(id);

      logger.info(`✅ Driver time slots pricing deleted: ID ${id}`);
      successResponse(res, 200, 'Driver time slots pricing deleted successfully', null);
    } catch (err: any) {
      logger.error(
        `❌ Driver time slots pricing deletion failed: ID ${req.params.id} - ${err.message}`
      );
      next(err);
    }
  }
}

export default DriverTimeSlotsPricingController;
