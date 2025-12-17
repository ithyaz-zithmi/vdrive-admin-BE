// src/modules/users/user.routes.ts
import { Router } from 'express';
import { AdminUserController } from './adminUser.controller';
import { AdminUserValidation } from './adminUser.validator';
import { validateBody, validateParams } from '../../utilities/helper';

const router = Router();

router.get('/', AdminUserController.getAdminUsers);

router.get(
  '/:id',
  validateParams(AdminUserValidation.idValidation),
  AdminUserController.getAdminUserById
);

router.post(
  '/',
  validateBody(AdminUserValidation.createAdminUserValidation),
  AdminUserController.createAdminUser
);

router.put(
  '/:id',
  validateParams(AdminUserValidation.idValidation),
  validateBody(AdminUserValidation.updateAdminUserValidation),
  AdminUserController.updateAdminUser
);

router.delete(
  '/:id',
  validateParams(AdminUserValidation.idValidation),
  AdminUserController.deleteAdminUser
);

export default router;
