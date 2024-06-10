"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Env = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    PORT: Number(process.env.PORT),
    ALLOWED_ORIGINS: (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(", "),
    API_VERSION: process.env.API_VERSION,
    API_PATH: "/api/" + process.env.API_VERSION,
    APP_URL: process.env.APP_URL,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_SECRET: process.env.REDIS_SECRET
};
exports.default = Env;
//# sourceMappingURL=environment_variables.js.map