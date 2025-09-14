# MongoDB Setup Guide for BulkBid

## Prerequisites

Before connecting MongoDB to your BulkBid project, you need to have MongoDB installed and running.

## Option 1: Local MongoDB Installation

### Install MongoDB Community Edition

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB service

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/gpg/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update the `.env` file in the backend directory

## Configuration

### 1. Update Environment Variables

Edit `backend/.env` file:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/bulkbid

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bulkbid

# Other settings
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Start the Frontend

```bash
# In a new terminal
npm run dev
```

The frontend will start on `http://localhost:5173`

## Testing the Connection

1. Visit `http://localhost:5000/api/health` to check if the backend is running
2. Try registering a new user on the frontend
3. Check your MongoDB database to see if the user was created

## Database Collections

The application will automatically create these collections:

- **users** - User accounts and profiles
- **auctions** - Auction listings and bidding data

## Troubleshooting

### Common Issues:

1. **Connection refused**: Make sure MongoDB is running
2. **Authentication failed**: Check your connection string
3. **CORS errors**: Ensure FRONTEND_URL is set correctly

### Useful Commands:

```bash
# Check if MongoDB is running (macOS/Linux)
brew services list | grep mongodb
# or
sudo systemctl status mongod

# Connect to MongoDB shell
mongosh
# or
mongo

# List databases
show dbs

# Use your database
use bulkbid

# List collections
show collections
```

## Next Steps

1. Start both frontend and backend servers
2. Register a new user account
3. Create your first auction
4. Test the bidding functionality

Your BulkBid application is now connected to MongoDB! 🎉
