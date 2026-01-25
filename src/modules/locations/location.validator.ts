import { Joi } from 'celebrate';

const paginationQueryValidation = Joi.object().keys({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().optional(),
});

export const LocationValidation = {
  paginationQueryValidation,

  countryIdValidation: Joi.object().keys({
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
  }),

  areaIdValidation: Joi.object().keys({
    area_id: Joi.string().uuid().required().messages({
      'string.guid': 'Area ID must be a valid UUID',
      'any.required': 'Area ID is required',
    }),
  }),

  stateIdValidation: Joi.object().keys({
    state_id: Joi.string().uuid().required().messages({
      'string.guid': 'State ID must be a valid UUID',
      'any.required': 'State ID is required',
    }),
  }),

  cityIdValidation: Joi.object().keys({
    city_id: Joi.string().uuid().required().messages({
      'string.guid': 'City ID must be a valid UUID',
      'any.required': 'City ID is required',
    }),
  }),

  statesQueryValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  citiesQueryValidation: Joi.object().keys({
    state_id: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  areasQueryValidation: Joi.object().keys({
    state_id: Joi.string().uuid().optional(),
    city_id: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  createCountryValidation: Joi.object().keys({
    country_code: Joi.string().required().messages({
      'any.required': 'Country code is required',
    }),
    country_name: Joi.string().required().messages({
      'any.required': 'Country name is required',
    }),
    country_flag: Joi.string().optional(),
  }),

  createStateValidation: Joi.object().keys({
    state_code: Joi.string().required().messages({
      'any.required': 'State code is required',
    }),
    state_name: Joi.string().required().messages({
      'any.required': 'State name is required',
    }),
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
  }),

  createCityValidation: Joi.object().keys({
    city_name: Joi.string().required().messages({
      'any.required': 'City name is required',
    }),
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
    state_id: Joi.string().uuid().optional(),
  }),

  createAreaValidation: Joi.object().keys({
    place: Joi.string().required().messages({
      'any.required': 'Area name is required',
    }),
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
    state_id: Joi.string().uuid().optional(),
    city_id: Joi.string().uuid().optional(),
    zipcode: Joi.string().optional(),
  }),
};
