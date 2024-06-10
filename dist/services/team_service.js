"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRepository = void 0;
const DBQuery_1 = __importDefault(require("./DBQuery"));
const team_1 = __importDefault(require("../models/team"));
class TeamRepository extends DBQuery_1.default {
    constructor() {
        super(team_1.default);
    }
}
const teamRepository = new TeamRepository();
exports.teamRepository = teamRepository;
exports.default = TeamRepository;
//# sourceMappingURL=team_service.js.map