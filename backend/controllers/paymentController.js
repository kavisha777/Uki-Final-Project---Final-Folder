
// import Rent from '../models/Rent.js'; 
// import User from '../models/User.js';
// import Package from '../models/Package.js';
// import Payment from '../models/Payment.js';
// import stripe from '../config/stripe.js';
// import dotenv from 'dotenv';
// dotenv.config();

// // ➤ 1. Create Stripe session for Seller Package
// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { packageId } = req.body;
//     const userId = req.user._id;

//     const packageData = await Package.findById(packageId);
//     if (!packageData) return res.status(404).json({ message: 'Package not found' });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: packageData.name,
//             description: `Duration: ${packageData.duration} days, Limit: ${packageData.itemLimit} items`,
//           },
//           unit_amount: packageData.price * 100,
//         },
//         quantity: 1,
//       }],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/seller-success?session_id={CHECKOUT_SESSION_ID}`,

//       cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
//       metadata: {
//         userId: userId.toString(),
//         packageId: packageId.toString()
//       }
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create payment session' });
//   }
// };

// // ➤ 2. Create Stripe session for Rent Payment
// export const createRentCheckoutSession = async (req, res) => {
//   try {
//     const { rentId } = req.body;
//     const userId = req.user._id;

//     const rent = await Rent.findById(rentId).populate('item');
//     if (!rent) return res.status(404).json({ message: 'Rent not found' });

//     const item = rent.item;

//     const numDays = Math.ceil(
//       (new Date(rent.endDate) - new Date(rent.startDate)) / (1000 * 60 * 60 * 24)
//     );
//     const totalAmount = item.pricePerDay * numDays;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: item.name,
//             description: `Rental for ${numDays} days`
//           },
//           unit_amount: totalAmount * 100,
//         },
//         quantity: 1,
//       }],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/user-dashboard?payment=success`,
//       cancel_url: `${process.env.CLIENT_URL}/rent-payment-cancel`,
//       metadata: {
//         userId: userId.toString(),
//         rentId: rentId.toString()
//       }
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error('❌ Failed to create rent session:', error.message);
//     await Payment.create({
//       user: userId,
//       rent: rentId,
//       amount: totalAmount,
//       status: 'pending'
//     });
//     res.status(500).json({ message: 'Failed to create rent payment session' });
//   }
// };

// // ➤ 3. Stripe Webhook (Handles completed payments ONLY)
// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.log('❌ Webhook signature verification failed.', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   console.log("🔔 Stripe webhook triggered:", event.type);

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     console.log("✅ Checkout session completed with metadata:", session.metadata);

//     const userId = session.metadata?.userId;
//     const packageId = session.metadata?.packageId;
//     const rentId = session.metadata?.rentId;
//     const amount = session.amount_total / 100;

//     try {
//       // ➤ Handle Package Payment
//       if (packageId) {
//         let payment = await Payment.findOne({ user: userId, package: packageId });

//         if (!payment) {
//           payment = new Payment({ user: userId, package: packageId, amount });
//         }

//         payment.status = 'completed';
//         await payment.save();
//         console.log("✅ Package payment marked as completed.");
//       }

//       // ➤ Handle Rent Payment
//       if (rentId) {
//         let payment = await Payment.findOne({ user: userId, rent: rentId });

//         if (!payment) {
//           payment = new Payment({ user: userId, rent: rentId, amount });
//         }

//         payment.status = 'completed';
//         await payment.save();
//         console.log("✅ Rent payment status updated to confirmed for:", rentId);

//         const rent = await Rent.findById(rentId);
//         if (rent && rent.status === 'approved') {
//           rent.status = 'confirmed';
//           rent.paymentStatus = 'completed';
//           rent.paid = true;                // <-- Add this line
//           rent.paymentDetails = session;
//           await rent.save();
//           console.log("✅ Rent status updated to confirmed.");
//         } else {
//           console.log("ℹ️ Rent not found or not in 'approved' state.");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error updating payment/rent status:", err.message);
//     }
//   }

