import RandomString, { GenerateOptions } from 'randomstring';
import mongoose, { ClientSession } from 'mongoose';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from "./redis"

const rateLimiter = () => {
    const limiter = rateLimit({
        // windowMs: 10 * 1000, // 10 seconds
        // limit: 1, // 1 request per 10 seconds
        windowMs: 60 * 60 * 1000, // 1 hour
        limit: 100, // 100 requests per hour
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args)
        }),
    })

    return limiter;
}

const getCode = (length:number = 6, capitalize = false, readable = true): string => {
    try {
        const options: GenerateOptions = {
            length: length,
            readable: readable,
            charset: "alphanumeric",
        }
        if (capitalize) {
            options.capitalization = "uppercase";
        }
        return RandomString.generate(options);

    } catch (error) {
        throw error
    }
}

const createMongooseTransaction = (): Promise<ClientSession> => {
    return new Promise((resolve, reject) => {
        let session: ClientSession;
        mongoose.startSession()
            .then(_session => {
                session = _session;
                session.startTransaction();
            })
            .then(() => {
                resolve(session);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Records and logs the response time for http requests
 * @returns {void}
*/
const recordResponseTime = (req:Request, res:Response, time:number) => {
    console.log(`${req.method}: ${req.url} => ${time.toFixed(3)} ms `, res.statusCode);
}

export {
    createMongooseTransaction,
    getCode,
    recordResponseTime,
    rateLimiter
};
