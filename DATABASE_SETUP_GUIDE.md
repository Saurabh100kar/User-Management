# Database Setup & Troubleshooting Guide

## 🔍 Issue: Empty User List (0 users)

The database exists but hasn't been seeded with data yet. Here's how to fix it.

---

## 📊 **How to View Tables in Database**

### Option 1: Using Docker (Recommended - No Installation Needed)

#### Method A: Using `psql` inside Docker container
```bash
# Connect to database container
docker exec -it database psql -U postgres -d management_db

# Once inside psql, run:
\dt                    # List all tables
SELECT * FROM "user";  # View all users (note: "user" is quoted because it's a reserved word)
\q                     # Exit psql
```

#### Method B: Using Prisma Studio (Visual GUI)
```bash
# From the server directory
cd server
npx prisma studio
```
This opens a web interface at `http://localhost:5555` where you can view and edit data.

---

### Option 2: Using pgAdmin4 (External Tool)

1. **Install pgAdmin4** (if not already installed)
   - Download from: https://www.pgadmin.org/download/

2. **Connect to Docker Database:**
   - Host: `localhost` (or `127.0.0.1`)
   - Port: `5431` (the mapped port from docker-compose.yml)
   - Database: `management_db`
   - Username: `postgres`
   - Password: (check your `.env` file - `POSTGRES_PASSWORD`)

3. **Navigate to Tables:**
   - Expand: Servers → PostgreSQL → Databases → `management_db` → Schemas → `public` → Tables
   - You'll see the `user` table there

**Note:** The table is named `user` (lowercase) because Prisma maps it with `@@map("user")` in the schema.

---

## 🌱 **How to Seed the Database**

The database needs to be populated with initial data. Here are the methods:

### Method 1: Using Prisma Seed Command (Recommended)

```bash
# Make sure database is running
docker-compose up postgres -d

# Run seed from server directory
cd server
npx prisma db seed
```

This will populate 50 users into the database.

---

### Method 2: Using Docker Exec

```bash
# Run seed inside server container (if server container is running)
docker exec -it server npx prisma db seed

# OR if server container is not running, run it directly:
cd server
node prisma/seed.js
```

---

### Method 3: Add Seed to Docker Compose (Automatic)

You can modify `docker-compose.yml` to automatically seed on startup:

```yaml
server:
    # ... existing config ...
    command: bash -c "npx prisma migrate deploy && npx prisma db seed && npm start"
```

---

## 🔧 **Troubleshooting: Client Can't Fetch Data**

Since you're running the client locally (localhost:5173), you need to ensure:

### 1. Server is Running
```bash
# Check if server is running
docker ps | findstr server

# If not running, start it:
docker-compose up server -d

# OR run locally:
cd server
npm run dev
```

### 2. Client Environment Variable

The client running locally needs to point to the correct server URL.

**If server is running in Docker:**
- Client should use: `http://localhost:7999` (the mapped port)

**If server is running locally:**
- Client should use: `http://localhost:8000`

**Check your client's `.env` or environment:**
- The client uses `import.meta.env.VITE_SERVER_URL`
- For local dev, create `client/.env.local`:
  ```
  VITE_SERVER_URL=http://localhost:7999
  ```

---

## ✅ **Quick Fix Steps**

1. **Start database:**
   ```bash
   docker-compose up postgres -d
   ```

2. **Run migrations:**
   ```bash
   cd server
   npx prisma migrate deploy
   ```

3. **Seed the database:**
   ```bash
   cd server
   npx prisma db seed
   ```

4. **Start server:**
   ```bash
   # Option A: In Docker
   docker-compose up server -d
   
   # Option B: Locally
   cd server
   npm run dev
   ```

5. **Verify data:**
   ```bash
   # Check if users exist
   docker exec -it database psql -U postgres -d management_db -c "SELECT COUNT(*) FROM \"user\";"
   ```

6. **Test API:**
   ```bash
   # Should return users
   curl http://localhost:7999/users/all
   ```

---

## 📝 **Viewing Tables - Quick Reference**

| Method | Command | Access |
|--------|---------|--------|
| **psql (Docker)** | `docker exec -it database psql -U postgres -d management_db` | Terminal |
| **Prisma Studio** | `cd server && npx prisma studio` | http://localhost:5555 |
| **pgAdmin4** | Install & connect to `localhost:5431` | Desktop App |
| **Direct Query** | `docker exec database psql -U postgres -d management_db -c "SELECT * FROM \"user\";"` | Terminal |

---

## 🎯 **Expected Result**

After seeding, you should see:
- **50 users** in the database
- User List showing users in the client
- API endpoint `/users/all` returning data

---

## 🔍 **Verify Database Connection**

```bash
# Test connection
docker exec database pg_isready -U postgres

# Check if table exists
docker exec database psql -U postgres -d management_db -c "\dt"

# Count users
docker exec database psql -U postgres -d management_db -c "SELECT COUNT(*) FROM \"user\";"
```

