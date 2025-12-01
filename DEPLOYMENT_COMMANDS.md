# Deployment Commands - Quick Reference

## 📦 Pre-Deployment Commands

### 1. Build Frontend
```bash
cd client
npm install
npm run build
```
**Output**: Creates `client/dist/` folder

### 2. Test Frontend Build Locally
```bash
cd client
npm run preview
```
**Expected**: Frontend runs on `http://localhost:4173`

### 3. Prepare Backend
```bash
cd server
npm install
npx prisma generate
```
**Purpose**: Ensure Prisma client is generated

### 4. Test Backend Locally (with production env)
```bash
cd server
# Set environment variables in .env
npm start
```
**Expected**: Server runs on configured PORT

---

## 🚀 Deployment-Specific Commands

### Netlify (Frontend)

**No commands needed** - Netlify will run:
- `npm install` (automatically)
- `npm run build` (from build settings)
- Deploys `dist/` folder

**Manual Deploy:**
```bash
cd client
npm run build
# Then drag client/dist folder to Netlify
```

---

### Railway (Backend)

**Railway automatically runs:**
- `npm install`
- `npx prisma generate` (if in build command)
- `npx prisma migrate deploy` (if in start command)
- `npm start`

**Manual Railway CLI (optional):**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

### Render (Backend)

**Render automatically runs:**
- `npm install`
- Build command (if specified)
- Start command

**No CLI needed** - Use dashboard

---

## 🗄️ Database Commands

### Run Migrations (Production)
```bash
cd server
npx prisma migrate deploy
```
**Note**: Use `migrate deploy` (not `migrate dev`) for production

### Generate Prisma Client
```bash
cd server
npx prisma generate
```

### View Database (Prisma Studio)
```bash
cd server
npx prisma studio
```
**Note**: Only for local development

---

## 🔧 Environment Setup Commands

### Create Production .env (Backend)
```bash
cd server
# Create .env with:
# DATABASE_URL=your_production_db_url
# JWT_SECRET=your_secret
# JWT_EXPIRES_IN=7d
# PORT=8000
# NODE_ENV=production
# FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Create Production .env (Frontend)
```bash
cd client
# Create .env.production with:
# VITE_SERVER_URL=https://your-backend.railway.app
```

---

## ✅ Verification Commands

### Test Frontend API Connection
```bash
# In browser console on deployed site:
fetch('https://your-backend.railway.app/users/all?page=1&limit=10')
  .then(r => r.json())
  .then(console.log)
```

### Test Backend Health
```bash
curl https://your-backend.railway.app/users/all?page=1&limit=10
```

### Test Authentication
```bash
# Signup
curl -X POST https://your-backend.railway.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-backend.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🐳 Docker Commands (Local Only)

### Start Local Development
```bash
docker-compose up -d
```

### Stop Local Development
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

**Note**: Docker is NOT needed for Netlify/Railway deployment

---

## 📝 Git Commands (Before Deployment)

### Initial Setup
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Update Before Deploy
```bash
git add .
git commit -m "Update for deployment"
git push
```

---

## 🎯 Complete Deployment Flow

```bash
# 1. Build frontend
cd client
npm run build

# 2. Test build
npm run preview
# (Press Ctrl+C to stop)

# 3. Prepare backend
cd ../server
npm install
npx prisma generate

# 4. Commit to Git
cd ..
git add .
git commit -m "Ready for deployment"
git push

# 5. Deploy:
# - Frontend: Upload client/dist to Netlify OR connect GitHub
# - Backend: Connect GitHub to Railway/Render
# - Database: Create on Railway/Render/Supabase

# 6. Set environment variables in both platforms

# 7. Test deployed application
```

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - Use platform environment variables
2. **Use `migrate deploy`** for production (not `migrate dev`)
3. **Test locally first** before deploying
4. **Check logs** if something fails
5. **Update CORS** to allow your frontend domain

