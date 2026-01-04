import { Joi } from 'celebrate';

export const AdminUserValidation = {
  createAdminUserValidation: Joi.object().keys({
    first_name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 100 characters',
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 100 characters',
      'any.required': 'Last name is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    contact: Joi.alternatives()
      .try(
        Joi.string().email(),
        Joi.string().pattern(/^[0-9]{6,15}$/) // phone: 6–15 digits
      )
      .required()
      .messages({
        'alternatives.match': 'Contact must be a valid email or phone number.',
      }),
    alternate_contact: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Alternate contact must be a valid phone number',
      }),
  }),

  updateAdminUserValidation: Joi.object({
    first_name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 100 characters',
    }),
    last_name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 100 characters',
    }),
    contact: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Contact must be a valid phone number',
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
