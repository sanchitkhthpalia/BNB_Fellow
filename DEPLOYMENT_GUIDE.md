# 🚀 MGNREGA Dashboard - Deployment Guide

## Quick Deployment Steps

### Step 1: Create VPS Server (DigitalOcean)

1. **Sign up**: Go to https://www.digitalocean.com
2. **Create Droplet**:
   - Choose: **Ubuntu 22.04 LTS**
   - Plan: **Basic (6 GB RAM - 1 vCPU - 25 GB SSD) - $6/month**
   - Choose datacenter: **Bangalore, India** (closest to your users)
   - Add SSH key or create password
3. **Copy your server IP** (e.g., `159.89.12.34`)

### Step 2: Connect to Your Server

```bash
# If using SSH key
ssh root@your-server-ip

# If using password
# Enter the password you set
```

### Step 3: Setup Docker on Server

Once connected to your server, run these commands:

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Add user to docker group (if not root)
usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose version
```

### Step 4: Clone Your Repository

```bash
# Install git if not present
apt install git -y

# Clone your repository
git clone https://github.com/sanchitkhthpalia/BNB_Fellow.git
cd BFB_Fellow
```

### Step 5: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file
nano .env
```

Update these critical values in `.env`:

```env
# API Key (already have this)
DATA_GOV_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b

# Server Configuration
NODE_ENV=production
DOMAIN=your-server-ip

# JWT Secret (change this to a random string)
JWT_SECRET=change-this-to-a-random-secret-production-key-min-32-characters

# Database passwords (keep default or change)
DATABASE_URL=postgresql://mgnrega_user:mgnrega_pass@postgres:5432/mgnrega_db
POSTGRES_PASSWORD=mgnrega_pass
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Start the Application

```bash
# Start all services with production configuration
docker-compose -f docker-compose.prod.yml up -d

# Check if everything is running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 7: Configure Firewall

```bash
# Allow HTTP traffic
ufw allow 80/tcp

# Allow HTTPS traffic  
ufw allow 443/tcp

# Allow SSH
ufw allow 22/tcp

# Enable firewall
ufw enable
```

### Step 8: Access Your Application!

Open in browser: `http://your-server-ip`

## 🎯 Your Public URL

Once deployed, your application will be accessible at:
- **Frontend**: `http://your-server-ip`
- **API**: `http://your-server-ip/api`

## 🔒 Optional: Setup SSL (HTTPS)

If you have a domain name, you can setup HTTPS:

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com

# Automatic renewal
certbot renew --dry-run
```

## 📊 Monitoring Your Application

### Check Application Status

```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs worker

# Check database
docker-compose -f docker-compose.prod.yml exec postgres psql -U mgnrega_user -d mgnrega_db -c "SELECT COUNT(*) FROM districts;"
```

### Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart frontend
```

### Update Application

```bash
cd BFB_Fellow
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🐛 Troubleshooting

### Can't access the website

```bash
# Check if containers are running
docker ps

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Check if port 80 is open
netstat -tlnp | grep 80
```

### Database connection issues

```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Check if database is accessible
docker-compose -f docker-compose.prod.yml exec postgres pg_isready
```

### Worker not fetching data

```bash
# Check worker logs
docker-compose -f docker-compose.prod.yml logs worker

# Manually trigger worker
docker-compose -f docker-compose.prod.yml exec worker node index.js
```

## ✅ Deployment Checklist

- [ ] Created VPS server
- [ ] Installed Docker & Docker Compose
- [ ] Cloned repository
- [ ] Configured `.env` file with API key
- [ ] Started services with `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Opened ports 80 and 443 in firewall
- [ ] Verified application is accessible at `http://your-server-ip`
- [ ] Tested district selection
- [ ] Tested "Detect My Location" feature
- [ ] Verified data is loading correctly

## 📝 What You'll Submit

1. **Hosted URL**: `http://your-server-ip`
2. **Loom Video Link**: Record your 2-minute demo video
3. **GitHub Repository**: Already pushed ✅

## 💰 Estimated Costs

- **DigitalOcean**: $6/month (6 GB RAM)
- **Total for 1 month**: ~$6 USD
- **Optional domain**: $10-15/year (from Namecheap/GoDaddy)

## 🎉 Once Deployed

Share your public URL in the assignment submission!

---

**Need help?** Check the application logs and error messages. Most issues are related to:
- Missing environment variables
- Port conflicts
- Docker not running
- Database connection issues

