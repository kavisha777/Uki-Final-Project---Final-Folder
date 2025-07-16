import mongoose from 'mongoose';

const rentSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
    // ... existing fields
  
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'in-use', 'returned', 'completed', 'rejected', 'confirmed'],
      default: 'pending'
    },
  
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],   // customize as needed
      default: 'pending'
    },
  
    advancePaid: { type: Number, default: 0 },
    confirmPickupByUser: { type: Boolean, default: false },
    confirmPickupBySeller: { type: Boolean, default: false },
  
    paymentDetails: {
      transactionId: { type: String },
      method: { type: String },
      amount: { type: Number },
      paidAt: { type: Date }
    }
  }, { timestamps: true })
  

export default mongoose.model('Rent', rentSchema);



