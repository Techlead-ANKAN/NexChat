<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZiVNVfPck27OdOmEAi76szc8wCbmDb.png" alt="NexChat Interface" width="800"/>
  
  # 💬 NexChat
  
  **A Modern Real-Time Chat Application**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://nexchat-806p.onrender.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
  [![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org)
  
  *Connect with friends, share moments, and stay in touch with your loved ones.*
</div>

---

## 🚀 Project Overview

**NexChat** is a cutting-edge real-time chat application built with the powerful MERN stack (MongoDB, Express.js, React.js, Node.js) and enhanced with Socket.IO for seamless real-time communication. Designed with a focus on user experience and modern aesthetics, NexChat offers instant messaging capabilities with a sleek interface that adapts to your preferences.

### ✨ What Makes NexChat Special?

- **⚡ Real-time messaging** - Experience instant communication with zero delays
- **🔐 Secure authentication** - Robust user registration and login system
- **🌓 Dual themes** - Switch between elegant light and dark modes
- **📱 Responsive design** - Perfect experience across all devices
- **👥 Contact management** - Organized contact list with online/offline status
- **🖼️ Media sharing** - Share images and files seamlessly
- **👤 Profile management** - Customizable user profiles with avatar support

---

## 🎯 Key Features

### 🔑 **User Authentication & Profile Management**
- **Secure Registration & Login**: JWT-based authentication with encrypted password storage
- **Profile Customization**: Update personal information, profile pictures, and preferences
- **Account Management**: View account status, member since date, and account information
- **Session Management**: Secure session handling with automatic logout

### 💬 **Real-Time Messaging**
- **Instant Delivery**: Messages appear immediately across all connected devices
- **Media Sharing**: Send and receive images, files, and multimedia content
- **Message Timestamps**: Track conversation chronology with precise timing
- **Typing Indicators**: See when others are composing messages
- **Message Status**: Delivery and read receipts for better communication

### 👥 **Contact & User Management**
- **Contact List**: Organized list of all your contacts
- **Online Status**: Real-time online/offline status indicators
- **Contact Search**: Filter and find contacts quickly
- **User Profiles**: View detailed information about other users

### 🎨 **Customizable User Experience**
- **Light & Dark Themes**: Toggle between themes based on your preference
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: Built with accessibility best practices in mind

### 🔧 **Additional Features**
- **Cross-Platform Compatibility**: Works on all modern browsers
- **Optimized Performance**: Fast loading and smooth interactions
- **Persistent Chat History**: All conversations are saved and retrievable
- **Settings Panel**: Customize application behavior and preferences

---

## 🛠️ Technologies Used

### **Frontend**
- **React.js 18+** - Modern UI library for building interactive interfaces
- **Socket.IO Client** - Real-time bidirectional event-based communication
- **Axios** - HTTP client for API requests
- **React Router DOM** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Fast build tool and development server

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **Socket.IO** - Real-time communication engine
- **JWT (jsonwebtoken)** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling middleware

### **Database**
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js

### **Development Tools**
- **Nodemon** - Development server with auto-restart
- **Concurrently** - Run multiple commands simultaneously
- **dotenv** - Environment variable management
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

---

## 📦 Installation and Setup

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git
- npm or yarn package manager

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/Techlead-ANKAN/nexchat.git
cd nexchat
```

### **Step 2: Install Dependencies**

**Install backend dependencies:**
```bash
cd backend
npm install
```

**Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

### **Step 3: Environment Configuration**

**Backend Environment (.env in backend folder):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nexchat
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexchat

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Client Configuration
CLIENT_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Frontend Environment (.env in frontend folder):**
```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=NexChat
VITE_APP_VERSION=1.0.0
```

### **Step 4: Database Setup**

**For local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**For MongoDB Atlas:**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Replace the MONGODB_URI in your backend .env file

### **Step 5: Run the Application**

**Development mode (run both servers):**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Or use concurrently from root directory:**
```bash
npm run dev
```

### **Step 6: Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🎮 Usage

### **Getting Started**
1. **Register**: Create a new account with your email and password
2. **Complete Profile**: Add your profile information and upload an avatar
3. **Login**: Sign in with your credentials
4. **Start Chatting**: Begin conversations with other users
5. **Customize**: Switch between light and dark themes in settings

### **Chat Features**
- **Send Messages**: Type in the message input and press Enter or click Send
- **Share Media**: Click the attachment icon to share images and files
- **View Contacts**: Browse your contact list and see online status
- **Real-time Updates**: See messages appear instantly
- **Theme Toggle**: Use the settings to switch between light and dark modes
- **Profile Management**: Update your profile information anytime

### **Navigation**
- **Settings**: Access application settings and preferences
- **Profile**: View and edit your profile information
- **Logout**: Securely sign out of your account

---

## 🌐 Live Demo

Experience NexChat in action: **[Live Demo](https://nexchat-demo.vercel.app)**

*Test credentials for demo:*
- Email: demo@nexchat.com
- Password: demo123

---

## 🎨 Design and UI

NexChat features a **modern, minimalist design** that prioritizes user experience and visual appeal:

### **Design Philosophy**
- **Clean Interface**: Uncluttered layout focusing on content and conversations
- **Modern Aesthetics**: Contemporary design elements with smooth animations
- **Intuitive Navigation**: User-friendly interface requiring minimal learning curve
- **Consistent Branding**: Cohesive visual identity throughout the application

### **Theme Options**

#### 🌙 **Dark Theme**
<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4cObX46LHwC2gOAqOl2QQqLcqPWBaC.png" alt="NexChat Dark Mode" width="600"/>

*Elegant dark mode for comfortable night-time usage and reduced eye strain*

#### ☀️ **Light Theme**
<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Zt5pEWJg2DzwYjVrLxeCvzfzTmeGRn.png" alt="NexChat Light Mode" width="600"/>

*Clean, bright interface for daytime productivity and clarity*

### **Profile Management**
<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mz1atnWFHOG69cRK6mjHN3Ze1nFGWW.png" alt="NexChat Profile Page" width="600"/>

*Comprehensive profile management with avatar upload and account information*

### **Key Design Features**
- **Responsive Layout**: Adapts seamlessly to different screen sizes
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Accessibility**: Built with WCAG guidelines in mind
- **Cross-Browser Compatibility**: Consistent experience across all modern browsers

---

## 📁 Project Structure


```
nexchat/
├── backend/                    # Node.js backend server
│   ├── src/                   # Source code
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Main server file
│   ├── uploads/              # File upload directory
│   ├── .env                  # Environment variables
│   ├── .gitignore           # Git ignore rules
│   ├── package.json         # Backend dependencies
│   └── package-lock.json    # Lock file
├── frontend/                  # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # CSS/SCSS files
│   │   ├── context/         # React context providers
│   │   └── App.jsx          # Main App component
│   ├── dist/                # Build output
│   ├── .env                 # Environment variables
│   ├── .gitignore          # Git ignore rules
│   ├── eslint.config.js    # ESLint configuration
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── package-lock.json   # Lock file
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── vite.config.js      # Vite configuration
├── .gitignore              # Root git ignore
├── package.json            # Root package.json
└── README.md              # Project documentation
```

### **Key Directories Explained**
- **backend/src/**: Contains all server-side logic, API routes, and database models
- **frontend/src/**: Houses all React components, pages, and client-side functionality
- **uploads/**: Stores user-uploaded files and media
- **public/**: Static assets served directly by the web server

---

## 📸 Screenshots & Visuals

### **Chat Interface Comparison**

<div align="center">
  
| Light Mode | Dark Mode |
|------------|-----------|
| <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Zt5pEWJg2DzwYjVrLxeCvzfzTmeGRn.png" alt="Light Mode Chat" width="400"/> | <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4cObX46LHwC2gOAqOl2QQqLcqPWBaC.png" alt="Dark Mode Chat" width="400"/> |

</div>

### **Profile Management**
<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mz1atnWFHOG69cRK6mjHN3Ze1nFGWW.png" alt="Profile Page" width="500"/>
  <p><em>Comprehensive profile management with customizable user information</em></p>
</div>

### **Key Interface Features**
- **Contact Sidebar**: Easy access to all your contacts with online status
- **Message Area**: Clean, focused chat interface with media support
- **Input Controls**: Intuitive message composition with file attachment
- **Navigation Bar**: Quick access to settings, profile, and logout
- **Responsive Design**: Seamless experience across all device sizes

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help make NexChat even better:

### **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Contribution Guidelines**
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Update documentation as needed
- Ensure your code passes all linting checks

### **Development Setup**
1. Follow the installation instructions above
2. Create a new branch for your feature
3. Make your changes and test locally
4. Run linting: `npm run lint`
5. Submit a pull request with a clear description

### **Bug Reports**
Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or error messages (if applicable)
- Your environment details (OS, browser, Node.js version)

### **Feature Requests**
Have an idea for improvement? We'd love to hear it! Open an issue with:
- Detailed description of the proposed feature
- Use case and benefits
- Any implementation ideas or suggestions
- Mockups or wireframes (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 📞 Contact

### **Developer Information**
- **Name**: Ankan Maity
- **Email**: [mr.ankanmaity@gmail.com](mailto:mr.ankanmaity@gmail.com)
- **GitHub**: [@Techlead-ANKAN](https://github.com/Techlead-ANKAN)
- **LinkedIn**: [Ankan Maity](https://www.linkedin.com/in/ankan-maity)

### **Project Links**
- **Repository**: [https://github.com/Techlead-ANKAN/nexchat](https://github.com/Techlead-ANKAN/nexchat)
- **Live Demo**: [https://nexchat-806p.onrender.com/](https://nexchat-806p.onrender.com/)
- **Issues**: [Report a Bug](https://github.com/Techlead-ANKAN/nexchat/issues)
- **Discussions**: [Join the Discussion](https://github.com/Techlead-ANKAN/nexchat/discussions)

### **Get in Touch**
Feel free to reach out for:
- Questions about the project
- Collaboration opportunities
- Bug reports or feature suggestions
- Technical support
- General feedback

---

## 🙏 Acknowledgments

- **Socket.IO** team for the amazing real-time communication library
- **MongoDB** for the flexible and scalable database solution
- **React** community for the incredible frontend framework
- **Express.js** for the robust and minimalist backend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool
- All contributors and users who make this project possible

---

## 🚀 Future Enhancements

- **Group Chat**: Multi-user chat rooms and channels
- **Voice Messages**: Audio message support
- **Video Calls**: Integrated video calling functionality
- **Message Encryption**: End-to-end encryption for enhanced security
- **Mobile App**: React Native mobile application
- **File Sharing**: Enhanced file sharing with cloud storage integration
- **Message Search**: Advanced search functionality across chat history
- **Notifications**: Push notifications for new messages

---

<div align="center">
  
### **⭐ Star this repository if you found it helpful!**

**Made with ❤️ by [Ankan Maity](https://github.com/Techlead-ANKAN)**

*NexChat - Connecting people, one message at a time.*

[![GitHub stars](https://img.shields.io/github/stars/Techlead-ANKAN/nexchat?style=social)](https://github.com/Techlead-ANKAN/nexchat/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Techlead-ANKAN/nexchat?style=social)](https://github.com/Techlead-ANKAN/nexchat/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/Techlead-ANKAN/nexchat?style=social)](https://github.com/Techlead-ANKAN/nexchat/watchers)

</div>
