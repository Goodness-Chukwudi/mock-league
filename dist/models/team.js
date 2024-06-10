"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const enum_1 = require("../data/enums/enum");
const model_names_1 = __importDefault(require("../data/model_names"));
const ObjectId = mongoose_1.Types.ObjectId;
const TeamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, index: true },
    slogan: { type: String, required: true },
    stadium: { type: String, required: true, unique: true },
    added_by: { type: ObjectId, required: true, ref: model_names_1.default.USER },
    status: { type: String, enum: Object.values(enum_1.TEAM_STATUS), default: enum_1.TEAM_STATUS.ACTIVE }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
;
TeamSchema.plugin(mongoose_paginate_v2_1.default);
const Team = (0, mongoose_1.model)(model_names_1.default.TEAM, TeamSchema);
;
exports.default = Team;
//# sourceMappingURL=team.js.map