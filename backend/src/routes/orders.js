import express from 'express';
import { createOrderFromWin, getMyOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/', createOrderFromWin);
router.get('/my', getMyOrders);

export default router;


