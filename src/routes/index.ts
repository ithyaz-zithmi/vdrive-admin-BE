

import { Router } from 'express';
import userRoutes from '../modules/admin-users/adminUser.routes';
import userManagementRoutes from '../modules/user-management/userManagement.routes';
import authRoutes from '../modules/auth/auth.routes';
import isAuthenticated from '../shared/authentication';
import locationRoutes from '../modules/locations/location.routes';
import hotspotRoutes from '../modules/hotspots/hotspot.routes';
import priceSettingsRoutes from '../modules/price-settings/price.routes';
import packageRoutes from '../modules/packages/package.routes';
import s3Routes from '../modules/s3/s3.routes';
import driverReconciliationRoutes from '../modules/driver-reconciliation/driverReconciliation.routes';
import rechargePlanRoutes from '../modules/rechargePlan/rechargePlan.routes';

const router = Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});
router.use('/auth', authRoutes);

// router.use(isAuthenticated);

router.use('/locations', locationRoutes);
router.use('/hotspots', hotspotRoutes);
router.use('/price-settings', priceSettingsRoutes);
router.use('/packages', packageRoutes);
router.use('/admin-users', userRoutes);
router.use('/users', userManagementRoutes);
router.use('/generate-presigned-url', s3Routes);
router.use('/driver-reconciliation', driverReconciliationRoutes);
router.use('/recharge-plans', rechargePlanRoutes); 

export default router;
