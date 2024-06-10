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
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const environment_variables_1 = __importDefault(require("./common/config/environment_variables"));
const cors_1 = __importDefault(require("./common/utils/cors"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const response_time_1 = __importDefault(require("response-time"));
const app_utils_1 = require("./common/utils/app_utils");
const redis_1 = require("./common/utils/redis");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.plugInMiddlewares();
        this.plugInRoutes();
    }
    plugInMiddlewares() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: false }));
            this.app.use((0, redis_1.redisSessionStore)());
            this.app.use(cors_1.default);
            this.app.use((0, helmet_1.default)());
            this.app.use((0, compression_1.default)());
            this.app.use((0, response_time_1.default)(app_utils_1.recordResponseTime));
        });
    }
    plugInRoutes() {
        this.userRoutes = new UserRoutes_1.default(this.app);
        this.adminRoutes = new AdminRoutes_1.default(this.app);
        this.app.get("/", (req, res) => res.status(200).send("<h1>Successful</h1>"));
        this.app.get(environment_variables_1.default.API_PATH + "/health", (req, res) => {
            const response = "Server is healthy____   " + new Date().toUTCString();
            res.status(200).send(response);
        });
        //Expose routes
        this.adminRoutes.initializeRoutes();
        this.userRoutes.initializeRoutes();
        //return a 404 for unspecified/unmatched routes
        this.app.all("*", (req, res) => res.status(404).send("RESOURCE NOT FOUND"));
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map