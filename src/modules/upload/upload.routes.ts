import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from './upload.controller';

const router = Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), uploadFile);

export default router;
