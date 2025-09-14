import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile, getAllUsers, getUserProfile, updateUserStatus } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

// Protected admin routes
router.get('/profile', adminAuth, getAdminProfile);
router.put('/profile', adminAuth, updateAdminProfile);

// User management routes
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:userId', adminAuth, getUserProfile);
router.put('/users/:userId/status', adminAuth, updateUserStatus);

export default router;
