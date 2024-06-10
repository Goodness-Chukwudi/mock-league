"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_variables_1 = __importDefault(require("../common/config/environment_variables"));
const UserManagementController_1 = __importDefault(require("../controllers/admin/UserManagementController"));
const UserPrivilegeMiddleware_1 = __importDefault(require("../middlewares/UserPrivilegeMiddleware"));
const enum_1 = require("../data/enums/enum");
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const AdminFixtureController_1 = __importDefault(require("../controllers/admin/AdminFixtureController"));
const AdminTeamController_1 = __importDefault(require("../controllers/admin/AdminTeamController"));
class AdminRoutes {
    constructor(app) {
        this.app = app;
    }
    initializeRoutes() {
        const ADMIN_PATH = "/admin";
        const authMiddleware = new AuthMiddleware_1.default(this.app);
        this.app.use(environment_variables_1.default.API_PATH + ADMIN_PATH, authMiddleware.authGuard); //Load Authentication MiddleWare. Routes after this are protected
        //The userPrivilege middleware allows access to these endpoints to only users with the specified roles
        const adminPrivilege = new UserPrivilegeMiddleware_1.default(this.app, [enum_1.USER_ROLES.ADMIN, enum_1.USER_ROLES.SUPER_ADMIN]);
        this.app.use(environment_variables_1.default.API_PATH + ADMIN_PATH, adminPrivilege.validatePrivileges);
        this.app.use(environment_variables_1.default.API_PATH + ADMIN_PATH + "/users", UserManagementController_1.default);
        this.app.use(environment_variables_1.default.API_PATH + ADMIN_PATH + "/fixtures", AdminFixtureController_1.default);
        this.app.use(environment_variables_1.default.API_PATH + ADMIN_PATH + "/teams", AdminTeamController_1.default);
    }
}
exports.default = AdminRoutes;
//# sourceMappingURL=AdminRoutes.js.map