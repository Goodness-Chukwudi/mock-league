"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_variables_1 = __importDefault(require("../common/config/environment_variables"));
const AppController_1 = __importDefault(require("../controllers/AppController"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const app_utils_1 = require("../common/utils/app_utils");
const PublicController_1 = __importDefault(require("../controllers/PublicController"));
const fixture_service_1 = require("../services/fixture_service");
class UserRoutes {
    constructor(app) {
        this.app = app;
    }
    initializeRoutes() {
        this.app.get("/:fixture_url_id", fixture_service_1.returnHtmlForUniqueFixtureLink);
        this.app.use(environment_variables_1.default.API_PATH, PublicController_1.default);
        const authMiddleware = new AuthMiddleware_1.default(this.app);
        this.app.use(authMiddleware.authGuard); //Load Authentication MiddleWare. Routes after this are protected
        this.app.use((0, app_utils_1.rateLimiter)());
        this.app.use(environment_variables_1.default.API_PATH + "/", AppController_1.default);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map