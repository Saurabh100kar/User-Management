# 🔧 pgAdmin4 Connection Fix Guide

## ❌ **The Problem**

Your connection is failing because:
- **Host name/address:** `postgres management` ❌ (WRONG - this is not a valid hostname)
- **Error:** `[Errno 11001] getaddrinfo failed` (means hostname cannot be resolved)

---

## ✅ **The Solution**

### **Correct Connection Settings:**

1. **Close the current "Register - Server" dialog** (click X or Cancel)

2. **Right-click on "Servers"** in Object Explorer
   - Select **"Register" → "Server..."**

3. **Fill in the Connection tab with these EXACT values:**

   | Field | Value |
   |-------|-------|
   | **Host name/address** | `localhost` or `127.0.0.1` ⚠️ |
   | **Port** | `5431` ✅ |
   | **Maintenance database** | `postgres` or `management_db` |
   | **Username** | `postgres` ✅ |
   | **Password** | `changeme_secure_password` ✅ |
   | **Save password?** | ✅ Check this box (optional but recommended) |

4. **Click "Save"**

---

## 🎯 **Step-by-Step Visual Guide**

### **Step 1: General Tab**
- **Name:** `Docker PostgreSQL` (or any name you like)

### **Step 2: Connection Tab** ⭐ MOST IMPORTANT
```
Host name/address: localhost
                    ↑
                    THIS IS THE KEY FIX!
                    (NOT "postgres management")
```

**Complete Connection Settings:**
```
Host name/address:    localhost
Port:                  5431
Maintenance database:  postgres
Username:              postgres
Password:              changeme_secure_password
Save password?:        ✓ (check this)
```

### **Step 3: Click "Save"**

---

## 🔍 **Why "localhost" and not "postgres management"?**

- `localhost` = Your local machine (where Docker is running)
- `postgres management` = Not a valid hostname (causes DNS lookup failure)
- Port `5431` = Docker mapped port (container's 5432 → host's 5431)

---

## ✅ **After Successful Connection**

Once connected, you'll see:

```
Servers
└── Docker PostgreSQL (or your server name)
    └── Databases
        ├── postgres
        └── management_db  ⭐ YOUR DATABASE!
            └── Schemas
                └── public
                    └── Tables
                        └── user  ⭐ YOUR TABLE (50 users)
```

---

## 🐛 **Troubleshooting**

### **If connection still fails:**

1. **Verify Docker container is running:**
   ```bash
   docker ps | findstr database
   ```
   Should show container is "Up"

2. **Check port mapping:**
   ```bash
   docker ps
   ```
   Look for: `0.0.0.0:5431->5432/tcp`

3. **Test connection from command line:**
   ```bash
   docker exec database pg_isready -U postgres
   ```
   Should return: `database:5432 - accepting connections`

4. **Try alternative hostnames:**
   - `127.0.0.1` (instead of localhost)
   - `0.0.0.0` (if localhost doesn't work)

---

## 📝 **Quick Reference**

**Correct Settings:**
- Host: `localhost` ← **FIX THIS!**
- Port: `5431`
- Database: `postgres` (for connection) or `management_db` (to connect directly)
- User: `postgres`
- Password: `changeme_secure_password`

**Wrong Settings:**
- Host: `postgres management` ❌
- Host: `postgres` ❌ (this only works inside Docker)
- Port: `5432` ❌ (this is container port, not host port)

---

**The key fix: Change "Host name/address" from "postgres management" to "localhost"!** 🎯

