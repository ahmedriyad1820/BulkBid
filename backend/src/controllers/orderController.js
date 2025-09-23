import Order from '../models/Order.js';
import Auction from '../models/Auction.js';

export const createOrderFromWin = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { auctionId, shippingAddress, contactNumber } = req.body;

    const auction = await Auction.findById(auctionId).populate('seller', 'name email');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    // Consider auction ended if status is 'ended' OR endTime has passed
    let hasEnded = auction.status === 'ended' || auction.endTime <= new Date();
    if (hasEnded && !auction.winner && Array.isArray(auction.bids) && auction.bids.length > 0) {
      const highestBid = auction.bids[auction.bids.length - 1];
      auction.winner = highestBid.bidder;
      auction.currentBid = highestBid.amount || auction.currentBid;
      // Persist winner for ended auctions
      if (auction.status !== 'ended') {
        auction.status = 'ended';
      }
      await auction.save();
    }
    // Do not hard-block by status; require that winner exists and matches buyer
    if (!auction.winner || auction.winner.toString() !== buyerId.toString()) {
      return res.status(403).json({ message: 'Only the winning buyer can create an order' });
    }

    // Prevent duplicate orders per auction
    const existing = await Order.findOne({ auction: auction._id });
    if (existing) return res.status(400).json({ message: 'Order already exists for this auction' });

    const order = await Order.create({
      auction: auction._id,
      buyer: buyerId,
      seller: auction.seller._id || auction.seller,
      amount: auction.currentBid,
      shippingAddress,
      contactNumber
    });

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('auction', 'title location endTime')
      .populate('seller', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('auction', 'title location endTime')
      .populate('buyer', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Server error while fetching seller orders' });
  }
};


