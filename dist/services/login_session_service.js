"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSessionRepository = void 0;
const login_session_1 = __importDefault(require("../models/login_session"));
const DBQuery_1 = __importDefault(require("./DBQuery"));
class LoginSessionRepository extends DBQuery_1.default {
    constructor() {
        super(login_session_1.default);
    }
}
const loginSessionRepository = new LoginSessionRepository();
exports.loginSessionRepository = loginSessionRepository;
exports.default = LoginSessionRepository;
//# sourceMappingURL=login_session_service.js.map