// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { celebrate, Joi, Segments } from 'celebrate';
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,18}$/;

const router = Router();

router.post(
  '/admin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(3).max(30),
      password: Joi.string().required().min(5).max(18).pattern(passwordRegex).messages({
        'string.pattern.base':
          'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
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
      alternateContact: Joi.string()
        .pattern(/^[0-9]{6,15}$/) // phone only
        .allow('') // can be empty
        .messages({
          'string.pattern.base': 'Alternate contact must be a valid phone number.',
        }),
    }),
  }),
  AuthController.createAdmin
);
router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userName: Joi.alternatives()
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
  }),
  AuthController.signIn
);
router.post(
  '/forgot-password',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userName: Joi.alternatives()
        .try(
          Joi.string().email(),
          Joi.string().pattern(/^[0-9]{6,15}$/) // phone: 6–15 digits
        )
        .required()
        .messages({
          'alternatives.match': 'Contact must be a valid email or phone number.',
        }),
    }),
  }),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      resetToken: Joi.string().required(),
      newPassword: Joi.string().required().min(5).max(18).pattern(passwordRegex).messages({
        'string.pattern.base':
          'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
      }),
    }),
  }),
  AuthController.resetPassword
);

export default router;
