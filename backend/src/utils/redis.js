import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
let isConnected = false;

export async function connectRedis() {
    if (!isConnected) {
        try {
            await client.connect();
            isConnected = true;
            console.log('Connected to Redis');
        } catch (error) {
            console.error('Redis connection error:', error);
            throw error;
        }
    }
}

export async function disconnectRedis() {
    if (isConnected) {
        await client.quit();
        isConnected = false;
        console.log('Disconnected from Redis');
    }
}

// Cache helper functions
export async function getCached(key) {
    try {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
}

export async function setCached(key, value, ttlSeconds = 86400) {
    try {
        await client.setEx(key, ttlSeconds, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Redis set error:', error);
        return false;
    }
}

export async function deleteCached(key) {
    try {
        await client.del(key);
        return true;
    } catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
}

export { client };
