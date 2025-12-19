import { Router } from 'express';
import PriceController from './price.controller';
import { PriceValidation } from './price.validator';
import { validateBody, validateParams, validateQuery } from '../../utilities/helper';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/',
  validateQuery(PriceValidation.getPriceSettingsValidation),
  PriceController.getPriceSettings
);

router.get(
  '/:location_id',
  validateParams(PriceValidation.locationIdValidation),
  PriceController.getPriceSettingById
);

// -------------------- WRITE ROUTES --------------------
// Single price setting creation
router.post(
  '/',
  validateBody(PriceValidation.createPriceSettingValidation),
  PriceController.createPriceSetting
);

// Bulk price settings creation
router.post(
  '/bulk',
  validateBody(PriceValidation.createBulkPriceSettingsValidation),
  PriceController.createPriceSetting
);

// -------------------- UPDATE ROUTE --------------------
router.put(
  '/:location_id',
  validateParams(PriceValidation.locationIdValidation),
  validateBody(PriceValidation.updatePriceSettingValidation),
  PriceController.updatePriceSetting
);

// -------------------- DELETE ROUTE --------------------
router.delete(
  '/:location_id',
  validateParams(PriceValidation.locationIdValidation),
  PriceController.deletePriceSetting
);

export default router;
