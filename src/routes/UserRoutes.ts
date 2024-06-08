import {Express} from "express";
import Env from "../common/config/environment_variables";
import AppController from "../controllers/AppController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { rateLimiter } from "../common/utils/app_utils";
// import { rateLimiter } from "../common/utils/app_utils";
class UserRoutes {

    private app: Express;
    constructor(app: Express) {
        this.app = app;
    }

    initializeRoutes() {
        
        const authMiddleware = new AuthMiddleware(this.app);
        this.app.use(authMiddleware.authGuard); //Load Authentication MiddleWare. Routes after this are protected
        
        this.app.use(rateLimiter());
        this.app.use(Env.API_PATH + "/",  AppController);
    }
}

export default UserRoutes;