// src/routes/index.ts
import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import authRoutes from '../modules/auth/auth.routes';
import isAuthenticated from '../shared/authentication';
import locationRoutes from '../modules/locations/location.routes';
import hotspotRoutes from '../modules/hotspots/hotspot.routes';
import priceSettingsRoutes from '../modules/price-settings/price.routes';
import packageRoutes from '../modules/packages/package.routes';
import uploadRoutes from '../modules/upload/upload.routes';
import driverRoutes from '../modules/drivers/driver.routes';

const router = Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});
router.use('/auth', authRoutes);
router.use(isAuthenticated);
router.use('/locations', locationRoutes);
router.use('/hotspots', hotspotRoutes);
router.use('/price-settings', priceSettingsRoutes);
router.use('/packages', packageRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/drivers', driverRoutes);
router.use('/', driverRoutes);

export default router;
