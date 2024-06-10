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
const BaseApiController_1 = __importDefault(require("../base controllers/BaseApiController"));
const TeamValidator_1 = __importDefault(require("../../middlewares/validators/TeamValidator"));
const error_response_message_1 = require("../../common/constant/error_response_message");
const team_service_1 = require("../../services/team_service");
const app_constants_1 = require("../../common/constant/app_constants");
const redis_1 = require("../../common/utils/redis");
const app_utils_1 = require("../../common/utils/app_utils");
class AdminTeamController extends BaseApiController_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() {
        this.teamValidator = new TeamValidator_1.default(this.router);
    }
    initializeRoutes() {
        this.addTeam("/"); //POST
        this.listTeams("/"); //GET
        this.viewTeam("/:id"); //GET
        this.updateTeam("/:id"); //PATCH
        this.removeTeam("/:id"); //DELETE
    }
    addTeam(path) {
        this.router.post(path, this.teamValidator.validateTeam);
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;
                const teamData = {
                    name: body.name,
                    slogan: body.slogan,
                    stadium: body.stadium,
                    added_by: user.id
                };
                const team = yield team_service_1.teamRepository.save(teamData);
                //remove cached data to trigger a refetch from db on next request
                yield (0, redis_1.deleteCachedData)([app_constants_1.TEAMS_KEY]);
                this.sendSuccessResponse(res, team, 201, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
    listTeams(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let teams = yield (0, redis_1.getCachedData)(app_constants_1.TEAMS_KEY);
                if (!teams) {
                    teams = yield team_service_1.teamRepository.find();
                    yield (0, redis_1.setCachedData)(app_constants_1.TEAMS_KEY, teams);
                }
                this.sendSuccessResponse(res, teams);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    viewTeam(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const populatedFields = [
                    { path: "added_by", select: "first_name middle_name last_name" }
                ];
                const team = yield team_service_1.teamRepository.findByIdAndPopulate(req.params.id, { populatedFields });
                if (!team) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Team"), 404);
                }
                this.sendSuccessResponse(res, team);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    updateTeam(path) {
        this.router.patch(path, this.teamValidator.validateTeamUpdate);
        this.router.patch(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const { name, slogan, stadium, status } = req.body;
                const update = {
                    name,
                    slogan,
                    stadium,
                    status
                };
                const updatedTeam = yield team_service_1.teamRepository.updateById(req.params.id, update, { session });
                if (!updatedTeam) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Team"), 404);
                }
                //remove cached data to trigger a refetch from db on next request
                yield (0, redis_1.deleteCachedData)([app_constants_1.TEAMS_KEY]);
                this.sendSuccessResponse(res, updatedTeam, 200, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
    removeTeam(path) {
        this.router.delete(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const deletedTeam = yield team_service_1.teamRepository.deleteById(req.params.id, session);
                if (!deletedTeam) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Team"), 404);
                }
                //remove cached data to trigger a refetch from db on next request
                yield (0, redis_1.deleteCachedData)([app_constants_1.TEAMS_KEY]);
                this.sendSuccessResponse(res, {}, 200, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
}
exports.default = new AdminTeamController().router;
//# sourceMappingURL=AdminTeamController.js.map