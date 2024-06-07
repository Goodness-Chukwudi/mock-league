import { Request, Response, Router } from "express";
import BaseRouterMiddleware from "./BaseRouterMiddleware";
import { INVALID_PERMISSION, UNABLE_TO_COMPLETE_REQUEST } from "../common/constant/error_response_message";

export class UserPrivilegeMiddleware extends BaseRouterMiddleware {

    allowedRoles: string[];
    constructor(appRouter: Router, roles: string[]) {
        super(appRouter);
        this.allowedRoles = roles;
    }

    public validatePrivileges = async (req: Request, res: Response, next: any) => {
        try {
            let isPermitted = false;

            const userRoles = this.requestUtils.getUserRoles();
            this.allowedRoles.forEach(role => {
                if(userRoles.includes(role)) return isPermitted = true;
            });

            if (isPermitted) {
                next();
            } else {
                const error = new Error("Invalid permission. Only "+ this.allowedRoles.toString() + " is allowed");
                this.sendErrorResponse(res, error, INVALID_PERMISSION, 403)
            }
            
        } catch (error:any) {
            this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
        }
    }
}

export default UserPrivilegeMiddleware;
