import { PriceService } from './price.service';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';
import { logger } from '../../shared/logger';

/**
 * Price Settings Controller with strategic Winston logging
 * Only logs business operations, not validation (celebrate handles validation)
 */
class PriceController {
  static async getPriceSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      logger.info(`💰 Price settings list: page ${page}, limit ${limit}, search "${search}"`);

      const priceSettings = await PriceService.getPriceSettings(
        search as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      successResponse(res, 200, 'Price settings fetched successfully', priceSettings);
    } catch (err: any) {
      logger.error(`❌ Price settings list failed: ${err.message}`);
      next(err);
    }
  }

  static async getPriceSettingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { location_id } = req.params;
      logger.info(`🔍 Price setting lookup: Location ID ${location_id}`);

      const priceSetting = await PriceService.getPriceSettingById(location_id);

      logger.info(
        `✅ Price setting found: ${priceSetting.location.country} (${priceSetting.location.country})`
      );
      successResponse(res, 200, 'Price setting fetched successfully', priceSetting);
    } catch (err: any) {
      logger.warn(
        `❌ Price setting lookup failed: Location ID ${req.params.location_id} - ${err.message}`
      );
      next(err);
    }
  }

  static async createPriceSetting(req: Request, res: Response, next: NextFunction) {
    const priceSettingData = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

    try {
      if (Array.isArray(priceSettingData)) {
        // Bulk creation
        if (priceSettingData.length === 0) {
          logger.warn('❌ Bulk creation attempted with empty array');
          return next({
            statusCode: 400,
            message: 'At least one price setting is required',
          });
        }

        logger.info(`📦 Bulk price settings creation: ${priceSettingData.length} items from ${ip}`);

        const results = await PriceService.createMultiplePriceSettings(priceSettingData);

        logger.info(`✅ Bulk creation successful: ${results.length} price settings created`);
        return successResponse(
          res,
          201,
          `Successfully created ${results.length} price setting${results.length > 1 ? 's' : ''}`,
          results
        );
      } else {
        // Single creation
        const location = priceSettingData.location;
        logger.info(`🆕 Price setting creation: ${location.country} from ${ip}`);

        const result = await PriceService.createPriceSetting(priceSettingData);

        logger.info(`🎯 Price setting created: "${location.country}" (ID: ${result.location_id})`);
        return successResponse(res, 201, 'Price setting created successfully', result);
      }
    } catch (err: any) {
      if (Array.isArray(priceSettingData)) {
        logger.error(`❌ Bulk creation failed: ${err.message}`);
      } else {
        logger.error(
          `❌ Single creation failed: ${req.body.location?.country || 'unknown'} - ${err.message}`
        );
      }
      next(err);
    }
  }

  static async updatePriceSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { location_id } = req.params;
      const updates = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`✏️ Price setting update: Location ID ${location_id} from ${ip}`);

      const updatedPriceSetting = await PriceService.updatePriceSetting(location_id, updates);

      logger.info(
        `🔄 Price setting updated: ${updatedPriceSetting.location.country} (ID: ${updatedPriceSetting.location_id})`
      );
      successResponse(res, 200, 'Price setting updated successfully', updatedPriceSetting);
    } catch (err: any) {
      logger.warn(
        `❌ Price setting update failed: Location ID ${req.params.location_id} - ${err.message}`
      );
      next(err);
    }
  }

  static async deletePriceSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { location_id } = req.params;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.warn(`🗑️ Price setting deletion: Location ID ${location_id} from ${ip}`);

      await PriceService.deletePriceSetting(location_id);

      logger.info(`✅ Price setting deleted: Location ID ${location_id}`);
      successResponse(res, 200, 'Price setting deleted successfully', null);
    } catch (err: any) {
      logger.error(
        `❌ Price setting deletion failed: Location ID ${req.params.location_id} - ${err.message}`
      );
      next(err);
    }
  }
}

export default PriceController;
