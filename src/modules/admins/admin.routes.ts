import { Router } from 'express';
import { AdminController } from './admin.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,18}$/;

// Create Admin Schema
const createAdminSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    fullName: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address.',
    }),
    phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
      'string.pattern.base': 'Phone number must be valid (7-15 digits)',
    }),
    alternativePhone: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'Alternative phone number must be valid.',
      }),
    role: Joi.string().valid('admin').default('admin'), // Though we enforce it in backend
    status: Joi.string().valid('active', 'inactive').default('active'),
    password: Joi.string().required().min(5).max(18).pattern(passwordRegex).messages({
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
    }),
  }),
});

// Update Admin Schema
const updateAdminSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    fullName: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).optional(),
    alternativePhone: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .allow('')
      .optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    password: Joi.string().min(5).max(18).pattern(passwordRegex).optional().messages({
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
    }),
    // User cannot update role via this endpoint presumably, or restrict to admin
  }),
});

router.get('/', AdminController.getAdmins);
router.get('/:id', AdminController.getAdminById);
router.post('/', createAdminSchema, AdminController.createAdmin);
router.put('/:id', updateAdminSchema, AdminController.updateAdmin);
router.delete('/:id', AdminController.deleteAdmin);

export default router;
