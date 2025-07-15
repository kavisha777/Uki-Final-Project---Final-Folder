import express from 'express';
import { listItems, getItemById , createItem ,deleteItem ,getMyItems,updateItem} from '../controllers/itemController.js';

import  upload  from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/my-items', authMiddleware(['seller']), getMyItems);
router.post(
  '/',
  authMiddleware(['admin', 'seller']),
  upload.array('images', 5),
  createItem
);


router.get('/', listItems);

router.get('/:id',authMiddleware (['admin','seller','user']), getItemById);
router.put(
  '/:id',
  authMiddleware(['admin', 'seller']),
  upload.array('images', 5), // 🧠 Required to parse multipart/form-data
  updateItem
);

router.delete('/:id', authMiddleware(['admin', 'seller']), deleteItem);


export default router;
