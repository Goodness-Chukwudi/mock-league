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
const BaseRouterMiddleware_1 = __importDefault(require("./BaseRouterMiddleware"));
const app_constants_1 = require("../common/constant/app_constants");
const user_service_1 = require("../services/user_service");
const password_service_1 = require("../services/password_service");
const errorMessage = __importStar(require("../common/constant/error_response_message"));
const enum_1 = require("../data/enums/enum");
const auth_utils_1 = require("../common/utils/auth_utils");
class UserMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        /**
         * A middleware that fetches a user from the db using the email provided in the request.
         * - The fetched user is available through the getDataFromState or getRequestUser method of the request service
        */
        this.loadUserToRequestByEmail = (req, res, next) => {
            const email = req.body.email;
            if (!email) {
                const error = new Error("email is required");
                return this.sendErrorResponse(res, error, errorMessage.requiredField("Email"), 400);
            }
            password_service_1.passwordRepository.findOneAndPopulate({ email: email, status: enum_1.PASSWORD_STATUS.ACTIVE }, { populatedFields: ["user"] })
                .then((password) => {
                if (!password) {
                    return this.sendErrorResponse(res, new Error("User not found"), errorMessage.INVALID_LOGIN, 400);
                }
                this.requestUtils.addDataToState(app_constants_1.USER_LABEL, password.user);
                this.requestUtils.addDataToState(app_constants_1.USER_PASSWORD_LABEL, password);
                next();
            })
                .catch((err) => {
                return this.sendErrorResponse(res, err, errorMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            });
        };
        /**
         * Hashes a new password.
         * - Returns an invalid login error response for invalid password
        */
        this.hashNewPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.new_password) {
                    if (req.body.confirm_password !== req.body.new_password) {
                        const error = new Error("Passwords do not match");
                        return this.sendErrorResponse(res, error, errorMessage.PASSWORD_MISMATCH, 400);
                    }
                    req.body.password = yield (0, auth_utils_1.hashData)(req.body.new_password);
                    next();
                }
                else {
                    const error = new Error("No password provided");
                    return this.sendErrorResponse(res, error, errorMessage.requiredField("New password"), 400);
                }
            }
            catch (error) {
                this.sendErrorResponse(res, error, errorMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
        /**
         * Validates user's password.
         * Returns an invalid login error response for invalid password
        */
        this.validatePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userPassword = this.requestUtils.getDataFromState(app_constants_1.USER_PASSWORD_LABEL);
                if (!userPassword) {
                    const user = this.requestUtils.getRequestUser();
                    userPassword = yield password_service_1.passwordRepository.findOne({ email: user.email, status: enum_1.PASSWORD_STATUS.ACTIVE });
                    this.requestUtils.addDataToState(app_constants_1.USER_PASSWORD_LABEL, userPassword);
                }
                const isCorrectPassword = yield (0, auth_utils_1.validateHashedData)(req.body.password, userPassword.password);
                if (!isCorrectPassword)
                    return this.sendErrorResponse(res, new Error("Wrong password"), errorMessage.INVALID_LOGIN, 400);
                next();
            }
            catch (error) {
                console.log(error);
                return this.sendErrorResponse(res, error, errorMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
        /**
         * Logs out the user from other devices who's session hasn't expired yet.
        */
        this.logoutExistingSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.requestUtils.getRequestUser();
                yield user_service_1.userService.logoutUser(user.id);
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, errorMessage.UNABLE_TO_LOGIN, 500);
            }
        });
    }
}
exports.default = UserMiddleware;
//# sourceMappingURL=UserMiddleware.js.map