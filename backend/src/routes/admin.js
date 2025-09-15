import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile, getAllUsers, getUserProfile, updateUserStatus, deleteUser, getAuctionStats, approveSeller, rejectSeller } from '../controllers/adminController.js';
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
router.delete('/users/:userId', adminAuth, deleteUser);
router.post('/users/:userId/approve-seller', adminAuth, approveSeller);
router.post('/users/:userId/reject-seller', adminAuth, rejectSeller);

// Statistics routes
router.get('/stats/auctions', adminAuth, getAuctionStats);

export default router;
