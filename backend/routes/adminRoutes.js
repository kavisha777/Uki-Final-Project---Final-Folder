import { revokeSeller } from '../controllers/adminController.js';
import express from 'express';
import { getAllUsers,updateUser,deleteUser,getAllRentsForAdmin,getAllPayments} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';



const router = express.Router();

// Protect this route — only admins allowed
router.get('/users', authMiddleware(['admin']), getAllUsers);
router.get('/rents', authMiddleware(['admin']), getAllRentsForAdmin);
router.put('/users/:id', authMiddleware([ 'admin']), updateUser);
router.delete('/users/:id', authMiddleware(['admin']), deleteUser);
router.put('/revoke-seller/:id', authMiddleware(['admin']), revokeSeller);
router.get('/payments', authMiddleware(['admin']), getAllPayments);


export default router;
