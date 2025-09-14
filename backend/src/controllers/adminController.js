import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Auction from '../models/Auction.js';

// Create default admin if not exists
export const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'dracula@gmail.com' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      
      const admin = new Admin({
        name: 'Admin User',
        email: 'dracula@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin created successfully');
    } else {
      // Update existing admin to include name field if missing
      if (!existingAdmin.name) {
        existingAdmin.name = 'Admin User';
        await existingAdmin.save();
        console.log('✅ Updated existing admin with name field');
      } else {
        console.log('ℹ️  Admin already exists');
      }
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profile: admin.profile,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone, address, avatar } = req.body;
    
    const updateData = {
      name,
      email,
      profile: {
        phone,
        address,
        avatar
      }
    };

    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      admin
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile by ID (admin only)
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    const adminId = req.adminId;
    if (user._id.toString() === adminId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account'
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get auction statistics (admin only)
export const getAuctionStats = async (req, res) => {
  try {
    const now = new Date();
    
    // Get total auctions
    const totalAuctions = await Auction.countDocuments();
    
    // Get running auctions (active status and endTime > now)
    const runningAuctions = await Auction.countDocuments({
      status: 'active',
      endTime: { $gt: now }
    });
    
    // Get completed auctions (ended status or endTime <= now)
    const completedAuctions = await Auction.countDocuments({
      $or: [
        { status: 'ended' },
        { endTime: { $lte: now } }
      ]
    });
    
    // Get draft auctions
    const draftAuctions = await Auction.countDocuments({
      status: 'draft'
    });
    
    // Get cancelled auctions
    const cancelledAuctions = await Auction.countDocuments({
      status: 'cancelled'
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalAuctions,
        running: runningAuctions,
        completed: completedAuctions,
        draft: draftAuctions,
        cancelled: cancelledAuctions
      }
    });

  } catch (error) {
    console.error('Get auction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
