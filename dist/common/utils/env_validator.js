"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const app_config_1 = require("../config/app_config");
const environment_variables_1 = __importDefault(require("../config/environment_variables"));
function validateEnvironmentVariables() {
    try {
        const EnvSchema = joi_1.default.object({
            ENVIRONMENT: joi_1.default.string().valid(...Object.values(app_config_1.ENVIRONMENTS)).required(),
            PORT: joi_1.default.number().required(),
            ALLOWED_ORIGINS: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
            API_VERSION: joi_1.default.string().required(),
            API_PATH: joi_1.default.string().required(),
            APP_URL: joi_1.default.string().required(),
            MONGODB_URI: joi_1.default.string().required(),
            JWT_PRIVATE_KEY: joi_1.default.string().required(),
            JWT_EXPIRY: joi_1.default.string().required(),
            REDIS_PASSWORD: joi_1.default.string().required(),
            REDIS_HOST: joi_1.default.string().required(),
            REDIS_PORT: joi_1.default.number().required(),
            REDIS_SECRET: joi_1.default.string().required(),
        });
        const response = EnvSchema.validate(environment_variables_1.default);
        if (response.error)
            throw new Error(`Env validation error: ${response.error.message}`);
    }
    catch (error) {
        throw error;
    }
}
;
exports.default = validateEnvironmentVariables;
//# sourceMappingURL=env_validator.js.map