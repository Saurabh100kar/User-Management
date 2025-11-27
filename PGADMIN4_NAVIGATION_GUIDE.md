# 🗺️ pgAdmin4 Navigation Guide - Finding Your Database

## 📍 **Where to Find Your Database**

### **Step-by-Step Navigation:**

1. **In the Object Explorer (Left Side):**
   ```
   Servers (1)
   └── PostgreSQL 16
       └── Databases (1)  ← Click to expand
           └── postgres  ← This is the DEFAULT database
           └── management_db  ← This is YOUR database! ⭐
   ```

2. **To See Your Tables:**
   ```
   PostgreSQL 16
   └── Databases
       └── management_db  ← Click this
           └── Schemas
               └── public  ← Click this
                   └── Tables  ← Click this
                       └── user  ← This is your table! ⭐
   ```

---

## 🔍 **If You Don't See `management_db`:**

### **Option 1: Refresh the Database List**
1. Right-click on **"Databases"**
2. Select **"Refresh"**
3. `management_db` should appear

### **Option 2: Check Connection Settings**
Make sure you're connected to the correct server:
- **Host:** `localhost` (or `127.0.0.1`)
- **Port:** `5431` ⚠️ (NOT 5432 - this is the Docker mapped port)
- **Database:** `management_db` (or `postgres` to connect first)
- **Username:** `postgres`
- **Password:** `changeme_secure_password`

---

## 📊 **Viewing Your Data**

### **Once You Find the `user` Table:**

1. **Right-click on `user` table**
2. Select **"View/Edit Data" → "All Rows"**
3. You'll see all 50 users!

### **Or Use SQL Query:**

1. Right-click on `management_db` database
2. Select **"Query Tool"**
3. Run this query:
   ```sql
   SELECT * FROM public."user" ORDER BY id;
   ```

---

## 🎯 **Quick Visual Guide**

```
pgAdmin4 Object Explorer:
│
├── Servers (1)
│   └── PostgreSQL 16
│       │
│       ├── Databases (1)  ← Expand this
│       │   │
│       │   ├── postgres  ← Default database (ignore this)
│       │   │
│       │   └── management_db  ⭐ YOUR DATABASE
│       │       │
│       │       ├── Schemas
│       │       │   └── public
│       │       │       │
│       │       │       └── Tables
│       │       │           │
│       │       │           └── user  ⭐ YOUR TABLE (50 users)
│       │       │
│       │       ├── Query Tool  ← Use this to run SQL
│       │       └── ...
│       │
│       └── ...
```

---

## 💡 **Pro Tips**

1. **If you see "Databases (1)" but only see `postgres`:**
   - The count might be wrong - try refreshing
   - Or `management_db` might be in a different server connection

2. **To verify your connection:**
   - Check the server properties
   - Make sure port is `5431` (Docker mapped port)

3. **Quick way to find tables:**
   - Use the search box at the top of Object Explorer
   - Type: `user` or `management_db`

---

## 🔧 **Troubleshooting**

### **Can't See `management_db`?**

1. **Check if database exists:**
   ```bash
   docker exec database psql -U postgres -l
   ```
   Should list `management_db`

2. **Verify connection:**
   - Make sure Docker container is running: `docker ps | findstr database`
   - Check port mapping: `docker ps` should show `0.0.0.0:5431->5432/tcp`

3. **Reconnect in pgAdmin4:**
   - Right-click server → "Disconnect Server"
   - Right-click → "Connect Server"
   - Enter password: `changeme_secure_password`

---

**Your database `management_db` with table `user` (50 users) is there - just navigate deeper into the tree!** 🎯



