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
const BaseApiController_1 = __importDefault(require("./base controllers/BaseApiController"));
const error_response_message_1 = require("../common/constant/error_response_message");
const enum_1 = require("../data/enums/enum");
const app_constants_1 = require("../common/constant/app_constants");
const app_utils_1 = require("../common/utils/app_utils");
const AppValidator_1 = __importDefault(require("../middlewares/validators/AppValidator"));
const success_response_message_1 = require("../common/constant/success_response_message");
const password_service_1 = require("../services/password_service");
const user_service_1 = require("../services/user_service");
const team_service_1 = require("../services/team_service");
const fixture_service_1 = require("../services/fixture_service");
const user_privilege_service_1 = require("../services/user_privilege_service");
const redis_1 = require("../common/utils/redis");
const login_session_service_1 = require("../services/login_session_service");
class AppController extends BaseApiController_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() {
        this.appValidator = new AppValidator_1.default(this.router);
    }
    initializeRoutes() {
        this.listTeams("/teams-list"); //GET
        this.listCompletedFixtures("/fixtures/completed"); //GET
        this.listPendingFixtures("/fixtures/pending"); //GET
        this.me("/me"); //GET
        this.logout("/logout"); //PATCH
        this.updatePassword("/password"); //PATCH
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
    listPendingFixtures(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let fixtures = yield (0, redis_1.getCachedData)(app_constants_1.PENDING_FIXTURES_KEY);
                if (!fixtures) {
                    fixtures = yield fixture_service_1.fixtureRepository.find({ status: enum_1.FIXTURE_STATUS.PENDING });
                    yield (0, redis_1.setCachedData)(app_constants_1.PENDING_FIXTURES_KEY, fixtures);
                }
                this.sendSuccessResponse(res, fixtures);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    listCompletedFixtures(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let fixtures = yield (0, redis_1.getCachedData)(app_constants_1.COMPLETED_FIXTURES_KEY);
                if (!fixtures) {
                    fixtures = yield fixture_service_1.fixtureRepository.find({ status: enum_1.FIXTURE_STATUS.COMPLETED });
                    yield (0, redis_1.setCachedData)(app_constants_1.COMPLETED_FIXTURES_KEY, fixtures);
                }
                this.sendSuccessResponse(res, fixtures);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    me(path) {
        //returns the logged in user
        this.router.get(path, (req, res) => {
            const user = this.requestUtils.getRequestUser();
            this.sendSuccessResponse(res, user);
        });
    }
    logout(path) {
        this.router.patch(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const activeLoginSession = this.requestUtils.getLoginSession();
                const update = {};
                if (activeLoginSession.validity_end_date > new Date()) {
                    update.logged_out = true;
                    update.validity_end_date = new Date();
                }
                else {
                    update.expired = true;
                }
                update.status = enum_1.BIT.OFF;
                yield login_session_service_1.loginSessionRepository.updateById(activeLoginSession.id, update);
                req.session.destroy(() => { });
                this.sendSuccessResponse(res);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    updatePassword(path) {
        this.router.patch(path, this.appValidator.validatePasswordUpdate, this.userMiddleWare.validatePassword, this.userMiddleWare.hashNewPassword);
        this.router.patch(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const user = this.requestUtils.getRequestUser();
                const previousPassword = this.requestUtils.getDataFromState(app_constants_1.USER_PASSWORD_LABEL);
                const passwordData = {
                    password: req.body.password,
                    email: user.email,
                    user: user.id
                };
                yield password_service_1.passwordRepository.save(passwordData, { session });
                //Deactivate old password
                yield password_service_1.passwordRepository.updateById(previousPassword.id, { status: enum_1.PASSWORD_STATUS.DEACTIVATED }, { session });
                yield user_service_1.userService.logoutUser(user.id);
                const { token, loginSession } = yield user_service_1.userService.loginUser(user.id);
                const roles = [];
                const userPrivileges = yield user_privilege_service_1.privilegeRepository.find({ user: user._id, status: enum_1.ITEM_STATUS.ACTIVE });
                userPrivileges.forEach(privilege => {
                    roles.push(privilege.role);
                });
                req.session.data = { user, login_session: loginSession, user_roles: roles };
                this.sendSuccessResponse(res, { message: success_response_message_1.PASSWORD_UPDATE_SUCCESSFUL, token: token }, 200, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
}
exports.default = new AppController().router;
//# sourceMappingURL=AppController.js.map