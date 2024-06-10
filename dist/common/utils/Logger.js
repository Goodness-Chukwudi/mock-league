"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const environment_variables_1 = __importDefault(require("../config/environment_variables"));
const app_config_1 = require("../config/app_config");
require("winston-mongodb");
/**
 * A Utility class that provides methods used for logging
*/
class Logger {
    /**
     * Logs the provided error to console
     * - Logs to file as well if environment is set to production
     * @param error javascript error object
     * @param res an optional express Response object
     * - res is provided if the error occurred in a http request and the route and method needs to be recorded
     * @returns void
    */
    captureError(error, res) {
        winston_1.default.add(new winston_1.default.transports.Console({
            format: winston_1.default.format.prettyPrint(),
        }));
        winston_1.default.add(
        // @ts-ignore
        new winston_1.default.transports.MongoDB({
            db: environment_variables_1.default.MONGODB_URI,
            options: {
                dbName: "gomoney_mock_league_logs",
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
            },
        }));
        if (environment_variables_1.default.ENVIRONMENT == app_config_1.ENVIRONMENTS.PROD) {
            // winston.add(
            //     new winston.transports.File({
            //         filename: "Error Logs.log",
            //         format: winston.format.prettyPrint(),
            //     })
            // );  
        }
        winston_1.default.log({
            level: "error",
            message: `Error on the endpoint, ${res === null || res === void 0 ? void 0 : res.req.method} ${res === null || res === void 0 ? void 0 : res.req.url}  ======>    ${error.message}`,
            metadata: error,
            time_stamp: new Date()
        });
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map