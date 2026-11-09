import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  message: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);