"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCachedData = exports.getCachedData = exports.setCachedData = exports.redisSessionStore = void 0;
const environment_variables_1 = __importDefault(require("../config/environment_variables"));
const redis_1 = require("redis");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_stack_1 = require("connect-redis-stack");
const redisClient = (0, redis_1.createClient)({
    password: environment_variables_1.default.REDIS_PASSWORD,
    socket: {
        host: environment_variables_1.default.REDIS_HOST,
        port: environment_variables_1.default.REDIS_PORT
    }
});
redisClient.on('error', error => console.log('Error connecting to redis client', error));
redisClient.on('ready', () => console.log('Redis connection is ready'));
redisClient.connect();
const redisStackStore = new connect_redis_stack_1.RedisStackStore({
    client: redisClient,
    prefix: 'mock-league:',
    ttlInSeconds: 3600,
});
const redisSessionStore = () => {
    return (0, express_session_1.default)({
        store: redisStackStore,
        resave: false,
        saveUninitialized: false,
        secret: environment_variables_1.default.REDIS_SECRET
    });
};
exports.redisSessionStore = redisSessionStore;
const setCachedData = (key, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.setEx(key, 3600, JSON.stringify(data));
    }
    catch (error) {
        throw error;
    }
});
exports.setCachedData = setCachedData;
const getCachedData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield redisClient.get(key);
        const jsonData = data ? JSON.parse(data) : null;
        return jsonData;
    }
    catch (error) {
        throw error;
    }
});
exports.getCachedData = getCachedData;
const deleteCachedData = (keys) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.del(keys);
    }
    catch (error) {
        throw error;
    }
});
exports.deleteCachedData = deleteCachedData;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map