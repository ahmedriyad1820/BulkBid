import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'super-admin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  profile: {
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      zipCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      }
    },
    avatar: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
