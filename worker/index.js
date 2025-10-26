import { Pool } from 'pg';
import { createClient } from 'redis';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

// Connect to Redis
await redisClient.connect();

// Config
const API_BASE = 'https://api.data.gov.in/resource';
const API_KEY = process.env.DATA_GOV_API_KEY;
const POLL_INTERVAL_HOURS = parseInt(process.env.POLL_INTERVAL_HOURS) || 24;

// Exponential backoff helper
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'api-key': API_KEY,
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('retry-after')) || delay * Math.pow(2, i);
                console.log(`Rate limited. Retrying after ${retryAfter}ms`);
                await sleep(retryAfter);
                continue;
            }
            
            if (response.status >= 500) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const waitTime = delay * Math.pow(2, i);
            console.log(`Attempt ${i + 1} failed. Retrying in ${waitTime}ms...`);
            await sleep(waitTime);
        }
    }
}

async function updatePollingStatus(status, error = null) {
    await dbPool.query(
        `UPDATE polling_status SET 
            last_attempt = CURRENT_TIMESTAMP,
            consecutive_failures = CASE WHEN $1 = 'success' THEN 0 ELSE consecutive_failures + 1 END,
            status = $1,
            error_message = $2
        WHERE id = (SELECT id FROM polling_status ORDER BY id DESC LIMIT 1)`,
        [status, error]
    );
}

async function recordSuccessfulPoll() {
    await dbPool.query(
        `UPDATE polling_status SET 
            last_successful_poll = CURRENT_TIMESTAMP,
            last_attempt = CURRENT_TIMESTAMP,
            consecutive_failures = 0,
            status = 'success',
            error_message = NULL
        WHERE id = (SELECT id FROM polling_status ORDER BY id DESC LIMIT 1)`
    );
}

async function fetchMgnregaData() {
    console.log('Starting MGNREGA data fetch...');
    
    try {
        // Example API endpoint - adjust based on actual data.gov.in API structure
        const url = `${API_BASE}/mgnrega-data?api-key=${API_KEY}&format=json&limit=1000`;
        
        const data = await fetchWithRetry(url);
        
        console.log('Fetched data from API:', data.records?.length || 0, 'records');
        
        // Process and store data
        if (data.records && Array.isArray(data.records)) {
            for (const record of data.records) {
                // Normalize and store in database
                // This is a simplified example - adjust based on actual API structure
                const {
                    district_code,
                    year,
                    month,
                    workdays,
                    wages_paid,
                    people_benefited,
                    funds_disbursed,
                    payment_delay
                } = normalizeRecord(record);
                
                // Find district
                const districtResult = await dbPool.query(
                    'SELECT id FROM districts WHERE code = $1',
                    [district_code]
                );
                
                if (districtResult.rows.length === 0) {
                    console.log(`District not found: ${district_code}`);
                    continue;
                }
                
                const districtId = districtResult.rows[0].id;
                
                // Insert or update snapshot
                await dbPool.query(
                    `INSERT INTO mgnrega_snapshots 
                    (district_id, year, month, workdays, wages_paid, people_benefited, funds_disbursed, payment_delay_days)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (district_id, year, month) 
                    DO UPDATE SET
                        workdays = EXCLUDED.workdays,
                        wages_paid = EXCLUDED.wages_paid,
                        people_benefited = EXCLUDED.people_benefited,
                        funds_disbursed = EXCLUDED.funds_disbursed,
                        payment_delay_days = EXCLUDED.payment_delay_days,
                        updated_at = CURRENT_TIMESTAMP`,
                    [districtId, year, month, workdays, wages_paid, people_benefited, funds_disbursed, payment_delay]
                );
                
                // Clear cache for this district
                await redisClient.del(`district:${districtId}:latest`);
                await redisClient.del(`district:${districtId}:history:*`);
                await redisClient.del(`district:${districtId}:compare:*`);
            }
        }
        
        await recordSuccessfulPoll();
        console.log('Data fetch completed successfully');
        
    } catch (error) {
        console.error('Error fetching data:', error);
        await updatePollingStatus('failed', error.message);
        
        // If 3+ consecutive failures, send alert
        const statusResult = await dbPool.query(
            'SELECT consecutive_failures FROM polling_status ORDER BY id DESC LIMIT 1'
        );
        
        if (statusResult.rows[0]?.consecutive_failures >= 3) {
            console.error('ALERT: Multiple consecutive failures detected!');
            // Add email/notification logic here
        }
    }
}

function normalizeRecord(record) {
    // Normalize the record based on API response structure
    // Adjust based on actual data.gov.in API format
    return {
        district_code: record.district_code || record.district || '',
        year: parseInt(record.year || record.financial_year || new Date().getFullYear()),
        month: parseInt(record.month || 1),
        workdays: parseInt(record.person_days || record.workdays || 0),
        wages_paid: parseFloat(record.wages_paid || 0),
        people_benefited: parseInt(record.households_provided_employment || 0),
        funds_disbursed: parseFloat(record.funds_disbursed || 0),
        payment_delay: parseInt(record.payment_delay_days || 0)
    };
}

// Main polling loop
async function startWorker() {
    console.log('MGNREGA Worker started');
    console.log(`Poll interval: ${POLL_INTERVAL_HOURS} hours`);
    
    // Run immediately on start
    await fetchMgnregaData();
    
    // Then run on interval
    setInterval(async () => {
        await fetchMgnregaData();
    }, POLL_INTERVAL_HOURS * 60 * 60 * 1000);
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await dbPool.end();
    await redisClient.quit();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Shutting down worker...');
    await dbPool.end();
    await redisClient.quit();
    process.exit(0);
});

startWorker().catch(console.error);
