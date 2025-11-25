# Project Understanding

## Overview
A full-stack user management application with a modern React frontend and Express.js backend, using PostgreSQL database with Prisma ORM.

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **CSS Modules** for component styling
- Modern UI with animations and responsive design

### Backend
- **Express.js** REST API
- **Prisma ORM** for database operations
- **PostgreSQL** database (pgvector/pg16)

### Infrastructure
- **Docker Compose** for containerization
- Three services: PostgreSQL, Server, Client

## Architecture

```
Client (React) → Server (Express) → Database (PostgreSQL)
     ↓                ↓                    ↓
  Port 4172      Port 7999           Port 5431
```

## Project Structure

```
full_stack_management/
├── client/              # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Home/    # User list page with modern UI
│       │   └── UserDetail/  # Individual user details
│       └── App.jsx      # Router configuration
│
├── server/              # Express backend
│   └── src/
│       ├── app.js       # Main server & API routes
│       ├── config/      # Database configuration
│       └── constants/   # HTTP status codes
│
└── docker-compose.yml   # Container orchestration
```

## Workflow

### 1. Database Setup
- PostgreSQL runs in Docker container
- Prisma migrations create `user` table with fields: id, first_name, last_name, email, gender, phone
- Database seeded with sample data

### 2. Server Startup
- Express server starts on port 8000 (mapped to 7999)
- Prisma Client connects to PostgreSQL
- Two API endpoints:
  - `GET /users/all?page=1&limit=10` - Paginated user list
  - `GET /user/:id` - Single user details

### 3. Client Application
- React app runs on port 4173 (mapped to 4172)
- **Home Page** (`/`):
  - Fetches paginated users from API
  - Modern table UI with search functionality
  - Pagination controls
  - Click row to view user details
- **User Detail Page** (`/user/:id`):
  - Fetches individual user data
  - Displays user information

### 4. Data Flow
```
User Action → React Component → API Call → Express Route → Prisma Query → PostgreSQL → Response → UI Update
```

## Key Features

### Frontend
- ✅ Modern, responsive UI with gradient backgrounds
- ✅ Real-time search filtering
- ✅ Pagination with smooth navigation
- ✅ Component-based architecture (Header, SearchBar, UserTable, Pagination)
- ✅ Loading states and error handling
- ✅ Smooth animations and hover effects

### Backend
- ✅ RESTful API design
- ✅ Pagination support
- ✅ Error handling with proper HTTP status codes
- ✅ CORS enabled for frontend communication

## Running the Project

1. **Start all services**: `docker-compose up`
2. **Access Client**: http://localhost:4172
3. **Access Server API**: http://localhost:7999
4. **Database**: localhost:5431

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` - Database credentials
- `SERVER_PORT` - Express server port (default: 8000)
- `VITE_SERVER_URL` - Frontend API endpoint (default: http://localhost:8000)

## Component Breakdown

### Home Page Components
- **Header**: Title and user count badge
- **SearchBar**: Real-time filtering by name, email, or phone
- **UserTable**: Styled table with sticky header, row hover effects, and icons
- **Pagination**: Modern pill-style pagination with navigation arrows

