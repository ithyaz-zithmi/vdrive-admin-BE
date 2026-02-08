import { Joi } from 'celebrate';

export const AdminUserValidation = {
  createAdminUserValidation: Joi.object().keys({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    alternate_contact: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Alternate contact must be a valid phone number',
      }),
  }),

  updateAdminUserValidation: Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Email must be a valid email address',
    }),
    alternate_contact: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Alternate contact must be a valid phone number',
      }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided to update admin user',
    }),

  idValidation: Joi.object().keys({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required',
    }),
  }),
};
