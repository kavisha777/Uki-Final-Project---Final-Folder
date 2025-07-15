// controllers/adminController.js
import User from '../models/User.js';
import Rent from '../models/Rent.js';

import Payment from '../models/Payment.js';

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('package', 'name price duration itemLimit')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment records:", error.message);
    res.status(500).json({ message: "Failed to fetch payments", error: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, address, role, town } = req.body;

  // 🔍 Log the request body for debugging
  console.log('Request body received:', req.body);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        contactNumber: contact, // ✅ Note the rename
        address,
        town,
        role,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated', updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


  // Add this function
export const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  




  
export const revokeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'user';
    await user.save();

    res.status(200).json({ message: 'Seller access revoked', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const getAllRentsForAdmin = async (req, res) => {
  try {
    const rents = await Rent.find()
      .populate({
        path: 'item',
        populate: { path: 'owner', select: 'name email' }
      })
      .populate('renter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(rents);
  } catch (err) {
    console.error('Error fetching all rents for admin:', err);
    res.status(500).json({ error: 'Failed to retrieve rent records' });
  }
};