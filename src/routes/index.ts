// src/routes/index.ts
import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import RideMatchRoutes from "./../modules/ridematching/ridematching.routes"

const router = Router();

router.use('/users', userRoutes);
router.use('match', RideMatchRoutes)

export default router;