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
exports.userService = exports.userRepository = void 0;
const DBQuery_1 = __importDefault(require("./DBQuery"));
const user_1 = __importDefault(require("../models/user"));
const enum_1 = require("../data/enums/enum");
const login_session_service_1 = require("./login_session_service");
const auth_utils_1 = require("../common/utils/auth_utils");
const password_service_1 = require("./password_service");
const user_privilege_service_1 = require("./user_privilege_service");
const app_utils_1 = require("../common/utils/app_utils");
class UserRepository extends DBQuery_1.default {
    constructor() {
        super(user_1.default);
    }
}
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let activeLoginSession = yield login_session_service_1.loginSessionRepository.findOne({ status: enum_1.BIT.ON, user: userId });
            if (activeLoginSession) {
                if (activeLoginSession.validity_end_date > new Date()) {
                    activeLoginSession.logged_out = true;
                    activeLoginSession.validity_end_date = new Date();
                }
                else {
                    activeLoginSession.expired = true;
                }
                activeLoginSession.status = enum_1.BIT.OFF;
                activeLoginSession = yield activeLoginSession.save();
            }
            resolve(activeLoginSession);
        }
        catch (error) {
            reject(error);
        }
    }));
});
const loginUser = (userId, session) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const loginSessionData = {
                user: userId,
                status: enum_1.BIT.ON
            };
            const loginSession = yield login_session_service_1.loginSessionRepository.save(loginSessionData, { session });
            const token = (0, auth_utils_1.createAuthToken)(userId, loginSession.id);
            resolve({ token, loginSession });
        }
        catch (error) {
            reject(error);
        }
    }));
});
const createSuperAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, app_utils_1.createMongooseTransaction)();
    try {
        const existingSuperAdmin = yield user_privilege_service_1.privilegeRepository.findOne({ status: enum_1.ITEM_STATUS.ACTIVE, role: enum_1.USER_ROLES.SUPER_ADMIN });
        if (!existingSuperAdmin) {
            const userData = {
                first_name: "Super",
                last_name: "Admin",
                email: "super.admin@gmail.com",
                phone: "070435343453",
                gender: "male"
            };
            const user = yield userRepository.save(userData, { session });
            const password = (0, app_utils_1.getCode)(8);
            const passwordData = {
                password: yield (0, auth_utils_1.hashData)(password),
                email: user.email,
                user: user.id
            };
            yield password_service_1.passwordRepository.save(passwordData, { session });
            const privilege = {
                user: user.id,
                role: enum_1.USER_ROLES.SUPER_ADMIN,
                assigned_by: user.id
            };
            yield user_privilege_service_1.privilegeRepository.save(privilege, { session });
            console.log("email:    " + user.email);
            console.log("password:    " + password);
        }
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
});
const userRepository = new UserRepository();
exports.userRepository = userRepository;
const userService = {
    createSuperAdminUser,
    logoutUser,
    loginUser
};
exports.userService = userService;
exports.default = UserRepository;
//# sourceMappingURL=user_service.js.map