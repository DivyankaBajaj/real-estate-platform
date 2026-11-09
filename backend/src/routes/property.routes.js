import express from 'express';
import { getProperties, getPropertyById, createProperty, getMyProperties, deleteProperty } from '../controllers/propertyController.js';
import { aiSearch } from '../controllers/aiController.js'; // <-- Import AI
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/mine', protect, getMyProperties);
router.post('/ai-search', aiSearch); // <-- AI Search Route
router.get('/:id', getPropertyById);
router.post('/', protect, upload, createProperty);
router.delete('/:id', protect, deleteProperty);

export default router;