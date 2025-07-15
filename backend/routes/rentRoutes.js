import express from 'express';
import {
  requestRent,respondToRentRequest,getUnavailableDates,getRequests,getMyApprovedRents,getMyItemsRentHistory,
  getAllRentsForAdmin,confirmPickupUpdate,markReturned,completeRent, getMyRentedItems,cancelRentRequest
,updateRentStatus,updateRentPaymentStatus} from '../controllers/rentController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();


router.get('/requests', authMiddleware(['seller']), getRequests);
router.get('/my-approved', authMiddleware(), getMyApprovedRents);
router.get('/seller/history', authMiddleware(['seller']), getMyItemsRentHistory);
router.get('/:itemId/unavailable', authMiddleware(), getUnavailableDates);
router.post('/', authMiddleware(), requestRent);
router.patch('/:rentId/respond', authMiddleware(['seller']), respondToRentRequest);
router.patch('/:rentId/payment-status', authMiddleware(['user', 'seller']), updateRentPaymentStatus);

router.patch('/:rentId/pickup', authMiddleware(['user', 'seller']), confirmPickupUpdate);

router.patch('/:rentId/return', authMiddleware(['user']), markReturned);
router.patch('/:rentId/complete', authMiddleware(['seller']), completeRent);
router.get('/my-rentals', authMiddleware(['user','seller']), getMyRentedItems);
router.get('/all', authMiddleware(['admin']), getAllRentsForAdmin);
router.patch('/:rentId/cancel', authMiddleware(['user', 'seller']), cancelRentRequest);
router.patch('/:rentId/status', authMiddleware, updateRentStatus);






export default router;
