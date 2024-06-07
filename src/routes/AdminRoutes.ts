import {Express} from "express";
import Env from "../common/config/environment_variables";
import UserManagementController from "../controllers/admin/UserManagementController";
import UserPrivilegeMiddleware from "../middlewares/UserPrivilegeMiddleware";
import { USER_ROLES } from "../data/enums/enum";

class AdminRoutes {

    private app: Express;
    constructor(app: Express) {
        this.app = app;
    }

    initializeRoutes() {
        const ADMIN_PATH = "/admin";

        //The userPrivilege middleware allows access to these endpoints to only users with the specified roles
        const adminPrivilege = new UserPrivilegeMiddleware(this.app, [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN ]);
        this.app.use(Env.API_PATH + ADMIN_PATH, adminPrivilege.validatePrivileges);
        
        this.app.use(Env.API_PATH + ADMIN_PATH + "/users", UserManagementController);
    }
}

export default AdminRoutes;