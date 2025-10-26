# Environment Variables Setup Guide

## 🔑 Required Environment Variables

You need to set up environment variables for the application to work properly. Here's what you need:

### 1. **Data.gov.in API Key** (REQUIRED)
- **Purpose**: Worker service polls MGNREGA data from data.gov.in API
- **How to get**: 
  1. Go to https://data.gov.in/
  2. Register for an account
  3. Request an API key
  4. Copy the API key

### 2. **PostgreSQL Password** (REQUIRED)
- **Purpose**: Database security
- **Default**: `mgnrega_pass` (change for production)

### 3. **JWT Secret** (REQUIRED for production)
- **Purpose**: Security for API authentication
- **Generate**: Use a random string generator

## 📝 Setup Steps

### Step 1: Copy Environment Template
```bash
cp .env.example .env
```

### Step 2: Edit .env File
Open `.env` file and update these values:

```env
# REQUIRED: Get from https://data.gov.in/
DATA_GOV_API_KEY=your-actual-api-key-here

# REQUIRED: Change for production
POSTGRES_PASSWORD=your-secure-password

# REQUIRED: Generate a random secret
JWT_SECRET=your-random-secret-key

# OPTIONAL: For production deployment
DOMAIN=your-domain.com
```

### Step 3: Start the Application
```bash
docker-compose up -d
```

## 🚨 Important Notes

### For Development
- You can use the default values for most variables
- **DATA_GOV_API_KEY** is the only one you MUST get from data.gov.in
- The app will work with sample data even without the API key

### For Production
- **CHANGE ALL PASSWORDS AND SECRETS**
- Use strong, random passwords
- Set `NODE_ENV=production`
- Update `DOMAIN` to your actual domain

## 🔧 What Each Variable Does

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATA_GOV_API_KEY` | Polls MGNREGA data from API | ✅ Yes |
| `POSTGRES_PASSWORD` | Database password | ✅ Yes |
| `JWT_SECRET` | API security | ✅ Yes (prod) |
| `DATABASE_URL` | Database connection | ✅ Yes |
| `REDIS_URL` | Cache connection | ✅ Yes |
| `PORT` | Backend port | ❌ No (default: 3001) |
| `NODE_ENV` | Environment mode | ❌ No (default: development) |
| `DOMAIN` | Production domain | ❌ No (for prod only) |

## 🧪 Testing Without API Key

The application includes sample data, so you can test it without a real API key:

1. **Start with sample data**:
```bash
docker-compose up -d
```

2. **Access the app**: http://localhost:3000

3. **Test with sample districts**: Pune, Nagpur

The worker will show errors in logs, but the frontend will work with cached sample data.

## 🚀 Quick Start (Minimal Setup)

For immediate testing:

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env and add your data.gov.in API key
# DATA_GOV_API_KEY=your-key-here

# 3. Start the application
docker-compose up -d

# 4. Access at http://localhost:3000
```

## 🔍 Troubleshooting

### Worker Service Errors
- **Error**: "API key not found"
- **Solution**: Add `DATA_GOV_API_KEY` to `.env` file

### Database Connection Errors
- **Error**: "Connection refused"
- **Solution**: Check `POSTGRES_PASSWORD` in `.env`

### Frontend Not Loading
- **Error**: "API connection failed"
- **Solution**: Check `NEXT_PUBLIC_API_URL` in `.env`

## 📞 Support

If you need help getting an API key from data.gov.in:
1. Visit https://data.gov.in/
2. Look for "API" or "Developer" section
3. Register and request access
4. Follow their documentation

The application will work with sample data even without the API key!
