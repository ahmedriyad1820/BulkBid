import express from 'express';
import { createOrderFromWin, getMyOrders, getSellerOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/', createOrderFromWin);
router.get('/my', getMyOrders);
router.get('/seller', getSellerOrders);

export default router;


