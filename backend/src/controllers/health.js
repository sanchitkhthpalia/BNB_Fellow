import { query } from '../utils/db.js';
import { client } from '../utils/redis.js';

export async function getHealth(req, res, next) {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            checks: {}
        };
        
        // Database check
        try {
            await query('SELECT 1');
            health.checks.database = 'healthy';
        } catch (error) {
            health.checks.database = 'unhealthy';
            health.status = 'unhealthy';
        }
        
        // Redis check
        try {
            await client.ping();
            health.checks.redis = 'healthy';
        } catch (error) {
            health.checks.redis = 'unhealthy';
            health.status = 'unhealthy';
        }
        
        // Get last poll status
        try {
            const pollResult = await query(
                'SELECT last_successful_poll, consecutive_failures, status FROM polling_status ORDER BY id DESC LIMIT 1'
            );
            if (pollResult.rows.length > 0) {
                health.last_successful_poll = pollResult.rows[0].last_successful_poll;
                health.consecutive_failures = pollResult.rows[0].consecutive_failures;
                health.poll_status = pollResult.rows[0].status;
            }
        } catch (error) {
            console.error('Error fetching poll status:', error);
        }
        
        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        next(error);
    }
}
