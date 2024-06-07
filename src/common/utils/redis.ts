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


export default redisClient;
export {
    redisSessionStore
};