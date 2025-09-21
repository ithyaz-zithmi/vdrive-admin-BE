// src/modules/packages/package.routes.ts
import { Router } from 'express';
import PackageController from './package.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

// -------------------- READ ROUTES --------------------
router.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }),
  }),
  PackageController.getPackages
);

router.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  PackageController.getPackageById
);

// -------------------- WRITE ROUTES --------------------
router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      package_name: Joi.string().required(),
      duration_minutes: Joi.number().min(0).required(),
      distance_km: Joi.number().min(0).required(),
      extra_distance_km: Joi.number().min(0).required(),
      extra_minutes: Joi.number().min(0).required(),
    }),
  }),
  PackageController.createPackage
);

router.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object()
      .keys({
        package_name: Joi.string().optional(),
        duration_minutes: Joi.number().min(0).optional(),
        distance_km: Joi.number().min(0).optional(),
        extra_distance_km: Joi.number().min(0).optional(),
        extra_minutes: Joi.number().min(0).optional(),
      })
      .min(1), // At least one field must be provided for update
  }),
  PackageController.updatePackage
);

router.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  PackageController.deletePackage
);

export default router;
