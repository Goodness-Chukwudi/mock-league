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
exports.UserPrivilegeMiddleware = void 0;
const BaseRouterMiddleware_1 = __importDefault(require("./BaseRouterMiddleware"));
const error_response_message_1 = require("../common/constant/error_response_message");
class UserPrivilegeMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter, roles) {
        super(appRouter);
        this.validatePrivileges = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let isPermitted = false;
                const userRoles = this.requestUtils.getUserRoles();
                this.allowedRoles.forEach(role => {
                    if (userRoles.includes(role))
                        return isPermitted = true;
                });
                if (isPermitted) {
                    next();
                }
                else {
                    const error = new Error("Invalid permission. Only " + this.allowedRoles.toString() + " is allowed");
                    this.sendErrorResponse(res, error, error_response_message_1.INVALID_PERMISSION, 403);
                }
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
        this.allowedRoles = roles;
    }
}
exports.UserPrivilegeMiddleware = UserPrivilegeMiddleware;
exports.default = UserPrivilegeMiddleware;
//# sourceMappingURL=UserPrivilegeMiddleware.js.map