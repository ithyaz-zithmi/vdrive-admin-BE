import { Joi } from 'celebrate';

export const PricingFareRulesValidation = {
  // Get all pricing fare rules with pagination
  getPricingFareRulesValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
    city_id: Joi.string().uuid().optional(),
    district_id: Joi.string().uuid().optional(),
    is_hotspot: Joi.boolean().optional(),
    include_time_slots: Joi.boolean().optional(),
  }),

  // Get single pricing fare rule by ID
  pricingFareRuleIdValidation: Joi.object().keys({
    id: Joi.string().uuid().required().messages({
      'any.required': 'Pricing fare rule ID is required',
      'string.guid': 'Invalid ID format',
    }),
  }),

  // Create pricing fare rule with conditional validation
  createPricingFareRuleValidation: Joi.object()
    .keys({
      district_id: Joi.string().uuid().required().messages({
        'string.guid': 'Invalid district ID format',
        'any.required': 'District ID is required',
      }),
      city_id: Joi.string().uuid().optional().allow(null).messages({
        'string.guid': 'Invalid city ID format',
      }),
      global_price: Joi.number().precision(2).min(0).required().messages({
        'number.min': 'Global price must be greater than or equal to 0',
        'any.required': 'Global price is required',
      }),
      is_hotspot: Joi.boolean().default(false),
      hotspot_id: Joi.string().uuid().optional().allow(null).messages({
        'string.guid': 'Invalid hotspot ID format',
      }),
      multiplier: Joi.number().precision(1).greater(0).optional().allow(null).messages({
        'number.greater': 'Multiplier must be greater than 0',
      }),
    })
    .custom((value, helpers) => {
      // If is_hotspot is true, hotspot_id and multiplier are required
      if (value.is_hotspot === true) {
        if (!value.hotspot_id) {
          return helpers.error('any.custom', {
            message: 'Hotspot ID is required when is_hotspot is true',
          });
        }
        if (!value.multiplier) {
          return helpers.error('any.custom', {
            message: 'Multiplier is required when is_hotspot is true',
          });
        }
      }
      return value;
    }),

  // Update pricing fare rule
  updatePricingFareRuleValidation: Joi.object()
    .keys({
      district_id: Joi.string().uuid().optional().allow(null).messages({
        'string.guid': 'Invalid district ID format',
      }),
      city_id: Joi.string().uuid().optional().allow(null).messages({
        'string.guid': 'Invalid city ID format',
      }),
      global_price: Joi.number().precision(2).min(0).optional().messages({
        'number.min': 'Global price must be greater than or equal to 0',
      }),
      is_hotspot: Joi.boolean().optional(),
      hotspot_id: Joi.string().uuid().optional().allow(null).messages({
        'string.guid': 'Invalid hotspot ID format',
      }),
      multiplier: Joi.number().precision(1).greater(0).optional().allow(null).messages({
        'number.greater': 'Multiplier must be greater than 0',
      }),
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided to update pricing fare rule',
    })
    .custom((value, helpers) => {
      // If is_hotspot is being set to true, validate hotspot_id and multiplier
      if (value.is_hotspot === true) {
        if (!value.hotspot_id) {
          return helpers.error('any.custom', {
            message: 'Hotspot ID is required when is_hotspot is true',
          });
        }
        if (!value.multiplier) {
          return helpers.error('any.custom', {
            message: 'Multiplier is required when is_hotspot is true',
          });
        }
      }
      return value;
    }),
};
