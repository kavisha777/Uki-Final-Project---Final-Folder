import express from 'express';
import { registerUser, loginUser,logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);

export default router;
