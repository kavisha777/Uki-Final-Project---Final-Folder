// models/Package.js
import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  itemLimit: { type: Number, required: true },
  imageLimitPerItem: { type: Number, required: true },
  isFeatured: { type: Boolean, default: false },
  support: { type: String },

  features: { type: [String], default: [] }  // ✅ Add this line
}, { timestamps: true });

export default mongoose.model('Package', packageSchema);
