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
const error_response_message_1 = require("../../common/constant/error_response_message");
const team_service_1 = require("../../services/team_service");
const FixtureValidator_1 = __importDefault(require("../../middlewares/validators/FixtureValidator"));
const fixture_service_1 = require("../../services/fixture_service");
const uuid_1 = require("uuid");
const environment_variables_1 = __importDefault(require("../../common/config/environment_variables"));
const redis_1 = require("../../common/utils/redis");
const app_utils_1 = require("../../common/utils/app_utils");
const app_constants_1 = require("../../common/constant/app_constants");
const enum_1 = require("../../data/enums/enum");
class AdminFixtureController extends BaseApiController_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() {
        this.fixtureValidator = new FixtureValidator_1.default(this.router);
    }
    initializeRoutes() {
        this.addFixture("/"); //POST
        this.listFixtures("/"); //GET
        this.viewFixture("/:id"); //GET
        this.updateFixture("/:id"); //PATCH
        this.generateFixtureUrl("/:id"); //POST
        this.removeFixture("/:id"); //DELETE
    }
    addFixture(path) {
        this.router.post(path, this.fixtureValidator.validateFixture);
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;
                const homeTeam = yield team_service_1.teamRepository.findById(body.home_team);
                if (!homeTeam) {
                    const error = new Error("Home team not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Home team"), 404);
                }
                const awayTeam = yield team_service_1.teamRepository.findById(body.away_team);
                if (!awayTeam) {
                    const error = new Error("Away team not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Away team"), 404);
                }
                const fixtureData = {
                    venue: homeTeam.stadium,
                    kick_off: body.kick_off,
                    home_team: { name: homeTeam.name, team: homeTeam.id },
                    away_team: { name: awayTeam.name, team: awayTeam.id },
                    referee: body.referee,
                    created_by: user.id
                };
                const fixture = yield fixture_service_1.fixtureRepository.save(fixtureData, { session });
                //remove cached data to trigger a refetch from db on next request
                yield (0, redis_1.deleteCachedData)([app_constants_1.FIXTURES_KEY, app_constants_1.PENDING_FIXTURES_KEY]);
                this.sendSuccessResponse(res, fixture, 201, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
    listFixtures(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let fixtures = yield (0, redis_1.getCachedData)(app_constants_1.FIXTURES_KEY);
                if (!fixtures) {
                    fixtures = yield fixture_service_1.fixtureRepository.find();
                    yield (0, redis_1.setCachedData)(app_constants_1.FIXTURES_KEY, fixtures);
                }
                this.sendSuccessResponse(res, fixtures);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    viewFixture(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const populatedFields = [
                    { path: "home_team", select: "team score" },
                    { path: "away_team", select: "team score" },
                    { path: "created_by", select: "first_name middle_name last_name" }
                ];
                const fixture = yield fixture_service_1.fixtureRepository.findByIdAndPopulate(req.params.id, { populatedFields });
                if (!fixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Fixture"), 404);
                }
                this.sendSuccessResponse(res, fixture);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    updateFixture(path) {
        this.router.patch(path, this.fixtureValidator.validateFixtureUpdate);
        this.router.patch(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const body = req.body;
                const update = {
                    venue: body.venue,
                    kick_off: body.body,
                    referee: body.referee,
                    time_started: body.time_started,
                    time_ended: body.time_ended,
                    "home_team.score": body.home_team_score,
                    "away_team.score": body.away_team_score,
                    status: body.status
                };
                const updatedFixture = yield fixture_service_1.fixtureRepository.updateById(req.params.id, update, { session });
                if (!updatedFixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Fixture"), 404);
                }
                //remove cached data to trigger a refetch from db on next request
                const keys = [app_constants_1.FIXTURES_KEY];
                if (updatedFixture.status = enum_1.FIXTURE_STATUS.PENDING)
                    keys.push(enum_1.FIXTURE_STATUS.PENDING);
                if (updatedFixture.status = enum_1.FIXTURE_STATUS.COMPLETED)
                    keys.push(enum_1.FIXTURE_STATUS.COMPLETED);
                yield (0, redis_1.deleteCachedData)(keys);
                this.sendSuccessResponse(res, updatedFixture, 200, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
    generateFixtureUrl(path) {
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fixture = yield fixture_service_1.fixtureRepository.findById(req.params.id);
                if (!fixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Fixture"), 404);
                }
                let fixtureLink = "";
                if (fixture.url_id) {
                    fixtureLink = `${environment_variables_1.default.APP_URL}/${fixture.url_id}`;
                    return this.sendSuccessResponse(res, fixtureLink);
                }
                const id = (0, uuid_1.v4)();
                fixture.url_id = id;
                yield fixture.save();
                fixtureLink = `${environment_variables_1.default.APP_URL}/${id}`;
                this.sendSuccessResponse(res, fixtureLink);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    removeFixture(path) {
        this.router.delete(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const deletedFixture = yield fixture_service_1.fixtureRepository.deleteById(req.params.id, session);
                if (!deletedFixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("Fixture"), 404);
                }
                //remove cached data to trigger a refetch from db on next request
                const keys = [app_constants_1.FIXTURES_KEY];
                if (deletedFixture.status = enum_1.FIXTURE_STATUS.PENDING)
                    keys.push(enum_1.FIXTURE_STATUS.PENDING);
                if (deletedFixture.status = enum_1.FIXTURE_STATUS.COMPLETED)
                    keys.push(enum_1.FIXTURE_STATUS.COMPLETED);
                yield (0, redis_1.deleteCachedData)(keys);
                this.sendSuccessResponse(res, {}, 200, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
}
exports.default = new AdminFixtureController().router;
//# sourceMappingURL=AdminFixtureController.js.map