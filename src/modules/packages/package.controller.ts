// src/modules/packages/package.controller.ts
import { PackageService } from './package.service';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/errorHandler';
import { logger } from '../../shared/logger';

/**
 * Package Controller with strategic Winston logging
 */
class PackageController {
  static async getPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      logger.info(`📦 Package list requested: page ${page}, limit ${limit}`);

      const packages = await PackageService.getPackages(
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      successResponse(res, 200, 'Packages fetched successfully', packages);
    } catch (err: any) {
      logger.error(`❌ Package list failed: ${err.message}`);
      next(err);
    }
  }

  static async getPackageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`🔍 Package lookup: ID ${id}`);

      const packageItem = await PackageService.getPackageById(id);

      logger.info(`✅ Package found: ID ${packageItem.id}`);
      successResponse(res, 200, 'Package fetched successfully', packageItem);
    } catch (err: any) {
      logger.warn(`❌ Package lookup failed: ID ${req.params.id} - ${err.message}`);
      next(err);
    }
  }

  static async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`🏧 Package creation from ${ip}`);

      const packageData = req.body;
      const newPackage = await PackageService.createPackage(packageData);

      logger.info(`🆕 Package created: ID ${newPackage.id}`);
      successResponse(res, 201, 'Package created successfully', newPackage);
    } catch (err: any) {
      logger.error(`❌ Package creation failed: ${err.message}`);
      next(err);
    }
  }

  static async updatePackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.info(`✏️ Package update: ID ${id} from ${ip}`);

      const updatedPackage = await PackageService.updatePackage(id, updates);

      logger.info(`🔄 Package updated: ID ${updatedPackage.id}`);
      successResponse(res, 200, 'Package updated successfully', updatedPackage);
    } catch (err: any) {
      logger.warn(`❌ Package update failed: ID ${req.params.id} - ${err.message}`);
      next(err);
    }
  }

  static async deletePackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      logger.warn(`🗑️ Package deletion: ID ${id} from ${ip}`);

      await PackageService.deletePackage(id);

      logger.info(`✅ Package deleted: ID ${id}`);
      successResponse(res, 200, 'Package deleted successfully', null);
    } catch (err: any) {
      logger.error(`❌ Package deletion failed: ID ${req.params.id} - ${err.message}`);
      next(err);
    }
  }
}

export default PackageController;
