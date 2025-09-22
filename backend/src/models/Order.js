import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  contactNumber: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);


