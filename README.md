# Blog Platform

A modern, full-stack blog platform built with React, Node.js, Express, and MySQL.

## Features

- ✨ Modern, responsive UI with Tailwind CSS
- 🔐 User authentication and authorization
- 📝 Create, edit, and delete blog posts
- 💬 Comment system
- 🏷️ Category management
- 🔍 Search functionality
- 👤 User profiles
- 📱 Mobile-friendly design
- 🎨 Rich text editor for posts

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL
- **Authentication**: JWT tokens
- **File Upload**: Multer

## Quick Start

To keep developing, use:
Backend: cd server && npm run dev (health: http://localhost:5000/api/health)
Frontend: cd client && npm start (app: http://localhost:3000)

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up the database:**
   - Create a MySQL database named ``
   - Update database credentials in `server/config/database.js`

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
blog-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── database/             # Database schema and migrations
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 