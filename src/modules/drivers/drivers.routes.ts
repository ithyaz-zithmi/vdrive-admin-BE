import { Router } from 'express';
import { DriverController } from './drivers.controller';
import isAuthenticated from '../../shared/authentication';

const router = Router();

// Apply authentication to all routes
router.use(isAuthenticated);

router.post('/', DriverController.addDriver);

router.get('/', DriverController.getDrivers);

router.get('/:id', DriverController.getDriver);

router.put('/:id', DriverController.updateDriver);

export default router;
