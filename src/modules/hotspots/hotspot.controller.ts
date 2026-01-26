import { HotspotService } from './hotspot.service';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';
import { logger } from '../../shared/logger';

/**
 * Hotspot Controller with strategic Winston logging
 * Only logs business operations, not validation (celebrate handles validation)
 */
class HotspotController {
  static async getHotspots(req: Request, res: Response, next: NextFunction) {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      logger.info(`📍 Hotspot list requested: page ${page}, limit ${limit}, search "${search}"`);

      const hotspots = await HotspotService.getHotspots(
        search as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      successResponse(res, 200, 'Hotspots fetched successfully', hotspots);
    } catch (err: any) {
      logger.error(`❌ Hotspot list failed: ${err.message}`);
      next(err);
    }
  }

  static async getHotspotById(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotspot_id } = req.params;
      logger.info(`🔍 Hotspot lookup: ID ${hotspot_id}`);

      const hotspot = await HotspotService.getHotspotById(hotspot_id);

      logger.info(`✅ Hotspot found: ${hotspot.hotspot_name} (ID: ${hotspot.id})`);
      successResponse(res, 200, 'Hotspot fetched successfully', hotspot);
    } catch (err: any) {
      logger.warn(`❌ Hotspot lookup failed: ID ${req.params.hotspot_id} - ${err.message}`);
      next(err);
    }
  }

  static async addHotspot(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotspot_name } = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`🏧 Hotspot creation: "${hotspot_name}" from ${ip}`);

      const hotspotData = req.body;
      const newHotspot = await HotspotService.createHotspot(hotspotData);

      logger.info(`🆕 Hotspot created: "${newHotspot.hotspot_name}" (ID: ${newHotspot.id})`);
      successResponse(res, 201, 'Hotspot added successfully', newHotspot);
    } catch (err: any) {
      logger.error(`❌ Hotspot creation failed: "${req.body.hotspot_name}" - ${err.message}`);
      next(err);
    }
  }

  static async updateHotspot(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotspot_id } = req.params;
      const updates = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`✏️ Hotspot update: ID ${hotspot_id} from ${ip}`);

      const updatedHotspot = await HotspotService.updateHotspot(hotspot_id, updates);

      logger.info(`🔄 Hotspot updated: ${updatedHotspot.hotspot_name} (ID: ${updatedHotspot.id})`);
      successResponse(res, 200, 'Hotspot updated successfully', updatedHotspot);
    } catch (err: any) {
      logger.warn(`❌ Hotspot update failed: ID ${req.params.hotspot_id} - ${err.message}`);
      next(err);
    }
  }

  static async deleteHotspot(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotspot_id } = req.params;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.warn(`🗑️ Hotspot deletion: ID ${hotspot_id} from ${ip}`);

      await HotspotService.deleteHotspot(hotspot_id);

      logger.info(`✅ Hotspot deleted: ID ${hotspot_id}`);
      successResponse(res, 200, 'Hotspot deleted successfully', null);
    } catch (err: any) {
      logger.error(`❌ Hotspot deletion failed: ID ${req.params.hotspot_id} - ${err.message}`);
      next(err);
    }
  }
}

export default HotspotController;
