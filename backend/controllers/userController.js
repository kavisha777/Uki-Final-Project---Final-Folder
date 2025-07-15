import User from '../models/User.js';
import Package from '../models/Package.js';

// GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // use _id, not id
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/user/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, address, contact } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update basic text fields
    if (name) user.name = name;
    if (address) user.address = address;
    if (contact) user.contactNumber = contact;

    // Handle uploaded files
    if (req.files?.profilePic?.[0]) {
      user.profilePic = req.files.profilePic[0].path; // Cloudinary secure URL
    }
    if (req.files?.idProof?.[0]) {
      user.idProof = req.files.idProof[0].path;  // ✅ Cloudinary path
    }
    
    

    await user.save();

    const updatedUser = await User.findById(req.user._id).select('-password');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(400).json({ message: err.message });
  }
};


export const becomeSeller= async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.id;

    if (!packageId) {
      return res.status(400).json({ message: "Package ID is required" });
    }

    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (typeof selectedPackage.duration !== 'number' || isNaN(selectedPackage.duration)) {
      return res.status(400).json({ message: "Invalid package duration" });
    }

    const expiryDate = new Date(Date.now() + selectedPackage.duration * 24 * 60 * 60 * 1000);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: "seller",
        package: packageId,
        sellerSince: new Date(),
        sellerProfile: {
          maxListings: selectedPackage.itemLimit,
          expiryDate: expiryDate,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "User promoted to seller successfully",
      sellerData: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





export const upgradeToSeller = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.role = "seller";
  user.sellerSince = new Date();
  await user.save();
  res.json({ message: "You are now a seller" });
};
