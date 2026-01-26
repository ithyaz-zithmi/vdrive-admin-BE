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

  districtIdValidation: Joi.object().keys({
    district_id: Joi.string().uuid().required().messages({
      'string.guid': 'District ID must be a valid UUID',
      'any.required': 'District ID is required',
    }),
  }),

  statesQueryValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  districtsQueryValidation: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  areasQueryValidation: Joi.object().keys({
    state_id: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
  }),

  createCountryValidation: Joi.object().keys({
    code: Joi.string().required().messages({
      'any.required': 'Country code is required',
    }),
    name: Joi.string().required().messages({
      'any.required': 'Country name is required',
    }),
    flag: Joi.string().optional(),
  }),

  createStateValidation: Joi.object().keys({
    code: Joi.string().required().messages({
      'any.required': 'State code is required',
    }),
    name: Joi.string().required().messages({
      'any.required': 'State name is required',
    }),
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
  }),

  createDistrictValidation: Joi.object().keys({
    name: Joi.string().required().messages({
      'any.required': 'District name is required',
    }),
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
    state_id: Joi.string().uuid().required().messages({
      'string.guid': 'State ID must be a valid UUID',
      'any.required': 'State ID is required',
    }),
  }),

  createAreaValidation: Joi.object().keys({
    name: Joi.string().required().messages({
      'any.required': 'Area name is required',
    }),
    country_id: Joi.string().uuid().required().messages({
      'string.guid': 'Country ID must be a valid UUID',
      'any.required': 'Country ID is required',
    }),
    state_id: Joi.string().uuid().required().messages({
      'any.required': 'State ID is required',
    }),
    district_id: Joi.string().uuid().required().messages({
      'any.required': 'District ID is required',
    }),
    pincode: Joi.string().required().messages({
      'any.required': 'Pincode is required',
    }),
  }),

  updateCountryValidation: Joi.object().keys({
    code: Joi.string(),
    name: Joi.string(),
    flag: Joi.string().optional().allow(null),
  }),

  updateStateValidation: Joi.object().keys({
    code: Joi.string(),
    name: Joi.string(),
    country_id: Joi.string().uuid(),
  }),

  updateDistrictValidation: Joi.object().keys({
    name: Joi.string(),
    state_id: Joi.string().uuid(),
    country_id: Joi.string().uuid(),
  }),

  updateAreaValidation: Joi.object().keys({
    name: Joi.string(),
    district_id: Joi.string().uuid(),
    state_id: Joi.string().uuid(),
    country_id: Joi.string().uuid(),
    pincode: Joi.string(),
  }),
};
