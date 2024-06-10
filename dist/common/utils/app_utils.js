"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = exports.recordResponseTime = exports.getCode = exports.createMongooseTransaction = void 0;
const randomstring_1 = __importDefault(require("randomstring"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = __importDefault(require("./redis"));
const rateLimiter = () => {
    const limiter = (0, express_rate_limit_1.default)({
        // windowMs: 10 * 1000, // 10 seconds
        // limit: 1, // 1 request per 10 seconds
        windowMs: 60 * 60 * 1000, // 1 hour
        limit: 100, // 100 requests per hour
        legacyHeaders: false,
        store: new rate_limit_redis_1.RedisStore({
            sendCommand: (...args) => redis_1.default.sendCommand(args)
        }),
    });
    return limiter;
};
exports.rateLimiter = rateLimiter;
const getCode = (length = 6, capitalize = false, readable = true) => {
    try {
        const options = {
            length: length,
            readable: readable,
            charset: "alphanumeric",
        };
        if (capitalize) {
            options.capitalization = "uppercase";
        }
        return randomstring_1.default.generate(options);
    }
    catch (error) {
        throw error;
    }
};
exports.getCode = getCode;
const createMongooseTransaction = () => {
    return new Promise((resolve, reject) => {
        let session;
        mongoose_1.default.startSession()
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
};
exports.createMongooseTransaction = createMongooseTransaction;
/**
 * Records and logs the response time for http requests
 * @returns {void}
*/
const recordResponseTime = (req, res, time) => {
    console.log(`${req.method}: ${req.url} => ${time.toFixed(3)} ms `, res.statusCode);
};
exports.recordResponseTime = recordResponseTime;
//# sourceMappingURL=app_utils.js.map