//   res.status(200).json({ received: true });
// };


import Rent from '../models/Rent.js'; 
import User from '../models/User.js';
import Package from '../models/Package.js';
import Payment from '../models/Payment.js';
import stripe from '../config/stripe.js';
import dotenv from 'dotenv';
dotenv.config();

// ➤ 1. Create Stripe session for Seller Package
export const createCheckoutSession = async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user._id;

    const packageData = await Package.findById(packageId);
    if (!packageData) return res.status(404).json({ message: 'Package not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageData.name,
            description: `Duration: ${packageData.duration} days, Limit: ${packageData.itemLimit} items`,
          },
          unit_amount: packageData.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/seller-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId: userId.toString(),
        packageId: packageId.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
};

// ➤ 2. Create Stripe session for Rent Payment
export const createRentCheckoutSession = async (req, res) => {
  try {
    const { rentId } = req.body;
    const userId = req.user._id;

    const rent = await Rent.findById(rentId).populate('item');
    if (!rent) return res.status(404).json({ message: 'Rent not found' });

    const item = rent.item;

    const numDays = Math.ceil(
      (new Date(rent.endDate) - new Date(rent.startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = item.pricePerDay * numDays;

    await Payment.create({
      user: userId,
      rent: rentId,
      amount: totalAmount,
      status: 'pending'
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `Rental for ${numDays} days`
          },
          unit_amount: totalAmount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/user-dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/rent-payment-cancel`,
      metadata: {
        userId: userId.toString(),
        rentId: rentId.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Failed to create rent session:', error.message);
    
    res.status(500).json({ message: 'Failed to create rent payment session' });
  }
};



// ➤ 3. Stripe Webhook (Handles completed payments ONLY)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔔 Stripe webhook triggered:", event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log("✅ Checkout session completed with metadata:", session.metadata);

    const userId = session.metadata?.userId;
    const packageId = session.metadata?.packageId;
    const rentId = session.metadata?.rentId;
    const amount = session.amount_total / 100;

    try {
      // ➤ Handle Package Payment
      // ➤ Handle Package Payment
if (packageId) {
  let payment = await Payment.findOne({ user: userId, package: packageId });

  if (!payment) {
    payment = new Payment({ user: userId, package: packageId, amount });
  }

  payment.status = 'completed';
  await payment.save();
  console.log("✅ Package payment marked as completed.");

  // ⬇️ Promote user to seller here
  const user = await User.findById(userId);
  const selectedPackage = await Package.findById(packageId);

  if (user && selectedPackage) {
    const expiryDate = new Date(Date.now() + selectedPackage.duration * 24 * 60 * 60 * 1000);

    user.role = "seller";
    user.package = packageId;
    user.sellerSince = new Date();
    user.sellerProfile = {
      maxListings: selectedPackage.itemLimit,
      expiryDate: expiryDate
    };

    await user.save();
    console.log("🎉 User promoted to seller successfully!");
  } else {
    console.log("⚠️ User or package not found while promoting to seller.");
  }
}

if (rentId) {
          let payment = await Payment.findOne({ user: userId, rent: rentId });
  
          if (!payment) {
            payment = new Payment({ user: userId, rent: rentId, amount });
          }
  
          payment.status = 'completed';
          await payment.save();
          console.log("✅ Rent payment status updated to confirmed for:", rentId);
  
          const rent = await Rent.findById(rentId);
          if (rent && rent.status === 'approved') {
            rent.status = 'confirmed';
            rent.paymentStatus = 'completed';
            rent.paid = true;                // <-- Add this line
            rent.paymentDetails = session;
            await rent.save();
            console.log("✅ Rent status updated to confirmed.");
          } else {
            console.log("ℹ️ Rent not found or not in 'approved' state.");
          }
        }
      } catch (err) {
        console.error("❌ Error updating payment/rent status:", err.message);
      }
    }
  
    res.status(200).json({ received: true });
  };
  
  