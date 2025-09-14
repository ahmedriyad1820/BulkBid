import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

// Protected admin routes
router.get('/profile', adminAuth, getAdminProfile);
router.put('/profile', adminAuth, updateAdminProfile);

export default router;
