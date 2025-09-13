// src/routes/index.ts
import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import authRoutes from '../modules/auth/auth.routes';
import isAuthenticated from '../shared/authentication';
import locationRoutes from '../modules/locations/location.routes';
import hotspotRoutes from '../modules/hotspots/hotspot.routes';
import priceSettingsRoutes from '../modules/price-settings/price.routes';

const router = Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});
router.use('/auth', authRoutes);
router.use(isAuthenticated);
router.use('/locations', locationRoutes);
router.use('/hotspots', hotspotRoutes);
router.use('/price-settings', priceSettingsRoutes);
router.use('/users', userRoutes);

export default router;
