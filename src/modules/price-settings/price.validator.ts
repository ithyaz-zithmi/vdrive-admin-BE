import { Joi } from 'celebrate';

const locationSchema = Joi.object().keys({
  country: Joi.string().required(),
  state: Joi.string().allow('', null).optional(),
  district: Joi.string().allow('', null).optional(),
  area: Joi.string().allow('', null).optional(),
  pincode: Joi.string().length(6).pattern(/^\d+$/).allow('', null).optional(),
  global_price: Joi.number().precision(2).min(0).allow(null).optional(),
});

const hotspotDetailsSchema = Joi.object().keys({
  isHotspot: Joi.boolean().required(),
  hotspotId: Joi.string()
    .when('isHotspot', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow('', null),
    })
    .optional(),
  hotspotName: Joi.string().allow('', null).optional(),
  fare: Joi.number().precision(2).min(0).allow(null).optional(),
});

const timingSchema = Joi.object().keys({
  day: Joi.string()
    .valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
    .required(),
  from: Joi.object()
    .keys({
      time: Joi.number().integer().min(1).max(12).required(),
      type: Joi.string().valid('AM', 'PM').required(),
    })
    .required(),
  to: Joi.object()
    .keys({
      time: Joi.number().integer().min(1).max(12).required(),
      type: Joi.string().valid('AM', 'PM').required(),
    })
    .required(),
  rate: Joi.number().precision(2).greater(0).required(),
});

const rateDetailsSchema = Joi.object().keys({
  driverType: Joi.string().valid('normal', 'premium', 'elite').required(),
  cancellationFee: Joi.number().precision(2).min(0).required(),
  waitingFee: Joi.object()
    .keys({
      perMinutes: Joi.number().integer().min(1).required(),
      fee: Joi.number().precision(2).greater(0).required(),
    })
    .required(),
  timing: Joi.array().min(1).items(timingSchema).required(),
});

export const PriceValidation = {
  getPriceSettingsValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  locationIdValidation: Joi.object().keys({
    location_id: Joi.string().uuid().required().messages({
      'string.guid': 'Location ID must be a valid UUID',
      'any.required': 'Location ID is required',
    }),
  }),

  createPriceSettingValidation: Joi.object().keys({
    location: locationSchema.required(),
    hotspotDetails: hotspotDetailsSchema.required(),
    rateDetails: Joi.array().min(1).items(rateDetailsSchema).required(),
  }),

  createBulkPriceSettingsValidation: Joi.array()
    .min(1)
    .max(50)
    .items(
      Joi.object().keys({
        location: locationSchema.required(),
        hotspotDetails: hotspotDetailsSchema.required(),
        rateDetails: Joi.array().min(1).items(rateDetailsSchema).required(),
      })
    ),

  updatePriceSettingValidation: Joi.object()
    .keys({
      location: locationSchema.optional(),
      hotspotDetails: hotspotDetailsSchema.optional(),
      rateDetails: Joi.array().min(1).items(rateDetailsSchema).optional(),
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided to update price setting',
    }),
};
