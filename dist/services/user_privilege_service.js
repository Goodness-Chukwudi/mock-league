"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privilegeRepository = void 0;
const DBQuery_1 = __importDefault(require("./DBQuery"));
const user_privilege_1 = __importDefault(require("../models/user_privilege"));
class PrivilegeRepository extends DBQuery_1.default {
    constructor() {
        super(user_privilege_1.default);
    }
}
const privilegeRepository = new PrivilegeRepository();
exports.privilegeRepository = privilegeRepository;
exports.default = PrivilegeRepository;
//# sourceMappingURL=user_privilege_service.js.map