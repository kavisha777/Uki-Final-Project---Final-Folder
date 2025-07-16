import Rent from '../models/Rent.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import Payment from '../models/Payment.js';


export const requestRent = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;

    // Prevent renting own item
    const item = await Item.findById(itemId);
    if (!item || item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Invalid item" });
    }

    // Check if date range overlaps any confirmed/approved rentals
    const overlapping = await Rent.findOne({
      item: itemId,
      status: { $in: ['approved', 'confirmed'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: "Item not available for selected dates" });
    }

    const rent = await Rent.create({
      item: itemId,
      renter: req.user._id,
      seller: item.owner, // 🔥 ADD THIS LINE
      startDate,
      endDate,
      status: "pending"
    });
    

    res.status(201).json({ message: "Rent request submitted", rent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getRequests = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get all items owned by seller
    const items = await Item.find({ owner: sellerId }).select('_id');

    const itemIds = items.map(item => item._id);

    const requests = await Rent.find({
      item: { $in: itemIds },
      status: 'pending'
    }).populate('item').populate('renter', 'name email');

    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const respondToRentRequest = async (req, res) => {
  try {
    const { rentId } = req.params;
    const { action } = req.body; // "approve" or "reject"
    const sellerId = req.user._id;
    console.log('RENT RESPONSE:', { rentId, action, user: req.user._id });

    const rent = await Rent.findById(rentId).populate('item');

if (!rent) return res.status(404).json({ message: "Rent request not found" });

if (!rent.seller) {
  // Auto-correct old rent with missing seller
  if (rent.item?.owner) {
    rent.seller = rent.item.owner;
    console.warn("💡 Fixed missing seller on old rent:", rent._id);
  } else {
    return res.status(400).json({ message: "Missing seller and item.owner" });
  }
}
    console.log('Fetched rent:', rent);

    if (!rent.item) {
      return res.status(400).json({ message: "Item details not found in rent" });
    }
    
    if (rent.item.owner.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "You are not the owner of this item" });
    }
    
    if (rent.status !== 'pending') {
      return res.status(400).json({ message: "This rent request is already processed" });
    }

    if (action === 'approve') {
      rent.status = 'approved';
      await rent.save();
    
      // Cancel all overlapping 'pending' requests for the same item
      await Rent.updateMany({
        _id: { $ne: rent._id },
        item: rent.item._id,
        status: 'pending',
        $or: [
          { startDate: { $lte: rent.endDate }, endDate: { $gte: rent.startDate } }
        ]
      }, {
        $set: { status: 'cancelled' }
      });
    
      // ✅ Send email to renter
      const renter = await User.findById(rent.renter);
      if (renter?.email) {
        await sendEmail({
          to: renter.email,
          subject: `🎉 Rent Request Approved - ${rent.item.name}`,
          html: `
            <h2>Hi ${renter.name},</h2>
            <p>Your rent request for <strong>${rent.item.name}</strong> has been <span style="color:green;">approved</span> by the seller.</p>
            <p><b>Rental Duration:</b> ${new Date(rent.startDate).toLocaleDateString()} to ${new Date(rent.endDate).toLocaleDateString()}</p>
            <p>Next Steps: Please visit your dashboard to proceed with payment or pickup.</p>
            <br/>
            <p>Thank you,<br/>ROLO Team</p>
          `
        });
      }
    
      return res.status(200).json({
        message: "Rent request approved and email sent to renter.",
        rent
      });
        

    } else if (action === 'reject') {
      rent.status = 'rejected';
      await rent.save();
    
      // ✅ Send rejection email to renter
      const renter = await User.findById(rent.renter);
      if (renter?.email) {
        await sendEmail({
          to: renter.email,
          subject: `❌ Rent Request Rejected - ${rent.item.name}`,
          html: `
            <h2>Hi ${renter.name},</h2>
            <p>We’re sorry to inform you that your rent request for <strong>${rent.item.name}</strong> from <strong>${new Date(rent.startDate).toLocaleDateString()}</strong> to <strong>${new Date(rent.endDate).toLocaleDateString()}</strong> was <span style="color:red;">rejected</span>.</p>
            <p>Another user’s rent request was approved for overlapping dates, so the item is no longer available during your selected period.</p>
            <p>You can try requesting the same item for different dates, or explore similar items on ROLO.</p>
            <br/>
            <p>Thank you for using ROLO,<br/>ROLO Team</p>
          `
        });
      }
      else {
        return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'." });
      }
      return res.status(200).json({
        message: "Rent request rejected. The item remains unavailable for the selected dates.",
        rent
      });
    }
    

  } catch (err) {
    console.error("Error in respondToRentRequest:", err);
    res.status(500).json({ error: err.message });
  }
};




export const getMyApprovedRents = async (req, res) => {
  try {
    const userId = req.user._id;

    const approvedRents = await Rent.find({
      renter: userId,
      status: 'approved'
    }).populate('item');

    res.status(200).json({ approvedRents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// export const getMyItemsRentHistory = async (req, res) => {
//   try {
//     const sellerId = req.user._id;

//     // Get all item IDs owned by seller
//     const items = await Item.find({ owner: sellerId }).select('_id');
//     const itemIds = items.map(item => item._id);

//     // Get all rent records for seller's items
//     const rents = await Rent.find({ item: { $in: itemIds } })
//       .populate('item')
//       .populate('renter', 'name email');

//     // Attach payment status for each rent
//     const rentHistory = await Promise.all(rents.map(async (rent) => {
//       const payment = await Payment.findOne({ rent: rent._id, status: 'completed' });
//       return {
//         _id: rent._id,
//         item: rent.item,
//         renter: rent.renter,
//         startDate: rent.startDate,
//         endDate: rent.endDate,
//         status: rent.status,
//         paid: !!payment // true if paid
//       };
//     }));

//     res.status(200).json({ rentHistory });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getMyItemsRentHistory = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Get all items owned by the seller
    const items = await Item.find({ owner: sellerId }).select('_id');
    const itemIds = items.map(item => item._id);

    // 2. Fetch all rent records for those items
    const rents = await Rent.find({ item: { $in: itemIds } })
      .sort({ createdAt: -1 }) // newest first
      .populate('item')
      .populate('renter', 'name email');

    // 3. Attach payment info
    const rentHistory = await Promise.all(rents.map(async (rent) => {
      const payment = await Payment.findOne({ rent: rent._id, status: 'completed' });
      return {
        _id: rent._id,
        item: {
          name: rent.item?.name,
          _id: rent.item?._id
        },
        renter: rent.renter,
        startDate: rent.startDate,
        endDate: rent.endDate,
        status: rent.status,
        paid: !!payment,
        paidAt: payment?.createdAt || null,
        price: rent.price || 0
      };
    }));

    res.status(200).json({ rentHistory });
  } catch (err) {
    console.error("❌ Rent History Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const confirmPickupUpdate = async (req, res) => {
  const { rentId } = req.params;
  const userId = req.user._id;

  const rent = await Rent.findById(rentId).populate('item');
  if (!rent) return res.status(404).json({ message: "Rent not found" });

  if (rent.status !== 'confirmed') {
    return res.status(400).json({ message: "Pickup not allowed. Rent must be confirmed." });
  }

  // Update confirm flag
  const isSeller = rent.item.owner.toString() === userId.toString();
  const isUser = rent.renter.toString() === userId.toString();

  if (isSeller) {
    rent.confirmPickupBySeller = true;
  } else if (isUser) {
    rent.confirmPickupByUser = true;
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // If both confirmed, mark as in-use
  if (rent.confirmPickupBySeller && rent.confirmPickupByUser) {
    rent.status = 'in-use';
  }

  await rent.save();

  return res.status(200).json({
    message: rent.status === 'in-use' ? 'Rent is now in use' : 'Pickup confirmation recorded',
    rent,
  });
};






export const updateRentPaymentStatus = async (req, res) => {
  try {
    const { rentId } = req.params;

    const rent = await Rent.findById(rentId);
    if (!rent) return res.status(404).json({ message: 'Rent not found' });

    // Optional: You could also check if payment exists and is completed
    const payment = await Payment.findOne({ rent: rentId, status: 'completed' });
    if (!payment) {
      return res.status(400).json({ message: 'No completed payment found for this rent' });
    }

    // Update rent status and paid flag
    rent.status = 'confirmed';
    rent.paid = true;
    await rent.save();

    res.json({ message: 'Rent payment status updated successfully', rent });
  } catch (err) {
    console.error('❌ Failed to update payment status:', err.message);
    res.status(500).json({ message: 'Failed to update rent payment status' });
  }
};




export const markReturned = async (req, res) => {
  const { rentId } = req.params;
  const userId = req.user._id;

  const rent = await Rent.findById(rentId);
  if (!rent) return res.status(404).json({ message: 'Rent not found' });

  if (rent.renter.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (rent.status !== 'in-use') {
    return res.status(400).json({ message: 'Item is not in-use' });
  }

  rent.status = 'returned';
  await rent.save();

  res.json({ message: 'Item marked as returned. Awaiting seller confirmation.', rent });
};





export const completeRent = async (req, res) => {
  const { rentId } = req.params;
  const sellerId = req.user._id;

  const rent = await Rent.findById(rentId).populate('item');
  if (!rent) return res.status(404).json({ message: 'Rent not found' });

  if (rent.item.owner.toString() !== sellerId.toString()) {
    return res.status(403).json({ message: 'Not your item' });
  }

  if (rent.status !== 'returned') {
    return res.status(400).json({ message: 'Item has not been returned yet' });
  }

  rent.status = 'completed';
  await rent.save();

  res.json({ message: 'Rent marked as completed. Thank you!', rent });
};


export const getUnavailableDates = async (req, res) => {
  const { itemId } = req.params;

  try {
    const rents = await Rent.find({
      item: itemId,
      status: { $in: ['approved', 'confirmed'] }
    });

    const unavailableDates = rents.map(r => ({
      start: r.startDate.toISOString().split('T')[0], // '2025-07-16'
      end: r.endDate.toISOString().split('T')[0]
    }));

    res.json({ unavailableDates });
  } catch (err) {
    console.error("Unavailable Dates Error:", err);
    res.status(500).json({ message: "Failed to fetch unavailable dates" });
  }
};






// export const getMyRentedItems = async (req, res) => {
//   try {
//     const rents = await Rent.find({ renter: req.user._id })
//     .populate({
//       path: 'item',
//       select: 'name owner',
//       populate: {
//         path: 'owner',
//         select: 'name'
//       }
//     });
  
//       const formatted = rents.map(r => {
//         const itemName = r.item ? r.item.name : 'Unknown';
//         const sellerName = r.item?.owner ? r.item.owner.name : 'Unknown Seller';
      
//         return {
//           _id: r._id,
//           itemName,
//           sellerName,
//           startDate: r.startDate,
//           endDate: r.endDate,
//           status: r.status,
//           price: r.price,
//         };
//       });
      
//     res.status(200).json(formatted);
//   } catch (err) {
//     console.error("Error in getMyRentedItems:", err);
//     res.status(500).json({ message: "Failed to get rentals", error: err.message });
//   }
// };

export const getMyRentedItems = async (req, res) => {
  try {
    const rents = await Rent.find({ renter: req.user._id })
      .populate({
        path: 'item',
        select: 'name owner',
        populate: {
          path: 'owner',
          select: 'name'
        }
      });
  
    const formatted = rents.map(r => {
      const itemName = r.item ? r.item.name : 'Unknown';
      const sellerName = r.item?.owner ? r.item.owner.name : 'Unknown Seller';
    
      return {
        _id: r._id,
        itemName,
        sellerName,
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
        price: r.price,
        paymentStatus: r.paymentStatus,   // <-- add this line
      };
    });
    
    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error in getMyRentedItems:", err);
    res.status(500).json({ message: "Failed to get rentals", error: err.message });
  }
};







export const getAllRentsForAdmin = async (req, res) => {
  try {
    const rents = await Rent.find()
      .sort({ createdAt: -1 }) // latest first
      .populate({
        path: 'item',
        populate: {
          path: 'owner',
          select: 'name email'
        }
      })
      
      .populate('renter', 'name email'); // get renter name & email

    res.status(200).json(rents);
  } catch (err) {
    console.error("❌ Admin Rent Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch rent records" });
  }
};






export const cancelRentRequest = async (req, res) => {
  try {
    const { rentId } = req.params;
    const userId = req.user._id;

    const rent = await Rent.findById(rentId);
    if (!rent) return res.status(404).json({ message: 'Rent not found' });

    // Only the original requester (renter) can cancel
    if (rent.renter.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Allow cancellation only if not already in use or completed
    if (!['pending', 'approved', 'confirmed'].includes(rent.status)) {
      return res.status(400).json({ message: 'Cannot cancel at this stage' });
    }

    rent.status = 'cancelled';
    await rent.save();

    res.status(200).json({ message: 'Rent request cancelled', rent });
  } catch (err) {
    console.error("Cancel Rent Error:", err);
    res.status(500).json({ message: 'Failed to cancel rent', error: err.message });
  }
};

export const updateRentStatus = async (req, res) => {
  const { rentId } = req.params;
  const { action } = req.body;

  const rent = await Rent.findById(rentId);
  if (!rent) return res.status(404).json({ message: 'Rent not found' });

  switch (action) {
    case 'confirm-pickup-seller':
      rent.confirmPickupBySeller = true;
      if (rent.confirmPickupByUser) {
        rent.status = 'in-use';
      }
      break;

    case 'complete':
      if (rent.status !== 'returned') {
        return res.status(400).json({ message: 'Item must be returned before completion' });
      }
      rent.status = 'completed';
      break;

    default:
      return res.status(400).json({ message: 'Invalid action' });
  }

  await rent.save();
  res.json({ message: 'Rent status updated', rent });
};
