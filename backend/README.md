# BulkBid Backend API

A Node.js/Express backend API for the BulkBid auction platform with MongoDB integration.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Auction Management**: CRUD operations for auctions with bidding functionality
- **User Management**: Admin panel for user management
- **Real-time Bidding**: Bid placement with auto-extension and reserve price support
- **Search & Filtering**: Advanced search and filtering capabilities
- **Data Validation**: Comprehensive input validation using express-validator

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bulkbid
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB:**
   - Local MongoDB: Make sure MongoDB is running on your system
   - MongoDB Atlas: Use your Atlas connection string

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Auctions
- `GET /api/auctions` - Get all auctions (with filtering)
- `GET /api/auctions/:id` - Get auction by ID
- `POST /api/auctions` - Create new auction (authenticated)
- `PUT /api/auctions/:id` - Update auction (authenticated)
- `DELETE /api/auctions/:id` - Delete auction (authenticated)
- `POST /api/auctions/:id/bid` - Place a bid (authenticated)
- `GET /api/auctions/user/my-auctions` - Get user's auctions (authenticated)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Database Models

### User Model
- Basic user information (name, email, password)
- Profile data (avatar, phone, address)
- Preferences (notifications, theme)
- Role-based access control

### Auction Model
- Auction details (title, description, category)
- Pricing (starting bid, current bid, reserve price)
- Inventory (quantity, unit, grade, condition)
- Bidding system with auto-extension
- Status management (draft, active, ended)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/bulkbid` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

## Development

The server runs on `http://localhost:5000` by default. The API includes:

- Comprehensive error handling
- Input validation
- Authentication middleware
- CORS configuration
- Health check endpoint

## Health Check

Visit `http://localhost:5000/api/health` to verify the server is running.

## for run the project 
npm run dev:all

