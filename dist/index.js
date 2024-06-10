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
const App_1 = __importDefault(require("./App"));
const environment_variables_1 = __importDefault(require("./common/config/environment_variables"));
const app_config_1 = require("./common/config/app_config");
const env_validator_1 = __importDefault(require("./common/utils/env_validator"));
const db_1 = __importDefault(require("./common/utils/db"));
const user_service_1 = require("./services/user_service");
(0, env_validator_1.default)();
(0, db_1.default)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    App_1.default.listen(environment_variables_1.default.PORT, () => {
        if (environment_variables_1.default.ENVIRONMENT == app_config_1.ENVIRONMENTS.DEV)
            console.log(`Express is listening on ${environment_variables_1.default.APP_URL}:${environment_variables_1.default.PORT}${environment_variables_1.default.API_PATH}`);
    });
    yield user_service_1.userService.createSuperAdminUser();
}))
    .catch(() => console.log("DB Connection not successful"));
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:\n', p);
    console.log("\n");
    console.error('Reason:\n', reason);
    //Track error with error logger
    process.exit(1);
    //Restart with pm2 in production
});
process.on('uncaughtException', (error) => {
    console.error(`Uncaught exception:`);
    console.log("\n");
    console.error(error);
    //Track error with error logger
    process.exit(1);
    //Restart with pm2 in production
});
//# sourceMappingURL=index.js.map