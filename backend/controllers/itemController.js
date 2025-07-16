import Item from '../models/Item.js';


export const listItems = async (req, res) => {
  try {
    const role = req.user?.role || 'guest';  // ✅ Handle unauthenticated requests
    const userId = req.user?._id;

    let items;

    if (role === 'admin') {
      // Admin sees all items
      items = await Item.find().populate('owner', 'name email role');

    } else if (role === 'seller') {
      // Seller sees all available items + their own unavailable items
      items = await Item.find({
        $or: [
          { available: true },
          { owner: userId }
        ]
      }).populate('owner', 'name email role town address');

    } else {
      // Guest or normal user sees only available items
      items = await Item.find({ available: true }).populate('owner', 'name email');
    }

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No items found' });
    }

    res.status(200).json(items);
  } catch (err) {
    console.error('Error in listItems:', err);
    res.status(500).json({ message: err.message });
  }
};



export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const createItem = async (req, res) => {
  try {
    const { name, description, pricePerDay, depositeAmount, category, available } = req.body;

    // 🧪 DEBUG LOGGING
    console.log('📥 Incoming item form data:', req.body);
    
    console.log("Uploaded files:");
req.files.forEach(file => console.log(file.path));


    // ✅ SAFETY CHECK
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images were uploaded' });
    }

    // ✅ Extract Cloudinary image URLs
    const imageUrls = req.files.map(file => file.path); // multer-storage-cloudinary attaches `path`

    const newItem = new Item({
      name,
      description,
      images: imageUrls,
      pricePerDay,
    
      depositeAmount,
      category,
      available,
      owner: req.user._id
    });

    await newItem.save();
    console.log("Item saved:", newItem);

    res.status(201).json(newItem);
  } catch (err) {
    console.error('❌ Error creating item:', err); // ⬅️ This helps catch silent crashes
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
};



// controllers/itemController.js
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Update fields from body
    const fields = ['name', 'description', 'pricePerDay', 'advanceAmount', 'depositeAmount', 'category', 'available'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    // Handle image upload (Cloudinary or local)
    if (req.files && req.files.length > 0) {
      item.images = req.files.map(file => file.path || file.secure_url);
    }
   
    if (req.body.owner) {
      item.owner = req.body.owner; // ✅ Ensure this updates the seller
    }
    await item.save();
    res.json({ message: 'Item updated', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};







export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch your items' });
  }
};




export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only admin or the seller who owns the item can delete
    if (
      req.user.role !== 'admin' &&
      item.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};










// export const listMyItems = async (req, res) => {
//   try {
//     const items = await Item.find({ owner: req.user.id }); // or req.user._id
//     res.status(200).json(items);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

