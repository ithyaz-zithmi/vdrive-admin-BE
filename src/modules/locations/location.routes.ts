import { Router } from 'express';
import LocationController from './location.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/countries',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
    }),
  }),
  LocationController.getCountries
);

router.get(
  '/states/:country_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      country_id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
    }),
  }),
  LocationController.getStates
);

router.get(
  '/cities/:country_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      country_id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      state_id: Joi.string().uuid().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
    }),
  }),
  LocationController.getCities
);

router.get(
  '/areas/:country_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      country_id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      state_id: Joi.string().uuid().optional(),
      city_id: Joi.string().uuid().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
    }),
  }),
  LocationController.getAreas
);

router.get(
  '/full-location/:area_id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      area_id: Joi.string().uuid().required(),
    }),
  }),
  LocationController.getFullLocation
);

// -------------------- WRITE ROUTES --------------------
router.post(
  '/countries',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      country_code: Joi.string().required(),
      country_name: Joi.string().required(),
      country_flag: Joi.string().uri().optional(),
    }),
  }),
  LocationController.addCountry
);

router.post(
  '/states',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      state_code: Joi.string().required(),
      state_name: Joi.string().required(),
      country_id: Joi.string().uuid().required(),
    }),
  }),
  LocationController.addState
);

router.post(
  '/cities',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      city_name: Joi.string().required(),
      country_id: Joi.string().uuid().required(),
      state_id: Joi.string().uuid().optional(), // not required anymore
    }),
  }),
  LocationController.addCity
);

router.post(
  '/areas',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      area_name: Joi.string().required(),
      country_id: Joi.string().uuid().required(),
      state_id: Joi.string().uuid().optional(),
      city_id: Joi.string().uuid().optional(),
    }),
  }),
  LocationController.addArea
);

export default router;
