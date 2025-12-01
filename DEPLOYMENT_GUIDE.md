# Complete Deployment Guide - Netlify (Frontend) + Railway/Render (Backend)

## 📋 Overview

**Important:** Netlify is for **frontend only**. You need a separate service for your Express.js backend.

**Recommended Setup:**
- **Frontend**: Netlify (React/Vite)
- **Backend**: Railway or Render (Express.js)
- **Database**: Managed PostgreSQL (Railway, Supabase, Neon, or Render)

---

## 🚀 PART 1: Pre-Deployment Steps

### Step 1: Prepare Your Code

#### 1.1 Update Environment Variables

**Frontend (`client/.env` or `.env.production`):**
```env
VITE_SERVER_URL=https://your-backend-url.railway.app
# or
VITE_SERVER_URL=https://your-backend-url.onrender.com
```

**Backend (`server/.env`):**
```env
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d
PORT=8000
NODE_ENV=production
```

#### 1.2 Update API URLs in Frontend

Check `client/src/api/users.js` and `client/src/api/analytics.js` - they should use `VITE_SERVER_URL` which is already configured.

#### 1.3 Build Frontend Locally (Test)

```bash
cd client
npm run build
```

This creates a `dist/` folder. Test it locally:
```bash
npm run preview
```

#### 1.4 Create `.gitignore` Files (if not exists)

**Root `.gitignore`:**
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
docker_test_db/
```

**Client `.gitignore`:**
```
node_modules/
dist/
.env
.env.local
.env.production.local
```

**Server `.gitignore`:**
```
node_modules/
.env
.env.local
*.log
```

---

## 🌐 PART 2: Deploy Frontend to Netlify

### Step 2: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free account works)
3. Verify your email

### Step 3: Deploy via Netlify Dashboard

#### Option A: Drag & Drop (Easiest)

1. **Build your frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Go to Netlify Dashboard:**
   - Click "Add new site" → "Deploy manually"
   - Drag the `client/dist` folder to Netlify
   - Wait for deployment

3. **Configure Environment Variables:**
   - Go to Site settings → Environment variables
   - Add: `VITE_SERVER_URL` = `https://your-backend-url.railway.app`

4. **Redeploy** after adding environment variables

#### Option B: Git Integration (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Netlify Dashboard → "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build Settings:**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - **Node version**: `18` or `20` (in Environment variables)

4. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add: `VITE_SERVER_URL` = `https://your-backend-url.railway.app`

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### Step 4: Configure Netlify Redirects

Create `client/public/_redirects` (or `client/dist/_redirects`):
```
/*    /index.html   200
```

This ensures React Router works correctly.

---

## 🔧 PART 3: Deploy Backend to Railway (Recommended)

### Step 3.1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 3.2: Deploy Backend

1. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a PostgreSQL instance
   - Copy the `DATABASE_URL` from the database service

2. **Deploy Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Railway will detect it's a Node.js app

3. **Configure Backend:**
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma migrate deploy && npm start`

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add:
     ```
     DATABASE_URL=postgresql://... (from PostgreSQL service)
     JWT_SECRET=your_strong_secret_key_here
     JWT_EXPIRES_IN=7d
     PORT=8000
     NODE_ENV=production
     ```

5. **Generate Domain:**
   - Go to Settings → Generate Domain
   - Copy the URL (e.g., `https://your-app.railway.app`)

6. **Update Frontend:**
   - Go back to Netlify
   - Update `VITE_SERVER_URL` to your Railway backend URL
   - Redeploy frontend

---

## 🗄️ PART 4: Database Management

### Option A: Railway PostgreSQL (Easiest)

1. **Already created in Step 3.2**
2. **Connection String**: Automatically provided
3. **Migrations**: Run automatically via `npx prisma migrate deploy`
4. **Access**: Railway dashboard → Database → Connect

### Option B: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Use this URL in Railway environment variables

### Option C: Neon (Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string
4. Use in Railway environment variables

---

## 🐳 PART 5: Docker Considerations

### For Local Development Only

Your `docker-compose.yml` is for **local development**. For production:

