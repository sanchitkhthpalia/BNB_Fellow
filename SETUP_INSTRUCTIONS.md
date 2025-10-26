# MGNREGA Dashboard - Setup Instructions

## Quick Start Commands

### 1. Install Dependencies

```bash
# Install Docker and Docker Compose first
# Then run:
docker-compose up -d
```

### 2. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Get all districts
curl http://localhost:3001/api/districts

# Get latest data for district 1
curl http://localhost:3001/api/districts/1/latest
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://mgnrega_user:mgnrega_pass@postgres:5432/mgnrega_db
POSTGRES_PASSWORD=mgnrega_pass

# Redis
REDIS_URL=redis://redis:6379

# API Keys
DATA_GOV_API_KEY=your-api-key-here
JWT_SECRET=change-this-to-a-random-secret

# Server
PORT=3001
NODE_ENV=development

# Domain (for production)
DOMAIN=your-domain.com

# Worker
POLL_INTERVAL_HOURS=24

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Database Setup

The database schema is automatically created via `backend/db/init.sql` when Postgres container starts.

Sample data includes:
- 3 states (Maharashtra, Uttar Pradesh, Madhya Pradesh)
- 2 districts (Pune, Nagpur)
- 3 months of MGNREGA data

## Project Structure

```
BFB_Fellow/
├── frontend/          # Next.js app
│   ├── app/          # App directory
│   ├── public/       # Static files
│   └── package.json
├── backend/          # Express API
│   ├── src/         # Source code
│   ├── db/          # Database schema
│   └── package.json
├── worker/          # Polling service
│   ├── index.js
│   └── package.json
├── nginx/           # Nginx config
├── docker-compose.yml
└── README.md
```

## Development Workflow

### Start Development
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

## Deployment

See README.md for detailed production deployment instructions on VPS.
