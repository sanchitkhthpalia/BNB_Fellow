# Loom Demo Script - MGNREGA Dashboard
Duration: ~2 minutes (120 seconds)

## Script

### [0:00 - 0:15] Introduction
"Hi! I'm going to show you 'Our Voice, Our Rights' - a dashboard for rural Indians to track MGNREGA performance in their district. It's designed specifically for low-literacy users with large buttons, simple visuals, and audio summaries."

### [0:15 - 0:40] Homepage & District Selection
"On the homepage, users can either click 'Detect My Location' for automatic district detection, or search and select their district manually. Let me search for Pune district in Maharashtra."

*[Click on district selector, search for "Pune", select it]*

### [0:40 - 1:10] Dashboard Overview
"The dashboard shows 4 key metrics at the top: Workdays, Wages Paid, People Benefited, and Payment Delay. Each metric has a large icon and trend indicator. Green arrows mean improving, red means getting worse."

*[Point to each metric card]*

"You can see Pune had 48,000 workdays this month, with over 10 crores in wages paid to 1,300 people. The payment delay is 18 days."

### [1:10 - 1:30] Audio Summary Feature
"Here's the most important feature for low-literacy users - the 'Hear Summary' button. Let me click it."

*[Click "Hear Summary" button]*

*[Let audio play for 5 seconds, then pause/cut]*

"The browser reads the summary in simple language - perfect for users who can't read well."

### [1:30 - 1:50] Backend & Data
"Behind the scenes, we have a worker service that polls the data.gov.in API every 24 hours, stores data in PostgreSQL, and caches responses in Redis for fast performance."

*[Show API health endpoint in browser/Postman if visible]*

### [1:50 - 2:00] Closing
"The app is built with Next.js and Express, fully containerized with Docker, and can be deployed to any VPS with SSL. It's designed to be resilient - if the API is down, it serves cached data with a clear timestamp."

"That's 'Our Voice, Our Rights' - empowering rural citizens with accessible MGNREGA data. Thanks for watching!"

## Key Points to Emphasize

1. ✅ Accessibility first - large buttons, simple language, audio support
2. ✅ Production-ready - Docker, Redis caching, health checks
3. ✅ Resilience - graceful degradation if API fails
4. ✅ Low-literacy friendly - 4 metrics only, big icons, colors
5. ✅ Mobile responsive - works on feature phones and smartphones

## What to Show

- [ ] District selector page
- [ ] Dashboard with 4 metrics
- [ ] Audio summary button in action
- [ ] Clean, simple UI
- [ ] Responsive design (optional)

## What NOT to Show

- ❌ Code or technical details
- ❌ Complex charts (keep it simple)
- ❌ Command line or deployment details
- ❌ Any broken/buggy features

## Tips for Recording

1. Use a clean browser window
2. Clear browser cache before recording
3. Have sample data loaded
4. Practice the audio summary once before recording
5. Keep it under 2 minutes
6. Use clear, slow speech
7. Highlight the "Hear Summary" feature prominently
