import express from 'express';
import { getUserProfile, updateUserProfile, becomeSeller } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import  upload  from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ✅ Simple routes — no upload middleware
router.get('/profile', authMiddleware(), getUserProfile);
router.put(
  '/profile',
  authMiddleware(),
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
  ]), updateUserProfile);
router.post('/becomeseller', authMiddleware(), becomeSeller);

export default router;
