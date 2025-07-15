// seedPackages.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Package from './models/Package.js';

dotenv.config();

const packages = [
  {
    name: "Basic",
    price: 500,
    duration: 30,
    itemLimit: 5,
    imageLimitPerItem: 1,
    isFeatured: false,
    support: "Email support only"
  },
  {
    name: "Standard",
    price: 1000,
    duration: 30,
    itemLimit: 15,
    imageLimitPerItem: 3,
    isFeatured: true,
    support: "Email + Chat support"
  },
  {
    name: "Premium",
    price: 2000,
    duration: 30,
    itemLimit: 30,
    imageLimitPerItem: 5,
    isFeatured: true,
    support: "Priority Support"
  }
];

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📦 Connected to MongoDB");

    await Package.deleteMany(); 
    await Package.insertMany(packages);
    console.log("✅ Packages seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding packages:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
};

seedPackages();
