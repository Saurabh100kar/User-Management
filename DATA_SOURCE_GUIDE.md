# 📊 Data Source Guide - Where Your Data Comes From

## 🔄 **Data Flow**

```
PostgreSQL Database (Docker)
    ↓
Prisma ORM (server/src/config/database.js)
    ↓
Express API (server/src/app.js)
    ↓
React Client (client/src/pages/Home/index.jsx)
    ↓
Your Browser (localhost:5173)
```

---

## 📍 **Where the Data is Stored**

### **1. PostgreSQL Database (Primary Source)**

**Location:** Docker container named `database`

**Connection Details:**
- **Host:** `localhost` (when accessing from your machine)
- **Port:** `5431` (mapped from container port 5432)
- **Database Name:** `management_db`
- **Username:** `postgres`
- **Password:** `changeme_secure_password`
- **Table Name:** `user` (lowercase, because of Prisma's `@@map("user")`)

**Physical Storage:**
- Docker volume: `./docker_test_db` (in your project root)
- Container path: `/var/lib/postgresql/data`

---

## 🔍 **How to View/Cross-Check the Data**

### **Method 1: Prisma Studio (Easiest - Visual GUI)** ⭐ Recommended

```bash
cd server
npx prisma studio
```

**Opens at:** http://localhost:5555

**Features:**
- Visual table browser
- Edit data directly
- See all 50 users
- Filter and search

---

### **Method 2: Direct SQL Query (Quick Check)**

```bash
# View all users
docker exec database psql -U postgres -d management_db -c 'SELECT * FROM "user";'

# Count total users
docker exec database psql -U postgres -d management_db -c 'SELECT COUNT(*) FROM "user";'

# View first 10 users
docker exec database psql -U postgres -d management_db -c 'SELECT * FROM "user" ORDER BY id LIMIT 10;'

# View users 41-50 (what you're seeing in the UI)
docker exec database psql -U postgres -d management_db -c 'SELECT * FROM "user" WHERE id >= 41 AND id <= 50;'
```

---

### **Method 3: Interactive psql Session**

```bash
# Connect to database
docker exec -it database psql -U postgres -d management_db

# Then run SQL commands:
\dt                    # List all tables
SELECT * FROM "user";  # View all users
SELECT COUNT(*) FROM "user";  # Count users
\q                     # Exit
```

---

### **Method 4: pgAdmin4 (Desktop Application)**

1. **Install pgAdmin4:** https://www.pgadmin.org/download/

2. **Connection Settings:**
   - **Host:** `localhost`
   - **Port:** `5431` ⚠️ (NOT 5432)
   - **Database:** `management_db`
   - **Username:** `postgres`
   - **Password:** `changeme_secure_password`

3. **Navigate:**
   - Servers → PostgreSQL → Databases → `management_db` → Schemas → `public` → Tables → `user`
   - Right-click `user` → View/Edit Data → All Rows

---

### **Method 5: Check API Response Directly**

```bash
# View raw API response
curl http://localhost:8000/users/all?page=1&limit=10

# Or in browser:
# Open: http://localhost:8000/users/all?page=1&limit=10
```

---

## 📝 **Data Source Details**

### **Where Data Was Created:**

**File:** `server/prisma/seed.js`

This file contains all 50 users that were inserted into the database. The seed script:
1. Checks if database is empty
2. If empty, inserts 50 users (IDs 1-50)
3. Each user has: `id`, `first_name`, `last_name`, `email`, `gender`, `phone`

**To re-seed (if needed):**
```bash
cd server
node prisma/seed.js
```

---

### **How Data Flows to Your UI:**

1. **Client Request:**
   - `client/src/pages/Home/index.jsx` line 16
   - Fetches: `http://localhost:8000/users/all?page=1&limit=10`

2. **Server Processing:**
   - `server/src/app.js` line 11-58
   - Uses Prisma: `prisma.user.findMany()` with pagination
   - Queries PostgreSQL database

3. **Database Query:**
   - Prisma translates to SQL: `SELECT * FROM "user" LIMIT 10 OFFSET 0`
   - Returns users from database

4. **Response:**
   - Server sends JSON: `{ success: true, data: { users: [...], total: 50 } }`
   - Client displays in table

---

## 🔍 **Verify Specific Data**

### **Check User ID 41-50 (What You're Seeing):**

```bash
docker exec database psql -U postgres -d management_db -c 'SELECT id, first_name, last_name, email FROM "user" WHERE id BETWEEN 41 AND 50 ORDER BY id;'
```

### **Check Total Count:**

```bash
docker exec database psql -U postgres -d management_db -c 'SELECT COUNT(*) as total FROM "user";'
```

**Expected:** Should return `50`

---

## 📂 **File Locations**

| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Database Schema** | `server/prisma/schema.prisma` | Defines table structure |
| **Seed Data** | `server/prisma/seed.js` | Contains all 50 users |
| **Database Config** | `server/src/config/database.js` | Prisma client setup |
| **API Endpoint** | `server/src/app.js` | Handles `/users/all` request |
| **Client Fetch** | `client/src/pages/Home/index.jsx` | Fetches and displays data |

---

## 🎯 **Quick Verification Checklist**

- [ ] Database has 50 users: `SELECT COUNT(*) FROM "user";`
- [ ] API returns data: `curl http://localhost:8000/users/all?page=1&limit=10`
- [ ] Client displays data: Check browser at `localhost:5173`
- [ ] Data matches: Compare database vs UI

---

## 💡 **Pro Tips**

1. **Prisma Studio** is the easiest way to view/edit data
2. **pgAdmin4** is best for complex SQL queries
3. **Direct SQL** is fastest for quick checks
4. **API curl** shows exactly what the client receives

---

**Your data is stored in PostgreSQL, accessed via Prisma, served by Express, and displayed in React!** 🎉



