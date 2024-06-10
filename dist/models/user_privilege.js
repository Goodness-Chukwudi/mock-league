"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../data/enums/enum");
const model_names_1 = __importDefault(require("../data/model_names"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const UserPrivilegeSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: model_names_1.default.USER, required: true },
    role: { type: String, required: true, enum: Object.values(enum_1.USER_ROLES) },
    assigned_by: { type: ObjectId, ref: model_names_1.default.USER },
    status: { type: String, default: enum_1.ITEM_STATUS.ACTIVE, enum: Object.values(enum_1.ITEM_STATUS) }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
;
UserPrivilegeSchema.plugin(mongoose_paginate_v2_1.default);
const UserPrivilege = (0, mongoose_1.model)(model_names_1.default.USER_PRIVILEGE, UserPrivilegeSchema);
;
exports.default = UserPrivilege;
//# sourceMappingURL=user_privilege.js.map