# College Event Management System - Backend API

Complete Node.js + Express.js + MongoDB backend for the College Event Management System.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Local MongoDB Compass)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── eventController.js    # Event management logic
│   └── chatController.js     # Chatbot logic
├── models/
│   ├── User.js              # User model
│   ├── Event.js             # Event model
│   └── Chat.js              # Chat model
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── eventRoutes.js       # Event endpoints
│   └── chatRoutes.js        # Chat endpoints
├── middlewares/
│   ├── auth.js              # JWT & role authorization
│   └── errorHandler.js      # Error handling
├── utils/
│   ├── generateToken.js     # JWT token generator
│   └── seeder.js            # Database seeder
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── server.js                # Main entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- MongoDB Compass (optional, for GUI)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running locally:
```bash
# MongoDB should be running on mongodb://localhost:27017
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at: **http://localhost:5000**

## 🔑 Sample Credentials (After Seeding)

### Admin Account
- **Email:** admin@college.edu
- **Password:** admin123
- **Role:** admin

### Student Account
- **Email:** john@student.edu
- **Password:** student123
- **Role:** student

### Event Member Account
- **Email:** coordinator@college.edu
- **Password:** event123
- **Role:** event-member

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user profile |
| GET | `/api/auth/users` | Admin | Get all users |

### Events (`/api/events`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/events` | Public | Get all events (supports ?category & ?search) |
| GET | `/api/events/:id` | Public | Get single event |
| POST | `/api/events` | Event Member/Admin | Create new event |
| PUT | `/api/events/:id` | Owner/Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| POST | `/api/events/:id/register` | Student | Register for event |
| POST | `/api/events/:id/unregister` | Student | Unregister from event |

### Chatbot (`/api/chat`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/chat/start` | Public | Start new conversation |
| POST | `/api/chat/message` | Public | Send message & get response |
| GET | `/api/chat/:conversationId` | Public | Get conversation by ID |
| GET | `/api/chat/history/:userId` | Private | Get user's chat history |
| DELETE | `/api/chat/:conversationId` | Private | Delete conversation |

### Health Check

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/health` | Public | Check server status |
| GET | `/` | Public | API info |

## 📝 Request/Response Examples

### Register User

**POST** `/api/auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Event

**POST** `/api/events`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

```json
{
  "title": "Tech Workshop",
  "description": "Learn web development",
  "category": "workshop",
  "date": "2025-12-15",
  "time": "10:00 AM",
  "venue": "Lab 1",
  "college": "MIT",
  "organizer": "Tech Club",
  "capacity": 50
}
```

### Register for Event

**POST** `/api/events/:id/register`

**Headers:**
```
Authorization: Bearer <student_jwt_token>
```

### Send Chat Message

**POST** `/api/chat/message`

```json
{
  "conversationId": "chat_1234567890",
  "message": "What events are happening this week?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "chat_1234567890",
    "messages": [
      {
        "role": "user",
        "content": "What events are happening this week?",
        "timestamp": "2025-01-15T10:00:00.000Z"
      },
      {
        "role": "assistant",
        "content": "Here are the upcoming events...",
        "timestamp": "2025-01-15T10:00:01.000Z"
      }
    ]
  }
}
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

1. Register or login to get a token
2. Include token in Authorization header:
   ```
   Authorization: Bearer <your_token_here>
   ```
3. Token expires in 30 days

## 👥 User Roles & Permissions

### Student
- Register for events
- View events
- Access student dashboard
- Unregister from events

### Event Member
- Create events
- Update own events
- View all events
- All student permissions

### Admin
- All permissions
- Delete any event
- View all users
- Update any event

## 🤖 Chatbot Features

The chatbot uses **local rule-based logic** (no external APIs):

- Query upcoming events
- Search by category (technical, cultural, sports, workshop)
- Get registration help
- Ask about venues
- Get event recommendations
- All responses generated locally

## 🗄️ Database Schema

### User
- name, email, password (hashed)
- role (student | event-member | admin)
- registeredEvents[], createdEvents[]

### Event
- title, description, category
- date, time, venue, college, organizer
- capacity, image, createdBy
- registeredUsers[], registrationCount, status

### Chat
- userId, conversationId, title
- messages[] (role, content, timestamp)

## 🧪 Testing

Test the API using:
- **Postman** - Import endpoints manually
- **Thunder Client** - VS Code extension
- **curl** - Command line
- **Frontend** - Connect your React app

### Test Health Check:
```bash
curl http://localhost:5000/api/health
```

## 📦 NPM Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Seed database with sample data
```

## 🔧 Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collegeEventsDB
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
NODE_ENV=development
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MongoDB Compass connection
- Verify MONGO_URI in .env

### Port Already in Use
- Change PORT in .env
- Kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### JWT Token Issues
- Check if token is being sent in headers
- Verify token hasn't expired
- Ensure JWT_SECRET matches

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

**Built with ❤️ for College Event Management**
