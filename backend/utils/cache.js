/**
 * ⚡ REDIS CACHING UTILITY
 * High-performance caching layer for sub-second API responses
 * Target: 300-800ms response time
 */

const redis = require('redis');

// Redis client configuration
let redisClient = null;
let isRedisAvailable = false;

// Initialize Redis client
const initRedis = async () => {
    try {
        // Check if Redis URL is provided
        if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
            console.log('⚠️  Redis not configured - caching disabled (using in-memory fallback)');
            return null;
        }

        const redisConfig = process.env.REDIS_URL 
            ? { url: process.env.REDIS_URL }
            : {
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379
                },
                password: process.env.REDIS_PASSWORD || undefined
            };

        redisClient = redis.createClient(redisConfig);

        redisClient.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
            isRedisAvailable = false;
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis connected successfully');
            isRedisAvailable = true;
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error('❌ Redis initialization failed:', error.message);
        console.log('⚠️  Falling back to in-memory caching');
        return null;
    }
};

// In-memory cache fallback (for development without Redis)
const memoryCache = new Map();
const memoryCacheExpiry = new Map();

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {Promise<any>} - Cached data or null
 */
const get = async (key) => {
    try {
        if (isRedisAvailable && redisClient) {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } else {
            // Fallback to memory cache
            const expiry = memoryCacheExpiry.get(key);
            if (expiry && Date.now() > expiry) {
                memoryCache.delete(key);
                memoryCacheExpiry.delete(key);
                return null;
            }
            return memoryCache.get(key) || null;
        }
    } catch (error) {
        console.error('Cache GET error:', error);
        return null;
    }
};

/**
 * Set cached data
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttl - Time to live in seconds
 */
const set = async (key, value, ttl = 300) => {
    try {
        if (isRedisAvailable && redisClient) {
            await redisClient.setEx(key, ttl, JSON.stringify(value));
        } else {
            // Fallback to memory cache
            memoryCache.set(key, value);
            memoryCacheExpiry.set(key, Date.now() + (ttl * 1000));
        }
    } catch (error) {
        console.error('Cache SET error:', error);
    }
};

/**
 * Delete cached data
 * @param {string} key - Cache key
 */
const del = async (key) => {
    try {
        if (isRedisAvailable && redisClient) {
            await redisClient.del(key);
        } else {
            memoryCache.delete(key);
            memoryCacheExpiry.delete(key);
        }
    } catch (error) {
        console.error('Cache DEL error:', error);
    }
};

/**
 * Delete multiple keys matching a pattern
 * @param {string} pattern - Key pattern (e.g., 'announcements:*')
 */
const delPattern = async (pattern) => {
    try {
        if (isRedisAvailable && redisClient) {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } else {
            // Fallback: delete matching keys from memory cache
            const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
            for (const key of memoryCache.keys()) {
                if (regex.test(key)) {
                    memoryCache.delete(key);
                    memoryCacheExpiry.delete(key);
                }
            }
        }
    } catch (error) {
        console.error('Cache DEL PATTERN error:', error);
    }
};

/**
 * Clear all cache
 */
const flushAll = async () => {
    try {
        if (isRedisAvailable && redisClient) {
            await redisClient.flushAll();
        } else {
            memoryCache.clear();
            memoryCacheExpiry.clear();
        }
    } catch (error) {
        console.error('Cache FLUSH error:', error);
    }
};

/**
 * Cache middleware for Express routes
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} - Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedData = await get(key);
            
            if (cachedData) {
                console.log(`✅ Cache HIT: ${key}`);
                return res.status(200).json(cachedData);
            }

            console.log(`❌ Cache MISS: ${key}`);

            // Store original res.json
            const originalJson = res.json.bind(res);

            // Override res.json to cache the response
            res.json = function(data) {
                // Only cache successful responses
                if (res.statusCode === 200) {
                    set(key, data, ttl).catch(err => 
                        console.error('Failed to cache response:', err)
                    );
                }
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

module.exports = {
    initRedis,
    get,
    set,
    del,
    delPattern,
    flushAll,
    cacheMiddleware,
    isRedisAvailable: () => isRedisAvailable
};