- **Frontend**: Netlify handles hosting (no Docker needed)
- **Backend**: Railway/Render handles hosting (no Docker needed)
- **Database**: Managed PostgreSQL (no Docker needed)

### If You Want Docker in Production

Use **Railway** or **Render** which support Docker:
- Railway: Automatically detects Dockerfile
- Render: Use Dockerfile in root or specify in settings

---

## 📝 PART 6: Complete Deployment Checklist

### Pre-Deployment

- [ ] Test frontend build locally: `cd client && npm run build`
- [ ] Test backend locally with production env vars
- [ ] Update all API URLs to use environment variables
- [ ] Remove any hardcoded localhost URLs
- [ ] Commit all changes to Git

### Frontend (Netlify)

- [ ] Create Netlify account
- [ ] Build frontend: `npm run build` in `client/`
- [ ] Deploy to Netlify (drag & drop or Git)
- [ ] Add `VITE_SERVER_URL` environment variable
- [ ] Create `_redirects` file for React Router
- [ ] Test deployed frontend

### Backend (Railway)

- [ ] Create Railway account
- [ ] Create PostgreSQL database on Railway
- [ ] Deploy backend service
- [ ] Add all environment variables
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Generate Railway domain
- [ ] Test backend API endpoints

### Database

- [ ] Create production database
- [ ] Run migrations
- [ ] Seed initial data (if needed)
- [ ] Test database connection

### Final Steps

- [ ] Update frontend `VITE_SERVER_URL` with backend URL
- [ ] Redeploy frontend
- [ ] Test complete flow:
  - [ ] Signup
  - [ ] Login
  - [ ] View users
  - [ ] Create user
  - [ ] Edit user
  - [ ] Delete user
  - [ ] View dashboard

---

## 🔍 Troubleshooting

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `VITE_SERVER_URL` in Netlify environment variables
- **Solution**: Ensure backend CORS allows your Netlify domain

**Problem**: 404 on page refresh
- **Solution**: Add `_redirects` file with `/* /index.html 200`

**Problem**: Build fails
- **Solution**: Check Node version (use 18 or 20)
- **Solution**: Check build logs in Netlify

### Backend Issues

**Problem**: Database connection fails
- **Solution**: Check `DATABASE_URL` format
- **Solution**: Ensure database allows connections from Railway IPs

**Problem**: Migrations fail
- **Solution**: Run `npx prisma migrate deploy` manually
- **Solution**: Check Prisma schema matches database

**Problem**: CORS errors
- **Solution**: Update CORS in `server/src/app.js` to allow Netlify domain

---

## 📊 Alternative: Render.com (All-in-One)

If you prefer one platform:

1. **Frontend**: Render Static Site
   - Connect GitHub repo
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`

2. **Backend**: Render Web Service
   - Connect GitHub repo
   - Root directory: `server`
   - Build: `npm install && npx prisma generate`
   - Start: `npx prisma migrate deploy && npm start`

3. **Database**: Render PostgreSQL
   - Create PostgreSQL database
   - Use connection string in backend env vars

---

## 🎯 Quick Command Reference

### Before Deployment

```bash
# 1. Build frontend
cd client
npm run build

# 2. Test frontend build
npm run preview

# 3. Test backend (with production env)
cd ../server
# Set production env vars
npm start

# 4. Commit to Git
cd ..
git add .
git commit -m "Ready for deployment"
git push
```

### After Deployment

```bash
# Update frontend env var in Netlify dashboard
# Redeploy frontend

# Check backend logs in Railway/Render
# Test API endpoints
```

---

## 🔐 Security Checklist

- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Never commit `.env` files
- [ ] Use HTTPS (automatic on Netlify/Railway)
- [ ] Enable CORS only for your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Regularly update dependencies

---

## 📞 Support

If you encounter issues:
1. Check deployment logs in Netlify/Railway
2. Check browser console for frontend errors
3. Check server logs for backend errors
4. Verify all environment variables are set
5. Test API endpoints with Postman/curl

---

**Good luck with your deployment! 🚀**

