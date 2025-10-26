# Deployment Checklist - MGNREGA Dashboard

## 📊 Assignment Requirements Summary

### ✅ Core Requirements Met
- [x] Web app for MGNREGA district performance
- [x] Low-literacy friendly UI (large icons, simple metrics)
- [x] Current & past performance data
- [x] Production-ready architecture (Docker, Redis, PostgreSQL)
- [x] Resilience (caching, error handling, exponential backoff)
- [x] Auto-detect district from location (bonus feature)
- [x] Large state selected (Maharashtra + Delhi for testing)

### ⏳ Remaining Requirements
- [ ] **Deployed to VPS/VM** (not AI platforms)
- [ ] **Public URL** for submission
- [ ] **Loom video** (<2 minutes)
- [ ] **Real MGNREGA data** from data.gov.in API

---

## 🚀 Quick Deployment Guide

### Step 1: Get API Key (5 minutes)

1. Visit: https://data.gov.in/user/register
2. Create free account
3. Go to: https://data.gov.in/resource/api
4. Copy your API key
5. Add to `.env` file:
   ```env
   DATA_GOV_API_KEY=your-api-key-here
   ```

### Step 2: Deploy to VPS (30 minutes)

Choose one:

#### Option A: DigitalOcean (Recommended)
- Sign up: https://www.digitalocean.com
- Create $6/month droplet (Ubuntu 22.04)
- Connect via SSH

#### Option B: AWS EC2
- Launch t2.micro instance (free tier)
- Security group: open ports 80, 443, 22

#### Option C: Azure/Google Cloud
- Similar process

### Step 3: Server Setup (Run on VPS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Clone repository
git clone https://github.com/sanchitkhthpalia/BNB_Fellow.git
cd BFB_Fellow

# Create .env file
nano .env
# Add your DATA_GOV_API_KEY and other variables

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Step 4: Access Your Site

- Your IP: `http://your-server-ip`
- Test: `curl http://your-server-ip/api/health`

### Step 5: Setup SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 📹 Record Loom Demo (15 minutes)

### Requirements
- Maximum 2 minutes
- Show key features
- Don't show code
- Focus on user experience

### Script (see LOOM_SCRIPT.md)

1. **0:00-0:15** - Introduction
   - "Our Voice, Our Rights - MGNREGA Dashboard"
   - "Built for low-literacy rural citizens"

2. **0:15-0:40** - District Selection
   - Show detect location button
   - Show district search
   - Select a district

3. **0:40-1:10** - Dashboard
   - Show 4 metrics
   - Explain icons
   - Show trend arrows

4. **1:10-1:40** - Audio Summary
   - Click "Hear Summary"
   - Let it play briefly
   - "Perfect for non-readers"

5. **1:40-2:00** - Technical Highlights
   - "Production-ready"
   - "Real-time data from government APIs"
   - "Deployed on VPS"

### Recording Tips
- Use clean browser
- Full screen demo
- Speak clearly
- Stay under 2 minutes

---

## 📝 Submission Requirements

### Required Deliverables

1. **Loom Video Link**: Public URL to your 2-minute demo
2. **Hosted Website URL**: Live URL of your deployed app
3. **Code Repository**: Already on GitHub ✅

### What to Include in Submission

```
## Submission for MGNREGA Dashboard

**Demo Video**: [Loom link here]
**Live Website**: [Deployed URL here]

### Key Features Demonstrated:
1. District auto-detection (bonus feature)
2. Low-literacy friendly UI (large icons, simple metrics)
3. Text-to-Speech audio summaries
4. Production architecture (Docker, Redis, PostgreSQL)
5. Resilience (caching, error handling)

### Technical Stack:
- Frontend: Next.js 14 + Tailwind CSS
- Backend: Express.js + PostgreSQL
- Cache: Redis
- Deployment: Docker + Nginx
- Worker: Automated data polling

### Bonus Feature:
✅ Geolocation-based district detection without manual selection
```

---

## 🎯 Completion Status

| Task | Status | Priority |
|------|--------|----------|
| Code Development | ✅ 100% Complete | Done |
| Local Testing | ✅ Working | Done |
| GitHub Repository | ✅ Pushed | Done |
| API Key | ⏳ Required | **HIGH** |
| VPS Deployment | ⏳ Required | **HIGH** |
| SSL Certificate | ⏳ Optional | Low |
| Loom Video | ⏳ Required | **HIGH** |
| Final Submission | ⏳ Pending | **HIGH** |

---

## ⏱️ Time Estimate

- **Get API Key**: 5 minutes
- **Deploy to VPS**: 30 minutes
- **Record Loom Video**: 15 minutes
- **Test Everything**: 10 minutes

**Total Time**: ~1 hour to complete submission

---

## 🆘 Troubleshooting

### If Worker Doesn't Fetch Data
```bash
# Check logs
docker logs bfb_fellow-worker-1

# Check API key
docker exec bfb_fellow-worker-1 env | grep DATA_GOV_API_KEY
```

### If Database Issues
```bash
# Recreate database
docker-compose down -v
docker-compose up -d
```

### If Frontend Not Loading
```bash
# Check logs
docker logs bfb_fellow-frontend-1

# Restart
docker-compose restart frontend
```

---

## 🎉 You're Almost Done!

The hard work is complete:
- ✅ All code written and tested
- ✅ All features implemented  
- ✅ All documentation ready
- ✅ Repository pushed to GitHub

**Just need to:**
1. Get API key (5 min)
2. Deploy to VPS (30 min)
3. Record Loom video (15 min)

**You've got this!** 🚀

