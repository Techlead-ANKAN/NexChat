# NexChat - Project Guide

## 📋 Overview
NexChat is a modern real-time chat application built with the MERN stack, featuring advanced admin controls, dark theme support, and comprehensive audit logging.

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Location**: `./backend/`
- **Main Entry**: `src/index.js`
- **Database**: MongoDB Atlas with Mongoose ODM
- **Real-time**: Socket.IO for instant messaging
- **File Storage**: Cloudinary for image handling
- **Authentication**: JWT-based auth system

### Frontend (React + Vite)
- **Location**: `./frontend-new/` (Active version)
- **Framework**: React 18 with Vite build tool
- **Styling**: Tailwind CSS + DaisyUI components
- **State Management**: Zustand stores
- **HTTP Client**: Axios for API calls

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NexChat
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend-new
   npm install
   ```

4. **Environment Configuration**
   Create `.env` files in both backend and frontend directories with required variables.

### Running the Application

1. **Start Backend** (Port 5001)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Port 5173)
   ```bash
   cd frontend-new
   npm run dev
   ```

## 🔐 Admin Features

### Bulk Message Management
- **Clear All Messages**: Admin can delete all messages system-wide
- **Cloudinary Cleanup**: Automatically removes associated media files
- **Real-time Notifications**: Socket.IO broadcasts for instant updates

### Audit Logging System
- **Complete Trail**: All admin actions are logged with timestamps
- **Advanced Filtering**: Filter by action type, date range, and admin
- **Statistics Dashboard**: Visual insights into admin activities
- **Error Tracking**: Failed operations are recorded with error details

### Admin Dashboard Tabs
1. **Statistics**: User and message counts, system health
2. **Users Management**: View and manage all users
3. **Messages**: Monitor and moderate messages
4. **Audit Logs**: Complete administrative action history

## 📊 Database Schema

### Core Collections
- **users**: User profiles and authentication data
- **messages**: Chat messages with media references
- **auditlogs**: Administrative action tracking

### Key Models
```javascript
// User Model
{
  email: String,
  fullName: String,
  password: String (hashed),
  profilePic: String,
  isAdmin: Boolean
}

// Message Model
{
  senderId: ObjectId,
  receiverId: ObjectId,
  text: String,
  image: String,
  createdAt: Date
}

// AuditLog Model
{
  adminId: ObjectId,
  actionType: String,
  targetType: String,
  details: Object,
  errorMessages: [String],
  createdAt: Date
}
```

## 🎨 UI/UX Features

### Theme System
- **Dark Theme**: Primary theme with gray-900 backgrounds
- **Consistent Styling**: Unified color scheme across all components
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Component Architecture
```
src/components/
├── admin/          # Admin-specific components
├── chat/           # Chat interface components
├── layout/         # Navigation and layout
└── ui/             # Reusable UI components
```

## 🔄 State Management

### Zustand Stores
- **useAuthStore**: Authentication state and user data
- **useChatStore**: Chat messages and conversations
- **useAdminStore**: Admin operations and audit data
- **useThemeStore**: Theme preferences and settings

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Auth status check

### Admin Operations
- `DELETE /api/admin/messages/clear-all` - Bulk message deletion
- `GET /api/admin/audit/logs` - Retrieve audit logs
- `GET /api/admin/audit/stats` - Audit statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/messages` - Message monitoring

### Chat Features
- `GET /api/messages/users` - Get chat users
- `GET /api/messages/:id` - Get conversation
- `POST /api/messages/send/:id` - Send message

## 💾 Database Costs (MongoDB Atlas)

### Current Usage: ~81 KB
### Free Tier: 512 MB (M0 Cluster)

| Tier | Storage | Price/Month | Recommended For |
|------|---------|-------------|-----------------|
| M0   | 512 MB  | FREE        | Development & Testing |
| M2   | 2 GB    | $9          | Small Production Apps |
| M10  | 10 GB   | $57         | Growing Applications |

**Estimated Timeline**: 
- Current → 400 MB: 1-2 years on free tier
- Upgrade to M2: When approaching 512 MB limit
- Future scaling: M10 for 1000+ active users

## 🛠️ Development Workflow

### Code Structure
```
NexChat/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middleware
│   │   └── lib/            # Utilities (DB, Socket, Cloudinary)
├── frontend-new/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   └── lib/            # Utilities
└── build.sh               # Deployment script
```

### Best Practices
- **Error Handling**: Comprehensive try-catch blocks with audit logging
- **Security**: JWT authentication, admin middleware protection
- **Performance**: Efficient database queries, pagination for large datasets
- **Code Quality**: Consistent naming, proper component structure

## 🚀 Deployment

### Build Process
```bash
# Build frontend
cd frontend-new
npm run build

# The build.sh script automates this process
./build.sh
```

### Environment Variables
Ensure all required environment variables are set for production:
- Database connection strings
- JWT secrets
- Cloudinary credentials
- API URLs

## 📈 Performance Monitoring

### Key Metrics to Track
- **Database Size**: Monitor approaching 512 MB limit
- **Active Users**: Plan scaling based on user growth
- **Message Volume**: Track bulk deletion effectiveness
- **Admin Actions**: Monitor audit log growth

### Optimization Tips
- Regular bulk message cleanup
- Image compression via Cloudinary
- Efficient database indexing
- Client-side caching strategies

## 🔧 Troubleshooting

### Common Issues
1. **Double API Prefix**: Ensure axios baseURL doesn't duplicate `/api`
2. **Theme Issues**: Verify gray-700 backgrounds with white text
3. **Socket Connection**: Check CORS settings and port configuration
4. **Database Connection**: Verify MongoDB Atlas whitelist and credentials

### Debug Commands
```bash
# Backend logs
cd backend && npm run dev

# Frontend development
cd frontend-new && npm run dev

# Check database connection
node backend/src/lib/db.js
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Socket.IO](https://socket.io/)
- [Cloudinary](https://cloudinary.com/)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Last Updated**: August 12, 2025  
**Project Status**: Active Development  
**Version**: 1.0.0
