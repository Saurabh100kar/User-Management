# Quick Fix Guide - Critical Issues

## 🚨 Must Fix Before Running

### 1. Create `.env` File
Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Then edit `.env` with these values:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme_secure_password
POSTGRES_DB=management_db
DATABASE_URL=postgresql://postgres:changeme_secure_password@postgres:5432/management_db
SERVER_PORT=8000
VITE_SERVER_URL=http://server:8000
```

**⚠️ CRITICAL:** 
- `DATABASE_URL` must use `postgres` (Docker service name), NOT `localhost`
- `VITE_SERVER_URL` must use `server:8000` (Docker service name), NOT `127.0.0.1:7999`

---

### 2. Fix Client Dockerfile

**File:** `client/Dockerfile`

**Change line 2 from:**
```dockerfile
ARG VITE_SERVER_URL=http://127.0.0.1:7999
```

**To:**
```dockerfile
ARG VITE_SERVER_URL=http://server:8000
```

---

### 3. Fix Healthcheck (Optional but Recommended)

**File:** `docker-compose.yml`

**Change line 15 from:**
```yaml
test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
```

**To:**
```yaml
test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-postgres}"]
```

---

## ✅ After Fixes

1. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

2. Verify all services are running:
   ```bash
   docker-compose ps
   ```

3. Check logs if issues:
   ```bash
   docker-compose logs server
   docker-compose logs database
   docker-compose logs client
   ```

---

## 🔍 Quick Verification

- **Database:** `docker exec database pg_isready -U postgres`
- **Server:** `curl http://localhost:7999/users/all`
- **Client:** Open `http://localhost:4172` in browser

