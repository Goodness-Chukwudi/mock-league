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
const Team = {
    name: { type: String, required: true, index: true }, //team's name field is added and indexed to improve search
    score: { type: Number },
    team: { type: ObjectId, required: true, ref: model_names_1.default.TEAM }
};
const FixtureSchema = new mongoose_1.Schema({
    venue: { type: String, required: true },
    kick_off: { type: Date, required: true }, //supposed kickoff date and time
    time_started: { type: Date },
    time_ended: { type: Date },
    home_team: Team,
    away_team: Team,
    url_id: { type: String, unique: true, sparse: true },
    referee: { type: String, required: true },
    created_by: { type: ObjectId, required: true, ref: model_names_1.default.USER },
    status: { type: String, enum: Object.values(enum_1.FIXTURE_STATUS), default: enum_1.FIXTURE_STATUS.PENDING }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
;
FixtureSchema.plugin(mongoose_paginate_v2_1.default);
const Fixture = (0, mongoose_1.model)(model_names_1.default.FIXTURE, FixtureSchema);
;
exports.default = Fixture;
//# sourceMappingURL=fixture.js.map