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
const joi_1 = __importDefault(require("joi"));
const BaseRouterMiddleware_1 = __importDefault(require("../BaseRouterMiddleware"));
const app_config_1 = require("../../common/config/app_config");
const enum_1 = require("../../data/enums/enum");
const error_response_message_1 = require("../../common/constant/error_response_message");
const user_service_1 = require("../../services/user_service");
const joi_extensions_1 = require("../../common/utils/joi_extensions");
const user_privilege_service_1 = require("../../services/user_privilege_service");
const JoiId = joi_1.default.extend(joi_extensions_1.objectId);
class AppValidator extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.validateUserLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const BodySchema = joi_1.default.object({
                    email: joi_1.default.string().email().required(),
                    password: joi_1.default.string().required()
                });
                yield BodySchema.validateAsync(req.body, app_config_1.JoiValidatorOptions);
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
        this.validateUserSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const BodySchema = joi_1.default.object({
                    first_name: joi_1.default.string().max(50).required(),
                    last_name: joi_1.default.string().max(50).required(),
                    middle_name: joi_1.default.string().max(50),
                    email: joi_1.default.string().email().required(),
                    phone: joi_1.default.string().max(50).required(),
                    gender: joi_1.default.string().valid(...Object.values(enum_1.GENDER)).required(),
                    new_password: joi_1.default.string().required(),
                    confirm_password: joi_1.default.string().required()
                });
                yield BodySchema.validateAsync(req.body, app_config_1.JoiValidatorOptions);
                const existingUser = yield user_service_1.userRepository.findOne({ $or: [{ email: req.body.email.toLowerCase() }, { phone: req.body.phone }] });
                if (existingUser) {
                    if (existingUser.email == req.body.email) {
                        const error = new Error("A user with this email already exist");
                        return this.sendErrorResponse(res, error, error_response_message_1.DUPLICATE_EMAIL, 400);
                    }
                    if (existingUser.phone == req.body.phone) {
                        const error = new Error("A user with this phone number already exist");
                        return this.sendErrorResponse(res, error, error_response_message_1.DUPLICATE_PHONE, 400);
                    }
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
        this.validatePasswordUpdate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const BodySchema = joi_1.default.object({
                    password: joi_1.default.string().required(),
                    new_password: joi_1.default.string().required(),
                    confirm_password: joi_1.default.string().required()
                });
                yield BodySchema.validateAsync(body, app_config_1.JoiValidatorOptions);
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
        this.validatePrivilegeAssignment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const BodySchema = joi_1.default.object({
                    user: JoiId.string().objectId().required(),
                    role: joi_1.default.string().valid(...Object.values(enum_1.USER_ROLES)).required()
                });
                yield BodySchema.validateAsync(body, app_config_1.JoiValidatorOptions);
                const query = { user: body.user, role: body.role, status: enum_1.ITEM_STATUS.ACTIVE };
                const existingPrivilege = yield user_privilege_service_1.privilegeRepository.findOne(query);
                if (existingPrivilege) {
                    const error = new Error("This user already has this privilege");
                    return this.sendErrorResponse(res, error, error_response_message_1.DUPLICATE_USER_ROLE, 400);
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
    }
}
exports.default = AppValidator;
//# sourceMappingURL=AppValidator.js.map