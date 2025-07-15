import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }, // optional
  rent: { type: mongoose.Schema.Types.ObjectId, ref: 'Rent' },       // add this
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
