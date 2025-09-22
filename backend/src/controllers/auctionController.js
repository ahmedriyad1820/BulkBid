import Auction from '../models/Auction.js';
import { validationResult } from 'express-validator';

export const getAllAuctions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'active',
      search,
      sortBy = 'endTime',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const auctions = await Auction.find(filter)
      .populate('seller', 'name email')
      .populate('winner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Auction.countDocuments(filter);

    res.json({
      auctions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ message: 'Server error while fetching auctions' });
  }
};

export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name email profile')
      .populate('winner', 'name email')
      .populate('bids.bidder', 'name email');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({ message: 'Server error while fetching auction' });
  }
};

export const createAuction = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const auctionData = {
      ...req.body,
      seller: req.user._id
    };

    const auction = new Auction(auctionData);
    await auction.save();

    await auction.populate('seller', 'name email');

    res.status(201).json({
      message: 'Auction created successfully',
      auction
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ message: 'Server error while creating auction' });
  }
};

export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if user is the seller or admin
    if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    // Don't allow updates if auction has bids
    if (auction.bids.length > 0) {
      return res.status(400).json({ message: 'Cannot update auction with existing bids' });
    }

    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    res.json({
      message: 'Auction updated successfully',
      auction: updatedAuction
    });
  } catch (error) {
    console.error('Update auction error:', error);
    res.status(500).json({ message: 'Server error while updating auction' });
  }
};

export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if user is the seller or admin
    if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this auction' });
    }

    // Don't allow deletion if auction has bids
    if (auction.bids.length > 0) {
      return res.status(400).json({ message: 'Cannot delete auction with existing bids' });
    }

    await Auction.findByIdAndDelete(req.params.id);

    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Delete auction error:', error);
    res.status(500).json({ message: 'Server error while deleting auction' });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if user is a buyer
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can place bids' });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    if (auction.endTime <= new Date()) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    if (auction.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Sellers cannot bid on their own auctions' });
    }

    await auction.addBid(req.user._id, amount);

    // Populate the updated auction
    await auction.populate('seller', 'name email');
    await auction.populate('bids.bidder', 'name email');

    res.json({
      message: 'Bid placed successfully',
      auction
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error while placing bid' });
  }
};

export const getUserAuctions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { seller: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const auctions = await Auction.find(filter)
      .populate('winner', 'name email')
      .populate('bids.bidder', 'name email profile')
      .sort({ createdAt: -1 });

    // Sort bids within each auction by amount (highest first)
    const normalized = auctions.map(a => {
      const auction = a.toObject();
      if (Array.isArray(auction.bids)) {
        auction.bids = auction.bids
          .slice()
          .sort((b1, b2) => (b2.amount || 0) - (b1.amount || 0));
      }
      return auction;
    });

    res.json(normalized);
  } catch (error) {
    console.error('Get user auctions error:', error);
    res.status(500).json({ message: 'Server error while fetching user auctions' });
  }
};

// Get auctions that the current user has bid on (buyer dashboard)
export const getUserBids = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Find auctions where bids contain this user
    const auctions = await Auction.find({
      ...filter,
      'bids.bidder': userId
    })
      .populate('seller', 'name email profile')
      .populate('bids.bidder', 'name email profile')
      .sort({ updatedAt: -1 });

    // For frontend convenience, sort bids by amount desc
    const normalized = auctions.map(a => {
      const auction = a.toObject();
      if (Array.isArray(auction.bids)) {
        auction.bids = auction.bids
          .slice()
          .sort((b1, b2) => (b2.amount || 0) - (b1.amount || 0));
      }
      return auction;
    });

    res.json(normalized);
  } catch (error) {
    console.error('Get user bids error:', error);
    res.status(500).json({ message: 'Server error while fetching user bids' });
  }
};

