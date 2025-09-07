// src/routes/index.ts
import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
})
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
