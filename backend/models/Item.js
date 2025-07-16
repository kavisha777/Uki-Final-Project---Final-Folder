import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  images: [{ type: String, required: true }], // you can add array later if you support multiple
  pricePerDay: { type: Number, required: true },
   
  depositeAmount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['shoes', 'furniture', 'jewels', 'clothing', 'other','cameras', 'audio', 'filming', 'photography', 'lighting'],
    required: true
  },
  available: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
