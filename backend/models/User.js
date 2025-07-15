import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: String,
  address: String,
  town: String,
  idProof: String,        // Cloudinary URL
  profilePic: String,     // Cloudinary URL
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,

  // 🆕 Add these for seller info
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  sellerSince: Date,
  sellerProfile: {
    maxListings: { type: Number, default: 0 },
    expiryDate: Date
  }

}, { timestamps: true });


export default mongoose.model('User', userSchema);
