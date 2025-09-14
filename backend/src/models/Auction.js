import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Auction title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Textiles', 'Food & Beverage', 'Industrial', 'Furniture', 'Automotive']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  images: [{
    type: String
  }],
  startingBid: {
    type: Number,
    required: [true, 'Starting bid is required'],
    min: [0, 'Starting bid must be positive']
  },
  currentBid: {
    type: Number,
    default: 0
  },
  reservePrice: {
    type: Number,
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['pieces', 'boxes', 'pallets', 'kg', 'lbs', 'units']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['A', 'B', 'C', 'D', 'Mixed']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'ended', 'cancelled'],
    default: 'draft'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  bids: [bidSchema],
  bidCount: {
    type: Number,
    default: 0
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isReserveMet: {
    type: Boolean,
    default: false
  },
  autoExtend: {
    type: Boolean,
    default: true
  },
  autoExtendMinutes: {
    type: Number,
    default: 5
  },
  tags: [String],
  shipping: {
    included: { type: Boolean, default: false },
    cost: { type: Number, default: 0 },
    estimatedDays: { type: Number, default: 7 }
  }
}, {
  timestamps: true
});

// Index for better query performance
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ category: 1, status: 1 });
auctionSchema.index({ seller: 1, status: 1 });
auctionSchema.index({ title: 'text', description: 'text' });

// Virtual for time remaining
auctionSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const remaining = this.endTime - now;
  return remaining > 0 ? remaining : 0;
});

// Virtual for isActive
auctionSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && this.endTime > now;
});

// Method to add a bid
auctionSchema.methods.addBid = function(bidderId, amount) {
  if (this.status !== 'active') {
    throw new Error('Auction is not active');
  }
  
  if (this.endTime <= new Date()) {
    throw new Error('Auction has ended');
  }
  
  if (amount <= this.currentBid) {
    throw new Error('Bid must be higher than current bid');
  }
  
  if (this.seller.toString() === bidderId.toString()) {
    throw new Error('Sellers cannot bid on their own auctions');
  }
  
  this.bids.push({
    bidder: bidderId,
    amount: amount,
    timestamp: new Date()
  });
  
  this.currentBid = amount;
  this.bidCount += 1;
  
  // Check if reserve price is met
  if (this.reservePrice && amount >= this.reservePrice) {
    this.isReserveMet = true;
  }
  
  // Auto-extend if enabled and bid is within extension window
  if (this.autoExtend) {
    const extensionWindow = this.autoExtendMinutes * 60 * 1000; // Convert to milliseconds
    const timeUntilEnd = this.endTime - new Date();
    
    if (timeUntilEnd <= extensionWindow) {
      this.endTime = new Date(Date.now() + extensionWindow);
    }
  }
  
  return this.save();
};

// Method to end auction
auctionSchema.methods.endAuction = function() {
  if (this.status !== 'active') {
    throw new Error('Auction is not active');
  }
  
  this.status = 'ended';
  
  // Set winner if there are bids
  if (this.bids.length > 0) {
    const highestBid = this.bids[this.bids.length - 1];
    this.winner = highestBid.bidder;
  }
  
  return this.save();
};

export default mongoose.model('Auction', auctionSchema);

