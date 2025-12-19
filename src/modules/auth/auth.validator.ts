import { Joi } from 'celebrate';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,18}$/;

export const AuthValidation = {
  signInValidation: Joi.object().keys({
    user_name: Joi.alternatives()
      .try(
        Joi.string().email(),
        Joi.string().pattern(/^[0-9]{6,15}$/) // phone: 6–15 digits
      )
      .required()
      .messages({
        'alternatives.match': 'Contact must be a valid email or phone number.',
      }),
    password: Joi.string().required().min(5).max(18).pattern(passwordRegex).messages({
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
    }),
  }),

  forgotPasswordValidation: Joi.object().keys({
    user_name: Joi.alternatives()
      .try(
        Joi.string().email(),
        Joi.string().pattern(/^[0-9]{6,15}$/) // phone: 6–15 digits
      )
      .required()
      .messages({
        'alternatives.match': 'Contact must be a valid email or phone number.',
      }),
  }),

  resetPasswordValidation: Joi.object().keys({
    reset_token: Joi.string().required().messages({
      'any.required': 'Reset token is required',
    }),
    new_password: Joi.string().required().min(5).max(18).pattern(passwordRegex).messages({
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
    }),
  }),
};
