import { Joi } from 'celebrate';

export const RechargePlanValidation = {

  // 🔹 ID validation (params)
  idValidation: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be a positive number',
        'any.required': 'ID is required',
      }),
  }),

  // 🔹 CREATE validation
  createValidation: Joi.object({
    planName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.base': 'Plan name must be a string',
        'string.min': 'Plan name must have at least 2 characters',
        'string.max': 'Plan name must not exceed 100 characters',
        'any.required': 'Plan name is required',
      }),

    // ANY planType allowed (array)
    planType: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'Each plan type must be a string',
            'string.min': 'Plan type cannot be empty',
            'string.max': 'Plan type must not exceed 50 characters',
          })
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Plan type must be an array',
        'array.min': 'At least one plan type must be provided',
        'any.required': 'Plan type is required',
      }),

    description: Joi.string()
      .allow('', null)
      .max(500)
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 500 characters',
      }),

    rideLimit: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Ride limit must be a number',
        'number.integer': 'Ride limit must be an integer',
        'number.min': 'Ride limit must be at least 1',
        'any.required': 'Ride limit is required',
      }),

    validityDays: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Validity days must be a number',
        'number.integer': 'Validity days must be an integer',
        'number.min': 'Validity days must be at least 1',
        'any.required': 'Validity days is required',
      }),

    price: Joi.number()
      .positive()
      .required()
      .messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be greater than 0',
        'any.required': 'Price is required',
      }),

    isActive: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'isActive must be true or false',
      }),
  }),

  // 🔹 UPDATE validation (partial update allowed)
  updateValidation: Joi.object({
    planName: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.base': 'Plan name must be a string',
        'string.min': 'Plan name must have at least 2 characters',
        'string.max': 'Plan name must not exceed 100 characters',
      }),

    planType: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'Each plan type must be a string',
            'string.min': 'Plan type cannot be empty',
            'string.max': 'Plan type must not exceed 50 characters',
          })
      )
      .messages({
        'array.base': 'Plan type must be an array',
      }),

    description: Joi.string()
      .allow('', null)
      .max(500)
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 500 characters',
      }),

    rideLimit: Joi.number()
      .integer()
      .min(1)
      .messages({
        'number.base': 'Ride limit must be a number',
        'number.integer': 'Ride limit must be an integer',
        'number.min': 'Ride limit must be at least 1',
      }),

    validityDays: Joi.number()
      .integer()
      .min(1)
      .messages({
        'number.base': 'Validity days must be a number',
        'number.integer': 'Validity days must be an integer',
        'number.min': 'Validity days must be at least 1',
      }),

    price: Joi.number()
      .positive()
      .messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be greater than 0',
      }),

    isActive: Joi.boolean()
      .messages({
        'boolean.base': 'isActive must be true or false',
      }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided to update recharge plan',
    }),

  // 🔹 STATUS validation (optional separate API)
  statusValidation: Joi.object({
    isActive: Joi.boolean()
      .required()
      .messages({
        'boolean.base': 'isActive must be true or false',
        'any.required': 'isActive is required',
      }),
  }),
};
