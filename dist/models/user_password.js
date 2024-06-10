"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../data/enums/enum");
const model_names_1 = __importDefault(require("../data/model_names"));
const ObjectId = mongoose_1.Types.ObjectId;
const UserPasswordSchema = new mongoose_1.Schema({
    password: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: model_names_1.default.USER },
    status: { type: String, default: enum_1.PASSWORD_STATUS.ACTIVE, enum: Object.values(enum_1.PASSWORD_STATUS) }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
;
const UserPassword = (0, mongoose_1.model)(model_names_1.default.USER_PASSWORD, UserPasswordSchema);
;
exports.default = UserPassword;
//# sourceMappingURL=user_password.js.map