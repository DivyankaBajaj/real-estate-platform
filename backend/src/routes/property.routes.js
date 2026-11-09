import express from 'express';
import { getProperties, getPropertyById, createProperty, getMyProperties, deleteProperty } from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.get('/', getProperties);
router.get('/mine', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, upload, createProperty);

// ADD THIS LINE:
router.delete('/:id', protect, deleteProperty); 

export default router;