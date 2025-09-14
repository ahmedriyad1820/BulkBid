import express from 'express';
import { body } from 'express-validator';
import { 
  getAllAuctions, 
  getAuctionById, 
  createAuction, 
  updateAuction, 
  deleteAuction, 
  placeBid,
  getUserAuctions 
} from '../controllers/auctionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const auctionValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['Electronics', 'Textiles', 'Food & Beverage', 'Industrial', 'Furniture', 'Automotive'])
    .withMessage('Invalid category'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('startingBid')
    .isFloat({ min: 0 })
    .withMessage('Starting bid must be a positive number'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('unit')
    .isIn(['pieces', 'boxes', 'pallets', 'kg', 'lbs', 'units'])
    .withMessage('Invalid unit'),
  body('grade')
    .isIn(['A', 'B', 'C', 'D', 'Mixed'])
    .withMessage('Invalid grade'),
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Invalid condition'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('End time must be in the future');
      }
      return true;
    }),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isString()
    .withMessage('Each image must be a string')
];

const bidValidation = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Bid amount must be a positive number')
];

// Public routes
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

// Protected routes
router.post('/', authenticate, auctionValidation, createAuction);
router.put('/:id', authenticate, auctionValidation, updateAuction);
router.delete('/:id', authenticate, deleteAuction);
router.post('/:id/bid', authenticate, bidValidation, placeBid);
router.get('/user/my-auctions', authenticate, getUserAuctions);

export default router;

