import { Joi } from 'celebrate';

export const HotspotValidation = {
  getHotspotsValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  hotspotIdValidation: Joi.object().keys({
    hotspot_id: Joi.string().required().messages({
      'any.required': 'Hotspot ID is required',
    }),
  }),

  createHotspotValidation: Joi.object().keys({
    id: Joi.string().required().messages({
      'any.required': 'ID is required',
    }),
    hotspot_name: Joi.string().required().messages({
      'any.required': 'Hotspot name is required',
    }),
    fare: Joi.number().precision(2).min(0).required().messages({
      'number.min': 'Fare must be greater than or equal to 0',
      'any.required': 'Fare is required',
    }),
    multiplier: Joi.number().precision(2).greater(0).required().messages({
      'number.greater': 'Multiplier must be greater than 0',
      'any.required': 'Multiplier is required',
    }),
  }),

  updateHotspotValidation: Joi.object()
    .keys({
      hotspot_name: Joi.string().optional(),
      fare: Joi.number().precision(2).min(0).optional().messages({
        'number.min': 'Fare must be greater than or equal to 0',
      }),
      multiplier: Joi.number().precision(2).greater(0).optional().messages({
        'number.greater': 'Multiplier must be greater than 0',
      }),
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided to update hotspot',
    }),
};
