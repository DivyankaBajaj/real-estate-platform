import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({ 
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'https://real-estate-platform-five.vercel.app'], // We will update this later
  credentials: true 
}));
app.use(express.json());

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/appointments', appointmentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

export default app;