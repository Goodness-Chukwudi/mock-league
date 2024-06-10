"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRepository = void 0;
const DBQuery_1 = __importDefault(require("./DBQuery"));
const user_password_1 = __importDefault(require("../models/user_password"));
class PasswordRepository extends DBQuery_1.default {
    constructor() {
        super(user_password_1.default);
    }
}
const passwordRepository = new PasswordRepository();
exports.passwordRepository = passwordRepository;
exports.default = PasswordRepository;
//# sourceMappingURL=password_service.js.map