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
const success_response_message_1 = require("../common/constant/success_response_message");
const AppValidator_1 = __importDefault(require("../middlewares/validators/AppValidator"));
const user_service_1 = require("../services/user_service");
const password_service_1 = require("../services/password_service");
const app_utils_1 = require("../common/utils/app_utils");
const team_service_1 = require("../services/team_service");
const fixture_service_1 = require("../services/fixture_service");
const enum_1 = require("../data/enums/enum");
const user_privilege_service_1 = require("../services/user_privilege_service");
const date_utils_1 = require("../common/utils/date_utils");
class PublicController extends BaseApiController_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() {
        this.appValidator = new AppValidator_1.default(this.router);
    }
    initializeRoutes() {
        this.login("/login"); //POST
        this.signup("/signup"); //POST
        this.searchTeams("/teams"); //GET
        this.searchFixtures("/fixtures"); //GET
    }
    signup(path) {
        this.router.post(path, this.appValidator.validateUserSignup, this.userMiddleWare.hashNewPassword);
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, app_utils_1.createMongooseTransaction)();
            try {
                const body = req.body;
                const userData = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    middle_name: body.middle_name,
                    email: body.email,
                    phone: body.phone,
                    gender: body.gender
                };
                const user = yield user_service_1.userRepository.save(userData, { session });
                const passwordData = {
                    password: body.password,
                    email: user.email,
                    user: user.id
                };
                yield password_service_1.passwordRepository.save(passwordData, { session });
                const { token, loginSession } = yield user_service_1.userService.loginUser(user.id, session);
                const roles = [];
                const userPrivileges = yield user_privilege_service_1.privilegeRepository.find({ user: user._id, status: enum_1.ITEM_STATUS.ACTIVE });
                userPrivileges.forEach(privilege => {
                    roles.push(privilege.role);
                });
                req.session.data = { user, login_session: loginSession, user_roles: roles };
                const response = {
                    message: success_response_message_1.SIGNUP_SUCCESS,
                    token: token,
                    user: user
                };
                return this.sendSuccessResponse(res, response, 201, session);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        }));
    }
    login(path) {
        this.router.post(path, this.appValidator.validateUserLogin, this.userMiddleWare.loadUserToRequestByEmail, this.userMiddleWare.validatePassword, this.userMiddleWare.logoutExistingSession);
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.requestUtils.getRequestUser();
                const { token, loginSession } = yield user_service_1.userService.loginUser(user.id);
                const roles = [];
                const userPrivileges = yield user_privilege_service_1.privilegeRepository.find({ user: user._id, status: enum_1.ITEM_STATUS.ACTIVE });
                userPrivileges.forEach(privilege => {
                    roles.push(privilege.role);
                });
                req.session.data = { user, login_session: loginSession, user_roles: roles };
                const response = {
                    message: success_response_message_1.LOGIN_SUCCESSFUL,
                    token: token,
                    user: user
                };
                return this.sendSuccessResponse(res, response);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_LOGIN, 500);
            }
        }));
    }
    searchTeams(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reqQuery = req.query;
                let query = {};
                if (reqQuery.status)
                    query = Object.assign(Object.assign({}, query), { status: reqQuery.status });
                if (reqQuery.search)
                    query = Object.assign(Object.assign({}, query), { $or: [
                            { name: new RegExp(`${req.query.search}`, "i") },
                            { slogan: new RegExp(`${req.query.search}`, "i") },
                            { stadium: new RegExp(`${req.query.search}`, "i") }
                        ] });
                let limit;
                let page;
                if (reqQuery.limit)
                    limit = Number(reqQuery.limit);
                if (reqQuery.page)
                    page = Number(reqQuery.page);
                const selectedFields = "-created_at -updated_at -added_by";
                const teams = yield team_service_1.teamRepository.paginate(query, { limit, page, selectedFields });
                this.sendSuccessResponse(res, teams);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    searchFixtures(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reqQuery = req.query;
                let query = {};
                if (reqQuery.status)
                    query = Object.assign(Object.assign({}, query), { status: reqQuery.status });
                if (reqQuery.search)
                    query = Object.assign(Object.assign({}, query), { $or: [
                            { "home_team.name": new RegExp(`${req.query.search}`, "i") },
                            { "away_team.name": new RegExp(`${req.query.search}`, "i") },
                            { venue: new RegExp(`${req.query.search}`, "i") },
                            { referee: new RegExp(`${req.query.search}`, "i") }
                        ] });
                if (reqQuery.start_date && reqQuery.end_date) {
                    const startDate = (0, date_utils_1.getStartOfDay)(reqQuery.start_date);
                    const endDate = (0, date_utils_1.getEndOfDay)(reqQuery.end_date);
                    query = Object.assign(Object.assign({}, query), { kick_off: { $gte: startDate, $lte: endDate } });
                }
                let limit;
                let page;
                if (reqQuery.limit)
                    limit = Number(reqQuery.limit);
                if (reqQuery.page)
                    page = Number(reqQuery.page);
                const selectedFields = "-created_at -updated_at -created_by";
                const fixtures = yield fixture_service_1.fixtureRepository.paginate(query, { limit, page, selectedFields });
                this.sendSuccessResponse(res, fixtures);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
}
exports.default = new PublicController().router;
//# sourceMappingURL=PublicController.js.map