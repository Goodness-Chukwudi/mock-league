import BaseRouterMiddleware from "./BaseRouterMiddleware";
import { USER_LABEL, USER_ROLES_LABEL } from "../common/constant/app_constants";
import { Request, Response, Router } from "express";
import { LOGIN_SESSION_LABEL } from "../common/constant/app_constants";
import { TokenExpiredError } from "jsonwebtoken";
import { getTokenFromRequest, verifyJwtToken } from "../common/utils/auth_utils";
import * as errorResponse from "../common/constant/error_response_message";
import { BIT, ITEM_STATUS } from "../data/enums/enum";
import { loginSessionRepository } from "../services/login_session_service";
import { AuthTokenPayload } from "../data/interfaces/interfaces";
import { IUserDocument } from "../models/user";
import { privilegeRepository } from "../services/user_privilege_service";

export class AuthMiddleware extends BaseRouterMiddleware {

    constructor(appRouter: Router) {
        super(appRouter);
    }

    public authGuard = (req: Request, res: Response, next: any) => {
        
        const jwt = getTokenFromRequest(req);
        
        verifyJwtToken(jwt, async (error, decoded) => {
            try {

                if (error) {
                    if (error instanceof TokenExpiredError)
                        return this.sendErrorResponse(res, error, errorResponse.AUTHENTICATION_EXPIRED, 401);
    
                    return this.sendErrorResponse(res, error, errorResponse.INVALID_TOKEN, 401);
                }

                const payload:AuthTokenPayload = decoded.data;
                let sessionData = req.session.data;

                if (!sessionData) {
                    const query = {_id: payload.loginSession, user: payload.user, status: BIT.ON };
                    let loginSession = await loginSessionRepository.findOneAndPopulate(query, ["user"]);

                    if (!loginSession) {
                        const error =  new Error("Unable to validate user from token");
                        return this.sendErrorResponse(res, error, errorResponse.INVALID_SESSION_USER, 401);
                    }
                    const user = loginSession.user as IUserDocument;
                    loginSession = { ...loginSession.toJSON(), user: user.id }; //Remove the populated user object
                    
                    const roles:string[] = [];
                    const userPrivileges = await privilegeRepository.find({user: user._id, status: ITEM_STATUS.ACTIVE});
                    userPrivileges.forEach(privilege => {
                        roles.push(privilege.role);
                    })

                    sessionData = { user, login_session: loginSession, user_roles: roles };
                }

                await this.validateLoginSession(sessionData.login_session, req, res);

                req.session.data = sessionData;
                this.requestUtils.addDataToState(USER_LABEL, sessionData.user);
                this.requestUtils.addDataToState(LOGIN_SESSION_LABEL, sessionData.login_session);
                this.requestUtils.addDataToState(USER_ROLES_LABEL, sessionData.user_roles);

                next();

            } catch (error:any) {
                console.log(error)
                this.sendErrorResponse(res, error, errorResponse.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        })
    }

    private async validateLoginSession(loginSession: any, req: Request, res: Response): Promise<void> {
        try {
            if (loginSession.validity_end_date <= new Date()) {
                await loginSessionRepository.updateById(loginSession.id, { expired: true, status: BIT.OFF });
                const error = new Error("Session expired");
                return this.sendErrorResponse(res, error, errorResponse.AUTHENTICATION_EXPIRED, 401);
            }
            
        } catch (error) {
            throw error;
        }
    }
}

export default AuthMiddleware;
