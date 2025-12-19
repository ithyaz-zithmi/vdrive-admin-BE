import { Router } from 'express';
import HotspotController from './hotspot.controller';
import { HotspotValidation } from './hotspot.validator';
import { validateBody, validateParams, validateQuery } from '../../utilities/helper';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/',
  validateQuery(HotspotValidation.getHotspotsValidation),
  HotspotController.getHotspots
);

router.get(
  '/:hotspot_id',
  validateParams(HotspotValidation.hotspotIdValidation),
  HotspotController.getHotspotById
);

// -------------------- WRITE ROUTES --------------------
router.post(
  '/',
  validateBody(HotspotValidation.createHotspotValidation),
  HotspotController.addHotspot
);

router.put(
  '/:hotspot_id',
  validateParams(HotspotValidation.hotspotIdValidation),
  validateBody(HotspotValidation.updateHotspotValidation),
  HotspotController.updateHotspot
);

router.delete(
  '/:hotspot_id',
  validateParams(HotspotValidation.hotspotIdValidation),
  HotspotController.deleteHotspot
);

export default router;
