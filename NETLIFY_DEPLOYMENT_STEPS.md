# Step-by-Step Netlify Deployment Guide

## 🎯 Complete Step-by-Step Instructions

### STEP 1: Prepare Your Project

#### 1.1 Build Frontend
Open terminal in your project root:

```bash
cd client
npm install
npm run build
```

**Expected Output:**
- Creates `client/dist/` folder
- No errors in terminal

#### 1.2 Test Build Locally
```bash
npm run preview
```

Open `http://localhost:4173` in browser. If it works, you're ready!

**Stop the preview:** Press `Ctrl+C`

---

### STEP 2: Create Netlify Account

1. Go to **https://netlify.com**
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"** (recommended) or email
4. Complete signup process
5. Verify your email if required

---

### STEP 3: Deploy to Netlify

#### Option A: Drag & Drop (Fastest - 2 minutes)

1. **In Netlify Dashboard:**
   - Click **"Add new site"**
   - Select **"Deploy manually"**

2. **Drag your build folder:**
   - Open `client/dist` folder in File Explorer
   - Drag the entire `dist` folder to Netlify's drag area
   - Wait for upload (10-30 seconds)

3. **Your site is live!**
   - Netlify gives you a URL like: `https://random-name-123.netlify.app`
   - Click the URL to see your site

4. **Add Environment Variable:**
   - Go to **Site settings** → **Environment variables**
   - Click **"Add variable"**
   - **Key**: `VITE_SERVER_URL`
   - **Value**: `https://your-backend.railway.app` (you'll get this after backend deployment)
   - Click **"Save"**

5. **Redeploy:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

#### Option B: GitHub Integration (Recommended for updates)

1. **Push to GitHub:**
   ```bash
   # If not already a git repo:
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **In Netlify:**
   - Click **"Add new site"** → **"Import an existing project"**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify to access GitHub
   - Select your repository

3. **Configure Build Settings:**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - Click **"Deploy site"**

4. **Add Environment Variable:**
   - Site settings → Environment variables
   - Add `VITE_SERVER_URL` = `https://your-backend.railway.app`
   - Redeploy

---

### STEP 4: Fix React Router (Important!)

Create file: `client/public/_redirects`

**Content:**
```
/*    /index.html   200
```

**Why?** This ensures React Router works when users refresh pages or navigate directly to URLs.

**After creating file:**
- If using drag & drop: Rebuild and redeploy
- If using GitHub: Commit and push, Netlify will auto-deploy

---

### STEP 5: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `myapp.com`)
4. Follow DNS configuration instructions

---

## 🔧 Backend Deployment (Railway)

### STEP 6: Deploy Backend to Railway

#### 6.1 Create Railway Account

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with GitHub

#### 6.2 Create Database

1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Wait for database to provision (30 seconds)
3. Click on database → **"Variables"** tab
4. Copy the `DATABASE_URL` (you'll need this)

#### 6.3 Deploy Backend

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Railway detects it's Node.js

4. **Configure Service:**
   - Click on the service
   - Go to **"Settings"** tab
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma migrate deploy && npm start`

5. **Add Environment Variables:**
   - Go to **"Variables"** tab
   - Click **"New Variable"**
   - Add these:
     ```
     DATABASE_URL = (paste from database service)
     JWT_SECRET = your_strong_secret_key_minimum_32_characters
     JWT_EXPIRES_IN = 7d
     PORT = 8000
     NODE_ENV = production
     FRONTEND_URL = https://your-netlify-app.netlify.app
     ```

6. **Generate Domain:**
   - Go to **"Settings"** → **"Generate Domain"**
   - Copy the URL (e.g., `https://your-app.up.railway.app`)

#### 6.4 Update Frontend

1. Go back to **Netlify**
2. **Site settings** → **Environment variables**
3. Update `VITE_SERVER_URL` to your Railway backend URL
4. **Redeploy** frontend

---

## ✅ Final Verification

### Test Your Deployment

1. **Frontend:**
   - Visit your Netlify URL
   - Should see your app

2. **Backend:**
   - Visit `https://your-backend.railway.app/users/all?page=1&limit=10`
   - Should see JSON response

3. **Full Flow:**
   - Sign up on frontend
   - Login
   - Create a user
   - View dashboard

---

## 🐛 Common Issues & Fixes

### Issue: Frontend shows blank page
**Fix**: Check browser console for errors. Usually CORS or API URL issue.

### Issue: API calls fail
**Fix**: 
- Verify `VITE_SERVER_URL` in Netlify environment variables
- Check backend CORS allows Netlify domain
- Check backend is running on Railway

### Issue: 404 on page refresh
**Fix**: Create `client/public/_redirects` file with `/* /index.html 200`

### Issue: Database connection fails
**Fix**: 
- Verify `DATABASE_URL` in Railway variables
- Check database is running
- Run migrations: `npx prisma migrate deploy`

---

## 📊 What Happens to Docker?

**Short Answer**: Docker is NOT used in production deployment.

- **Netlify**: Handles frontend hosting (no Docker)
- **Railway**: Can use Docker OR just Node.js (we're using Node.js)
- **Database**: Managed PostgreSQL (no Docker)

**Docker is only for local development** with `docker-compose.yml`.

---

## 🗄️ Database Management After Deployment

### Accessing Your Production Database

**Option 1: Railway Dashboard**
- Click on PostgreSQL service
- Go to "Connect" tab
- Use connection string in any PostgreSQL client

**Option 2: Prisma Studio (Local)**
```bash
cd server
# Set DATABASE_URL to production URL in .env
npx prisma studio
```

**Option 3: pgAdmin / DBeaver**
- Use connection string from Railway
- Connect to production database

### Running Migrations

**Automatic**: Railway runs `npx prisma migrate deploy` on each deploy

**Manual**:
```bash
cd server
# Set DATABASE_URL to production
npx prisma migrate deploy
```

### Backing Up Database

**Railway**: Automatic backups (check Railway dashboard)

**Manual Backup**:
```bash
pg_dump your_database_url > backup.sql
```

---

## 🎯 Quick Checklist

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Frontend preview works (`npm run preview`)
- [ ] Created Netlify account
- [ ] Deployed frontend to Netlify
- [ ] Created `_redirects` file
- [ ] Created Railway account
- [ ] Created PostgreSQL database on Railway
- [ ] Deployed backend to Railway
- [ ] Added all environment variables
- [ ] Generated Railway domain
- [ ] Updated `VITE_SERVER_URL` in Netlify
- [ ] Redeployed frontend
- [ ] Tested complete application

---

## 💰 Cost Estimate

**Free Tier Available:**
- **Netlify**: Free (100GB bandwidth/month)
- **Railway**: $5/month free credit (usually enough for small apps)
- **Database**: Included with Railway or use free Supabase/Neon

**Total**: ~$0-5/month for small applications

---

## 📞 Need Help?

1. Check deployment logs in Netlify/Railway
2. Check browser console for errors
3. Verify all environment variables are set
4. Test API endpoints with Postman

**You're all set! 🚀**

