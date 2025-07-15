import multer from 'multer';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // 👈 Make sure this path is correct

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rolo_uploads', // 👈 Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp','avif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

export default upload;
