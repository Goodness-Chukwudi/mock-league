"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const enum_1 = require("../data/enums/enum");
const model_names_1 = __importDefault(require("../data/model_names"));
const schemaFields = {
    first_name: { type: String, required: [true, "first name is required"], trim: true, index: true },
    last_name: { type: String, required: [true, "last name is required"], trim: true, index: true },
    middle_name: { type: String },
    email: { type: String, lowercase: true, unique: true, trim: true, required: [true, "email is required"] },
    phone: { type: String, unique: true, required: [true, "phone is required"], trim: true },
    phone_country_code: { type: String, default: "234" },
    gender: { type: String, lowercase: true, required: [true, "gender is required"], enum: Object.values(enum_1.GENDER) },
    status: { type: String, enum: Object.values(enum_1.ITEM_STATUS), default: enum_1.ITEM_STATUS.ACTIVE }
};
const UserSchema = new mongoose_1.Schema(schemaFields, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
UserSchema.virtual('full_name').get(function () {
    if (this.middle_name)
        return `${this.first_name} ${this.middle_name} ${this.last_name}`;
    return `${this.first_name} ${this.last_name}`;
});
UserSchema.virtual('phone_with_country_code').get(function () {
    if (this.phone && this.phone_country_code) {
        const phoneWithoutZero = parseInt(this.phone);
        const phone = '+' + this.phone_country_code + phoneWithoutZero.toString();
        return phone;
    }
});
;
UserSchema.plugin(mongoose_paginate_v2_1.default);
const User = (0, mongoose_1.model)(model_names_1.default.USER, UserSchema);
;
exports.default = User;
//# sourceMappingURL=user.js.map