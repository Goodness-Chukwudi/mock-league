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
const joi_extensions_1 = require("../../common/utils/joi_extensions");
const JoiId = joi_1.default.extend(joi_extensions_1.objectId);
class TeamValidator extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.validateFixture = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const BodySchema = joi_1.default.object({
                    kick_off: joi_1.default.date().required(),
                    home_team: JoiId.string().objectId().required(),
                    away_team: JoiId.string().objectId().required(),
                    referee: joi_1.default.string().max(255).required()
                });
                yield BodySchema.validateAsync(req.body, app_config_1.JoiValidatorOptions);
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
        this.validateFixtureUpdate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const BodySchema = joi_1.default.object({
                    venue: joi_1.default.string().max(255),
                    kick_off: joi_1.default.date(),
                    referee: joi_1.default.string().max(255),
                    time_started: joi_1.default.date(),
                    time_ended: joi_1.default.date(),
                    home_team_score: joi_1.default.number(),
                    away_team_score: joi_1.default.number(),
                    status: joi_1.default.string().valid(...Object.values(enum_1.FIXTURE_STATUS))
                });
                yield BodySchema.validateAsync(req.body, app_config_1.JoiValidatorOptions);
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, (0, error_response_message_1.badRequestError)(error.message), 400);
            }
        });
    }
}
exports.default = TeamValidator;
//# sourceMappingURL=FixtureValidator.js.map