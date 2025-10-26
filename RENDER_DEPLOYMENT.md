# 🚀 Free Deployment on Render.com

## Why Render?
- ✅ **100% Free** for small apps
- ✅ **Free PostgreSQL** database
- ✅ **Free SSL** certificate
- ✅ **Docker support**
- ✅ **Automatic deployments** from GitHub
- ⚠️ **Limitation**: Apps sleep after 15 minutes of inactivity (wake up on first request)

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with your **GitHub account**
3. Authorize Render to access your repositories

### Step 3: Create PostgreSQL Database

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `mgnrega-db`
   - **Database**: `mgnrega_db`
   - **User**: `mgnrega_user`
   - **Password**: Generate a strong password (save it!)
4. Click **"Create Database"**
5. **Save the connection string** (you'll need it later)

### Step 4: Deploy Backend API

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mgnrega-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile.prod`
   - **Port**: `3001`
4. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://mgnrega_user:your-password@your-db-host:5432/mgnrega_db
   REDIS_URL=redis://localhost:6379
   DATA_GOV_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   PORT=3001
   ```
5. Click **"Create Web Service"**

### Step 5: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mgnrega-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/out`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Click **"Create Static Site"**

### Step 6: Update Frontend API URL

1. Go to your backend service in Render
2. Copy the **URL** (e.g., `https://mgnrega-backend.onrender.com`)
3. Go to your frontend service
4. Update environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://mgnrega-backend.onrender.com/api
   ```
5. **Redeploy** the frontend

### Step 7: Test Your Application

1. Go to your frontend URL
2. Test district selection
3. Test "Detect My Location"
4. Verify data is loading

## 🔧 Render-Specific Configuration

### Update docker-compose.prod.yml for Render

Since Render doesn't support docker-compose, we need to deploy services separately:

1. **Backend**: Deploy as Web Service with Docker
2. **Frontend**: Deploy as Static Site
3. **Database**: Deploy as PostgreSQL service
4. **Worker**: Deploy as Background Worker (optional)

### Environment Variables for Render

**Backend Service:**
```env
DATABASE_URL=postgresql://mgnrega_user:password@host:5432/mgnrega_db
REDIS_URL=redis://localhost:6379
DATA_GOV_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=3001
```

**Frontend Service:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

## 📊 Render Dashboard

Once deployed, you'll see:
- **Frontend URL**: `https://mgnrega-frontend.onrender.com`
- **Backend URL**: `https://mgnrega-backend.onrender.com`
- **Database**: Managed PostgreSQL instance

## 🐛 Troubleshooting

### App Not Loading
- Check if services are running in Render dashboard
- Check logs for errors
- Verify environment variables

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database is running
- Test connection from backend logs

### Frontend Not Connecting to Backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Test backend API directly

## 💰 Cost

- **Render**: **FREE** (with limitations)
- **Database**: **FREE**
- **SSL**: **FREE**
- **Total**: **$0/month**

## ⚠️ Limitations of Free Tier

1. **Sleep Mode**: Apps sleep after 15 minutes of inactivity
2. **Wake Time**: First request takes 30-60 seconds to wake up
3. **Bandwidth**: Limited bandwidth per month
4. **Build Time**: Limited build minutes per month

## 🎯 Your Public URLs

Once deployed:
- **Frontend**: `https://mgnrega-frontend.onrender.com`
- **API**: `https://mgnrega-backend.onrender.com/api`

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Environment variables configured
- [ ] Application tested
- [ ] URLs working

## 🚀 Next Steps

1. **Deploy to Render** (follow steps above)
2. **Test your application**
3. **Record Loom video**
4. **Submit assignment**

---

**Ready to deploy?** Let me know if you need help with any step!
