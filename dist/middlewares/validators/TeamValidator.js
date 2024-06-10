"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const BaseRouterMiddleware_1 = __importDefault(require("../BaseRouterMiddleware"));
const app_config_1 = require("../../common/config/app_config");
const enum_1 = require("../../data/enums/enum");
const error_response_message_1 = require("../../common/constant/error_response_message");
const team_service_1 = require("../../services/team_service");
class TeamValidator extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.validateTeam = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const BodySchema = joi_1.default.object({
                    name: joi_1.default.string().max(255).required(),
                    slogan: joi_1.default.string().max(255).required(),
                    stadium: joi_1.default.string().max(255).required()
                });
                yield BodySchema.validateAsync(req.body, app_config_1.JoiValidatorOptions);
                const existingTeam = yield team_service_1.teamRepository.findOne({ $or: [{ name: req.body.name }, { stadium: req.body.stadium }] });
                if (existingTeam) {
                    if (existingTeam.name == req.body.name) {
                        const error = new Error("A team with this name already exist");
                        return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
                    }
                    if (existingTeam.stadium == req.body.stadium) {
                        const error = new Error("A team with this stadium already exist");
                        return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
                    }
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
        this.validateTeamUpdate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const BodySchema = joi_1.default.object({
                    name: joi_1.default.string().max(255).required(),
                    slogan: joi_1.default.string().max(255).required(),
                    stadium: joi_1.default.string().max(255).required(),
                    status: joi_1.default.string().valid(...Object.values(enum_1.TEAM_STATUS))
                });
                yield BodySchema.validateAsync(req.body, app_config_1.JoiValidatorOptions);
                const query = { _id: { $ne: req.params.id }, $or: [{ name: req.body.name }, { stadium: req.body.stadium }] };
                const existingTeam = yield team_service_1.teamRepository.findOne(query);
                if (existingTeam) {
                    if (existingTeam.name == req.body.name) {
                        const error = new Error("A team with this name already exist");
                        return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
                    }
                    if (existingTeam.stadium == req.body.stadium) {
                        const error = new Error("A team with this stadium already exist");
                        return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
                    }
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
    }
}
exports.default = TeamValidator;
//# sourceMappingURL=TeamValidator.js.map