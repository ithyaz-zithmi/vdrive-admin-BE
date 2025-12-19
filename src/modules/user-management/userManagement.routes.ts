import { Router } from 'express';
import { UserManagementController } from './userManagement.controller';
import isAuthenticated from '../../shared/authentication';

const router = Router();

// Apply admin authentication to all routes
router.use(isAuthenticated);

// User management routes that proxy to user driver service
// Validation is handled by the user driver API
router.get('/customers', UserManagementController.getCustomers);

router.get('/drivers', UserManagementController.getDrivers);

router.get('/:id', UserManagementController.getUserById);

router.post('/create', UserManagementController.createUser);

router.patch('/update/:id', UserManagementController.updateUser);

router.patch('/block/:id', UserManagementController.blockUser);

router.patch('/unblock/:id', UserManagementController.unblockUser);

router.patch('/disable/:id', UserManagementController.disableUser);

router.delete('/delete/:id', UserManagementController.deleteUser);

export default router;
