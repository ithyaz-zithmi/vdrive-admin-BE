import { Router } from 'express';
import PricingFareRulesController from './pricingFareRules.controller';
import DriverTimeSlotsPricingController from './driverTimeSlotsPricing.controller';
import { PricingFareRulesValidation } from './pricingFareRules.validator';
import { DriverTimeSlotsPricingValidation } from './driverTimeSlotsPricing.validator';
import { validateBody, validateParams, validateQuery } from '../../utilities/helper';

const router = Router();

// ==================== PRICING FARE RULES ROUTES ====================

// GET all pricing fare rules
router.get(
  '/',
  validateQuery(PricingFareRulesValidation.getPricingFareRulesValidation),
  PricingFareRulesController.getPricingFareRules
);

// GET single pricing fare rule by ID
router.get(
  '/:id',
  validateParams(PricingFareRulesValidation.pricingFareRuleIdValidation),
  PricingFareRulesController.getPricingFareRuleById
);

// CREATE new pricing fare rule
router.post(
  '/',
  validateBody(PricingFareRulesValidation.createPricingFareRuleValidation),
  PricingFareRulesController.createPricingFareRule
);

// UPDATE pricing fare rule
router.put(
  '/:id',
  validateParams(PricingFareRulesValidation.pricingFareRuleIdValidation),
  validateBody(PricingFareRulesValidation.updatePricingFareRuleValidation),
  PricingFareRulesController.updatePricingFareRule
);

// DELETE pricing fare rule
router.delete(
  '/:id',
  validateParams(PricingFareRulesValidation.pricingFareRuleIdValidation),
  PricingFareRulesController.deletePricingFareRule
);

// ==================== DRIVER TIME SLOTS PRICING ROUTES ====================

// GET all driver time slots pricing
router.get(
  '/time-slots/all',
  validateQuery(DriverTimeSlotsPricingValidation.getDriverTimeSlotsPricingValidation),
  DriverTimeSlotsPricingController.getDriverTimeSlotsPricing
);

// GET driver time slots pricing by pricing fare rule ID
router.get(
  '/time-slots/by-fare-rule/:price_and_fare_rules_id',
  validateParams(DriverTimeSlotsPricingValidation.pricingFareRuleIdValidation),
  DriverTimeSlotsPricingController.getByPricingFareRuleId
);

// GET single driver time slots pricing by ID
router.get(
  '/time-slots/:id',
  validateParams(DriverTimeSlotsPricingValidation.driverTimeSlotsPricingIdValidation),
  DriverTimeSlotsPricingController.getDriverTimeSlotsPricingById
);

// CREATE new driver time slots pricing
router.post(
  '/time-slots',
  validateBody(DriverTimeSlotsPricingValidation.createDriverTimeSlotsPricingValidation),
  DriverTimeSlotsPricingController.createDriverTimeSlotsPricing
);

// BULK CREATE driver time slots pricing
router.post(
  '/time-slots/bulk',
  validateBody(DriverTimeSlotsPricingValidation.bulkCreateDriverTimeSlotsPricingValidation),
  DriverTimeSlotsPricingController.bulkCreateDriverTimeSlotsPricing
);

// UPDATE driver time slots pricing
router.put(
  '/time-slots/:id',
  validateParams(DriverTimeSlotsPricingValidation.driverTimeSlotsPricingIdValidation),
  validateBody(DriverTimeSlotsPricingValidation.updateDriverTimeSlotsPricingValidation),
  DriverTimeSlotsPricingController.updateDriverTimeSlotsPricing
);

// DELETE driver time slots pricing
router.delete(
  '/time-slots/:id',
  validateParams(DriverTimeSlotsPricingValidation.driverTimeSlotsPricingIdValidation),
  DriverTimeSlotsPricingController.deleteDriverTimeSlotsPricing
);

export default router;
