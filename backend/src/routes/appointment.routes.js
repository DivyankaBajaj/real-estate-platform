import express from 'express';
import { bookGuest, bookAuth, getMyAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/guest', bookGuest);
router.post('/', protect, bookAuth);
router.get('/mine', protect, getMyAppointments);

export default router;