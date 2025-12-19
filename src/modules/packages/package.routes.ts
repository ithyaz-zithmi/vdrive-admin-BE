// src/modules/packages/package.routes.ts
import { Router } from 'express';
import PackageController from './package.controller';
import { PackageValidation } from './package.validator';
import { validateBody, validateParams, validateQuery } from '../../utilities/helper';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/',
  validateQuery(PackageValidation.getPackagesValidation),
  PackageController.getPackages
);

router.get(
  '/:id',
  validateParams(PackageValidation.packageIdValidation),
  PackageController.getPackageById
);

// -------------------- WRITE ROUTES --------------------
router.post(
  '/',
  validateBody(PackageValidation.createPackageValidation),
  PackageController.createPackage
);

router.put(
  '/:id',
  validateParams(PackageValidation.packageIdValidation),
  validateBody(PackageValidation.updatePackageValidation),
  PackageController.updatePackage
);

router.delete(
  '/:id',
  validateParams(PackageValidation.packageIdValidation),
  PackageController.deletePackage
);

export default router;
