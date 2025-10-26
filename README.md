# Our Voice, Our Rights - MGNREGA District Dashboard

A production-ready, lightweight web application for rural Indian citizens to track MGNREGA performance in their districts. Designed specifically for low-literacy users with accessibility features, audio summaries, and clear visual indicators.

## 🎯 Goal

Create a hosted web app where any rural Indian citizen can select their district (or be auto-detected via geolocation) and instantly understand simple, visual summaries of MGNREGA performance (current + past + comparative).

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (React) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Worker**: Node.js polling service
- **Charts**: Chart.js / React-ChartJS-2
- **Hosting**: Docker + docker-compose
- **Web Server**: Nginx with Let's Encrypt SSL

## 📁 Project Structure

```
mgnrega-dashboard/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── worker/            # Data polling service
├── nginx/             # Nginx configuration
├── scripts/           # Deployment scripts
├── docker-compose.yml # Development environment
└── docker-compose.prod.yml # Production environment
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd BFB_Fellow
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Postgres: localhost:5432
- Redis: localhost:6379

### Manual Setup (without Docker)

1. **Install dependencies**
```bash
# Root
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..

# Worker
cd worker
npm install
```

2. **Set up PostgreSQL**
```bash
# Create database
psql -U postgres
CREATE DATABASE mgnrega_db;
\q

# Run migrations
psql -U postgres -d mgnrega_db -f backend/db/init.sql
```

3. **Start Redis**
```bash
redis-server
```

4. **Start services**
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Worker (terminal 2)
cd worker
npm start

# Frontend (terminal 3)
cd frontend
npm run dev
```

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Production
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## 📊 Database Schema

### Tables

- **states**: State information
- **districts**: District information with geo-coordinates
- **mgnrega_snapshots**: Monthly performance data
- **polling_status**: Worker status and last poll time

### Seed Data

Sample data for 3 months across 3 districts is included in `backend/db/init.sql`.

## 🔌 API Endpoints

### Health Check
```bash
GET /api/health
```

### Districts
```bash
# Get all districts
GET /api/districts

# Get districts by state
GET /api/districts?state_id=1

# Get latest snapshot for a district
GET /api/districts/:id/latest

# Get historical data
GET /api/districts/:id/history?months=12

# Compare district with state average
GET /api/districts/:id/compare?with=state
```

### Example API Calls

```bash
# Health check
curl http://localhost:3001/api/health

# Get all districts
curl http://localhost:3001/api/districts

# Get latest data for district ID 1
curl http://localhost:3001/api/districts/1/latest

# Get 12 months history
curl http://localhost:3001/api/districts/1/history?months=12
```

## 🌐 Production Deployment (VPS)

### 1. Prepare VPS

```bash
# SSH into your VPS
ssh ubuntu@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again
exit
```

### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd mgnrega-dashboard

# Create .env file with production values
nano .env
# Edit with: POSTGRES_PASSWORD, JWT_SECRET, DATA_GOV_API_KEY, DOMAIN

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate (replace your-domain.com)
sudo certbot certonly --standalone -d your-domain.com

# Update nginx configuration with your domain
sudo nano nginx/conf.d/default.conf
# Replace 'your-domain.com' in SSL paths

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### 4. Set Up Automatic Backups

```bash
# Create backup script
sudo nano /usr/local/bin/mgnrega-backup.sh
```

Add this content:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
docker exec mgnrega-dashboard-postgres-1 pg_dump -U mgnrega_user mgnrega_db > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/mgnrega-backup.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/mgnrega-backup.sh
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔒 Security

- Rate limiting: 100 requests/minute per IP
- Input sanitization on all API endpoints
- Parameterized queries (SQL injection prevention)
- CORS restrictions
- Helmet.js for security headers
- Environment variables for secrets

## ♿ Accessibility Features

- Large buttons (min 44x44px touch targets)
- High contrast colors
- Font size controls
- Keyboard navigation support
- ARIA labels and roles
- Screen reader support
- TTS "Hear Summary" button

## 📱 Features for Low-Literacy Users

- **4 Key Metrics Only**: Workdays, Wages Paid, People Benefited, Payment Delays
- **Large Icons**: 32-48px pictograms for each metric
- **Color Coding**: Green = improving, Red = worsening, Gray = neutral
- **Audio Summary**: Browser SpeechSynthesis API reads data in simple language
- **Help Tooltips**: "?" button with explanations
- **Trend Indicators**: Visual arrows showing improvement/decline

## 🔄 Worker Service

The worker polls the data.gov.in API every 24 hours:

- Exponential backoff on failures
- Retry on 429 (rate limit)
- Cache invalidation after update
- Status tracking in database
- Alert on 3+ consecutive failures

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U mgnrega_user -d mgnrega_db
```

### Redis Connection Issues
```bash
# Check Redis
docker-compose logs redis

# Test connection
docker-compose exec redis redis-cli ping
```

### CORS Issues
Update `FRONTEND_URL` in backend `.env` file

### data.gov.in API 429 (Rate Limit)
The worker automatically implements exponential backoff. If persistent:
- Check API key is valid
- Reduce polling frequency
- Contact data.gov.in support

## 📈 Monitoring

### Health Check
```bash
curl http://your-domain.com/api/health
```

### Check Worker Status
```bash
docker-compose exec backend psql -U mgnrega_user -d mgnrega_db -c "SELECT * FROM polling_status;"
```

## 📝 Environment Variables

### Backend & Worker
```env
DATABASE_URL=postgresql://user:pass@host:5432/mgnrega_db
REDIS_URL=redis://localhost:6379
DATA_GOV_API_KEY=your-api-key
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=production
POLL_INTERVAL_HOURS=24
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### Production
```env
DOMAIN=your-domain.com
POSTGRES_PASSWORD=secure-password
```

## 📄 License

MIT License


## 📞 Support

For issues or questions, please open an issue on GitHub.
