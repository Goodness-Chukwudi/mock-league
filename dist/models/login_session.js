"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../data/enums/enum");
const model_names_1 = __importDefault(require("../data/model_names"));
const ObjectId = mongoose_1.Types.ObjectId;
const LoginSessionSchema = new mongoose_1.Schema({
    user: { type: ObjectId, required: true, ref: model_names_1.default.USER },
    status: { type: Number, enum: Object.values(enum_1.BIT), default: enum_1.BIT.OFF },
    validity_end_date: { type: Date, default: new Date(Date.now() + 86400000) }, //1 day
    logged_out: { type: Boolean, default: false },
    expired: { type: Boolean, default: false },
    os: { type: String },
    version: { type: String },
    device: { type: String },
    ip: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
;
const LoginSession = (0, mongoose_1.model)(model_names_1.default.LOGIN_SESSION, LoginSessionSchema);
;
exports.default = LoginSession;
//# sourceMappingURL=login_session.js.map