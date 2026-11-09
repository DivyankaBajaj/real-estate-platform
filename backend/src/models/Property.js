import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['apartment', 'villa', 'plot', 'office'], required: true },
  bhk: { type: Number, required: true },
  area: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
  },
  images: [{ url: String, fileId: String }],
  status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);