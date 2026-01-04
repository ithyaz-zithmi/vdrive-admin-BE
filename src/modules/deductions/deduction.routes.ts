import { Router } from 'express';
import { DeductionController } from './deduction.controller';
import isAuthenticated from '../../shared/authentication';

const router = Router();

// Apply authentication to all deduction routes
router.use(isAuthenticated);

// GET /api/deductions - Get all deductions
router.get('/', DeductionController.getAllDeductions);

// POST /api/deductions - Create a new deduction
router.post('/', DeductionController.createDeduction);

// GET /api/deductions/:id - Get a single deduction
router.get('/:id', DeductionController.getDeductionById);

// PATCH /api/deductions/:id - Update a deduction
router.patch('/:id', DeductionController.updateDeduction);

// DELETE /api/deductions/:id - Delete a deduction
router.delete('/:id', DeductionController.deleteDeduction);

// PATCH /api/deductions/status/:id - Toggle deduction status
router.patch('/status/:id', DeductionController.toggleDeductionStatus);

export default router;
