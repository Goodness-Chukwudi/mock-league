"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const environment_variables_1 = __importDefault(require("../config/environment_variables"));
const corsOptions = {
    origin: environment_variables_1.default.ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Date", "Content-Type", "Origin", "Authorization"],
    credentials: true,
    optionSuccessStatus: 200,
};
const corsSettings = (0, cors_1.default)(corsOptions);
exports.default = corsSettings;
//# sourceMappingURL=cors.js.map