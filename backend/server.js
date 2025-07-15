// // import dotenv from 'dotenv';
// // dotenv.config();
// // import express from 'express';
// // import connectDB from './config/db.js';
// // import authRoutes from './routes/authRoutes.js';
// // import adminRoutes from './routes/adminRoutes.js';
// // import userRoutes from './routes/userRoutes.js';
// // import itemRoutes from './routes/itemRoutes.js';
// // import rentRoutes from './routes/rentRoutes.js';
// // import payment from './routes/paymentRoutes.js';



// // // import paymentRoutes from './routes/paymentRoutes.js';
// // import packageRoutes from './routes/packageRoutes.js';
// // import cors from 'cors';


// // const app = express();



// // app.use(express.json());
// // app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


// // // In routes or root file like app.js
// // app.get('/api/test', (req, res) => {
// //     res.json({ message: "Backend working!" });
// //   });
  

// // // Connect to DB
// // connectDB();

// // // Routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/admin', adminRoutes);
// // app.use('/api/user', userRoutes);
// // app.use('/api/items', itemRoutes);
// // app.use('/api/rent', rentRoutes);
// // app.use('/uploads', express.static('uploads'));
// // app.use('/api/payment', payment)


// // // app.use('/api/payment', paymentRoutes);
// // app.use('/api/packages', packageRoutes);

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // // console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
// // // console.log('API key:', process.env.CLOUDINARY_API_KEY);
// // // console.log('Secret:', process.env.CLOUDINARY_API_SECRET);





// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import connectDB from './config/db.js';

// import authRoutes from './routes/authRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import itemRoutes from './routes/itemRoutes.js';
// import rentRoutes from './routes/rentRoutes.js';
// import payment from './routes/paymentRoutes.js';
// import packageRoutes from './routes/packageRoutes.js';
// import { stripeWebhook } from './controllers/paymentController.js';




// const app = express();
// app.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   stripeWebhook
// );


// app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));



// // ✅ Test endpoint
// app.get('/api/test', (req, res) => {
//   res.json({ message: "Backend working!" });
// });

// // ✅ Connect to MongoDB
// connectDB();

// // ✅ All routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/rent', rentRoutes);
// app.use('/api/packages', packageRoutes);
// app.use('/uploads', express.static('uploads'));

// // ✅ Important: payment route includes webhook (raw handled above)
// app.use('/api/payment', payment);

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import rentRoutes from './routes/rentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import packageRoutes from './routes/packageRoutes.js';

import { stripeWebhook } from './controllers/paymentController.js';

const app = express();

// 🧠 Stripe Webhook – must come before express.json()!
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// 🔐 General middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// 🧪 Health check endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working!' });
});

// 🔌 Connect to MongoDB
connectDB();

// 📦 Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/rent', rentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payment', paymentRoutes);

// 🖼 Serve uploads folder
app.use('/uploads', express.static('uploads'));

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
