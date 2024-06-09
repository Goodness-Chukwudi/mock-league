import Env from "../config/environment_variables";
import { createClient } from 'redis';
import session from 'express-session';
import { RedisStackStore } from 'connect-redis-stack';

const redisClient = createClient({
    password: Env.REDIS_PASSWORD,
    socket: {
        host: Env.REDIS_HOST,
        port: Env.REDIS_PORT
    }
});

redisClient.on('error', error => console.log('Error connecting to redis client', error));
redisClient.on('ready', () => console.log('Redis connection is ready'));
redisClient.connect();

const redisStackStore = new RedisStackStore({
    client: redisClient,
    prefix: 'mock-league:',
    ttlInSeconds: 3600,
});

const redisSessionStore = () => {
    return session({
        store: redisStackStore,
        resave: false,
        saveUninitialized: false,
        secret: Env.REDIS_SECRET
    });
}

const setCachedData = async (key: string, data: any) => {
    try {
        await redisClient.setEx(key, 3600, JSON.stringify(data))
    } catch (error) {
        throw error;
    }
}

const getCachedData = async (key: string) => {
    try {
        const data = await redisClient.get(key);

        const jsonData = data ? JSON.parse(data) : null;

        return jsonData;
    } catch (error) {
        throw error;
    }

}

const deleteCachedData = async (keys: string[]) => {
    try {
        await redisClient.del(keys);
    } catch (error) {
        throw error;
    }
}

export default redisClient;
export {
    redisSessionStore,
    setCachedData,
    getCachedData,
    deleteCachedData
};