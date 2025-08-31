import { Router } from 'express';
import { RideMatchingController } from './ridematching.controller';

const router = Router();

router.post('/match', RideMatchingController.match);

export default router;
