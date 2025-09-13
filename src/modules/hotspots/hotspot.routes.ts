import { Router } from 'express';
import HotspotController from './hotspot.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
    }),
  }),
  HotspotController.getHotspots
);

router.get(
  '/:hotspot_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      hotspot_id: Joi.string().required(),
    }),
  }),
  HotspotController.getHotspotById
);

// -------------------- WRITE ROUTES --------------------
router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.string().required(),
      hotspot_name: Joi.string().required(),
      fare: Joi.number().precision(2).min(0).required(),
      multiplier: Joi.number().precision(2).greater(0).required(),
    }),
  }),
  HotspotController.addHotspot
);

router.put(
  '/:hotspot_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      hotspot_id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object()
      .keys({
        hotspot_name: Joi.string().optional(),
        fare: Joi.number().precision(2).min(0).optional(),
        multiplier: Joi.number().precision(2).greater(0).optional(),
      })
      .min(1), // At least one field must be provided for update
  }),
  HotspotController.updateHotspot
);

router.delete(
  '/:hotspot_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      hotspot_id: Joi.string().required(),
    }),
  }),
  HotspotController.deleteHotspot
);

export default router;
