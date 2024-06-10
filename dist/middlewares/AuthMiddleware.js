"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthMiddleware = void 0;
const BaseRouterMiddleware_1 = __importDefault(require("./BaseRouterMiddleware"));
const app_constants_1 = require("../common/constant/app_constants");
const app_constants_2 = require("../common/constant/app_constants");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_utils_1 = require("../common/utils/auth_utils");
const errorResponse = __importStar(require("../common/constant/error_response_message"));
const enum_1 = require("../data/enums/enum");
const login_session_service_1 = require("../services/login_session_service");
const user_privilege_service_1 = require("../services/user_privilege_service");
class AuthMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.authGuard = (req, res, next) => {
            const jwt = (0, auth_utils_1.getTokenFromRequest)(req);
            (0, auth_utils_1.verifyJwtToken)(jwt, (error, decoded) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (error) {
                        if (error instanceof jsonwebtoken_1.TokenExpiredError)
                            return this.sendErrorResponse(res, error, errorResponse.AUTHENTICATION_EXPIRED, 401);
                        return this.sendErrorResponse(res, error, errorResponse.INVALID_TOKEN, 401);
                    }
                    const payload = decoded.data;
                    let sessionData = req.session.data;
                    if (!sessionData) {
                        const query = { _id: payload.loginSession, user: payload.user, status: enum_1.BIT.ON };
                        let loginSession = yield login_session_service_1.loginSessionRepository.findOneAndPopulate(query, { populatedFields: ["user"] });
                        if (!loginSession) {
                            const error = new Error("Unable to validate user from token");
                            return this.sendErrorResponse(res, error, errorResponse.INVALID_SESSION_USER, 401);
                        }
                        const user = loginSession.user;
                        loginSession = Object.assign(Object.assign({}, loginSession.toJSON()), { user: user.id }); //Remove the populated user object
                        const roles = [];
                        const userPrivileges = yield user_privilege_service_1.privilegeRepository.find({ user: user._id, status: enum_1.ITEM_STATUS.ACTIVE });
                        userPrivileges.forEach(privilege => {
                            roles.push(privilege.role);
                        });
                        sessionData = { user, login_session: loginSession, user_roles: roles };
                    }
                    yield this.validateLoginSession(sessionData.login_session, req, res);
                    req.session.data = sessionData;
                    this.requestUtils.addDataToState(app_constants_1.USER_LABEL, sessionData.user);
                    this.requestUtils.addDataToState(app_constants_2.LOGIN_SESSION_LABEL, sessionData.login_session);
                    this.requestUtils.addDataToState(app_constants_1.USER_ROLES_LABEL, sessionData.user_roles);
                    next();
                }
                catch (error) {
                    console.log(error);
                    this.sendErrorResponse(res, error, errorResponse.UNABLE_TO_COMPLETE_REQUEST, 500);
                }
            }));
        };
    }
    validateLoginSession(loginSession, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (loginSession.validity_end_date <= new Date()) {
                    yield login_session_service_1.loginSessionRepository.updateById(loginSession.id, { expired: true, status: enum_1.BIT.OFF });
                    const error = new Error("Session expired");
                    return this.sendErrorResponse(res, error, errorResponse.AUTHENTICATION_EXPIRED, 401);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map