import { Joi } from 'celebrate';

export const PackageValidation = {
  getPackagesValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),

  packageIdValidation: Joi.object().keys({
    id: Joi.string().required().messages({
      'any.required': 'Package ID is required',
    }),
  }),

  createPackageValidation: Joi.object().keys({
    package_name: Joi.string().required().messages({
      'any.required': 'Package name is required',
    }),
    duration_minutes: Joi.number().min(0).required().messages({
      'number.min': 'Duration minutes must be greater than or equal to 0',
      'any.required': 'Duration minutes is required',
    }),
    distance_km: Joi.number().min(0).required().messages({
      'number.min': 'Distance km must be greater than or equal to 0',
      'any.required': 'Distance km is required',
    }),
    extra_distance_km: Joi.number().min(0).required().messages({
      'number.min': 'Extra distance km must be greater than or equal to 0',
      'any.required': 'Extra distance km is required',
    }),
    extra_minutes: Joi.number().min(0).required().messages({
      'number.min': 'Extra minutes must be greater than or equal to 0',
      'any.required': 'Extra minutes is required',
    }),
  }),

  updatePackageValidation: Joi.object()
    .keys({
      package_name: Joi.string().optional(),
      duration_minutes: Joi.number().min(0).optional().messages({
        'number.min': 'Duration minutes must be greater than or equal to 0',
      }),
      distance_km: Joi.number().min(0).optional().messages({
        'number.min': 'Distance km must be greater than or equal to 0',
      }),
      extra_distance_km: Joi.number().min(0).optional().messages({
        'number.min': 'Extra distance km must be greater than or equal to 0',
      }),
      extra_minutes: Joi.number().min(0).optional().messages({
        'number.min': 'Extra minutes must be greater than or equal to 0',
      }),
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided to update package',
    }),
};
